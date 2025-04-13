
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Session, Subject } from '@/types/models';
import { createMeeting } from '@/services/meetingService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Define the form schema using zod
const formSchema = z.object({
  subjectId: z.string().min(1, { message: "Subject is required" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  duration: z.number().min(15, { message: "Duration must be at least 15 minutes" }),
  sessionType: z.enum(["tutor", "peer"]),
  zoomLink: z.string().optional(),
});

interface CreateSessionFormProps {
  userExpertiseSubjects: Subject[];
  canHostPeerSession: boolean;
  onSessionCreated?: (session: Session) => void;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const CreateSessionForm: React.FC<CreateSessionFormProps> = ({
  userExpertiseSubjects,
  canHostPeerSession,
  onSessionCreated,
  onSubmitSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      duration: 60,
      sessionType: canHostPeerSession ? 'peer' : 'tutor',
      zoomLink: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const selectedSubject = userExpertiseSubjects.find(s => s.id === values.subjectId);
      if (!selectedSubject) {
        throw new Error("Selected subject not found");
      }

      const dateObj = new Date(values.date);
      const [hours, minutes] = values.startTime.split(':').map(Number);
      dateObj.setUTCHours(hours, minutes, 0, 0);

      const payload = {
        topic: values.title,
        start_time: dateObj.toISOString(),
        duration: values.duration,
        subject: selectedSubject,
        title: values.title,
        session_type: values.sessionType,
        description: values.description,
        // Preserve any existing zoom link
        zoomLink: values.zoomLink
      };

      const meetingResponse = await createMeeting(payload);
      console.log("Meeting created:", meetingResponse);
      
      const session: Session = {
        id: meetingResponse.session_id,
        tutorId: currentUser?.id || meetingResponse.tutor_id,
        studentId: meetingResponse.student_id,
        subject: meetingResponse.subject,
        startTime: new Date(meetingResponse.start_time),
        endTime: new Date(meetingResponse.end_time),
        status: 'scheduled',
        zoomLink: meetingResponse.join_url || values.zoomLink,
        sessionType: meetingResponse.session_type,
        title: meetingResponse.title,
        description: meetingResponse.description || values.description
      };

      toast.success("Session created successfully!");

      if (onSessionCreated) {
        onSessionCreated(session);
      } else if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userExpertiseSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code}: {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Calculus Review for Midterm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what will be covered in this session"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={15} 
                  step={15} 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {canHostPeerSession && (
          <FormField
            control={form.control}
            name="sessionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tutor">Tutoring (1-on-1)</SelectItem>
                    <SelectItem value="peer">Peer Study Group</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Peer study groups are open to multiple participants
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Session"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateSessionForm;
