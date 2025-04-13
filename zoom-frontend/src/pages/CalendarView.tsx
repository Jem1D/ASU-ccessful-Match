
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Video, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

interface MeetingEvent {
  uuid: string;
  id: number;
  host_id: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  created_at: string;
  join_url: string;
  supportGoLive: boolean;
}

const CalendarView: React.FC = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  const [upcomingMeetings, setUpcomingMeetings] = useState<MeetingEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [meetingsOnSelectedDate, setMeetingsOnSelectedDate] = useState<MeetingEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Log to check tutorId
  console.log('Tutor ID:', tutorId);

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use mock data for local development or actual API for production
        let response;
        if (window.location.hostname === 'localhost') {
          // Create mock data that matches the real API response
          const mockMeetings = [
            {
              uuid: "abc123",
              id: 123456,
              host_id: tutorId || currentUser?.id || "host123",
              topic: "Physics Lab Review",
              type: 2,
              start_time: "2025-04-12T11:30:00Z",
              duration: 45,
              timezone: "America/Phoenix",
              created_at: "2025-04-15T10:00:00Z",
              join_url: "https://us05web.zoom.us/j/81072022041?pwd=7Doaby3GkxjBLxLQUKNzEH4wJ8d2bb.1",
              supportGoLive: true
            },
            {
              uuid: "def456",
              id: 789012,
              host_id: tutorId || currentUser?.id || "host123",
              topic: "Calculus Study Session",
              type: 2,
              start_time: "2025-04-13T15:00:00Z",
              duration: 60,
              timezone: "America/Phoenix",
              created_at: "2025-04-16T09:30:00Z",
              join_url: "https://us05web.zoom.us/j/81072022041?pwd=7Doaby3GkxjBLxLQUKNzEH4wJ8d2bb.1",
              supportGoLive: true
            }
          ];
          
          response = { data: { sessions: mockMeetings } };
          console.log("Using mock data:", mockMeetings);
        } else {
          // Real API call
          response = await axios.post("http://localhost:3007/api/tutors/sessions", {
            tutorId: tutorId || currentUser?.id,
          });
        }
  
        // Log the entire response object to understand its structure
        console.log("Full response data:", response.data);
  
        // Adjust based on the structure of response.data
        if (response.data && Array.isArray(response.data.sessions)) {
          const formatted: MeetingEvent[] = response.data.sessions.map((session: any) => ({
            uuid: session.uuid,
            id: session.id,
            host_id: session.host_id || "unknown",
            topic: session.topic,
            type: session.type,
            start_time: session.start_time,
            duration: session.duration,
            timezone: session.timezone || "America/Phoenix", // Default timezone if not provided
            created_at: session.created_at,
            join_url: session.join_url,
            supportGoLive: session.supportGoLive || false, // Default to false if not provided
          }));
  
          // Set the formatted data in the state
          console.log("Formatted meetings:", formatted);
          setUpcomingMeetings(formatted);
        } else {
          console.error("sessions property not found or is not an array:", response.data);
          // Try to handle other data structures
          if (response.data && typeof response.data === 'object') {
            const meetings = [];
            // Loop through response data to find any meeting-like objects
            for (const key in response.data) {
              if (response.data[key] && typeof response.data[key] === 'object' && response.data[key].start_time) {
                meetings.push({
                  uuid: response.data[key].uuid || key,
                  id: response.data[key].id || parseInt(key),
                  host_id: response.data[key].host_id || "unknown",
                  topic: response.data[key].topic || "Untitled Meeting",
                  type: response.data[key].type || 0,
                  start_time: response.data[key].start_time,
                  duration: response.data[key].duration || 60,
                  timezone: response.data[key].timezone || "America/Phoenix",
                  created_at: response.data[key].created_at || new Date().toISOString(),
                  join_url: response.data[key].join_url || "#",
                  supportGoLive: response.data[key].supportGoLive || false,
                });
              }
            }
            if (meetings.length > 0) {
              console.log("Extracted meetings from response:", meetings);
              setUpcomingMeetings(meetings);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch upcoming meetings:", error);
        setError("Failed to load meetings. Please try again later.");
        toast.error("Could not load meetings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUpcomingMeetings();
  }, [tutorId, currentUser?.id]);
  
  // Track days with meetings
  const daysWithMeetings = upcomingMeetings.map(meeting => 
    parseISO(meeting.start_time)
  );
  console.log(daysWithMeetings);
  useEffect(() => {
    if (selectedDate) {
      const filteredMeetings = upcomingMeetings.filter(meeting => 
        isSameDay(parseISO(meeting.start_time), selectedDate)
      );
      console.log(filteredMeetings);
      setMeetingsOnSelectedDate(filteredMeetings);
    } else {
      setMeetingsOnSelectedDate([]);
    }
  }, [selectedDate]);

  const formatMeetingTime = (startTime: string, durationMinutes: number) => {
    const start = parseISO(startTime);
    const formattedStart = format(start, 'h:mm a');
    
    // Calculate end time
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + durationMinutes);
    const formattedEnd = format(end, 'h:mm a');
    
    return `${formattedStart} - ${formattedEnd}`;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  return (
    <Layout requireAuth>
      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Calendar</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  View scheduled sessions with {tutorId ? "this tutor" : "your students"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-medium">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="border rounded-md"
                  modifiers={{
                    hasMeeting: daysWithMeetings
                  }}
                  modifiersStyles={{
                    hasMeeting: {
                      backgroundColor: "#fee2e2", // Light red background for days with meetings
                      fontWeight: "bold",
                      color: "#000",
                      borderRadius: "4px"
                    }
                  }}
                />
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-200 mr-2"></div>
                    <span>Days with scheduled meetings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col">
                  <CardTitle>
                    {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {meetingsOnSelectedDate.length === 0 
                      ? "No meetings scheduled for this day" 
                      : `${meetingsOnSelectedDate.length} meeting${meetingsOnSelectedDate.length > 1 ? 's' : ''} scheduled`}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 w-fit rounded-md">
                    <TabsTrigger value="upcoming" className="px-6">Upcoming</TabsTrigger>
                    <TabsTrigger value="past" className="px-6">Past</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming">
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-pulse">Loading meetings...</div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-red-500">
                        {error}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {meetingsOnSelectedDate.length > 0 ? (
                          meetingsOnSelectedDate.map((meeting) => (
                            <Card key={meeting.uuid} className="overflow-hidden border-0 shadow-none">
                              <div className="p-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-xl">{meeting.topic}</h3>
                                  <Badge className="bg-red-800 hover:bg-red-700">Zoom Meeting</Badge>
                                </div>
                                
                                <div className="mt-4 space-y-2">
                                  <div className="flex items-center text-sm">
                                    <CalendarIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                                    {format(parseISO(meeting.start_time), 'EEEE, MMMM d')}
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                                    {formatMeetingTime(meeting.start_time, meeting.duration)}
                                  </div>
                                </div>
                                
                                <div className="flex mt-6 space-x-2">
                                  <Button className="flex-1 bg-red-800 hover:bg-red-700" asChild>
                                    <a href={meeting.join_url} target="_blank" rel="noopener noreferrer">
                                      <Video className="w-4 h-4 mr-2" />
                                      Join Zoom
                                    </a>
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Message
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-medium">No upcoming meetings</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              There are no meetings scheduled for this date.
                            </p>
                            <div className="mt-6">
                              <Button asChild>
                                <Link to="/dashboard">
                                  Schedule a Meeting
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="past">
                    <div className="text-center py-8">
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-medium">No past meetings</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Past meetings will appear here after they've completed.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarView;
