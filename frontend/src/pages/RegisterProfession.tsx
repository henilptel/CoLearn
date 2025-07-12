import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { userAPI } from "../apis/user"
import CleanAuthSidebar from "../components/CleanAuthSidebar"
import { useProfessionRegistration, useBasicRegistration } from "../contexts/RegistrationContext"

const RegisterProfession: React.FC = () => {
  const { data: professionData, updateData } = useProfessionRegistration();
  const { data: basicData } = useBasicRegistration();
  const [formData, setFormData] = useState({
    skillsOffered: professionData?.skillsOffered || [],
    skillsWanted: professionData?.skillsWanted || [],
    currentSkill: "",
    currentWantedSkill: "",
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  const handleAddSkill = (type: "offered" | "wanted") => {
    const skillValue = type === "offered" ? formData.currentSkill : formData.currentWantedSkill
    if (skillValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        [type === "offered" ? "skillsOffered" : "skillsWanted"]: [
          ...prev[type === "offered" ? "skillsOffered" : "skillsWanted"],
          skillValue.trim(),
        ],
        [type === "offered" ? "currentSkill" : "currentWantedSkill"]: "",
      }))
    }
  }

  const handleRemoveSkill = (type: "offered" | "wanted", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type === "offered" ? "skillsOffered" : "skillsWanted"]: prev[
        type === "offered" ? "skillsOffered" : "skillsWanted"
      ].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.skillsOffered.length === 0) {
      setError("Please add at least one skill you can offer")
      setLoading(false)
      return
    }

    if (formData.skillsWanted.length === 0) {
      setError("Please add at least one skill you want to learn")
      setLoading(false)
      return
    }

    try {
      // For registration flow, just save to context instead of API call
      // The final API call will be made in the last step with all data
      updateData({
        skillsOffered: formData.skillsOffered,
        skillsWanted: formData.skillsWanted,
      });
      
      // Navigate to next step without API call
      navigate("/register/3")
    } catch (err: any) {
      setError(err.message || "Failed to save skills")
    } finally {
      setLoading(false)
    }
  }

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
                width: "64px",
                height: "64px",
                backgroundColor: "var(--primary-100)",
                borderRadius: "var(--radius-xl)",
                color: "var(--primary-600)",
                fontSize: "1.5rem",
              }}
            >
              💼
            </div>
            <h1 className="h2 fw-bold mb-3 text-primary" style={{ fontFamily: "var(--font-family-heading)" }}>
              Your Knowledge Currency
            </h1>
            <p className="text-muted">Share what you know, learn what you need - The foundation of our community</p>
          </div>

          {/* Alert */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="slide-up">
            {/* Skills Offered Section */}
            <div className="skills-section mb-6">
              <h3 className="h5 fw-bold mb-2">Skills You Can Offer</h3>
              <p className="text-muted mb-3">What knowledge can you share with the community?</p>

              <div className="skill-input-group mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.currentSkill}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentSkill: e.target.value }))}
                    placeholder="e.g., JavaScript, Photography, Cooking..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill("offered"))}
                  />
                  <button type="button" className="btn btn-outline-primary" onClick={() => handleAddSkill("offered")}>
                    Add
                  </button>
                </div>
              </div>

              <div className="skills-list d-flex flex-wrap gap-2">
                {formData.skillsOffered.map((skill, index) => (
                  <div key={index} className="skill-tag badge bg-primary d-flex align-items-center">
                    <span>{skill}</span>
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => handleRemoveSkill("offered", index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Wanted Section */}
            <div className="skills-section mb-6">
              <h3 className="h5 fw-bold mb-2">Skills You Want to Learn</h3>
              <p className="text-muted mb-3">What knowledge are you seeking from the community?</p>

              <div className="skill-input-group mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.currentWantedSkill}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentWantedSkill: e.target.value }))}
                    placeholder="e.g., Python, Design, Guitar..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill("wanted"))}
                  />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => handleAddSkill("wanted")}>
                    Add
                  </button>
                </div>
              </div>

              <div className="skills-list d-flex flex-wrap gap-2">
                {formData.skillsWanted.map((skill, index) => (
                  <div key={index} className="skill-tag badge bg-secondary d-flex align-items-center">
                    <span>{skill}</span>
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => handleRemoveSkill("wanted", index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-100"
              style={{ height: "48px" }}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Saving...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterProfession
