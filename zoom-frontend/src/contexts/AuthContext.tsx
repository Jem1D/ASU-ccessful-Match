
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Profile } from '../types/models';
import { getUserProfile, profiles } from '../services/mockData';

interface AuthContextType {
  currentUser: User | null;
  userProfile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, confirmPassword: string, profileData?: any) => Promise<User>;
  logout: () => Promise<void>;
  setUserProfile: (profile: Profile) => void;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isLoading: true,
  login: async () => { throw new Error('Not implemented'); },
  signup: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  setUserProfile: () => { throw new Error('Not implemented'); },
  checkSession: async () => { throw new Error('Not implemented'); },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfileState] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async (): Promise<boolean> => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          
          const storedProfile = localStorage.getItem('userProfile');
          if (storedProfile) {
            setUserProfileState(JSON.parse(storedProfile));
          }
          
          return true;
        } catch (e) {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userProfile');
        }
      }
      return false;
    } catch (error) {
      console.error('Session check failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkSession();
      setIsLoading(false);
    };
    
    init();
  }, []);

  const formatProfileFromFirebase = (firebaseProfile: any, userId: string): Profile => {
    return {
      userId: userId,
      name: firebaseProfile.name || '',
      major: firebaseProfile.major || '',
      year: firebaseProfile.year || '',
      bio: firebaseProfile.bio || '',
      expertiseSubjects: firebaseProfile.expertise?.map((subject: string) => {
        const [code, name] = subject.split(' : ');
        return { id: code, code, name: name || code, description: '' };
      }) || [],
      learningSubjects: firebaseProfile.learning_interests?.map((subject: string) => {
        const [code, name] = subject.split(' : ');
        return { id: code, code, name: name || code, description: '' };
      }) || [],
      availability: []
    };
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch('http://localhost:3007/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid email or password');
      }
      
      const data = await response.json();
      
      const completeUser: User = {
        id: email, // Using email as ID since your backend is using email as document ID
        name: '',  // Will be filled from profile if available
        email: email,
        role: 'student',
        createdAt: new Date()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(completeUser));
      setCurrentUser(completeUser);
      
      return completeUser;
    } catch (error) {
      console.error('Login error:', error);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('API not available, falling back to mock data');
        
        const mockedUsers = [
          { 
            id: '1', 
            name: 'John Doe', 
            email: 'john@asu.edu',
            role: 'student' as const,
            createdAt: new Date()
          },
          { 
            id: '2', 
            name: 'Jane Smith', 
            email: 'jane@asu.edu',
            role: 'student' as const,
            createdAt: new Date()
          },
        ];
        
        const user = mockedUsers.find(u => u.email === email);
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        
        const profile = getUserProfile(user.id);
        if (profile) {
          setUserProfileState(profile);
          localStorage.setItem('userProfile', JSON.stringify(profile));
        }
        
        return user;
      }
      
      throw error;
    }
  };

  const signup = async (email: string, password: string, confirmPassword: string, profileData?: any): Promise<User> => {
    try {
      // Step 1: Create account with email and password
      const accountResponse = await fetch('http://localhost:3007/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirm_password: confirmPassword
        }),
      });
      
      if (!accountResponse.ok) {
        const errorData = await accountResponse.json();
        throw new Error(errorData.error || 'Failed to create account');
      }
      
      const accountData = await accountResponse.json();
      const userId = email; // Using email as the userId
      
      // Step 2: Create user profile
      const userProfileData = {
        email,
        name: profileData?.name || '',
        bio: profileData?.bio || '',
        expertise: profileData?.expertise || [],
        learning_interests: profileData?.learning_interests || [],
        is_active: true,
        is_mentor: false,
        major: profileData?.major || '',
        year: profileData?.year || ''
      };

      const profileResponse = await fetch('http://localhost:3007/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfileData),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.error || 'Account created but failed to set up profile');
      }

      const completeUser: User = {
        id: userId,
        name: profileData?.name || '',
        email,
        role: 'student',
        createdAt: new Date()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(completeUser));
      setCurrentUser(completeUser);
      
      const formattedProfile: Profile = {
        userId: userId,
        name: profileData?.name || '',
        major: profileData?.major || '',
        year: profileData?.year || '',
        bio: profileData?.bio || '',
        expertiseSubjects: [],
        learningSubjects: [],
        availability: []
      };
      
      setUserProfileState(formattedProfile);
      localStorage.setItem('userProfile', JSON.stringify(formattedProfile));
      
      return completeUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('http://localhost:3007/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userProfile');
      setCurrentUser(null);
      setUserProfileState(null);
    }
  };
  
  const setUserProfile = (profile: Profile) => {
    setUserProfileState(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    try {
      const profileData = {
        email: currentUser?.email,
        name: profile.name,
        bio: profile.bio,
        major: profile.major,
        year: profile.year,
        expertise: profile.expertiseSubjects?.map(subject => `${subject.code} : ${subject.name}`) || [],
        learning_interests: profile.learningSubjects?.map(subject => `${subject.code} : ${subject.name}`) || [],
        is_active: true,
        is_mentor: false
      };
      
      fetch('http://localhost:3007/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
    
    const existingProfileIndex = profiles.findIndex(p => p.userId === profile.userId);
    if (existingProfileIndex >= 0) {
      profiles[existingProfileIndex] = profile;
    } else {
      profiles.push(profile);
    }
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    login,
    signup,
    logout,
    setUserProfile,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
