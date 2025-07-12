import { axiosInstance } from "./commons";
import type { AxiosResponse } from "axios";

// Types for swap request API
export interface CreateSwapRequestData {
  receiverId: string;
  message: string;
  offeredSkill: string;
  requestedSkill: string;
}

export interface UpdateSwapRequestData {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
}

// Create a new swap request
function createSwapRequest(data: CreateSwapRequestData): Promise<AxiosResponse<any>> {
  return axiosInstance.post("/swap", data);
}

// Get swap requests I sent
function getSentSwapRequests(): Promise<AxiosResponse<any>> {
  return axiosInstance.get("/swap/sent");
}

// Get swap requests I received
function getReceivedSwapRequests(): Promise<AxiosResponse<any>> {
  return axiosInstance.get("/swap/received");
}

// Get a specific swap request by ID
function getSwapRequestById(id: string): Promise<AxiosResponse<any>> {
  return axiosInstance.get(`/swap/${id}`);
}

// Update swap request status (accept/reject)
function updateSwapRequestStatus(id: string, data: UpdateSwapRequestData): Promise<AxiosResponse<any>> {
  return axiosInstance.patch(`/swap/${id}/status`, data);
}

// Delete a swap request
function deleteSwapRequest(id: string): Promise<AxiosResponse<any>> {
  return axiosInstance.delete(`/swap/${id}`);
}

// Accept a swap request
function acceptSwapRequest(id: string): Promise<AxiosResponse<any>> {
  return updateSwapRequestStatus(id, { status: 'ACCEPTED' });
}

// Reject a swap request
function rejectSwapRequest(id: string): Promise<AxiosResponse<any>> {
  return updateSwapRequestStatus(id, { status: 'REJECTED' });
}

// Export all functions as swapAPI
export const swapAPI = {
  createSwapRequest,
  getSentSwapRequests,
  getReceivedSwapRequests,
  getSwapRequestById,
  updateSwapRequestStatus,
  deleteSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
};

// Export individual functions
export {
  createSwapRequest,
  getSentSwapRequests,
  getReceivedSwapRequests,
  getSwapRequestById,
  updateSwapRequestStatus,
  deleteSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
};
