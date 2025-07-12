export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface User {
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

export interface Member extends User {
  noOfSessions: number;
  noOfReviews: number;
  rating: number;
  creditScore: number;
}

export interface EventDetails {
  id?: string;
  name: string;
  desc: string;
  date: string;
  time: string;
  location?: string;
  organizer?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  skillsRequired?: string[];
  skillsOffered?: string[];
  eventType?: 'workshop' | 'skill-swap' | 'mentoring' | 'networking';
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillSwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser?: User;
  toUser?: User;
  skillOffered: string;
  skillWanted: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  proposedDate?: string;
  proposedTime?: string;
  location?: string;
  sessionType?: 'virtual' | 'in-person' | 'hybrid';
  duration?: number; // in minutes
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isVerified?: boolean;
  popularity?: number;
  createdAt?: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skill?: Skill;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  isOffering: boolean;
  isWanting: boolean;
  description?: string;
  portfolio?: string[];
  certificates?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  hostId: string;
  host?: User;
  participantId?: string;
  participant?: User;
  skillsInvolved: string[];
  sessionType: 'skill-swap' | 'mentoring' | 'workshop' | 'q&a';
  format: 'virtual' | 'in-person' | 'hybrid';
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  materials?: string[];
  recordingUrl?: string;
  hostRating?: number;
  participantRating?: number;
  hostFeedback?: string;
  participantFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'skill-swap-request' | 'session-reminder' | 'rating-request' | 'system' | 'achievement';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewer?: User;
  reviewedId: string;
  reviewed?: User;
  sessionId?: string;
  swapRequestId?: string;
  rating: number;
  comment?: string;
  skills?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'first-swap' | 'skill-master' | 'helpful-mentor' | 'active-learner' | 'community-builder';
  title: string;
  description: string;
  icon?: string;
  points: number;
  unlockedAt: string;
}

export interface UserProfile extends User {
  totalSwaps: number;
  totalSessions: number;
  totalReviews: number;
  averageRating: number;
  skills: UserSkill[];
  achievements: Achievement[];
  recentActivity: any[];
  connectionCount: number;
  joinedDate: string;
}

export interface SearchFilters {
  skills?: string[];
  location?: string;
  availability?: string[];
  experience?: string;
  rating?: number;
  sessionType?: string;
  sortBy?: 'rating' | 'experience' | 'distance' | 'recent';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DayAvailability {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
}

export interface UserAvailability {
  userId: string;
  timezone: string;
  availability: DayAvailability[];
  isFlexible: boolean;
  notes?: string;
  updatedAt: string;
}

// Form interfaces
export interface RegisterUserInfoForm {
  name: string;
  gender: string;
  language: string;
  location: string;
}

export interface RegisterProfessionForm {
  currentPost: string;
  experienceYears: number;
  experienceMonths: number;
  skillsOffered: string[];
  skillsWanted: string[];
}

export interface RegisterBioForm {
  bio: string;
  isPublicProfile: boolean;
  profileImage?: string;
}

export interface RegisterTimeSlotsForm {
  availability: DayAvailability[];
  timezone: string;
}

// API Error types
export interface APIError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Component prop types
export interface AuthcardProps {
  side?: 'left' | 'right';
  className?: string;
}

export interface HeaderProps {
  onToggleSideBar: () => void;
  headerRef: React.RefObject<HTMLDivElement>;
}

export interface SideBarProps {
  show: boolean;
}

export interface TextFieldProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isValid?: boolean;
  isInvalid?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface SelectProps {
  name: string;
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  isValid?: boolean;
  isInvalid?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
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
  // Add video call fields
  roomId?: string;
  meetingToken?: string;
  meetingStartTime?: string;
  meetingEndTime?: string;
}

export interface VideoCallSession {
  id: string;
  requestId: string;
  roomId: string;
  token: string;
  participants: string[];
  startTime: string;
  endTime?: string;
  isActive: boolean;
}

// Make sure we don't have conflicting exports
