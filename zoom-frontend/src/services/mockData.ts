import { User, Profile, Subject, Session, LiveSession, Feedback, Match, Availability, SubjectRating } from '../types/models';

// Mock users data
export const users: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@asu.edu",
    profileImageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    role: 'student',
    createdAt: new Date('2023-01-15')
  },
  {
    id: "user-2",
    name: "Emily Johnson",
    email: "emily.johnson@asu.edu",
    profileImageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    role: 'student',
    createdAt: new Date('2023-02-10')
  },
  {
    id: "user-3",
    name: "Michael Brown",
    email: "michael.brown@asu.edu",
    profileImageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    role: 'student',
    createdAt: new Date('2023-01-20')
  },
  {
    id: "user-4",
    name: "Jessica Davis",
    email: "jessica.davis@asu.edu",
    profileImageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    role: 'student',
    createdAt: new Date('2023-03-05')
  },
  {
    id: "user-5",
    name: "David Wilson",
    email: "david.wilson@asu.edu",
    profileImageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    role: 'student',
    createdAt: new Date('2023-02-25')
  },
  {
    id: "user-6",
    name: "Alex Johnson",
    email: "alex.johnson@asu.edu",
    profileImageUrl: "https://randomuser.me/api/portraits/men/6.jpg",
    role: 'student',
    createdAt: new Date('2023-01-10')
  }
];

// Mock subjects data
export const subjects: Subject[] = [
  {
    id: "sub-1",
    name: "Calculus I",
    code: "MAT 265",
    description: "Functions, limits and continuity, differential calculus, and applications."
  },
  {
    id: "sub-2",
    name: "Calculus II",
    code: "MAT 266",
    description: "Methods of integration, applications of integration, and infinite series."
  },
  {
    id: "sub-3",
    name: "Physics I",
    code: "PHY 121",
    description: "Mechanics, including Newton's laws, energy, momentum, and angular momentum."
  },
  {
    id: "sub-4",
    name: "Computer Science I",
    code: "CSE 110",
    description: "Principles of programming with emphasis on problem-solving strategies and good programming style."
  },
  {
    id: "sub-5",
    name: "Organic Chemistry",
    code: "CHM 233",
    description: "Structure, properties, and reactions of carbon-containing compounds."
  },
  {
    id: "sub-6",
    name: "Data Structures",
    code: "CSE 205",
    description: "Design and implementation of data structures, including lists, stacks, queues, trees, and graphs."
  }
];

