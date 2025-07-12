import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../apis/user';
import type { Member } from '../types';

interface Filters {
  search: string;
  availability: string;
}

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<Member[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Member[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    availability: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const navigate = useNavigate();

  const usersPerPage = 5;

  // Mock data from your main.tsx
  const mockUsers: Member[] = [
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
    }
  ];

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        
        setCurrentUser({
          id: 'current',
          firstName: 'You',
          lastName: '',
          email: 'you@example.com',
          role: 'member',
          name: 'You',
          rating: 0,
          currentPost: '',
          noOfSessions: 0,
          noOfReviews: 0,
          experienceYears: 0,
          experienceMonths: 0,
          creditScore: 0,
          skillsOffered: ['JavaScript', 'React'],
          skillsWanted: ['Python', 'Machine Learning'],
          location: '',
          bio: '',
          isPublicProfile: true,
          availability: []
        });
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Enhanced search and filtering logic
  useEffect(() => {
    let filtered = users;

    // Search filter - searches across multiple fields
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(user => {
        // Search in name
        const nameMatch = user.name.toLowerCase().includes(searchTerm);
        
        // Search in current post/title
        const postMatch = user.currentPost.toLowerCase().includes(searchTerm);
        
        // Search in location
        const locationMatch = user.location?.toLowerCase().includes(searchTerm) || false;
        
        // Search in bio
        const bioMatch = user.bio?.toLowerCase().includes(searchTerm) || false;
        
        // Search in skills offered
        const skillsOfferedMatch = user.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchTerm)
        );
        
        // Search in skills wanted
        const skillsWantedMatch = user.skillsWanted.some(skill => 
          skill.toLowerCase().includes(searchTerm)
        );
        
        return nameMatch || postMatch || locationMatch || bioMatch || skillsOfferedMatch || skillsWantedMatch;
      });
    }

    // Availability filter
    if (filters.availability.trim()) {
      filtered = filtered.filter(user => 
        user.availability?.some(avail => 
          avail.toLowerCase().includes(filters.availability.toLowerCase().trim())
        ) || false
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, users]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically by the useEffect above
    // This function is kept for form submission if needed
  };

  const clearSearch = () => {
    setFilters({
      search: '',
      availability: ''
    });
  };

  const handleSendSwapRequest = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Sending swap request to user:', userId);
    // Show success message or modal
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars.join('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="homepage">
        <div className="homepage-loading">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Header */}
      <header className="homepage-header">
        <nav className="homepage-nav">
          <Link to="/" className="homepage-logo">
            <span className="homepage-logo-icon">🤗</span>
            Skill Swap Platform
          </Link>
          
          <div className="homepage-user-menu">
            <Link to="/profile" className="homepage-user-avatar">
              {currentUser ? getInitials(currentUser.name) : 'U'}
            </Link>
            <button 
              onClick={handleLogout}
              className="homepage-search-btn"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Login
            </button>
          </div>
        </nav>
      </header>

      <div className="homepage-container">
        {/* Search and Filters */}
        <section className="homepage-search-section">
          <form onSubmit={handleSearch} className="homepage-search-bar">
            <input
              type="text"
              className="homepage-search-input"
              placeholder="Search by name, skills, location, or job title..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <button type="submit" className="homepage-search-btn">
              Search
            </button>
            {filters.search && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="homepage-search-btn"
                style={{ background: '#6b7280' }}
              >
                Clear
              </button>
            )}
          </form>
          
          <div className="homepage-filters">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="homepage-filter-label">Availability:</span>
              <select
                className="homepage-filter-select"
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="">All</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
                <option value="weekday_evenings">Weekday Evenings</option>
              </select>
            </div>
          </div>
          
          {/* Search Results Summary */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 0',
            color: '#6b7280',
            fontSize: '0.875rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              {filteredUsers.length === users.length 
                ? `Showing all ${users.length} members`
                : `Found ${filteredUsers.length} of ${users.length} members`
              }
            </span>
            {(filters.search || filters.availability) && (
              <button 
                onClick={clearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textDecoration: 'underline'
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </section>

        {/* Users Grid - Now Single Column */}
        <section>
          {currentUsers.length === 0 ? (
            <div className="homepage-empty">
              <div className="homepage-empty-icon">🔍</div>
              <h3 className="homepage-empty-title">
                {filteredUsers.length === 0 && (filters.search || filters.availability)
                  ? 'No matches found'
                  : 'No users found'
                }
              </h3>
              <p className="homepage-empty-subtitle">
                {filteredUsers.length === 0 && (filters.search || filters.availability)
                  ? 'Try adjusting your search terms or filters'
                  : 'Check back later for new members'
                }
              </p>
              {(filters.search || filters.availability) && (
                <button 
                  onClick={clearSearch}
                  className="homepage-search-btn"
                  style={{ marginTop: '1rem' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="homepage-users-grid">
              {currentUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="user-card"
                  onClick={() => handleViewProfile(user.id)}
                >
                  <div className="user-card-avatar">
                    {getInitials(user.name)}
                  </div>
                  
                  <div className="user-card-content">
                    <div className="user-card-header">
                      <div className="user-card-info">
                        <h3 className="user-card-name">{user.name}</h3>
                        <p className="user-card-title">{user.currentPost}</p>
                        {user.location && (
                          <p className="user-card-location">
                            <span>📍</span>
                            {user.location}
                          </p>
                        )}
                      </div>
                      <div className="user-card-rating">
                        <span className="user-card-rating-stars">
                          {getRatingStars(user.rating)}
                        </span>
                        <span className="user-card-rating-text">
                          {user.rating}/5
                        </span>
                      </div>
                    </div>

                    <div className="user-card-skills">
                      <div className="user-card-skills-section">
                        <span className="user-card-skills-label">Skills Offered:</span>
                        <div className="user-card-skills-list">
                          {user.skillsOffered.slice(0, 4).map((skill, index) => (
                            <span key={index} className="user-card-skill-tag offered">
                              {skill}
                            </span>
                          ))}
                          {user.skillsOffered.length > 4 && (
                            <span className="user-card-skill-tag offered">
                              +{user.skillsOffered.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="user-card-skills-section">
                        <span className="user-card-skills-label">Skills Wanted:</span>
                        <div className="user-card-skills-list">
                          {user.skillsWanted.slice(0, 4).map((skill, index) => (
                            <span key={index} className="user-card-skill-tag wanted">
                              {skill}
                            </span>
                          ))}
                          {user.skillsWanted.length > 4 && (
                            <span className="user-card-skill-tag wanted">
                              +{user.skillsWanted.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="user-card-actions">
                    <button 
                      className="user-card-btn user-card-btn-primary"
                      onClick={(e) => handleSendSwapRequest(user.id, e)}
                    >
                      Request
                    </button>
                    <button 
                      className="user-card-btn user-card-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(user.id);
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="homepage-pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;