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
}

export interface EventDetails {
  name: string;
  desc: string;
  date: string;
  time: string;
}