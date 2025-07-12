export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  name: string;
  rating: number;
  currentPost: string;
  noOfSessions: number;
  noOfReviews: number;
  experienceYears: number;
  experienceMonths: number;
  creditScore: number;
  skillsOffered: string[];
  skillsWanted: string[];
  location: string;
  bio: string;
  isPublicProfile: boolean;
  availability: string[];
  timeSlots?: { day: string; slots: string[] }[];
}

export interface EventDetails {
  name: string;
  desc: string;
  date: string;
  time: string;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  fromUser: Member;
  toUser: Member;
}

export interface SwapRequestData {
  offeredSkill: string;
  wantedSkill: string;
  message: string;
}