import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/clean-community.scss";
import "./styles/style.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Import pages - keeping existing structure
//import Upcoming from "./pages/Upcoming";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RegisterUserInfo from "./pages/RegisterUserInfo";
import RegisterProfession from "./pages/RegisterProfession";
import RegisterBio from "./pages/RegisterBio";
import RegisterTimeSlots from "./pages/RegisterTimeSlots";
//import MenteeWelcome from "./pages/MenteeWelcome";
//import MentorWelcome from "./pages/MentorWelcome";
//import ExploreMentor from "./pages/ExloreMentors";
//import VerifyEmailCallback from "./pages/VerifyEmailCallback";
/*import UserInfo from "./components/UserInfo";
import ProfileCard from "./components/ProfileCard";
import MenteeProfile from "./pages/MenteeProfile";
import MenteeExploring from "./pages/MenteeExploring";
import Milestone from "./components/Milestones";
import JobList from "./pages/Jobs";
import Workshops from "./pages/Workshop";
import JobDetails from "./pages/JobDetails";
import SessionForm from "./pages/CreateSession_1";
import SessionForm1 from "./pages/CreateSession2";
import Meeting from "./pages/Meeting";
import WorkshopDetails from "./pages/WorkshopDetails";
import Sessions from "./pages/Sessions";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Chat from "./pages/Chat";
import CreateJobs from "./pages/CreateJobs";
import CreateWorkshop from "./pages/CreateWorkshop";
import LandingPage from "./pages/LandingPage";
import BookSession from "./pages/BookSession";
import Error from "./pages/Error";
import Community from "./pages/Community";
import Question from "./pages/Question";
import BlankPage from "./pages/blank";
import AdminPage from "./pages/Admin";
import Verification from "./pages/Verification";
import UpdateTimeSlots from "./pages/UpdateTimeSlots";
import Referrals from "./pages/Referrals";
import ReferralRequests from "./pages/referral_request";
import MentorStats from "./pages/MentorStats";*/

// Import types
import type { Member, EventDetails } from "./types";

// Mock data for skill swap platform
const eventdetails: EventDetails = {
  name: "CoLearn Skill Exchange Workshop",
  desc: "A community gathering where members share their expertise and learn from each other in various skill domains.",
  date: "28/11",
  time: "17:00",
};

const demoTags: string[] = [
  "JavaScript", "Python", "React", "Node.js", "UI/UX Design", "Data Science",
  "Photography", "Digital Marketing", "Graphic Design", "Web Development",
  "Mobile Development", "Machine Learning", "Cooking", "Music", "Language Learning",
  "Writing", "Public Speaking", "Project Management"
];

const members: Member[] = [
  {
    id: "member_001",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    role: "member",
    name: "Alice Johnson",
    rating: 4.8,
    currentPost: "Senior Data Scientist & Python Enthusiast",
    noOfSessions: 25,
    noOfReviews: 8,
    experienceYears: 12,
    experienceMonths: 3,
    creditScore: 98,
    skillsOffered: ["Python", "Data Science", "Machine Learning", "Statistics"],
    skillsWanted: ["React", "UI/UX Design", "Photography"],
    location: "San Francisco, CA",
    bio: "Love turning data into insights and helping others learn Python!",
    isPublicProfile: true,
    availability: ["weekends", "evenings"]
  },
  {
    id: "member_002",
    firstName: "Bob",
    lastName: "Martinez",
    email: "bob@example.com",
    role: "member",
    name: "Bob Martinez",
    rating: 4.2,
    currentPost: "DevOps Engineer & Cloud Specialist",
    noOfSessions: 15,
    noOfReviews: 6,
    experienceYears: 8,
    experienceMonths: 10,
    creditScore: 92,
    skillsOffered: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    skillsWanted: ["Frontend Development", "Mobile Development"],
    location: "Austin, TX",
    bio: "Passionate about automation and helping teams deploy better.",
    isPublicProfile: true,
    availability: ["weekday_evenings"]
  },
  {
    id: "member_003",
    firstName: "Chloe",
    lastName: "Kim",
    email: "chloe@example.com",
    role: "member",
    name: "Chloe Kim",
    rating: 4.9,
    currentPost: "Lead UX Designer & Creative Director",
    noOfSessions: 30,
    noOfReviews: 12,
    experienceYears: 14,
    experienceMonths: 2,
    creditScore: 99,
    skillsOffered: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Design Thinking"],
    skillsWanted: ["Frontend Development", "Animation", "Video Editing"],
    location: "New York, NY",
    bio: "Believe great design can change the world. Always eager to learn new creative skills!",
    isPublicProfile: true,
    availability: ["weekends", "weekday_evenings"]
  },
  {
    id: "member_004",
    firstName: "David",
    lastName: "Patel",
    email: "david@example.com",
    role: "member",
    name: "David Patel",
    rating: 4.7,
    currentPost: "AI Researcher & Tech Educator",
    noOfSessions: 40,
    noOfReviews: 20,
    experienceYears: 11,
    experienceMonths: 6,
    creditScore: 96,
    skillsOffered: ["Machine Learning", "Deep Learning", "Python", "Research Methods"],
    skillsWanted: ["Music Production", "Guitar", "Public Speaking"],
    location: "Toronto, Canada",
    bio: "Researching AI while learning creative skills. Knowledge exchange is the future!",
    isPublicProfile: true,
    availability: ["weekends"]
  },
  {
    id: "member_005",
    firstName: "Emily",
    lastName: "Wright",
    email: "emily@example.com",
    role: "member",
    name: "Emily Wright",
    rating: 4.5,
    currentPost: "Blockchain Developer & Crypto Enthusiast",
    noOfSessions: 18,
    noOfReviews: 7,
    experienceYears: 9,
    experienceMonths: 8,
    creditScore: 94,
    skillsOffered: ["Blockchain", "Smart Contracts", "Solidity", "Web3"],
    skillsWanted: ["Digital Marketing", "Content Creation", "Photography"],
    location: "London, UK",
    bio: "Building the decentralized future while exploring creative expressions.",
    isPublicProfile: true,
    availability: ["weekends", "weekday_evenings"]
  },
];

const events: EventDetails[] = Array(6).fill(eventdetails);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    //errorElement: <Error />,
    children: [
     /* {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "admin",
        element: <AdminPage />
      },
      {
        path: "upcoming",
        element: <Upcoming />,
      },*/
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register/1",
        element: <RegisterUserInfo />,
      },
      {
        path: "register/2",
        element: <RegisterProfession />,
      },
      {
        path: "register/3",
        element: <RegisterBio />,
      },
      {
        path: "register/4",
        element: <RegisterTimeSlots />,
      },
      /*{
        path: "dashboard",
        element: <MenteeWelcome mentors_={members} events_={events} />,
      },
      {
        path: "mentee_welcome",
        element: <MenteeWelcome mentors_={members} events_={events} />,
      },
      {
        path: "mentor_welcome",
        element: <MentorWelcome events_={events} />,
      },
      {
        path: "explore",
        element: <ExploreMentor mentors_={members} demoTags={demoTags} />,
      },
      {
        path: "verify/callback",
        element: <VerifyEmailCallback />,
      },
      {
        path: "mentee_profile/:menteeId",
        element: <MenteeProfile />,
      },
      {
        path: "profilecard",
        element: <ProfileCard />,
      },
      {
        path: "mentee_exploring/:mentorId",
        element: <MenteeExploring />,
      },
      {
        path: "milestone",
        element: <Milestone />,
      },
      {
        path: "jobs",
        element: <JobList />,
      },
      {
        path: "jobs/:jobId",
        element: <JobDetails />,
      },
      {
        path: "workshops",
        element: <Workshops demoTags={demoTags} />,
      },
      {
        path: "workshops/:workshopId",
        element: <WorkshopDetails />,
      },
      {
        path: "createsession_1",
        element: <SessionForm />,
      },
      {
        path: "createsession_2",
        element: <SessionForm1 />,
      },
      {
        path: "meeting",
        element: <Meeting />,
      },
      {
        path: "meeting/:meetingId",
        element: <Meeting />
      },
      {
        path: "sessions",
        element: <Sessions />
      },
      {
        path: "user_profile",
        element: <UserProfile _isEditing={false} />,
      },
      {
        path: "edit_profile",
        element: <UserProfile _isEditing={true} />,
      },
      {
        path: "chat",
        element: <Chat />
      },
      {
        path: "create_job",
        element: <CreateJobs />
      },
      {
        path: "create_workshop",
        element: <CreateWorkshop />
      },
      {
        path: "book_session/:availableSessionId",
        element: <BookSession />
      },
      {
        path: "community",
        element: <Community />
      },
      {
        path: "community/:questionId",
        element: <Question />
      },
      {
        path: "landing_page",
        element: <LandingPage />
      },
      {
        path: "verification",
        element: <Verification />
      },
      {
        path: "update_slots",
        element: <UpdateTimeSlots />
      },
      {
        path: "referrals",
        element: <Referrals />
      },
      {
        path: "referral_request",
        element: <ReferralRequests />,
      },
      {
        path: "mentorstats",
        element: <MentorStats />,
      },*/
    ],
  },
  /*{
    path: "/landing-page",
    element: <LandingPage />,
  }*/
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);