// Mock profiles data
export const profiles: Profile[] = [
  {
    userId: "user-1",
    name: "John Smith",
    major: "Computer Science",
    year: "Junior",
    bio: "I'm passionate about algorithms and machine learning. Always looking to help others with programming concepts!",
    expertiseSubjects: [subjects[3], subjects[5]],
    learningSubjects: [subjects[0], subjects[2]],
    availability: [
      {
        id: "avail-1-1",
        dayOfWeek: 1, // Monday
        startTime: "13:00", // 1 PM
        endTime: "15:00"  // 3 PM
      },
      {
        id: "avail-1-2",
        dayOfWeek: 3, // Wednesday
        startTime: "10:00", // 10 AM
        endTime: "12:00"  // 12 PM
      }
    ],
    subjectRatings: [
      {
        subjectId: "sub-4",
        rating: 4.5,
        quizResults: [
          {
            id: "quiz-1-1",
            date: new Date('2023-06-10'),
            score: 9,
            totalQuestions: 10
          }
        ]
      },
      {
        subjectId: "sub-6",
        rating: 3.8,
        quizResults: [
          {
            id: "quiz-1-2",
            date: new Date('2023-07-15'),
            score: 8,
            totalQuestions: 10
          }
        ]
      }
    ]
  },
  {
    userId: "user-2",
    name: "Emily Johnson",
    major: "Physics",
    year: "Senior",
    bio: "Physics major with a focus on theoretical physics. I enjoy teaching complex concepts in simple terms.",
    expertiseSubjects: [subjects[2], subjects[0]],
    learningSubjects: [subjects[4]],
    availability: [
      {
        id: "avail-2-1",
        dayOfWeek: 2, // Tuesday
        startTime: "15:00", // 3 PM
        endTime: "17:00"  // 5 PM
      },
      {
        id: "avail-2-2",
        dayOfWeek: 4, // Thursday
        startTime: "14:00", // 2 PM
        endTime: "16:00"  // 4 PM
      }
    ],
    subjectRatings: [
      {
        subjectId: "sub-3",
        rating: 4.8,
        quizResults: [
          {
            id: "quiz-2-1",
            date: new Date('2023-05-20'),
            score: 10,
            totalQuestions: 10
          }
        ]
      }
    ]
  },
  {
    userId: "user-3",
    name: "Michael Brown",
    major: "Chemistry",
    year: "Graduate",
    bio: "Chemistry graduate student specializing in organic chemistry. Happy to help with any chemistry questions!",
    expertiseSubjects: [subjects[4]],
    learningSubjects: [subjects[3]],
    availability: [
      {
        id: "avail-3-1",
        dayOfWeek: 1, // Monday
        startTime: "09:00", // 9 AM
        endTime: "11:00"  // 11 AM
      },
      {
        id: "avail-3-2",
        dayOfWeek: 5, // Friday
        startTime: "13:00", // 1 PM
        endTime: "15:00"  // 3 PM
      }
    ],
    subjectRatings: [
      {
        subjectId: "sub-5",
        rating: 4.7,
        quizResults: [
          {
            id: "quiz-3-1",
            date: new Date('2023-07-05'),
            score: 19,
            totalQuestions: 20
          }
        ]
      }
    ]
  },
  {
    userId: "user-4",
    name: "Jessica Davis",
    major: "Mathematics",
    year: "Senior",
    bio: "Math enthusiast focusing on calculus and differential equations. I believe anyone can excel in math with the right guidance!",
    expertiseSubjects: [subjects[0], subjects[1]],
    learningSubjects: [subjects[5]],
    availability: [
      {
        id: "avail-4-1",
        dayOfWeek: 2, // Tuesday
        startTime: "11:00", // 11 AM
        endTime: "13:00"  // 1 PM
      },
      {
        id: "avail-4-2",
        dayOfWeek: 4, // Thursday
        startTime: "14:00", // 2 PM
        endTime: "16:00"  // 4 PM
      }
    ],
    subjectRatings: [
      {
        subjectId: "sub-1",
        rating: 4.9,
        quizResults: [
          {
            id: "quiz-4-1",
            date: new Date('2023-06-15'),
            score: 10,
            totalQuestions: 10
          }
        ]
      },
      {
        subjectId: "sub-2",
        rating: 4.6,
        quizResults: [
          {
            id: "quiz-4-2",
            date: new Date('2023-07-20'),
            score: 9,
            totalQuestions: 10
          }
        ]
      }
    ]
  },
  {
    userId: "user-5",
    name: "David Wilson",
    major: "Computer Engineering",
    year: "Junior",
    bio: "I specialize in computer systems and programming. Let's tackle complex coding problems together!",
    expertiseSubjects: [subjects[3], subjects[5]],
    learningSubjects: [subjects[2]],
    availability: [
      {
        id: "avail-5-1",
        dayOfWeek: 3, // Wednesday
        startTime: "15:00", // 3 PM
        endTime: "17:00"  // 5 PM
      },
      {
        id: "avail-5-2",
        dayOfWeek: 5, // Friday
        startTime: "10:00", // 10 AM
        endTime: "12:00"  // 12 PM
      }
    ],
    subjectRatings: [
      {
        subjectId: "sub-4",
        rating: 4.5,
        quizResults: [
          {
            id: "quiz-5-1",
            date: new Date('2023-05-25'),
            score: 9,
            totalQuestions: 10
          }
        ]
      }
    ]
  }
];

