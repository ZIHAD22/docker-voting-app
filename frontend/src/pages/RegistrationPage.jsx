import React, { useState } from "react";
import { authAPI } from "../utils/api";
import "./RegistrationPage.css";

const RegistrationPage = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    isAnonymous: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.isAnonymous) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
        newErrors.phone = "Invalid Bangladesh phone number (e.g., 01712345678)";
      }
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "Invalid email address";
      }
    } else {
      // For anonymous users, generate a random phone number
      if (!formData.phone) {
        const randomPhone =
          "019" + Math.floor(10000000 + Math.random() * 90000000);
        setFormData((prev) => ({ ...prev, phone: randomPhone }));
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const submitData = formData.isAnonymous
        ? {
            name: "Anonymous User",
            phone: "019" + Math.floor(10000000 + Math.random() * 90000000),
            email: "",
            isAnonymous: true,
          }
        : formData;

      const response = await authAPI.register(submitData);

      // Store user data with token
      onRegister(response.data);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((error) => {
          backendErrors[error.path] = error.msg;
        });
        setErrors(backendErrors);
      } else {
        setApiError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <div className="bd-flag">
            <div className="flag-circle"></div>
          </div>
          <h1>🗳️ Bangladesh Voting System</h1>
          <p>Your vote, Your voice, Your future</p>
        </div>

        <div className="registration-card">
          <h2>Voter Registration</h2>
          <p className="subtitle">Please enter your information to continue</p>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkbox-label">Vote Anonymously</span>
              </label>
            </div>

            {!formData.isAnonymous && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? "error" : ""}
                    disabled={loading}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className={errors.phone ? "error" : ""}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address (Optional)</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? "error" : ""}
                    disabled={loading}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
              </>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                <>
                  {formData.isAnonymous
                    ? "Continue Anonymously"
                    : "Register & Vote"}
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="registration-footer">
            <p>🔒 Your information is secure and confidential</p>
          </div>
        </div>

        <div className="info-banner">
          <div className="info-item">
            <span className="info-icon">✓</span>
            <span>One Person, One Vote</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔒</span>
            <span>Secure & Private</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <span>Real-time Results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
