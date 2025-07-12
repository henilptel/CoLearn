import { axiosInstance } from "./commons";
import type { AxiosResponse } from "axios";

// Types for API responses
interface LoginUser {
  email: string;
  password: string;
}

interface RegisterUser {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  isPublic: boolean;
  agreeToTerms: boolean;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  name: string;
  currentPost?: string;
  experienceYears?: number;
  experienceMonths?: number;
  skillsOffered?: string[];
  skillsWanted?: string[];
  location?: string;
  bio?: string;
  isPublicProfile?: boolean;
  availability?: string[];
  profileImage?: string;
  rating?: number;
  creditScore?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface GoogleCallbackBody {
  token: string;
  role?: string;
}

interface GetUserInfoParams {
  userId?: string;
}

// Individual functions
function login(user: LoginUser): Promise<AxiosResponse<any>> {
  return axiosInstance.post(`/auth/login`, user);
}

function register(user: RegisterUser): Promise<AxiosResponse<any>> {
  return axiosInstance.post(`/auth/register`, user);
}

function logout(): Promise<AxiosResponse<any>> {
  return axiosInstance.post("/auth/logout");
}

function sendVerificationEmail(email: string, role: string): Promise<AxiosResponse<any>> {
  return axiosInstance.post(`/auth/verify`, { email, role });
}

function verificationEmailCallback(token: string): Promise<AxiosResponse<any>> {
  return axiosInstance.get(`/auth/verify/callback?token=${token}`);
}

function registerUser(userProfile: Partial<UserProfile>): Promise<AxiosResponse<any>> {
  return axiosInstance.post(`/auth/register-user`, userProfile);
}

function googleCallback(body: GoogleCallbackBody): Promise<AxiosResponse<any>> {
  return axiosInstance.post(`/auth/google/callback`, body);
}

function googleRegister(credentialResponse: any): Promise<AxiosResponse<any>> {
  return axiosInstance.post(`/auth/google/register`, credentialResponse);
}

function getUserInfo(params?: GetUserInfoParams): Promise<AxiosResponse<any>> {
  return axiosInstance.get(`/user`);
}

function getAllTags(): Promise<AxiosResponse<any>> {
  return axiosInstance.get(`/users/tags`);
}

function getUserProfile(): Promise<AxiosResponse<any>> {
  return axiosInstance.get("/users/profile");
}

function editUserProfile(data: Partial<UserProfile>): Promise<AxiosResponse<any>> {
  return axiosInstance.put("/users/profile", data);
}

function updateProfile(data: Partial<UserProfile>): Promise<AxiosResponse<any>> {
  return axiosInstance.put("/users/profile", data);
}

function checkAuthStatus(): Promise<AxiosResponse<any>> {
  return axiosInstance.get("/auth/status");
}

// Create userAPI object for easier importing
const userAPI = {
  login,
  register,
  logout,
  sendVerificationEmail,
  verificationEmailCallback,
  registerUser,
  googleCallback,
  googleRegister,
  getUserInfo,
  getAllTags,
  getUserProfile,
  editUserProfile,
  updateProfile,
  checkAuthStatus,
};

// Export individual functions (backward compatibility)
export {
  login,
  register,
  logout,
  sendVerificationEmail,
  verificationEmailCallback,
  registerUser,
  googleCallback,
  googleRegister,
  getAllTags,
  getUserProfile,
  editUserProfile,
  updateProfile,
  getUserInfo,
  checkAuthStatus,
};

// Export the userAPI object
export { userAPI };

// Default export
export default userAPI;

// Export types for use in other files
export type {
  LoginUser,
  RegisterUser,
  UserProfile,
  GoogleCallbackBody,
  GetUserInfoParams,
};
