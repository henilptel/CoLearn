import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { userAPI } from '../apis/user';
import SwapRequestModal from '../components/SwapRequestModal';
import type { Member } from '../types';
import { useSwapRequests } from '../contexts/SwapRequestContext';

interface SkillInputProps {
  onAdd: (skill: string) => void;
  placeholder: string;
}

const SkillInput: React.FC<SkillInputProps> = ({ onAdd, placeholder }) => {
  const [value, setValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setValue('');
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="skill-input-form">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="skill-input"
          autoFocus
        />
        <div className="skill-input-actions">
          <button type="submit" className="skill-input-btn save">
            ✓
          </button>
          <button type="button" onClick={handleCancel} className="skill-input-btn cancel">
            ✕
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="skill-add"
    >
      + Add Skill
    </button>
  );
};

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useUser();
  
  // Function to transform API user data to Member interface
  const transformApiUserToMember = (apiUser: any): Member => {
    return {
      id: apiUser.id,
      firstName: apiUser.name?.split(' ')[0] || '',
      lastName: apiUser.name?.split(' ').slice(1).join(' ') || '',
      email: apiUser.email,
      role: 'member',
      name: apiUser.name || '',
      rating: apiUser.rating || 0,
      currentPost: apiUser.currentPost || '',
      noOfSessions: apiUser.noOfSessions || 0,
      noOfReviews: apiUser.noOfReviews || 0,
      experienceYears: apiUser.experience_years || 0,
      experienceMonths: apiUser.experienceMonths || 0,
      creditScore: apiUser.creditScore || 0,
      skillsOffered: apiUser.skillsOffered?.map((skill: any) => skill.name || skill) || [],
      skillsWanted: apiUser.skillsWanted?.map((skill: any) => skill.name || skill) || [],
      location: apiUser.location || '',
      bio: apiUser.bio || '',
      isPublicProfile: apiUser.isPublic !== undefined ? apiUser.isPublic : true,
      availability: apiUser.availability || []
    };
  };
  const [user, setUser] = useState<Member | null>(null);
  const { sendRequest, requests } = useSwapRequests();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Member | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{[key: string]: string[]}>({});
  
  // Add modal state
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  
  // Check if this is the current user's profile
  const isOwnProfile = !userId || userId === 'me' || userId === 'current';

  // Time slots configuration (same as RegisterTimeSlots)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Mock user data based on userId
  const mockUsers: { [key: string]: Member } = {
    member_001: {
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
      bio: "Love turning data into insights and helping others learn Python! I have over 12 years of experience in data science and machine learning. Always excited to help others grow in their coding journey!",
      isPublicProfile: true,
      availability: ["weekends", "evenings"]
    },
    member_002: {
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
      bio: "Passionate about automation and helping teams deploy better. I love working with cloud technologies and helping teams scale their applications efficiently.",
      isPublicProfile: true,
      availability: ["weekday_evenings"]
    },
    member_003: {
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
      bio: "Believe great design can change the world. Always eager to learn new creative skills! I specialize in creating user-centered designs that solve real problems.",
      isPublicProfile: true,
      availability: ["weekends", "weekday_evenings"]
    },
    member_004: {
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
      bio: "Researching AI while learning creative skills. Knowledge exchange is the future! I love exploring the intersection of technology and creativity.",
      isPublicProfile: true,
      availability: ["weekends"]
    },
    member_005: {
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
      bio: "Building the decentralized future while exploring creative expressions. I'm passionate about blockchain technology and its potential to transform industries.",
      isPublicProfile: true,
      availability: ["weekends", "weekday_evenings"]
    }
  };
   const handleSwapRequestSubmit = async (requestData: any) => {
    if (!currentUser || !user) return;
    
    try {
      await sendRequest(currentUser, user, requestData);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'profile-notification success';
      notification.textContent = `Swap request sent to ${user.name} successfully!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 4000);
    } catch (error) {
      alert('Failed to send swap request. Please try again.');
    }
  };

  // Initialize time slots from user data
  useEffect(() => {
    if (user) {
      const initialTimeSlots: {[key: string]: string[]} = {};
      days.forEach(day => {
        initialTimeSlots[day] = [];
      });
      
      // If user has existing time slots, use them
      if ((user as any).timeSlots) {
        (user as any).timeSlots.forEach((slot: any) => {
          const dayName = slot.day.toLowerCase();
          const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
          if (!initialTimeSlots[capitalizedDay]) {
            initialTimeSlots[capitalizedDay] = [];
          }
          initialTimeSlots[capitalizedDay].push(slot.from);
        });
      } else {
        // Default time slots based on availability
        if (user.availability && user.availability.includes('weekends')) {
          initialTimeSlots['Saturday'] = ['09:00', '10:00', '14:00', '15:00'];
          initialTimeSlots['Sunday'] = ['09:00', '10:00', '14:00', '15:00'];
        }
        if (user.availability && (user.availability.includes('weekday_evenings') || user.availability.includes('evenings'))) {
          ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
            initialTimeSlots[day] = ['18:00', '19:00'];
          });
        }
      }
      
      setSelectedTimeSlots(initialTimeSlots);
    }
  }, [user]);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        let userData: Member;
        if (isOwnProfile) {
          // Load current user profile
          if (currentUser) {
            const response = await userAPI.getUserProfile();
            userData = transformApiUserToMember(response.data.user);
            // Add timeSlots manually since it's not in the Member interface
            (userData as any).timeSlots = response.data.user.timeSlots || [];
          } else {
            // No authenticated user, redirect to login or show error
            navigate('/login');
            return;
          }
        } else {
          // Load specific user by ID
          const response = await userAPI.getUserById(userId!);
          userData = transformApiUserToMember(response.data.user);
          // Add timeSlots manually since it's not in the Member interface
          (userData as any).timeSlots = response.data.user.timeSlots || [];
        }
        
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        // Fallback to mock data if API fails
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          let userData: Member;
          if (isOwnProfile) {
            if (currentUser) {
              userData = currentUser;
            } else {
              navigate('/login');
              return;
            }
          } else {
            userData = mockUsers[userId || ''] || mockUsers.member_001;
          }
          
          setUser(userData);
          setEditedUser(userData);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, isOwnProfile, currentUser, navigate]);

  const validateForm = (userData: Member): {[key: string]: string} => {
    const errors: {[key: string]: string} = {};
    
    if (!userData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!userData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!userData.currentPost.trim()) {
      errors.currentPost = 'Current position is required';
    }
    
    if (!userData.bio.trim()) {
      errors.bio = 'Bio is required';
    } else if (userData.bio.length < 20) {
      errors.bio = 'Bio must be at least 20 characters';
    }
    
    if (userData.skillsOffered.length === 0) {
      errors.skillsOffered = 'At least one skill offered is required';
    }
    
    if (userData.skillsWanted.length === 0) {
      errors.skillsWanted = 'At least one skill wanted is required';
    }
    
    // Check if at least one time slot is selected
    const hasTimeSlots = Object.values(selectedTimeSlots).some(slots => slots.length > 0);
    if (!hasTimeSlots) {
      errors.timeSlots = 'At least one time slot is required';
    }
    
    return errors;
  };

  const handleSendSwapRequest = () => {
    if (!currentUser || !user) {
      alert('Please log in to send swap requests');
      return;
    }

    // Check if user has skills to offer
    if (!currentUser.skillsOffered || currentUser.skillsOffered.length === 0) {
      alert('Please add skills to your profile before sending swap requests');
      return;
    }

    // Check if target user has skills to offer
    if (!user.skillsOffered || user.skillsOffered.length === 0) {
      alert('This user has no skills listed to learn from');
      return;
    }

    setIsSwapModalOpen(true);
  };

  
  const handleSave = async () => {
    if (!editedUser) return;
    
    const errors = validateForm(editedUser);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      alert('Please fix the validation errors before saving.');
      return;
    }
    
    try {
      // Convert selectedTimeSlots to timeSlots array format for backend
      const timeSlotArray = Object.entries(selectedTimeSlots)
        .filter(([_, slots]) => slots.length > 0)
        .flatMap(([day, slots]) => 
          slots.map(slot => ({
            day: day.toUpperCase(),
            from: slot,
            to: slot // You might want to calculate the end time based on session length
          }))
        );

      // Prepare data for API
      const updateData = {
        name: editedUser.name,
        location: editedUser.location,
        bio: editedUser.bio,
        currentPost: editedUser.currentPost,
        experienceYears: editedUser.experienceYears,
        experienceMonths: editedUser.experienceMonths,
        skillsOffered: editedUser.skillsOffered,
        skillsWanted: editedUser.skillsWanted,
        isPublic: editedUser.isPublicProfile,
        timeSlots: timeSlotArray
      };

      // Call API to update profile
      const response = await userAPI.updateProfile(updateData);
      
      const updatedUser = {
        ...editedUser,
        timeSlots: response.data.user.timeSlots || timeSlotArray
      };

      // Update user in context (this persists the changes)
      updateCurrentUser(updatedUser);
      
      setUser(updatedUser);
      setIsEditing(false);
      setHasChanges(false);
      setValidationErrors({});
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'profile-notification success';
      notification.textContent = 'Profile updated successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmDiscard) return;
    }
    
    setEditedUser(user);
    setIsEditing(false);
    setHasChanges(false);
    setValidationErrors({});
    
    // Reset time slots to original user data
    if (user) {
      const initialTimeSlots: {[key: string]: string[]} = {};
      days.forEach(day => {
        initialTimeSlots[day] = [];
      });
      
      if ((user as any).timeSlots) {
        (user as any).timeSlots.forEach((slot: any) => {
          const dayName = slot.day.toLowerCase();
          const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
          if (!initialTimeSlots[capitalizedDay]) {
            initialTimeSlots[capitalizedDay] = [];
          }
          initialTimeSlots[capitalizedDay].push(slot.from);
        });
      }
      
      setSelectedTimeSlots(initialTimeSlots);
    }
  };

  const handleInputChange = (field: keyof Member, value: any) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value
      });
      setHasChanges(true);
      
      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors({
          ...validationErrors,
          [field]: ''
        });
      }
    }
  };

  const addSkill = (type: 'offered' | 'wanted', skill: string) => {
    if (editedUser) {
      const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
      const currentSkills = editedUser[field];
      
      // Check for duplicates
      if (currentSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        alert('This skill is already in your list!');
        return;
      }
      
      setEditedUser({
        ...editedUser,
        [field]: [...currentSkills, skill]
      });
      setHasChanges(true);
      
      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors({
          ...validationErrors,
          [field]: ''
        });
      }
    }
  };

  const removeSkill = (type: 'offered' | 'wanted', index: number) => {
    if (editedUser) {
      const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
      const skills = [...editedUser[field]];
      skills.splice(index, 1);
      setEditedUser({
        ...editedUser,
        [field]: skills
      });
      setHasChanges(true);
    }
  };

  // Time slot functions (same as RegisterTimeSlots)
  const handleTimeSlotClick = (day: string, slot: string) => {
    if (!isOwnProfile || !isEditing) return;
    
    const newTimeSlots = { ...selectedTimeSlots };
    if (!newTimeSlots[day]) {
      newTimeSlots[day] = [];
    }
    
    if (newTimeSlots[day].includes(slot)) {
      newTimeSlots[day] = newTimeSlots[day].filter(s => s !== slot);
    } else {
      newTimeSlots[day].push(slot);
      newTimeSlots[day].sort();
    }
    
    setSelectedTimeSlots(newTimeSlots);
    setHasChanges(true);
    
    // Clear validation error for time slots
    if (validationErrors.timeSlots) {
      setValidationErrors({
        ...validationErrors,
        timeSlots: ''
      });
    }
  };

  const getTotalSelectedSlots = () => {
    return Object.values(selectedTimeSlots).reduce((total, slots) => total + slots.length, 0);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Handle browser back/refresh when editing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (hasChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  if (loading || !currentUser) {
    return (
      <div className="user-profile-page">
        <div className="loading-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="profile-container">
          <div className="error-message">
            <h3>User not found</h3>
            <p>The user you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayUser = isEditing ? editedUser! : user;

  // Calculate pending requests count
  const pendingRequestsCount = requests.filter(
    req => req.toUserId === currentUser?.id && req.status === 'pending'
  ).length;

  return (
    <div className="user-profile-page">
      {/* Header */}
      <header className="profile-header">
        <nav className="profile-nav">
          <div className="nav-left">
            {isOwnProfile ? (
              // Own profile - can edit
              isEditing ? (
                <>
                  <button onClick={handleSave} className="nav-btn save-btn">
                    Save Changes
                  </button>
                  <button onClick={handleDiscard} className="nav-btn discard-btn">
                    Discard Changes
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="nav-btn edit-btn">
                  Edit Profile
                </button>
              )
            ) : (
              // Other user's profile - read only
              <button onClick={() => navigate('/')} className="nav-btn">
                ← Back to Browse
              </button>
            )}
          </div>
          
          <div className="nav-center">
            <h1 className="page-title">
              {isOwnProfile ? 'My Profile' : `${user.name}'s Profile`}
            </h1>
            {isEditing && hasChanges && (
              <span className="changes-indicator">• Unsaved changes</span>
            )}
          </div>
          
          <div className="nav-right">
            {!isOwnProfile && (
              <button onClick={handleSendSwapRequest} className="nav-btn swap-btn">
                Send Swap Request
              </button>
            )}
            <button 
              onClick={() => navigate('/requests')} 
              className="nav-btn requests-btn"
              style={{ position: 'relative' }}
            >
              Requests
              {pendingRequestsCount > 0 && (
                <span 
                  className="requests-badge"
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '9999px',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/')} className="nav-btn home-btn">
              Home
            </button>
            <div className="profile-avatar-small">
              {getInitials(displayUser.name)}
            </div>
          </div>
        </nav>
      </header>

      <div className="profile-container">
        <div className="profile-form">
          <div className="profile-main">
            <div className="profile-left">
              {/* Name */}
              <div className="form-group">
                <label className="form-label">Name</label>
                {isOwnProfile && isEditing ? (
                  <input
                    type="text"
                    className={`form-input ${validationErrors.name ? 'error' : ''}`}
                    value={displayUser.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="form-display">{displayUser.name}</div>
                )}
                {validationErrors.name && (
                  <span className="error-message">{validationErrors.name}</span>
                )}
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location</label>
                {isOwnProfile && isEditing ? (
                  <input
                    type="text"
                    className={`form-input ${validationErrors.location ? 'error' : ''}`}
                    value={displayUser.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your city, state/country"
                  />
                ) : (
                  <div className="form-display">{displayUser.location}</div>
                )}
                {validationErrors.location && (
                  <span className="error-message">{validationErrors.location}</span>
                )}
              </div>

              {/* Current Post */}
              <div className="form-group">
                <label className="form-label">Current Position</label>
                {isOwnProfile && isEditing ? (
                  <input
                    type="text"
                    className={`form-input ${validationErrors.currentPost ? 'error' : ''}`}
                    value={displayUser.currentPost}
                    onChange={(e) => handleInputChange('currentPost', e.target.value)}
                    placeholder="Enter your current job title or profession"
                  />
                ) : (
                  <div className="form-display">{displayUser.currentPost}</div>
                )}
                {validationErrors.currentPost && (
                  <span className="error-message">{validationErrors.currentPost}</span>
                )}
              </div>

              {/* Skills Offered */}
              <div className="form-group">
                <label className="form-label">Skills Offered</label>
                <div className="skills-container">
                  {displayUser.skillsOffered.map((skill, index) => (
                    <div key={index} className="skill-tag offered">
                      {skill}
                      {isOwnProfile && isEditing && (
                        <button
                          onClick={() => removeSkill('offered', index)}
                          className="skill-remove"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {isOwnProfile && isEditing && (
                    <SkillInput
                      onAdd={(skill) => addSkill('offered', skill)}
                      placeholder="Enter a skill you can teach"
                    />
                  )}
                </div>
                {validationErrors.skillsOffered && (
                  <span className="error-message">{validationErrors.skillsOffered}</span>
                )}
              </div>

              {/* Profile Privacy - only show for own profile */}
              {isOwnProfile && (
                <div className="form-group">
                  <label className="form-label">Profile Visibility</label>
                  {isEditing ? (
                    <select
                      className="form-select"
                      value={displayUser.isPublicProfile ? 'public' : 'private'}
                      onChange={(e) => handleInputChange('isPublicProfile', e.target.value === 'public')}
                    >
                      <option value="public">Public - Anyone can view your profile</option>
                      <option value="private">Private - Only you can view your profile</option>
                    </select>
                  ) : (
                    <div className="form-display">
                      {displayUser.isPublicProfile ? 'Public' : 'Private'}
                    </div>
                  )}
                </div>
              )}

              {/* Stats - read only */}
              <div className="form-group">
                <label className="form-label">Statistics</label>
                <div className="stats-container">
                  <div className="stat-item">
                    <span className="stat-label">Sessions:</span>
                    <span className="stat-value">{displayUser.noOfSessions}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Reviews:</span>
                    <span className="stat-value">{displayUser.noOfReviews}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Rating:</span>
                    <span className="stat-value">{displayUser.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-right">
              {/* Profile Photo */}
              <div className="profile-photo-section">
                <div className="profile-photo">
                  <div className="profile-avatar-large">
                    {getInitials(displayUser.name)}
                  </div>
                  {isOwnProfile && isEditing && (
                    <div className="photo-edit">
                      <button className="photo-edit-btn">
                        Change Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="form-group">
                <label className="form-label">Skills Wanted</label>
                <div className="skills-container">
                  {displayUser.skillsWanted.map((skill, index) => (
                    <div key={index} className="skill-tag wanted">
                      {skill}
                      {isOwnProfile && isEditing && (
                        <button
                          onClick={() => removeSkill('wanted', index)}
                          className="skill-remove"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {isOwnProfile && isEditing && (
                    <SkillInput
                      onAdd={(skill) => addSkill('wanted', skill)}
                      placeholder="Enter a skill you want to learn"
                    />
                  )}
                </div>
                {validationErrors.skillsWanted && (
                  <span className="error-message">{validationErrors.skillsWanted}</span>
                )}
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">Bio</label>
                {isOwnProfile && isEditing ? (
                  <textarea
                    className={`form-textarea ${validationErrors.bio ? 'error' : ''}`}
                    value={displayUser.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Tell others about yourself, your experience, and what you're passionate about... (minimum 20 characters)"
                  />
                ) : (
                  <div className="form-display bio-display">{displayUser.bio}</div>
                )}
                {isOwnProfile && isEditing && (
                  <small className="char-count">
                    {displayUser.bio.length} characters
                  </small>
                )}
                {validationErrors.bio && (
                  <span className="error-message">{validationErrors.bio}</span>
                )}
              </div>

              {/* Time Slots - Using the same design as RegisterTimeSlots */}
              <div className="form-group">
                <label className="form-label">Available Time Slots</label>
                
                {isOwnProfile && isEditing ? (
                  <div className="time-slots-container">
                    <div className="time-slots-header">
                      <p className="time-slots-description">
                        Select your available time slots for skill exchange sessions. 
                        You have selected {getTotalSelectedSlots()} slots.
                      </p>
                    </div>
                    
                    <div className="time-slots-grid">
                      {days.map(day => (
                        <div key={day} className="day-section">
                          <div className="day-header">
                            <h4 className="day-title">{day}</h4>
                            <span className="day-count">
                              {selectedTimeSlots[day]?.length || 0} slots
                            </span>
                          </div>
                          <div className="time-slots-row">
                            {timeSlots.map(slot => (
                              <button
                                key={slot}
                                type="button"
                                className={`time-slot-btn ${
                                  selectedTimeSlots[day]?.includes(slot) ? 'selected' : ''
                                }`}
                                onClick={() => handleTimeSlotClick(day, slot)}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Read-only view for time slots
                  <div className="time-slots-display">
                    {Object.entries(selectedTimeSlots).map(([day, slots]) => (
                      slots.length > 0 && (
                        <div key={day} className="day-summary">
                          <strong>{day}:</strong> {slots.join(', ')}
                        </div>
                      )
                    ))}
                    {getTotalSelectedSlots() === 0 && (
                      <div className="no-slots">No time slots selected</div>
                    )}
                  </div>
                )}
                
                {validationErrors.timeSlots && (
                  <span className="error-message">{validationErrors.timeSlots}</span>
                )}
              </div>

              {/* Contact Info - only for other users */}
              {!isOwnProfile && (
                <div className="form-group">
                  <label className="form-label">Contact</label>
                  <div className="contact-info">
                    <div className="contact-item">
                      <span className="contact-label">Email:</span>
                      <span className="contact-value">{displayUser.email}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Experience:</span>
                      <span className="contact-value">
                        {displayUser.experienceYears} years, {displayUser.experienceMonths} months
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {!isOwnProfile && currentUser && (
        <SwapRequestModal
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          onSubmit={handleSwapRequestSubmit}
          currentUser={currentUser}
          targetUser={user}
        />
      )}
    </div>
  );
};

export default UserProfile;