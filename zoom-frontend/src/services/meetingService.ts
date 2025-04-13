import { Session } from '../types/models';

type MeetingData = {
  topic: string;
  start_time: string;
  duration: number;
  subject?: {
    id: string;
    name: string;
    code: string;
    description?: string;
  };
  title?: string;
  session_type?: 'tutor' | 'peer';
  description?: string;
  zoomLink?: string;
};

type MeetingResponse = {
  session_id: string;
  meeting_id: string;
  topic: string;
  start_time: string;
  end_time: string;
  duration: number;
  join_url: string;
  start_url: string;
  password: string;
  session_type: 'tutor' | 'peer';
  tutor_id: string;
  student_id: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  subject: {
    id: string;
    name: string;
    code: string;
    description?: string;
  };
  title: string;
  description?: string;
};

export const createMeeting = async (meetingData: MeetingData): Promise<MeetingResponse> => {
  console.log("Creating meeting with data:", meetingData);

  // Step 1: Create Zoom meeting
  const response = await fetch('http://localhost:3007/api/meetings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meetingData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('API error:', errorData);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const zoomData = await response.json();
  console.log("Zoom meeting created:", zoomData);

  // Step 2: Push session to Firestore
  const sessionPayload = {
    topic: meetingData.topic,
    title: meetingData.title || meetingData.topic,
    description: meetingData.description || '',
    start_time: meetingData.start_time,
    duration: meetingData.duration,
    join_url: zoomData.join_url,
    start_url: zoomData.start_url,
    meeting_id: zoomData.meeting_id,
    session_type: meetingData.session_type || 'tutor',
    student_id: `session-${Date.now()}`, // Replace with actual student ID if available
    subject: meetingData.subject || {
      id: "default-subject",
      name: "General Topic",
      code: "GEN 101",
      description: "General study session"
    }
  };

  const sessionRes = await fetch('http://localhost:3007/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionPayload),
  });

  if (!sessionRes.ok) {
    const errorData = await sessionRes.json().catch(() => null);
    console.error('Session API error:', errorData);
    throw new Error(`Session API error: ${sessionRes.status} ${sessionRes.statusText}`);
  }

  const sessionData = await sessionRes.json();
  console.log("Session pushed to Firestore:", sessionData);

  return sessionData.session;
};

export const convertMeetingToSession = (meeting: MeetingResponse): Session => {
  return {
    id: meeting.session_id,
    tutorId: meeting.tutor_id,
    studentId: meeting.student_id,
    subject: meeting.subject,
    startTime: new Date(meeting.start_time),
    endTime: new Date(meeting.end_time),
    status: meeting.status,
    zoomLink: meeting.join_url,
    sessionType: meeting.session_type,
    title: meeting.title || 'Untitled Session',
    description: meeting.description || ''
  };
};
