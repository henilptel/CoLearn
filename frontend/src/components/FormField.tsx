import React from 'react';
import { Form } from 'react-bootstrap';

interface FormFieldProps {
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
  icon?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  onBlur,
  isValid,
  isInvalid,
  error,
  required,
  disabled,
  className = '',
  icon
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Form.Group className={`form-field-group mb-4 ${className}`}>
      <div className="position-relative">
        <Form.Label 
          htmlFor={name}
          className={`form-field-label ${isFocused || value ? 'active' : ''}`}
          style={{
            position: 'absolute',
            top: isFocused || value ? '8px' : '50%',
            left: icon ? '48px' : '16px',
            transform: isFocused || value ? 'translateY(0)' : 'translateY(-50%)',
            fontSize: isFocused || value ? '0.75rem' : '1rem',
            color: isFocused ? 'var(--primary-600)' : 'var(--neutral-500)',
            background: 'white',
            padding: '0 4px',
            borderRadius: 'var(--radius-sm)',
            transition: 'all 0.2s ease',
            zIndex: 1,
            fontWeight: '500'
          }}
        >
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
        
        {icon && (
          <div 
            className="form-field-icon position-absolute d-flex align-items-center justify-content-center"
            style={{
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '24px',
              height: '24px',
              color: isFocused ? 'var(--primary-600)' : 'var(--neutral-400)',
              transition: 'all 0.2s ease',
              zIndex: 2
            }}
          >
            {icon}
          </div>
        )}
        
        <Form.Control
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder=""
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          className={`form-field-input ${isValid ? 'is-valid' : ''} ${isInvalid ? 'is-invalid' : ''}`}
          style={{
            height: '64px',
            paddingLeft: icon ? '48px' : '16px',
            paddingRight: '16px',
            paddingTop: '24px',
            paddingBottom: '8px',
            border: `2px solid ${
              isInvalid ? 'var(--warm-500)' : 
              isFocused ? 'var(--primary-500)' : 
              'var(--neutral-200)'
            }`,
            borderRadius: 'var(--radius-lg)',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            background: 'white',
            boxShadow: isFocused ? 'var(--shadow-primary)' : 'var(--shadow-sm)'
          }}
        />
        
        {isValid && (
          <div 
            className="form-field-success position-absolute"
            style={{
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--success-600)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </div>
      
      {error && (
        <Form.Control.Feedback 
          type="invalid" 
          className="d-block mt-2"
          style={{
            fontSize: '0.875rem',
            color: 'var(--warm-600)',
            fontWeight: '500'
          }}
        >
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormField;