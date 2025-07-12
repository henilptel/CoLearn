import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/clean-community.scss";
import "./styles/homepage.scss";
import "./styles/style.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./contexts/UserContext";
import { SwapRequestProvider } from "./contexts/SwapRequestContext";
import SwapRequests from "./pages/SwapRequests";

// Import pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import RegisterUserInfo from "./pages/RegisterUserInfo";
import RegisterProfession from "./pages/RegisterProfession";
import RegisterBio from "./pages/RegisterBio";
import RegisterTimeSlots from "./pages/RegisterTimeSlots";
import Homepage from "./pages/HomePage";
import Meeting from "./components/Meeting";

// Import types
import type { Member, EventDetails } from "./types";
import UserProfile from "./pages/UserProfile";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Homepage />
      },
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
      {
        path: "homepage",
        element: <Homepage/>
      },
      {
        path: "profile",
        element: <UserProfile/>
      },
      {
        path: "my-profile",
        element: <UserProfile/>
      },
      {
        path: "profile/:userId",
        element: <UserProfile/>
      },
       {
        path: "requests",
        element: <SwapRequests/>
      },
       {
        path: "meeting",
        element: <Meeting/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <UserProvider>
        <SwapRequestProvider>
          <RouterProvider router={router} />
        </SwapRequestProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);