// frontend/src/apis/meeting.ts
import { axiosInstance } from './commons';

export const getToken = (roomId?: string) => {
  return axiosInstance.post('/meetings/token', { roomId });
};

export const createRoom = (token: string) => {
  return axiosInstance.post('/meetings/room', { token });
};

export const startRecording = (token: string, roomId: string) => {
  return axiosInstance.post('/meetings/recordings/start', { token, roomId });
};

export const stopRecording = (token: string, roomId: string) => {
  return axiosInstance.post('/meetings/recordings/stop', { token, roomId });
};