import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SwapRequest, Member } from '../types';
import { getToken, createRoom } from '../apis/meeting';

interface SwapRequestContextType {
  requests: SwapRequest[];
  sentRequests: SwapRequest[];
  receivedRequests: SwapRequest[];
  sendRequest: (fromUser: Member, toUser: Member, data: { offeredSkill: string; wantedSkill: string; message: string }) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  getRequestById: (requestId: string) => SwapRequest | undefined;
  createVideoCall: (requestId: string) => Promise<{ roomId: string; token: string }>;
  loading: boolean;
}

const SwapRequestContext = createContext<SwapRequestContextType | undefined>(undefined);

export const useSwapRequests = () => {
  const context = useContext(SwapRequestContext);
  if (!context) {
    throw new Error('useSwapRequests must be used within a SwapRequestProvider');
  }
  return context;
};

interface SwapRequestProviderProps {
  children: ReactNode;
}

export const SwapRequestProvider: React.FC<SwapRequestProviderProps> = ({ children }) => {
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with hardcoded demo requests - ALWAYS VISIBLE
  useEffect(() => {
    const hardcodedRequests: SwapRequest[] = [
      {
        id: 'demo_accepted_request_001',
        fromUserId: 'alice_user_id',
        toUserId: 'demo_current_user', // Fixed user ID
        fromUserName: 'Alice Johnson',
        toUserName: 'You',
        offeredSkill: 'Python',
        requestedSkill: 'React',
        message: 'Hi! I\'d love to help you learn Python in exchange for React lessons. I have 12 years of experience and can teach from basics to advanced concepts.',
        status: 'accepted',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        fromUser: {
          id: 'alice_user_id',
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice@example.com',
          role: 'member',
          name: 'Alice Johnson',
          rating: 4.8,
          currentPost: 'Senior Data Scientist & Python Enthusiast',
          noOfSessions: 25,
          noOfReviews: 8,
          experienceYears: 12,
          experienceMonths: 3,
          creditScore: 98,
          skillsOffered: ['Python', 'Data Science', 'Machine Learning', 'Statistics'],
          skillsWanted: ['React', 'UI/UX Design', 'Photography'],
          location: 'San Francisco, CA',
          bio: 'Love turning data into insights and helping others learn Python!',
          isPublicProfile: true,
          availability: ['weekends', 'evenings']
        },
        toUser: {
          id: 'demo_current_user',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          role: 'member',
          name: 'Demo User',
          rating: 4.0,
          currentPost: 'Frontend Developer',
          noOfSessions: 5,
          noOfReviews: 3,
          experienceYears: 3,
          experienceMonths: 6,
          creditScore: 85,
          skillsOffered: ['React', 'JavaScript', 'HTML/CSS'],
          skillsWanted: ['Python', 'Data Science', 'Machine Learning'],
          location: 'Your Location',
          bio: 'Passionate about web development and eager to learn backend technologies.',
          isPublicProfile: true,
          availability: ['weekends', 'evenings']
        }
      },
      {
        id: 'demo_accepted_request_002',
        fromUserId: 'bob_user_id',
        toUserId: 'demo_current_user',
        fromUserName: 'Bob Smith',
        toUserName: 'You',
        offeredSkill: 'Node.js',
        requestedSkill: 'React',
        message: 'I can teach you Node.js backend development in exchange for React knowledge. Let\'s build something together!',
        status: 'accepted',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        fromUser: {
          id: 'bob_user_id',
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bob@example.com',
          role: 'member',
          name: 'Bob Smith',
          rating: 4.6,
          currentPost: 'Backend Engineer',
          noOfSessions: 18,
          noOfReviews: 6,
          experienceYears: 8,
          experienceMonths: 4,
          creditScore: 92,
          skillsOffered: ['Node.js', 'Express', 'MongoDB', 'API Development'],
          skillsWanted: ['React', 'UI/UX Design', 'Mobile Development'],
          location: 'Austin, TX',
          bio: 'Backend specialist who loves building scalable APIs and learning frontend technologies.',
          isPublicProfile: true,
          availability: ['weekends', 'evenings']
        },
        toUser: {
          id: 'demo_current_user',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          role: 'member',
          name: 'Demo User',
          rating: 4.0,
          currentPost: 'Frontend Developer',
          noOfSessions: 5,
          noOfReviews: 3,
          experienceYears: 3,
          experienceMonths: 6,
          creditScore: 85,
          skillsOffered: ['React', 'JavaScript', 'HTML/CSS'],
          skillsWanted: ['Python', 'Data Science', 'Machine Learning'],
          location: 'Your Location',
          bio: 'Passionate about web development and eager to learn backend technologies.',
          isPublicProfile: true,
          availability: ['weekends', 'evenings']
        }
      },
      {
        id: 'demo_pending_request_001',
        fromUserId: 'chloe_user_id',
        toUserId: 'demo_current_user',
        fromUserName: 'Chloe Kim',
        toUserName: 'You',
        offeredSkill: 'UI/UX Design',
        requestedSkill: 'React',
        message: 'Would love to exchange UI/UX design knowledge for React development skills. I can teach design thinking and prototyping.',
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        fromUser: {
          id: 'chloe_user_id',
          firstName: 'Chloe',
          lastName: 'Kim',
          email: 'chloe@example.com',
          role: 'member',
          name: 'Chloe Kim',
          rating: 4.9,
          currentPost: 'Lead UX Designer',
          noOfSessions: 30,
          noOfReviews: 12,
          experienceYears: 14,
          experienceMonths: 2,
          creditScore: 99,
          skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
          skillsWanted: ['Frontend Development', 'Animation'],
          location: 'New York, NY',
          bio: 'Believe great design can change the world!',
          isPublicProfile: true,
          availability: ['weekends', 'weekday_evenings']
        },
        toUser: {
          id: 'demo_current_user',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          role: 'member',
          name: 'Demo User',
          rating: 4.0,
          currentPost: 'Frontend Developer',
          noOfSessions: 5,
          noOfReviews: 3,
          experienceYears: 3,
          experienceMonths: 6,
          creditScore: 85,
          skillsOffered: ['React', 'JavaScript', 'HTML/CSS'],
          skillsWanted: ['Python', 'Data Science', 'Machine Learning'],
          location: 'Your Location',
          bio: 'Passionate about web development and eager to learn backend technologies.',
          isPublicProfile: true,
          availability: ['weekends', 'evenings']
        }
      }
    ];

    console.log('Setting hardcoded demo requests:', hardcodedRequests);
    setRequests(hardcodedRequests);
  }, []);

  const sendRequest = async (fromUser: Member, toUser: Member, data: { offeredSkill: string; wantedSkill: string; message: string }) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newRequest: SwapRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: fromUser.id,
        toUserId: toUser.id,
        fromUserName: fromUser.name,
        toUserName: toUser.name,
        offeredSkill: data.offeredSkill,
        requestedSkill: data.wantedSkill,
        message: data.message,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fromUser,
        toUser
      };

      setRequests(prev => [...prev, newRequest]);
    } catch (error) {
      console.error('Error sending request:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'accepted' as const, updatedAt: new Date().toISOString() }
          : req
      ));
    } catch (error) {
      console.error('Error accepting request:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as const, updatedAt: new Date().toISOString() }
          : req
      ));
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRequestById = (requestId: string) => {
    return requests.find(req => req.id === requestId);
  };

  const createVideoCall = async (requestId: string) => {
    try {
      console.log('Getting token...');
      const tokenResponse = await getToken();
      const token = tokenResponse.data.token;
      console.log('Token received:', token);
      
      console.log('Creating room...');
      const roomResponse = await createRoom(token);
      const roomId = roomResponse.data.roomId;
      console.log('Room created:', roomId);
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              roomId,
              meetingToken: token,
              meetingStartTime: new Date().toISOString() 
            }
          : req
      ));
      
      return { roomId, token };
    } catch (error) {
      console.error('Error creating video call:', error);
      throw error;
    }
  };

  // HARDCODED FILTERING - Always use 'demo_current_user' as the current user
  const sentRequests = requests.filter(req => req.fromUserId === 'demo_current_user');
  const receivedRequests = requests.filter(req => req.toUserId === 'demo_current_user');

  return (
    <SwapRequestContext.Provider value={{
      requests,
      sentRequests,
      receivedRequests,
      sendRequest,
      acceptRequest,
      rejectRequest,
      getRequestById,
      createVideoCall,
      loading
    }}>
      {children}
    </SwapRequestContext.Provider>
  );
};