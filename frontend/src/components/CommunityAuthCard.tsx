import React from 'react';
import { Col } from 'react-bootstrap';

interface CommunityAuthCardProps {
  side?: 'left' | 'right';
  variant?: 'community' | 'sharing' | 'growth';
  className?: string;
}

const CommunityAuthCard: React.FC<CommunityAuthCardProps> = ({ 
  side = 'left', 
  variant = 'community',
  className = '' 
}) => {
  const communityStories = [
    {
      text: "I taught cooking to a developer, and learned web design in return. Now I have my own recipe blog!",
      author: "Maria Santos",
      role: "Chef & Blogger",
      skills: "🍳 Cooking ↔️ 💻 Web Design",
      avatar: "👩‍🍳"
    },
    {
      text: "Through CoLearn, I found my passion for photography while teaching Python. Community learning changed my life!",
      author: "David Kim",
      role: "Software Engineer",
      skills: "🐍 Python ↔️ 📸 Photography",
      avatar: "👨‍💻"
    },
    {
      text: "Teaching guitar while learning digital marketing opened doors I never imagined. Skills + community = magic!",
      author: "Alex Rivera",
      role: "Musician & Marketer",
      skills: "🎸 Guitar ↔️ 📱 Marketing",
      avatar: "🎵"
    }
  ];

  const [currentStory, setCurrentStory] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % communityStories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'sharing':
        return {
          background: 'var(--gradient-sharing)',
          accentColor: '#38bdf8'
        };
      case 'growth':
        return {
          background: 'var(--gradient-growth)',
          accentColor: '#22c55e'
        };
      default:
        return {
          background: 'var(--gradient-community)',
          accentColor: '#f43f5e'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Col 
      className={`community-auth-card d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden ${className}`}
      style={{
        background: variantStyles.background,
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {/* Animated background elements */}
      <div className="position-absolute w-100 h-100 overflow-hidden">
        {/* Floating circles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating position-absolute"
            style={{
              width: `${40 + i * 15}px`,
              height: `${40 + i * 15}px`,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              top: `${10 + i * 15}%`,
              left: `${5 + i * 12}%`,
              right: i % 2 === 0 ? `${5 + i * 8}%` : 'auto',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
        
        {/* Knowledge sharing icons */}
        <div className="position-absolute" style={{ top: '15%', left: '10%' }}>
          <div className="floating" style={{ animationDelay: '0s', fontSize: '2rem' }}>
            💡
          </div>
        </div>
        <div className="position-absolute" style={{ top: '25%', right: '15%' }}>
          <div className="floating" style={{ animationDelay: '1s', fontSize: '2rem' }}>
            🤝
          </div>
        </div>
        <div className="position-absolute" style={{ bottom: '30%', left: '15%' }}>
          <div className="floating" style={{ animationDelay: '2s', fontSize: '2rem' }}>
            🌱
          </div>
        </div>
        <div className="position-absolute" style={{ bottom: '15%', right: '10%' }}>
          <div className="floating" style={{ animationDelay: '3s', fontSize: '2rem' }}>
            ✨
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="text-center text-white px-4 position-relative" style={{ zIndex: 2 }}>
        {/* Brand section */}
        <div className="brand-section mb-5 fade-in-up">
          <div className="brand-logo mb-4">
            <div 
              className="heartbeat d-inline-flex align-items-center justify-content-center"
              style={{
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                backdropFilter: 'blur(10px)',
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="d-flex flex-column align-items-center">
                <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🤗</div>
                <div style={{ fontSize: '1.5rem' }}>CoLearn</div>
              </div>
            </div>
          </div>
          
          <h1 className="display-4 fw-bold mb-3" style={{ 
            fontFamily: 'var(--font-family-heading)',
            letterSpacing: '-0.02em'
          }}>
            Where Hearts Meet Minds
          </h1>
          
          <p className="lead mb-4" style={{ 
            fontSize: '1.25rem', 
            opacity: 0.9,
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Join a community where sharing knowledge creates lasting friendships
          </p>
        </div>

        {/* Community values */}
        <div className="community-values mb-5 slide-in-left">
          <div className="row g-3">
            <div className="col-12">
              <div 
                className="value-card p-3 rounded-3 glass"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ fontSize: '1.5rem' }}>🤝</div>
                  <div>
                    <h6 className="mb-1 fw-bold">Share & Learn</h6>
                    <small style={{ opacity: 0.8 }}>Every skill shared creates two learners</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div 
                className="value-card p-3 rounded-3 glass"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ fontSize: '1.5rem' }}>💝</div>
                  <div>
                    <h6 className="mb-1 fw-bold">Caring Community</h6>
                    <small style={{ opacity: 0.8 }}>Supportive environment for everyone</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div 
                className="value-card p-3 rounded-3 glass"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ fontSize: '1.5rem' }}>🌟</div>
                  <div>
                    <h6 className="mb-1 fw-bold">Grow Together</h6>
                    <small style={{ opacity: 0.8 }}>Personal growth through collaboration</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community story carousel */}
        <div className="community-story-section slide-in-right" style={{ maxWidth: '450px' }}>
          <div 
            className="story-card p-4 rounded-3"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              minHeight: '200px'
            }}
          >
            <div className="d-flex align-items-center mb-3">
              <div 
                className="story-avatar me-3"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}
              >
                {communityStories[currentStory].avatar}
              </div>
              <div className="text-start">
                <h6 className="mb-1 fw-bold">{communityStories[currentStory].author}</h6>
                <small style={{ opacity: 0.8 }}>{communityStories[currentStory].role}</small>
              </div>
            </div>
            
            <p className="mb-3" style={{ 
              fontSize: '0.95rem', 
              lineHeight: '1.6',
              textAlign: 'left'
            }}>
              "{communityStories[currentStory].text}"
            </p>
            
            <div 
              className="skills-exchange text-center p-2 rounded-2"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              {communityStories[currentStory].skills}
            </div>
          </div>
          
          {/* Story indicators */}
          <div className="d-flex justify-content-center mt-3 gap-2">
            {communityStories.map((_, index) => (
              <button
                key={index}
                className={`story-indicator ${index === currentStory ? 'active' : ''}`}
                onClick={() => setCurrentStory(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentStory ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Community stats */}
        <div className="community-stats mt-5 pt-4" style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div className="row text-center">
            <div className="col-4">
              <div className="stat-item">
                <div className="h4 fw-bold mb-1">2.5K+</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Happy Learners</div>
              </div>
            </div>
            <div className="col-4">
              <div className="stat-item">
                <div className="h4 fw-bold mb-1">150+</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Skills Shared</div>
              </div>
            </div>
            <div className="col-4">
              <div className="stat-item">
                <div className="h4 fw-bold mb-1">98%</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Love Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default CommunityAuthCard;