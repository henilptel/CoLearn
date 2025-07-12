import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import * as yup from "yup";
import CleanAuthSidebar from "../components/CleanAuthSidebar";
import { userAPI } from "../apis/user";
import type { LoginUser } from "../apis/user";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const initialValues: LoginForm = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const handleSubmit = async (
    values: LoginForm,
    { setSubmitting }: FormikHelpers<LoginForm>
  ) => {
    try {
      setSubmitting(true);
      const loginData: LoginUser = {
        email: values.email,
        password: values.password,
      };
      
      const response = await userAPI.login(loginData);
      
      if (response.data.message === "Logged in successfully") {
        setAlertType("success");
        setAlertMessage("Welcome back! Redirecting to your dashboard...");
        setShowAlert(true);
        
        // Store user data instead of token since we're using session auth
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (values.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error instanceof Error ? error.message : "Login failed. Please try again.");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="grid-auth">
      <CleanAuthSidebar variant="welcome" />
      
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
              👋
            </div>
            <h1 className="h2 fw-bold mb-3 text-primary" style={{ fontFamily: 'var(--font-family-heading)' }}>
              Welcome back
            </h1>
            <p className="text-muted">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Alert */}
          {showAlert && (
            <div 
              className={`alert ${alertType === 'success' ? 'alert-success' : 'alert-danger'} slide-up`}
              style={{
                backgroundColor: alertType === 'success' ? 'var(--success-50)' : 'var(--error-50)',
                border: `1px solid ${alertType === 'success' ? 'var(--success-200)' : 'var(--error-200)'}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                color: alertType === 'success' ? 'var(--success-700)' : 'var(--error-700)'
              }}
            >
              {alertMessage}
            </div>
          )}

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit} noValidate className="slide-up">
                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''} ${formik.touched.email && !formik.errors.email ? 'is-valid' : ''}`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
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
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''} ${formik.touched.password && !formik.errors.password ? 'is-valid' : ''}`}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      className="form-check-input"
                      checked={formik.values.rememberMe}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="rememberMe" className="form-check-label">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-primary text-decoration-none"
                    style={{ fontSize: '0.875rem', fontWeight: '500' }}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="btn btn-primary btn-lg w-100 mb-4"
                  style={{ height: '48px' }}
                >
                  {formik.isSubmitting ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
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

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="btn btn-outline-primary w-100"
                    style={{ height: '48px' }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" className="me-2">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </div>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;