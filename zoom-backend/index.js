// index.js
const express = require('express');
// const matchRouter = require('./routes/match');
const { createMeeting,getMeetingPolls,getAllUserMeetings } = require('./zoom');
require('dotenv').config();

const admin = require('firebase-admin');
const session = require('express-session');
const bcrypt = require('bcrypt');
// const serviceAccount = require('./serviceAccountKey.json');

const app = express();
const PORT = 3007;
app.use(express.json()); 
const cors = require('cors');

app.use(cors({
  origin: true,         // reflect request origin (allows all)
  credentials: true     // allows cookies, sessions, etc.
}));


// app.use('/api', matchRouter);


// 🔐 Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();



// user creation

// 🧠 Session middleware (ensure this is before the login routes)
app.use(session({
  secret: 'super_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
  }
}));



app.post('/api/account', async (req, res) => {
  const { email, password, confirm_password } = req.body;

  if (!email || !password || !confirm_password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (!snapshot.empty) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Initially create only the email and hashed password
    const userDoc = usersRef.doc(email); // Auto-generate user_id
    await userDoc.set({
      email,
      password: hashedPassword,
      profile_created: false
    });

    res.status(201).json({
      message: 'Account created successfully',
      email: userDoc.id,
    });
  } catch (err) {
    console.error('Account creation error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
});


// ✅ GET /api/tutors — fetch all tutors
app.get('/api/dropdowns/subject', async (req, res) => {
  try {
    const snapshot = await db.collection('dropdowns', 'Subject').get();
    const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(subjects[1].subjectCode);
  } catch (error) {
    console.error('Error fetching subjects:', error.message);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

// user signup
app.post('/api/profile', async (req, res) => {
  const {
    email,
    name,
    major,
    year,
    bio,
    expertise,
    is_mentor,
    learning_interests,
    is_active
  } = req.body;

  if (!name || !major || !year) {
    return res.status(400).json({ error: 'Required profile fields missing' });
  }

  try {
    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userRef.update({
      email,
      name,
      major,
      year,
      bio,
      expertise,
      is_mentor,
      learning_interests,
      is_active,
      profile_created: true
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile creation error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.post('/api/tutors/sessions', async (req, res) => {
  try {
    const {
      duration,
      start_time,
      join_url,
      start_url,
      meeting_id,
      session_type,
      student_id,
      subject
    } = req.body;

    if (!start_time || isNaN(Date.parse(start_time))) {
      return res.status(400).json({ error: 'Invalid or missing start_time' });
    }

    const session_id = `session-${Date.now()}`;
    const end_time = new Date(new Date(start_time).getTime() + duration * 60000).toISOString();

    const sessionDoc = {
      duration,
      start_time,
      end_time,
      join_url,
      start_url,
      meeting_id,
      password: "",
      session_id,
      session_type: session_type || "tutor",
      status: "scheduled",
      student_id: student_id || session_id,
      subject: subject || {
        id: "default-subject",
        name: "General Topic",
        code: "GEN 101",
        description: "General study session",
        title: "General",
        topic: "General",
        tutor_id: "unknown"
      }
    };

    await db.collection('mentorship').doc(meeting_id.toString()).set(sessionDoc);

    res.json({
      message: 'Session saved to Firestore successfully',
      session: sessionDoc
    });

  } catch (error) {
    console.error('Error saving session:', error.message);
    res.status(500).json({ error: 'Failed to save session to Firestore' });
  }
});




// ✅ GET /api/sessions/all — fetch all sessions
app.get('/api/sessions/all', async (req, res) => {
  try {
    const snapshot = await db.collection('mentorship').get();

    const sessions = snapshot.docs.map(doc => {
      return {
        id: doc.data().session_id,
        tutor_id: doc.data().tutor_id || 'unknown',
        student_id: doc.data().student_id,
        subject: doc.data().subject,
        start_time: doc.data().start_time,
        end_time: doc.data().end_time,
        status: doc.data().status,
        zoomLink: doc.data().join_url,
        sessionType: doc.data().session_type,
        title: doc.data().title,
        description: doc.data().description || ''
      };
    });

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error.message);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});


app.post('/api/sessions', async (req, res) => {
  try {
    const {
      duration,
      start_time,
      join_url,
      start_url,
      meeting_id,
      session_type,
      student_id,
      subject
    } = req.body;

    // ✅ Validate required fields
    if (!start_time || isNaN(Date.parse(start_time))) {
      return res.status(400).json({ error: 'Invalid or missing start_time' });
    }

    if (!duration || typeof duration !== 'number') {
      return res.status(400).json({ error: 'Invalid or missing duration' });
    }

    if (!meeting_id) {
      return res.status(400).json({ error: 'Missing meeting_id' });
    }

    // ✅ Fix session_id template literal
    const session_id = `session-${Date.now()}`;
    const end_time = new Date(new Date(start_time).getTime() + duration * 60000).toISOString();

    const sessionDoc = {
      duration,
      start_time,
      end_time,
      join_url,
      start_url,
      meeting_id,
      password: "",
      session_id,
      session_type: session_type || "tutor",
      status: "scheduled",
      student_id: student_id || session_id,
      subject: subject || {
        id: "default-subject",
        name: "General Topic",
        code: "GEN 101",
        description: "General study session",
        title: "General",
        topic: "General",
        tutor_id: "unknown"
      }
    };

    // Save to Firestore
    await db.collection('mentorship').doc(meeting_id.toString()).set(sessionDoc);

    res.json({
      message: 'Session saved to Firestore successfully',
      session: sessionDoc
    });

  } catch (error) {
    console.error('Error saving session:', error.message);
    res.status(500).json({ error: 'Failed to save session to Firestore' });
  }
});



// ✅ GET /api/tutors — fetch all tutors
app.post('/api/tutors', async (req, res) => {
  try {
    const { subjectCode } = req.body;
    const snapshot = await db.collection('tutors').get();

    let tutors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(tutors)
    if (subjectCode) {
      tutors = tutors.filter(tutor =>
        tutor.subjects?.some(subject => subject.code === subjectCode)
      );
    }

    res.json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error.message);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

// ✅ GET /api/tutors/:email — fetch single tutor by email (document ID)
app.get('/api/tutors/:email', async (req, res) => {
  const email = decodeURIComponent(req.params.email); // handle @ and . in URLs

  try {
    const doc = await db.collection('tutors').doc(email).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching tutor:', error.message);
    res.status(500).json({ error: 'Failed to fetch tutor' });
  }
});




// ✅ POST /api/login (with encrypted password)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();
    

    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.user = { email: userData.email, user_id: userDoc.id };
    res.json({ message: 'Login successful', user: { email: userData.email} });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ GET /api/session
// app.get('/api/session', (req, res) => {
//   if (req.session.user) {
//     res.json({ loggedIn: true, user: req.session.user });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

// ✅ POST /api/logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});







app.post('/api/meetings', async (req, res) => {
  try {
    const meetingInfo = await createMeeting(req.body);
    res.json({
      join_url: meetingInfo.join_url,
      start_url: meetingInfo.start_url,
      meeting_id: meetingInfo.id,
    });
  } catch (error) {
    console.error('Error creating meeting:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create Zoom meeting' });
  }
});

app.get('/report/meetings/:meetingId/polls', async (req, res) => {
  const { meetingId } = req.params;

  try {
    const polls = await getMeetingPolls(meetingId);
    res.json({
      meetingId,
      polls,
    });
  } catch (error) {
    console.error('❌ Error fetching meeting polls:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch polls for the meeting',
      details: error.response?.data || error.message,
    });
  }
});



app.get('/api/meetings/all', async (req, res) => {
  try {
    const meetings = await getAllUserMeetings();
    res.json(meetings);
  } catch (error) {
    console.error('❌ Error fetching meetings:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch all user meetings',
      details: error.response?.data || error.message
    });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