// Mock sessions data
const sessions: Session[] = [
  {
    id: "session-1",
    tutorId: "user-2",
    studentId: "user-1",
    subject: subjects[2], // Physics
    startTime: new Date('2023-08-15T14:00:00'),
    endTime: new Date('2023-08-15T15:30:00'),
    status: "completed",
    zoomLink: "https://asu.zoom.us/j/1234567890",
    sessionType: "tutor", // Adding the required sessionType field
    title: "Physics I - Mechanics Review",
    description: "Working through practice problems on forces and motion",
    feedback: {
      id: "feedback-1",
      sessionId: "session-1",
      rating: 4.5,
      comment: "Emily was a great tutor! She explained physics concepts very clearly.",
      createdAt: new Date('2023-08-15T16:00:00'),
      isLike: true
    }
  },
  {
    id: "session-2",
    tutorId: "user-4",
    studentId: "user-5",
    subject: subjects[0], // Calculus I
    startTime: new Date('2023-08-16T10:00:00'),
    endTime: new Date('2023-08-16T11:00:00'),
    status: "completed",
    zoomLink: "https://asu.zoom.us/j/0987654321",
    sessionType: "tutor",
    title: "Calculus I - Limits and Derivatives",
    description: "In-depth exploration of limits and basic derivatives",
    feedback: {
      id: "feedback-2",
      sessionId: "session-2",
      rating: 4.8,
      comment: "Jessica really knows her calculus! I feel much more confident now.",
      createdAt: new Date('2023-08-16T11:30:00'),
      isLike: true
    }
  },
  {
    id: "session-3",
    tutorId: "user-1",
    studentId: "user-3",
    subject: subjects[3], // Computer Science I
    startTime: new Date('2023-08-20T13:00:00'),
    endTime: new Date('2023-08-20T14:30:00'),
    status: "scheduled",
    zoomLink: "https://asu.zoom.us/j/5432167890",
    sessionType: "tutor",
    title: "Programming Fundamentals - Arrays & Functions",
    description: "Learn how to work with arrays and create reusable functions"
  },
  {
    id: "session-4",
    tutorId: "user-3",
    studentId: "user-2",
    subject: subjects[4], // Organic Chemistry
    startTime: new Date('2023-08-21T15:00:00'),
    endTime: new Date('2023-08-21T16:00:00'),
    status: "scheduled",
    zoomLink: "https://asu.zoom.us/j/6789054321",
    sessionType: "peer",
    title: "Organic Chemistry - Reaction Mechanisms",
    description: "Group study on common organic chemistry reaction mechanisms"
  },
  {
    id: "session-5",
    tutorId: "user-4",
    studentId: "user-1",
    subject: subjects[0], // Calculus I
    startTime: new Date('2023-07-25T11:00:00'),
    endTime: new Date('2023-07-25T12:30:00'),
    status: "completed",
    zoomLink: "https://asu.zoom.us/j/1357924680",
    sessionType: "peer",
    title: "Calculus Study Group - Integration",
    description: "Working through integration techniques and applications",
    feedback: {
      id: "feedback-3",
      sessionId: "session-5",
      rating: 4.2,
      comment: "Very helpful session. Jessica explains concepts clearly.",
      createdAt: new Date('2023-07-25T13:00:00'),
      isLike: true
    }
  },
  {
    id: "session-6",
    tutorId: "user-5",
    studentId: "user-4",
    subject: subjects[3], // Computer Science I
    startTime: new Date('2023-08-25T16:00:00'),
    endTime: new Date('2023-08-25T17:30:00'),
    status: "scheduled",
    zoomLink: "https://asu.zoom.us/j/2468013579",
    sessionType: "tutor",
    title: "Algorithms and Data Structures",
    description: "Introduction to fundamental algorithms and data structures"
  }
];

// Mock matches data
const matches: Match[] = [
  {
    id: "match-1",
    userId: "user-1", // John Smith
    matchedUserId: "user-2", // Emily Johnson
    subject: subjects[2], // Physics
    score: 0.9,
    status: "accepted"
  },
  {
    id: "match-2",
    userId: "user-1", // John Smith
    matchedUserId: "user-4", // Jessica Davis
    subject: subjects[0], // Calculus I
    score: 0.85,
    status: "suggested"
  },
  {
    id: "match-3",
    userId: "user-5", // David Wilson
    matchedUserId: "user-1", // John Smith
    subject: subjects[3], // Computer Science I
    score: 0.95,
    status: "requested"
  },
  {
    id: "match-4",
    userId: "user-3", // Michael Brown
    matchedUserId: "user-2", // Emily Johnson
    subject: subjects[2], // Physics
    score: 0.8,
    status: "accepted"
  }
];

