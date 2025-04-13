import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { subjects } from '../services/mockData';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Subject, Availability } from '../types/models';
import type { Profile as ProfileType } from '../types/models';

const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "PhD"];
const majors = [
  "Computer Science",
  "Physics",
  "Biology",
  "Chemistry",
  "Mathematics",
  "Psychology",
  "History",
  "English",
  "Engineering",
  "Business",
  "Communications",
  "Economics",
];

// Sample availability data that matches the Availability type
const sampleAvailability: Availability[] = [
  { id: "avail-1", dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
  { id: "avail-2", dayOfWeek: 3, startTime: "14:00", endTime: "16:00" },
  { id: "avail-3", dayOfWeek: 5, startTime: "09:00", endTime: "11:00" },
];

// Sample ratings for dummy data
const sampleRatings = [
  { subjectId: "1", rating: 4.5 },
  { subjectId: "3", rating: 3.8 },
  { subjectId: "5", rating: 4.2 },
];

const Profile: React.FC = () => {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<ProfileType>>({
    major: '',
    year: '',
    bio: '',
    expertiseSubjects: [],
    learningSubjects: [],
    availability: []
  });
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');
  const [selectedLearning, setSelectedLearning] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileCompletion = () => {
      if (currentUser && userProfile) {
        const hasRequiredFields = userProfile.major && 
                                 userProfile.year && 
                                 userProfile.bio && 
                                 userProfile.expertiseSubjects?.length > 0 &&
                                 userProfile.learningSubjects?.length > 0;
        
        if (hasRequiredFields) {
          setIsComplete(true);
          const isDirectNavigation = window.location.pathname.includes('/profile');
          if (!isDirectNavigation) {
            navigate('/dashboard');
            return true;
          }
        }
      }
      return false;
    };

    if (!checkProfileCompletion()) {
      if (currentUser) {
        if (userProfile) {
          setProfile(userProfile);
        } else {
          const sampleProfile: Partial<ProfileType> = {
            major: 'Computer Science',
            year: 'Junior',
            bio: 'I am passionate about learning and helping others succeed in their studies. My areas of expertise include programming, data structures, and algorithms.',
            expertiseSubjects: subjects.slice(0, 3),
            learningSubjects: subjects.slice(3, 6),
            availability: sampleAvailability,
            subjectRatings: sampleRatings
          };
          setProfile(sampleProfile);
        }
      }
    }
  }, [currentUser, userProfile, navigate]);

  const handleExpertiseAdd = () => {
    if (!selectedExpertise) return;
    
    const subject = subjects.find(s => s.id === selectedExpertise);
    if (!subject) return;
    
    if (profile.expertiseSubjects?.some(s => s.id === subject.id)) {
      toast.error(`${subject.code} is already in your expertise list`);
      return;
    }
    
    setProfile(prev => ({
      ...prev,
      expertiseSubjects: [...(prev.expertiseSubjects || []), subject]
    }));
    setSelectedExpertise('');
  };

  const handleLearningAdd = () => {
    if (!selectedLearning) return;
    
    const subject = subjects.find(s => s.id === selectedLearning);
    if (!subject) return;
    
    if (profile.learningSubjects?.some(s => s.id === subject.id)) {
      toast.error(`${subject.code} is already in your learning list`);
      return;
    }
    
    setProfile(prev => ({
      ...prev,
      learningSubjects: [...(prev.learningSubjects || []), subject]
    }));
    setSelectedLearning('');
  };

  const handleExpertiseRemove = (subjectId: string) => {
    setProfile(prev => ({
      ...prev,
      expertiseSubjects: prev.expertiseSubjects?.filter(s => s.id !== subjectId) || []
    }));
  };

  const handleLearningRemove = (subjectId: string) => {
    setProfile(prev => ({
      ...prev,
      learningSubjects: prev.learningSubjects?.filter(s => s.id !== subjectId) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.major || !profile.year || !profile.bio) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!profile.expertiseSubjects?.length) {
      toast.error('Please add at least one subject you can help with');
      return;
    }
    
    if (!profile.learningSubjects?.length) {
      toast.error('Please add at least one subject you want to learn');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to save your profile');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const completeProfile: ProfileType = {
        userId: currentUser.id,
        name: currentUser.name || '',
        major: profile.major || '',
        year: profile.year || '',
        bio: profile.bio || '',
        expertiseSubjects: profile.expertiseSubjects || [],
        learningSubjects: profile.learningSubjects || [],
        availability: profile.availability || sampleAvailability,
        subjectRatings: profile.subjectRatings || sampleRatings
      };
      
      setUserProfile(completeProfile);
      
      console.log("Profile saved:", completeProfile);
      
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout requireAuth>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-6 text-2xl font-bold">Complete Your Profile</h1>
          
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about your academic background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Select
                      value={profile.major}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, major: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your major" />
                      </SelectTrigger>
                      <SelectContent>
                        {majors.map((major) => (
                          <SelectItem key={major} value={major}>
                            {major}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={profile.year}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, year: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself, your academic interests, and your study style"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Expertise</CardTitle>
                <CardDescription>What subjects can you help others with?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.code}: {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleExpertiseAdd}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.expertiseSubjects?.map((subject) => (
                    <Badge key={subject.id} variant="secondary" className="pl-3 pr-2 py-2">
                      <span>{subject.code}: {subject.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => handleExpertiseRemove(subject.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                  {profile.expertiseSubjects?.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No subjects added yet. Add subjects you can tutor others in.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Learning Interests</CardTitle>
                <CardDescription>What subjects do you want to learn or improve in?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Select value={selectedLearning} onValueChange={setSelectedLearning}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.code}: {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleLearningAdd}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.learningSubjects?.map((subject) => (
                    <Badge key={subject.id} className="pl-3 pr-2 py-2 bg-transparent border border-asu-maroon text-asu-maroon">
                      <span>{subject.code}: {subject.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => handleLearningRemove(subject.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                  {profile.learningSubjects?.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No subjects added yet. Add subjects you want to learn or improve in.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
