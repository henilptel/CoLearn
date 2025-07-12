import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Member } from '../types';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Member | null>(null);

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
      bio: "Love turning data into insights and helping others learn Python!",
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
      bio: "Passionate about automation and helping teams deploy better.",
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
      bio: "Believe great design can change the world. Always eager to learn new creative skills!",
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
      bio: "Researching AI while learning creative skills. Knowledge exchange is the future!",
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
      bio: "Building the decentralized future while exploring creative expressions.",
      isPublicProfile: true,
      availability: ["weekends", "weekday_evenings"]
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const userData = mockUsers[userId || ''] || mockUsers.member_001;
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const handleSendSwapRequest = () => {
    console.log('Sending swap request to user:', userId);
    // Show success message or modal
  };

  const handleSave = () => {
    if (editedUser) {
      setUser(editedUser);
      setIsEditing(false);
      console.log('Profile updated:', editedUser);
    }
  };

  const handleDiscard = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Member, value: any) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value
      });
    }
  };

  const addSkill = (type: 'offered' | 'wanted') => {
    if (editedUser) {
      const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
      const newSkill = prompt(`Enter a new skill you want to ${type === 'offered' ? 'offer' : 'learn'}:`);
      if (newSkill && newSkill.trim()) {
        setEditedUser({
          ...editedUser,
          [field]: [...editedUser[field], newSkill.trim()]
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
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
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

  return (
    <div className="user-profile-page">
      {/* Header */}
      <header className="profile-header">
        <nav className="profile-nav">
          <div className="nav-left">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="nav-btn save-btn">
                  Save
                </button>
                <button onClick={handleDiscard} className="nav-btn discard-btn">
                  Discard
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="nav-btn edit-btn">
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="nav-center">
            <h1 className="page-title">User Profile</h1>
          </div>
          
          <div className="nav-right">
            <button onClick={handleSendSwapRequest} className="nav-btn swap-btn">
              Swap Request
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
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={displayUser.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <div className="form-display">{displayUser.name}</div>
                )}
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={displayUser.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                ) : (
                  <div className="form-display">{displayUser.location}</div>
                )}
              </div>

              {/* Skills Offered */}
              <div className="form-group">
                <label className="form-label">Skills Offered</label>
                <div className="skills-container">
                  {displayUser.skillsOffered.map((skill, index) => (
                    <div key={index} className="skill-tag offered">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('offered', index)}
                          className="skill-remove"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => addSkill('offered')}
                      className="skill-add"
                    >
                      + Add Skill
                    </button>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="form-group">
                <label className="form-label">Availability</label>
                {isEditing ? (
                  <select
                    className="form-select"
                    value={displayUser.availability.join(', ')}
                    onChange={(e) => handleInputChange('availability', e.target.value.split(', '))}
                  >
                    <option value="weekends">Weekends</option>
                    <option value="evenings">Evenings</option>
                    <option value="weekday_evenings">Weekday Evenings</option>
                    <option value="weekends,evenings">Weekends & Evenings</option>
                  </select>
                ) : (
                  <div className="form-display">
                    {displayUser.availability.map(avail => avail.replace('_', ' ')).join(', ')}
                  </div>
                )}
              </div>

              {/* Profile Privacy */}
              <div className="form-group">
                <label className="form-label">Profile</label>
                {isEditing ? (
                  <select
                    className="form-select"
                    value={displayUser.isPublicProfile ? 'public' : 'private'}
                    onChange={(e) => handleInputChange('isPublicProfile', e.target.value === 'public')}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                ) : (
                  <div className="form-display">
                    {displayUser.isPublicProfile ? 'Public' : 'Private'}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-right">
              {/* Profile Photo */}
              <div className="profile-photo-section">
                <div className="profile-photo">
                  <div className="profile-avatar-large">
                    {getInitials(displayUser.name)}
                  </div>
                  {isEditing && (
                    <div className="photo-edit">
                      <small>Add/Edit/Remove</small>
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
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('wanted', index)}
                          className="skill-remove"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => addSkill('wanted')}
                      className="skill-add"
                    >
                      + Add Skill
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">Bio</label>
                {isEditing ? (
                  <textarea
                    className="form-textarea"
                    value={displayUser.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                  />
                ) : (
                  <div className="form-display bio-display">{displayUser.bio}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;