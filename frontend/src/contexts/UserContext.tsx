import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Member } from '../types';

interface UserContextType {
  currentUser: Member | null;
  updateCurrentUser: (user: Member) => void;
  setCurrentUser: (user: Member | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<Member | null>(null);

  // Initialize user from localStorage or use default
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUserState(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        // Set default user if parsing fails
        setDefaultUser();
      }
    } else {
      setDefaultUser();
    }
  }, []);

  const setDefaultUser = () => {
    const defaultUser: Member = {
      id: "current",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "member",
      name: "John Doe",
      rating: 4.5,
      currentPost: "Full Stack Developer & Tech Enthusiast",
      noOfSessions: 12,
      noOfReviews: 5,
      experienceYears: 5,
      experienceMonths: 8,
      creditScore: 85,
      skillsOffered: ["JavaScript", "React", "Node.js", "Python"],
      skillsWanted: ["Machine Learning", "UI/UX Design", "Data Science"],
      location: "San Francisco, CA",
      bio: "Passionate about creating amazing web experiences and always eager to learn new technologies. Love to share knowledge and help others grow in their coding journey!",
      isPublicProfile: true,
      availability: ["weekends", "evenings"],
      timeSlots: [
        { day: "Monday", slots: [] },
        { day: "Tuesday", slots: [] },
        { day: "Wednesday", slots: [] },
        { day: "Thursday", slots: [] },
        { day: "Friday", slots: [] },
        { day: "Saturday", slots: ["09:00", "10:00", "14:00", "15:00"] },
        { day: "Sunday", slots: ["09:00", "10:00", "14:00", "15:00"] }
      ]
    };
    setCurrentUserState(defaultUser);
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
  };

  const updateCurrentUser = (user: Member) => {
    setCurrentUserState(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const setCurrentUser = (user: Member | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, updateCurrentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};