import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Member } from '../types';
import type { SwapRequest } from '../types.ts';
import { swapAPI } from '../apis/swap';

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

  // Load requests from API and localStorage on mount
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        
        // Try to load from API first
        const [sentResponse, receivedResponse] = await Promise.all([
          swapAPI.getSentSwapRequests(),
          swapAPI.getReceivedSwapRequests()
        ]);
        
        const allRequests = [
          ...sentResponse.data.map((req: any) => ({
            id: req.id,
            fromUserId: req.requesterId,
            toUserId: req.receiverId,
            fromUserName: req.requester?.name || 'Unknown',
            toUserName: req.receiver?.name || 'Unknown',
            offeredSkill: req.offeredSkill || 'Unknown Skill',
            requestedSkill: req.requestedSkill || 'Unknown Skill',
            message: req.message || '',
            status: req.status?.toLowerCase() || 'pending',
            createdAt: req.createdAt,
            updatedAt: req.updatedAt,
            fromUser: req.requester,
            toUser: req.receiver
          })),
          ...receivedResponse.data.map((req: any) => ({
            id: req.id,
            fromUserId: req.requesterId,
            toUserId: req.receiverId,
            fromUserName: req.requester?.name || 'Unknown',
            toUserName: req.receiver?.name || 'Unknown',
            offeredSkill: req.offeredSkill || 'Unknown Skill',
            requestedSkill: req.requestedSkill || 'Unknown Skill',
            message: req.message || '',
            status: req.status?.toLowerCase() || 'pending',
            createdAt: req.createdAt,
            updatedAt: req.updatedAt,
            fromUser: req.requester,
            toUser: req.receiver
          }))
        ];
        
        setRequests(allRequests);
      } catch (error) {
        console.error('Failed to load requests from API, falling back to localStorage:', error);
        
        // Fallback to localStorage
        const savedRequests = localStorage.getItem('swapRequests');
        if (savedRequests) {
          try {
            setRequests(JSON.parse(savedRequests));
          } catch (error) {
            console.error('Error parsing saved requests:', error);
            setRequests([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  // Save requests to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem('swapRequests', JSON.stringify(requests));
  }, [requests]);

  const sendRequest = async (fromUser: Member, toUser: Member, data: { offeredSkill: string; wantedSkill: string; message: string }) => {
    setLoading(true);
    try {
      // Call real API
      const response = await swapAPI.createSwapRequest({
        receiverId: toUser.id,
        message: data.message,
        offeredSkill: data.offeredSkill,
        requestedSkill: data.wantedSkill,
      });
      
      if (response.data.swapRequest) {
        // Convert backend format to frontend format
        const newRequest: SwapRequest = {
          id: response.data.swapRequest.id,
          fromUserId: fromUser.id,
          toUserId: toUser.id,
          fromUserName: fromUser.name,
          toUserName: toUser.name,
          offeredSkill: data.offeredSkill,
          requestedSkill: data.wantedSkill,
          message: data.message,
          status: 'pending',
          createdAt: response.data.swapRequest.createdAt || new Date().toISOString(),
          updatedAt: response.data.swapRequest.updatedAt || new Date().toISOString(),
          fromUser,
          toUser
        };

        setRequests(prev => [...prev, newRequest]);
      }
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
      // Call real API
      await swapAPI.acceptSwapRequest(requestId);
      
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
      // Call real API
      await swapAPI.rejectSwapRequest(requestId);
      
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