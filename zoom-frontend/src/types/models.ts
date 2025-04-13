
export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  role: 'student' | 'admin';
  createdAt: Date;
}

export interface Profile {
  userId: string;
  name: string; // Added name field to Profile interface
  major: string;
  year: string;
  bio: string;
  expertiseSubjects: Subject[];
  learningSubjects: Subject[];
  availability: Availability[];
  subjectRatings?: SubjectRating[]; // New field for subject ratings
}

export interface SubjectRating {
  subjectId: string;
  rating: number;
  quizResults?: QuizResult[]; // Track quiz history
}

export interface QuizResult {
  id: string;
  date: Date;
  score: number;
  totalQuestions: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Session {
  id: string;
  tutorId: string;
  studentId: string;
  subject: Subject;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  zoomLink?: string;
  feedback?: Feedback;
  sessionType: 'tutor' | 'peer'; // Field to identify session type
  title: string; // Added title field to match form submission
  description: string; // Added description field to match form submission
}

export interface Feedback {
  id: string;
  sessionId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  isLike?: boolean; // Field to track like/dislike
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  subject: Subject;
  score: number;
  status: 'suggested' | 'requested' | 'accepted' | 'rejected';
}

export interface LiveSession {
  id: string;
  tutorId: string;
  subject: Subject;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  zoomLink?: string;
  participants: SessionParticipant[];
  isActive: boolean;
  sessionType: 'tutor' | 'peer'; // New field to identify session type
}

export interface SessionParticipant {
  userId: string;
  joinedAt?: Date;
}
