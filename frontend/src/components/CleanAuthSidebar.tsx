import React from 'react';

interface CleanAuthSidebarProps {
  variant?: 'welcome' | 'register' | 'bio' | 'schedule';
}

const CleanAuthSidebar: React.FC<CleanAuthSidebarProps> = ({ variant = 'welcome' }) => {
  const getContent = () => {
    switch (variant) {
      case 'register':
        return {
          icon: '🌟',
          title: 'Join Our Community',
          subtitle: 'Where learning meets friendship',
          quote: 'The best way to learn is to teach others.',
          author: 'Frank Oppenheimer',
          features: [
            { icon: '🤝', text: 'Connect with learners worldwide' },
            { icon: '📚', text: 'Share your unique skills' },
            { icon: '🎯', text: 'Learn what you\'ve always wanted' }
          ]
        };
      
      case 'bio':
        return {
          icon: '✨',
          title: 'Tell Your Story',
          subtitle: 'Help others discover who you are',
          quote: 'Your story is what you have, what you\'ve always had, what you will always have.',
          author: 'Michelle Obama',
          features: [
            { icon: '💫', text: 'Share your journey' },
            { icon: '🎨', text: 'Show your passions' },
            { icon: '🌍', text: 'Connect with like-minded people' }
          ]
        };
      
      case 'schedule':
        return {
          icon: '🗓️',
          title: 'Set Your Schedule',
          subtitle: 'When are you available to teach?',
          quote: 'Time is the most valuable thing we can give to others.',
          author: 'Maya Angelou',
          features: [
            { icon: '⏰', text: 'Flexible scheduling' },
            { icon: '📅', text: 'Your time, your choice' },
            { icon: '🎓', text: 'Ready to teach others' }
          ]
        };
      
      default:
        return {
          icon: '🤗',
          title: 'Welcome to CoLearn',
          subtitle: 'Where knowledge creates connections',
          quote: 'Alone we can do so little; together we can do so much.',
          author: 'Helen Keller',
          features: [
            { icon: '🌟', text: 'Learn new skills' },
            { icon: '🤝', text: 'Share your knowledge' },
            { icon: '💝', text: 'Build lasting connections' }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <div className="auth-sidebar">
      {/* Background decoration */}
      <div 
        className="position-absolute"
        style={{
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
        }}
      />
      <div 
        className="position-absolute"
        style={{
          bottom: '20%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
        }}
      />
      
      <div className="position-relative z-1">
        {/* Logo/Icon */}
        <div className="icon-large fade-in">
          {content.icon}
        </div>
        
        {/* Main content */}
        <div className="slide-up">
          <h1 className="h2 fw-bold mb-3" style={{ fontFamily: 'var(--font-family-heading)' }}>
            {content.title}
          </h1>
          <p className="lead mb-8" style={{ opacity: 0.9 }}>
            {content.subtitle}
          </p>
          
          {/* Features */}
          <div className="mb-8">
            {content.features.map((feature, index) => (
              <div key={index} className="d-flex align-items-center mb-4">
                <div className="me-3" style={{ fontSize: '1.5rem' }}>
                  {feature.icon}
                </div>
                <div className="text-start">
                  <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                    {feature.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quote */}
          <div className="quote-card">
            <div className="quote-text">
              "{content.quote}"
            </div>
            <div className="quote-author">
              — {content.author}
            </div>
          </div>
          
          {/* Stats */}
          <div className="row text-center mt-8">
            <div className="col-4">
              <div className="h4 fw-bold mb-1">2.1K+</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Members</div>
            </div>
            <div className="col-4">
              <div className="h4 fw-bold mb-1">150+</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Skills</div>
            </div>
            <div className="col-4">
              <div className="h4 fw-bold mb-1">95%</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Success</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanAuthSidebar;