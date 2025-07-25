import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Formik } from "formik"
import type { FormikHelpers } from "formik"
import * as yup from "yup"
import CleanAuthSidebar from "../components/CleanAuthSidebar"
import { userAPI } from "../apis/user"
import useProfile from "../hooks/useProfile"
import { useBioRegistration, useRegistration, useBasicRegistration, useProfessionRegistration, useUserInfoRegistration } from "../contexts/RegistrationContext"

interface BioForm {
  bio: string
}

const RegisterBio: React.FC = () => {
  const prevForm = useLocation().state
  const { data: bioData, updateData } = useBioRegistration();
  const { data: basicData } = useBasicRegistration();
  const { data: userInfoData } = useUserInfoRegistration();
  const { data: professionData } = useProfessionRegistration();
  const { registrationData } = useRegistration();
  const { profile, loading: isProfileLoading } = useProfile()
  const navigate = useNavigate()

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const validationSchema = yup.object({
    bio: yup
      .string()
      .min(50, "Please tell us more about yourself (at least 50 characters)")
      .max(500, "Keep your bio under 500 characters")
      .required("Bio is required"),
  })

  const initialValues: BioForm = {
    bio: bioData?.bio || "",
  }

  const handleSubmit = async (values: BioForm, { setSubmitting }: FormikHelpers<BioForm>) => {
    try {
      setSubmitting(true)
      setError("")
      
      // Just save to context for now - don't make API call yet
      updateData({
        bio: values.bio,
      });

      setSuccess("Bio saved! Redirecting to final step...")
      setTimeout(() => {
        navigate("/register/4")
      }, 1000)
    } catch (err: any) {
      console.error('Error saving bio:', err);
      setError("Failed to save bio. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (isProfileLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid-auth">
      <CleanAuthSidebar variant="bio" />

      <div className="auth-content">
        <div className="auth-form">
          {/* Progress Indicator */}
          <div className="progress-indicator mb-6">
            <div className="d-flex align-items-center justify-content-center">
              <div className="progress-step completed">1</div>
              <div className="progress-line completed"></div>
              <div className="progress-step completed">2</div>
              <div className="progress-line active"></div>
              <div className="progress-step active">3</div>
              <div className="progress-line inactive"></div>
              <div className="progress-step inactive">4</div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "var(--secondary-100)",
                borderRadius: "var(--radius-xl)",
                color: "var(--secondary-600)",
                fontSize: "1.5rem",
              }}
            >
              ✨
            </div>
            <h1 className="h2 fw-bold mb-3 text-secondary" style={{ fontFamily: "var(--font-family-heading)" }}>
              Tell us about yourself
            </h1>
            <p className="text-muted">Help our community get to know you better</p>
          </div>

          {/* Alerts */}
          {error && (
            <div
              className="alert slide-up"
              style={{
                backgroundColor: "var(--error-50)",
                border: "1px solid var(--error-200)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-4)",
                marginBottom: "var(--space-6)",
                color: "var(--error-700)",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="alert slide-up"
              style={{
                backgroundColor: "var(--success-50)",
                border: "1px solid var(--success-200)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-4)",
                marginBottom: "var(--space-6)",
                color: "var(--success-700)",
              }}
            >
              {success}
            </div>
          )}

          {/* Form */}
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {(formik) => (
              <form onSubmit={formik.handleSubmit} noValidate className="slide-up">
                {/* Bio */}
                <div className="form-group">
                  <label htmlFor="bio" className="form-label">
                    Tell us your story
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className={`form-control ${formik.touched.bio && formik.errors.bio ? "is-invalid" : ""} ${formik.touched.bio && !formik.errors.bio ? "is-valid" : ""}`}
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Share your journey, interests, and what makes you unique..."
                    rows={4}
                    style={{ resize: "vertical" }}
                  />
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <div className="form-text">
                      Tell us about your background, interests, and what you're passionate about
                    </div>
                    <small className="text-muted">{formik.values.bio.length}/500</small>
                  </div>
                  {formik.touched.bio && formik.errors.bio && (
                    <div className="invalid-feedback">{formik.errors.bio}</div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="btn btn-secondary btn-lg w-100"
                  style={{ height: "48px" }}
                >
                  {formik.isSubmitting ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Updating profile...
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default RegisterBio
