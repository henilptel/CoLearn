import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { userAPI } from '../apis/user';
import CleanAuthSidebar from '../components/CleanAuthSidebar';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await userAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'member'
      });
      
      localStorage.setItem('token', response.token);
      navigate('/register-bio');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await userAPI.googleRegister(credentialResponse);
      localStorage.setItem('token', response.token);
      navigate('/register-bio');
    } catch (err: any) {
      setError(err.message || 'Google registration failed');
    }
  };

  return (
    <div className="grid-auth">
      <CleanAuthSidebar variant="register" />
      
      <div className="auth-content">
        <div className="auth-form">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <div 
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--primary-100)',
                borderRadius: 'var(--radius-xl)',
                color: 'var(--primary-600)',
                fontSize: '1.5rem'
              }}
            >
              🌟
            </div>
            <h1 className="h2 fw-bold mb-3 text-primary" style={{ fontFamily: 'var(--font-family-heading)' }}>
              Join the Knowledge Revolution
            </h1>
            <p className="text-muted">
              Life is a cycle of give and take - Start your journey today
            </p>
          </div>

          {/* Alert */}
          {error && (
            <div 
              className="alert slide-up"
              style={{
                backgroundColor: 'var(--error-50)',
                border: '1px solid var(--error-200)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                color: 'var(--error-700)'
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="slide-up">
            {/* Name Fields Row */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-100 mb-4"
              style={{ height: '48px' }}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Creating Account...
                </div>
              ) : (
                'Start Your Journey'
              )}
            </button>

            {/* Divider */}
            <div className="text-center mb-4">
              <div className="d-flex align-items-center mb-4">
                <div className="flex-grow-1" style={{ height: '1px', backgroundColor: 'var(--neutral-200)' }} />
                <span className="px-3 text-muted" style={{ fontSize: '0.875rem' }}>
                  Or continue with
                </span>
                <div className="flex-grow-1" style={{ height: '1px', backgroundColor: 'var(--neutral-200)' }} />
              </div>

              <div className="google-login-wrapper">
                <button
                  type="button"
                  onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
                  className="btn btn-outline-primary w-100"
                  style={{ height: '48px' }}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    {/* Google SVG icon here */}
                    Continue with Google
                  </div>
                </button>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                Already part of our community?{' '}
                <Link
                  to="/login"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
