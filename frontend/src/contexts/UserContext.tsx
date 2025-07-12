import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { userAPI } from '../apis/user';
import type { Member } from '../types';

interface UserContextType {
  currentUser: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateCurrentUser: (user: Member) => void;
  setCurrentUser: (user: Member | null) => void;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status with backend session
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.checkAuthStatus();
      
      if (response.data.authenticated && response.data.user) {
        const user = response.data.user;
        setCurrentUserState(user);
        setIsAuthenticated(true);
        
        // Sync with localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        // Not authenticated
        setCurrentUserState(null);
        setIsAuthenticated(false);
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setCurrentUserState(null);
      setIsAuthenticated(false);
      
      // Clear localStorage on error
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize authentication state
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await userAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUserState(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('registrationData');
    }
  };

  const updateCurrentUser = (user: Member) => {
    setCurrentUserState(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const setCurrentUser = (user: Member | null) => {
    setCurrentUserState(user);
    setIsAuthenticated(!!user);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  };

  const value: UserContextType = {
    currentUser,
    isAuthenticated,
    isLoading,
    updateCurrentUser,
    setCurrentUser,
    checkAuthStatus,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
