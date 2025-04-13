import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Clock, CalendarClock, Video, Filter, GraduationCap, School } from 'lucide-react';
import { LiveSession, User } from '@/types/models';
import { getUserById, registerForSession } from '@/services/mockData';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface LiveSessionsCardProps {
  sessions: LiveSession[];
  currentUserId: string;
}

const LiveSessionsCard: React.FC<LiveSessionsCardProps> = ({ sessions, currentUserId }) => {
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>("all");

  // Apply session type filter
  const filteredSessions = sessions.filter(session => {
    if (sessionTypeFilter === "all") return true;
    return session.sessionType === sessionTypeFilter;
  });

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Sessions</CardTitle>
          <CardDescription>No live sessions are currently in progress</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <Video className="w-12 h-12 mb-4 text-muted-foreground" />
          <p>No live sessions are currently available.</p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRegister = (sessionId: string) => {
    const success = registerForSession(sessionId, currentUserId);
    if (success) {
      toast.success("Successfully registered for the session!");
    } else {
      toast.error("Could not register for the session. It may be full or registration is closed.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Video className="w-5 h-5 mr-2" />
            Live Sessions
          </CardTitle>
          <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Sessions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="tutor">Tutor Sessions</SelectItem>
              <SelectItem value="peer">Peer Mentor Sessions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>Currently active and upcoming study sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8">
            <p>No sessions match your filter criteria</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const tutor = getUserById(session.tutorId);
            const isActive = session.isActive;
            const isRegistered = session.participants.some(p => p.userId === currentUserId);
            const canRegister = !isRegistered && (!isActive || (new Date() < new Date(session.startTime.getTime() + 30 * 60000)));
            const participantCount = session.participants.length;

            return (
              <div
                key={session.id}
                className={`p-4 border rounded-lg ${isActive ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    {tutor && (
                      <Avatar className="mr-3">
                        <AvatarImage src={tutor.profileImageUrl} />
                        <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <h4 className="font-semibold">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tutor?.name} · {session.subject.code}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge className="mr-2" variant={isActive ? "default" : "outline"}>
                          {isActive ? 'LIVE' : 'Upcoming'}
                        </Badge>
                        <Badge
                          className="mr-2"
                          variant="outline"
                          style={{ color: session.sessionType === 'peer' ? '#00A06D' : '#8C1D40', borderColor: session.sessionType === 'peer' ? '#00A06D' : '#8C1D40' }}
                        >
                          {session.sessionType === 'peer' ? (
                            <div className="flex items-center">
                              <GraduationCap className="w-3 h-3 mr-1" />
                              Peer Mentor
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <School className="w-3 h-3 mr-1" />
                              Tutor
                            </div>
                          )}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{participantCount} {participantCount === 1 ? 'participant' : 'participants'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm mt-3">{session.description}</p>

                <div className="flex flex-wrap gap-y-2 mt-3">
                  <div className="flex items-center mr-4 text-sm">
                    <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarClock className="w-4 h-4 mr-1 text-muted-foreground" />
                    {isActive ? 'Started' : 'Starts'} {isActive ?
                      new Date(Math.abs(Date.now() - session.startTime.getTime())).toISOString().substr(11, 5) + ' ago' :
                      new Date(Math.abs(session.startTime.getTime() - Date.now())).toISOString().substr(11, 5) + ' from now'
                    }
                  </div>
                </div>

                <div className="flex mt-4">
                  {isRegistered ? (
                    <Button className="w-full" asChild>
                      <a href={session.zoomLink} target="_blank" rel="noopener noreferrer">
                        <Video className="w-4 h-4 mr-2" />
                        {isActive ? 'Join Session' : 'View Session Details'}
                      </a>
                    </Button>
                  ) : canRegister ? (
                    <Button
                      className="w-full"
                      onClick={() => handleRegister(session.id)}
                    >
                      Register for Session
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => window.location.href = 'https://us05web.zoom.us/j/81072022041?pwd=7Doaby3GkxjBLxLQUKNzEH4wJ8d2bb.1'}
                    >
                      Join Now
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default LiveSessionsCard;
