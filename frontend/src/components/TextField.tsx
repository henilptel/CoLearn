import React from 'react';
import { Form } from 'react-bootstrap';

interface TextFieldProps {
  name: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isValid?: boolean;
  isInvalid?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  type,
  value,
  placeholder,
  onChange,
  onBlur,
  onKeyPress,
  isValid,
  isInvalid,
  error,
  required,
  disabled,
  className,
}) => {
  return (
    <Form.Group className={className}>
      {label && (
        <Form.Label htmlFor={name}>
          {label}
          {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Control
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        isValid={isValid}
        isInvalid={isInvalid}
        disabled={disabled}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default TextField;