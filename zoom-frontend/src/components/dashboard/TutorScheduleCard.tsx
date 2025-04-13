
import React, { useState } from 'react';
import { getUserById, getTutorUpcomingSessions } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { LiveSession } from '@/types/models';
import { format, isSameDay, parseISO, addMinutes } from 'date-fns';
import { createMeeting } from '@/services/meetingService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface TutorScheduleCardProps {
  tutorId: string;
  onScheduleSession?: (tutorId: string) => void;
}

const TutorScheduleCard: React.FC<TutorScheduleCardProps> = ({ tutorId, onScheduleSession }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const navigate = useNavigate();
  
  const tutor = getUserById(tutorId);
  const upcomingSessions = getTutorUpcomingSessions(tutorId);
  
  if (!tutor) {
    return null;
  }
  
  const formatSessionTime = (start: Date, end: Date) => {
    const startTime = format(new Date(start), 'h:mm a');
    const endTime = format(new Date(end), 'h:mm a');
    return `${startTime} - ${endTime}`;
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Helper to get dates that have sessions
  const getSessionDates = (sessions: LiveSession[]) => {
    return sessions.map(session => new Date(session.startTime));
  };
  
  // Helper to check if a date has sessions
  const dateHasSessions = (date: Date) => {
    return upcomingSessions.some(session => 
      isSameDay(new Date(session.startTime), date)
    );
  };
  
  // Get sessions for selected date
  const getSessionsForDate = (sessions: LiveSession[], selectedDate: Date) => {
    return sessions.filter(session => 
      isSameDay(new Date(session.startTime), selectedDate)
    );
  };
  
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };
  
  const sessionsForSelectedDate = date ? getSessionsForDate(upcomingSessions, date) : [];

  const handleScheduleClick = async (session: LiveSession) => {
    if (onScheduleSession) {
      onScheduleSession(tutorId);
      return;
    }

    try {
      setIsCreatingMeeting(true);
      
      // Format the meeting data
      const meetingData = {
        topic: `${session.subject.code}: ${session.subject.name} Study Session`,
        start_time: session.startTime.toISOString(),
        duration: Math.ceil((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)), // Duration in minutes
        subject: session.subject,
        title: session.title,
        session_type: session.sessionType,
        description: session.description
      };
      
      // Call the API to create a meeting
      const response = await createMeeting(meetingData);
      
      toast.success('Session scheduled successfully!');
      
      // Navigate to the calendar view to show the scheduled session
      navigate(`/calendar/${tutorId}`);
    } catch (error) {
      console.error('Failed to schedule session:', error);
      toast.error('Failed to schedule session. Please try again.');
    } finally {
      setIsCreatingMeeting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Avatar className="mr-2">
            <AvatarImage src={tutor.profileImageUrl} />
            <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
          </Avatar>
          <span>{tutor.name}'s Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasSession: getSessionDates(upcomingSessions)
              }}
              modifiersStyles={{
                hasSession: {
                  fontWeight: 'bold',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '4px'
                }
              }}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">
              {date ? (
                <>Sessions on {format(date, 'MMMM d, yyyy')}</>
              ) : (
                <>Select a date to view sessions</>
              )}
            </h3>
            
            {date && sessionsForSelectedDate.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No sessions scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessionsForSelectedDate.map((session) => (
                  <div key={session.id} className="border rounded-lg p-3">
                    <div className="font-medium">{session.subject.code}: {session.subject.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {formatSessionTime(session.startTime, session.endTime)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-muted-foreground">
                        {session.participants.length} registered participant(s)
                      </span>
                      <Button 
                        size="sm" 
                        onClick={() => handleScheduleClick(session)}
                        disabled={isCreatingMeeting}
                      >
                        {isCreatingMeeting ? 'Scheduling...' : 'Register'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorScheduleCard;
