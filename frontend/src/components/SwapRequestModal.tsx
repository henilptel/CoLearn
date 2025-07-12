import React, { useState, useEffect } from 'react';
import type { Member } from '../types';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SwapRequestData) => void;
  currentUser: Member;
  targetUser: Member;
}

interface SwapRequestData {
  offeredSkill: string;
  wantedSkill: string;
  message: string;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  targetUser
}) => {
  const [formData, setFormData] = useState<SwapRequestData>({
    offeredSkill: '',
    wantedSkill: '',
    message: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        offeredSkill: '',
        wantedSkill: '',
        message: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.offeredSkill.trim()) {
      newErrors.offeredSkill = 'Please select a skill you can offer';
    }

    if (!formData.wantedSkill.trim()) {
      newErrors.wantedSkill = 'Please select a skill you want to learn';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error sending swap request:', error);
      alert('Failed to send swap request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SwapRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="swap-request-modal">
        <div className="modal-header">
          <h3 className="modal-title">Send Swap Request</h3>
          <button 
            className="modal-close" 
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="request-info">
            <p className="request-description">
              Send a skill swap request to <strong>{targetUser.name}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="swap-request-form">
            {/* Offered Skill Selection */}
            <div className="form-group">
              <label className="form-label">
                Choose one of your offered skills
              </label>
              <div className="select-wrapper">
                <select
                  value={formData.offeredSkill}
                  onChange={(e) => handleInputChange('offeredSkill', e.target.value)}
                  className={`form-select ${errors.offeredSkill ? 'error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a skill you can teach</option>
                  {currentUser.skillsOffered.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>
              {errors.offeredSkill && (
                <span className="error-message">{errors.offeredSkill}</span>
              )}
            </div>

            {/* Wanted Skill Selection */}
            <div className="form-group">
              <label className="form-label">
                Choose one of their offered skills
              </label>
              <div className="select-wrapper">
                <select
                  value={formData.wantedSkill}
                  onChange={(e) => handleInputChange('wantedSkill', e.target.value)}
                  className={`form-select ${errors.wantedSkill ? 'error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a skill you want to learn</option>
                  {targetUser.skillsOffered.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>
              {errors.wantedSkill && (
                <span className="error-message">{errors.wantedSkill}</span>
              )}
            </div>

            {/* Message */}
            <div className="form-group">
              <label className="form-label">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={`form-textarea ${errors.message ? 'error' : ''}`}
                rows={4}
                placeholder="Introduce yourself and explain why you'd like to swap skills..."
                disabled={isSubmitting}
              />
              <div className="char-count">
                {formData.message.length} characters (minimum 10)
              </div>
              {errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
            </div>

            {/* Form Actions */}
            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="modal-btn modal-btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="modal-btn modal-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;