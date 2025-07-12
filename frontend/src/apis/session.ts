import { axiosInstance } from "./commons";
import type { AxiosResponse } from "axios";

// Types
interface TimeSlot {
  id: string;
  day: "SUNDAYS" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  from: string;
  to: string;
  session_id: string;
  session: MentorSession;
  mentee_id: string;
  mentee: object;
  sessions: MentorSession[];
}

interface MentorSessionTopic {
  id: string;
  name: string;
  sessions: MentorSession[];
}

interface MentorSession {
  id: string;
  description: string;
  durationMinutes: number;
  topics: MentorSessionTopic[];
  timeSlots: TimeSlot[];
  mentor_id: string;
  mentor: object;
}

function getAllAvailableSessions(userId: string): Promise<AxiosResponse<any>> {
  return axiosInstance.get(`/session/list/${userId}`);
}

function getSession(id: string): Promise<AxiosResponse<any>> {
  return axiosInstance.get(`/session/${id}`);
}

function getAllUserSessions(status?: string): Promise<AxiosResponse<any>> {
  let url = "/session/user/list";

  if (status) {
    url += `?status=${status}`;
  }

  return axiosInstance.get(url);
}

function getAcceptedSessions(): Promise<AxiosResponse<any>> {
  return axiosInstance.get("/session/user/accepted");
}

function bookSession(bookingId: string): Promise<AxiosResponse<any>> {
  return axiosInstance.post(`/session/${bookingId}/book`);
}

function createSession(sessionData: any): Promise<AxiosResponse<any>> {
  return axiosInstance.post("/session", sessionData);
}

function createTimeSlots(sessionData: any): Promise<AxiosResponse<any>> {
  return axiosInstance.post("/session/time-slots", sessionData);
}

function getAllTopics(): Promise<AxiosResponse<any>> {
  return axiosInstance.get("/session/topics");
}

function deleteSession(sessionId: string): Promise<AxiosResponse<any>> {
  return axiosInstance.delete(`/session/${sessionId}`);
}

function updateBookingStatus(bookingId: string, status: string): Promise<AxiosResponse<any>> {
  return axiosInstance.put(`/session/${bookingId}/status`, { status });
}

function setSessionRoomId(bookingId: string, roomId: string): Promise<AxiosResponse<any>> {
  return axiosInstance.put(`/session/${bookingId}/room`, { room_id: roomId });
}

function updateTimeSlots(mentorId: string, sessionData: any): Promise<AxiosResponse<any>> {
  return axiosInstance.put(`/session/${mentorId}/time-slots`, sessionData);
}

export {
  getAllAvailableSessions,
  getSession,
  getAllUserSessions,
  bookSession,
  createSession,
  createTimeSlots,
  getAllTopics,
  deleteSession,
  updateBookingStatus,
  setSessionRoomId,
  getAcceptedSessions,
  updateTimeSlots
};

// Export types for use in other files
export type {
  TimeSlot,
  MentorSessionTopic,
  MentorSession,
};