// Mock live sessions data
const liveSessions: LiveSession[] = [
  {
    id: "live-1",
    tutorId: "user-2",
    subject: subjects[2], // Physics
    title: "Physics I - Mechanics & Newton's Laws",
    description: "We'll be covering key mechanics concepts including Newton's laws, energy conservation, and momentum.",
    startTime: new Date('2023-08-18T13:00:00'),
    endTime: new Date('2023-08-18T14:30:00'),
    zoomLink: "https://us05web.zoom.us/j/81072022041?pwd=7Doaby3GkxjBLxLQUKNzEH4wJ8d2bb.1",
    participants: [
      {
        userId: "user-1",
        joinedAt: new Date('2023-08-18T13:05:00'),
      }
    ],
    isActive: true,
    sessionType: "tutor" // Adding the required sessionType field
  },
  {
    id: "live-2",
    tutorId: "user-4",
    subject: subjects[0], // Calculus I
    title: "Calculus I - Derivatives & Applications",
    description: "Join this session to learn about derivatives and their applications in real-world problems.",
    startTime: new Date('2023-08-18T15:00:00'),
    endTime: new Date('2023-08-18T16:30:00'),
    zoomLink: "https://us05web.zoom.us/j/81072022041?pwd=7Doaby3GkxjBLxLQUKNzEH4wJ8d2bb.1",
    participants: [
      {
        userId: "user-5",
        joinedAt: new Date('2023-08-18T15:02:00'),
      }
    ],
    isActive: true,
    sessionType: "peer" // Adding the required sessionType field
  },
  {
    id: "live-3",
    tutorId: "user-3",
    subject: subjects[4], // Organic Chemistry
    title: "Organic Chemistry - Reactions Overview",
    description: "A comprehensive overview of organic chemistry reactions and mechanisms.",
    startTime: new Date('2023-08-19T10:00:00'),
    endTime: new Date('2023-08-19T11:30:00'),
    zoomLink: "https://us05web.zoom.us/j/81072022041?pwd=7Doaby3GkxjBLxLQUKNzEH4wJ8d2bb.1",
    participants: [],
    isActive: false,
    sessionType: "tutor" // Adding the required sessionType field
  },
  {
    id: "live-4",
    tutorId: "user-1",
    subject: subjects[3], // Computer Science I
    title: "Programming Fundamentals - Problem Solving",
    description: "Learn effective problem-solving techniques for programming challenges.",
    startTime: new Date('2023-08-19T14:00:00'),
    endTime: new Date('2023-08-19T15:30:00'),
    zoomLink: "https://us05web.zoom.us/j/81072022041?pwd=7Doaby3GkxjBLxLQUKNzEH4wJ8d2bb.1",
    participants: [],
    isActive: false,
    sessionType: "peer" // Adding the required sessionType field
  }
];

// Helper functions
export function getUserById(userId: string): User | undefined {
  return users.find(user => user.id === userId);
}

export function getUserProfile(userId: string): Profile | undefined {
  return profiles.find(profile => profile.userId === userId);
}

export function getUserSessions(userId: string): Session[] {
  return sessions.filter(session => 
    session.tutorId === userId || session.studentId === userId
  );
}

export function getMatchedUserProfiles(userId: string): Array<{match: Match, user: User, profile: Profile}> {
  const userMatches = matches.filter(match => match.userId === userId || match.matchedUserId === userId);
  
  return userMatches.map(match => {
    const matchedUserId = match.userId === userId ? match.matchedUserId : match.userId;
    const matchedUser = getUserById(matchedUserId);
    const matchedProfile = getUserProfile(matchedUserId);
    
    return {
      match,
      user: matchedUser!,
      profile: matchedProfile!
    };
  });
}

export function getLiveSessions(): LiveSession[] {
  const now = new Date();
  
  // Return both active sessions and upcoming sessions (starting in the next 24 hours)
  return liveSessions.filter(session => {
    if (session.isActive) return true;
    
    const timeDiff = session.startTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff <= 24 && hoursDiff > 0;
  });
}

export function getTutorUpcomingSessions(tutorId: string): LiveSession[] {
  const now = new Date();
  
  return liveSessions.filter(session => {
    return session.tutorId === tutorId && (session.isActive || session.startTime > now);
  });
}

export function registerForSession(sessionId: string, userId: string): boolean {
  const session = liveSessions.find(s => s.id === sessionId);
  
  if (!session) return false;
  
  // Check if user is already registered
  if (session.participants.some(p => p.userId === userId)) {
    return false;
  }
  
  // Add user to participants
  session.participants.push({
    userId,
    joinedAt: new Date()
  });
  
  return true;
}

export function getSubjects(): Subject[] {
  return subjects;
}

export function submitFeedback(sessionId: string, feedback: Omit<Feedback, 'id' | 'createdAt'>): boolean {
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) return false;
  
  const newFeedback = {
    ...feedback,
    id: `feedback-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };
  
  session.feedback = newFeedback;
  session.status = "completed";
  
  return true;
}

export const getAllTutorsBySubject = (subjectCode: string): Array<{ user: User, profile: Profile }> => {
  // Find all profiles that have the subject in their expertise by matching subject code
  let matchingProfiles: Profile[];

  if (!subjectCode || subjectCode === 'all') {
    // Return all profiles with at least one expertise subject
    matchingProfiles = profiles.filter(profile => profile.expertiseSubjects?.length > 0);
  } else {
    // Filter profiles by the specific subject code
    matchingProfiles = profiles.filter(profile => 
      profile.expertiseSubjects?.some(subject => subject.code === subjectCode)
    );
  }
  // const matchingProfiles = profiles.filter(profile => 
  //   profile.expertiseSubjects?.some(subject => subject.code === subjectCode)
  // );

  // Get the corresponding users
  return matchingProfiles.map(profile => {
    const user = users.find(u => u.id === profile.userId);
    return { user: user!, profile };
  });
};

