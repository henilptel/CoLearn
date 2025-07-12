import React from 'react';
import { Col } from 'react-bootstrap';

interface AuthCardProps {
  side?: 'left' | 'right';
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ side = 'left', className = '' }) => {
  const testimonials = [
    {
      text: "CoLearn transformed how I approach learning. I taught Python and learned UI/UX design!",
      author: "Sarah Chen",
      role: "Software Engineer",
      skills: ["Python", "UI/UX"]
    },
    {
      text: "The community here is incredible. Everyone genuinely wants to help each other grow.",
      author: "Marcus Rodriguez",
      role: "Designer",
      skills: ["Design", "Photography"]
    },
    {
      text: "I never thought I'd be teaching cooking while learning web development!",
      author: "Priya Patel",
      role: "Chef & Developer",
      skills: ["Cooking", "JavaScript"]
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Col 
      className={`auth-card d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden ${className}`}
      style={{
        background: 'var(--primary-gradient)',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {/* Floating background elements */}
      <div className="position-absolute w-100 h-100">
        <div 
          className="floating-animation position-absolute"
          style={{
            top: '10%',
            left: '10%',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animationDelay: '0s'
          }}
        />
        <div 
          className="floating-animation position-absolute"
          style={{
            top: '20%',
            right: '15%',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animationDelay: '2s'
          }}
        />
        <div 
          className="floating-animation position-absolute"
          style={{
            bottom: '15%',
            left: '20%',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '50%',
            animationDelay: '4s'
          }}
        />
        <div 
          className="floating-animation position-absolute"
          style={{
            bottom: '25%',
            right: '10%',
            width: '70px',
            height: '70px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Main content */}
      <div className="text-center text-white px-4 position-relative z-1">
        {/* Logo and brand */}
        <div className="mb-4">
          <div className="brand-logo mb-3 position-relative">
            <div 
              className="pulse-glow d-inline-flex align-items-center justify-content-center"
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '24px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6L13 7V9C13 11.8 10.8 14 8 14S3 11.8 3 9V7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V9ZM8 16C10.2 16 12 14.2 12 12H16C16 16.4 12.4 20 8 20S0 16.4 0 12H4C4 14.2 5.8 16 8 16Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <h1 className="h2 fw-bold mb-2" style={{ fontFamily: 'var(--font-family-heading)' }}>
            CoLearn
          </h1>
          <p className="lead mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Where Knowledge Meets Community
          </p>
        </div>

        {/* Animated skill tags */}
        <div className="skill-showcase mb-4">
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
            {['Teaching', 'Learning', 'Sharing', 'Growing', 'Connecting'].map((skill, index) => (
              <span 
                key={skill}
                className="badge px-3 py-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial carousel */}
        <div className="testimonial-section" style={{ maxWidth: '400px' }}>
          <div 
            className="testimonial-card p-4 mb-4"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-xl)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
                <path
                  d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"
                  fill="rgba(255, 255, 255, 0.7)"
                />
              </svg>
            </div>
            <p className="mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              "{testimonials[currentTestimonial].text}"
            </p>
            <div className="d-flex align-items-center justify-content-center">
              <div className="text-center">
                <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                  {testimonials[currentTestimonial].author}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {testimonials[currentTestimonial].role}
                </div>
                <div className="mt-2">
                  {testimonials[currentTestimonial].skills.map((skill) => (
                    <span 
                      key={skill}
                      className="badge me-1"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '0.7rem',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial indicators */}
          <div className="d-flex justify-content-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonial-indicator ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentTestimonial ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Community stats */}
        <div className="community-stats mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div className="row text-center">
            <div className="col-4">
              <div className="fw-bold h5 mb-1">1,200+</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Members</div>
            </div>
            <div className="col-4">
              <div className="fw-bold h5 mb-1">50+</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Skills</div>
            </div>
            <div className="col-4">
              <div className="fw-bold h5 mb-1">98%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .testimonial-indicator {
          transition: all 0.3s ease;
        }
        
        .testimonial-indicator:hover {
          transform: scale(1.2);
        }
        
        .skill-showcase .badge {
          transition: all 0.3s ease;
        }
        
        .skill-showcase .badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </Col>
  );
};

export default AuthCard;