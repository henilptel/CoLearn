import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SwapRequest, Member } from '../types';

interface SwapRequestContextType {
  requests: SwapRequest[];
  sentRequests: SwapRequest[];
  receivedRequests: SwapRequest[];
  sendRequest: (fromUser: Member, toUser: Member, data: { offeredSkill: string; wantedSkill: string; message: string }) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  getRequestById: (requestId: string) => SwapRequest | undefined;
  loading: boolean;
}

const SwapRequestContext = createContext<SwapRequestContextType | undefined>(undefined);

export const useSwapRequests = () => {
  const context = useContext(SwapRequestContext);
  if (context === undefined) {
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

  // Load requests from localStorage on mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('swapRequests');
    if (savedRequests) {
      try {
        setRequests(JSON.parse(savedRequests));
      } catch (error) {
        console.error('Error parsing saved requests:', error);
        setRequests([]);
      }
    }
  }, []);

  // Save requests to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem('swapRequests', JSON.stringify(requests));
  }, [requests]);

  const sendRequest = async (fromUser: Member, toUser: Member, data: { offeredSkill: string; wantedSkill: string; message: string }) => {
    setLoading(true);
    try {
      // Simulate API call
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
      // Simulate API call
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
      // Simulate API call
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

  // Get sent and received requests (these will be computed based on current user in the consuming component)
  const sentRequests = requests.filter(req => req.fromUserId === 'current'); // This will be updated by components
  const receivedRequests = requests.filter(req => req.toUserId === 'current'); // This will be updated by components

  return (
    <SwapRequestContext.Provider value={{
      requests,
      sentRequests,
      receivedRequests,
      sendRequest,
      acceptRequest,
      rejectRequest,
      getRequestById,
      loading
    }}>
      {children}
    </SwapRequestContext.Provider>
  );
};