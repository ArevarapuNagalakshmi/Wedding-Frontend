import React, { useState, useContext } from "react";
import {
  FaEnvelope,
  FaUser,
  FaIdCard,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import {
  sendEmailOtp,
  verifyEmailOtp,
  registerAadhaar,
  sendAadhaarOtp,
  verifyAadhaarOtp,
  register,
  login
} from "../api/authApi";

import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Register.css";

const Register = () => {

  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    aadhaarNumber: "",
    mobileNumber: "",
    password: ""
  });

  const [emailOtp, setEmailOtp] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [aadhaarSendLoading, setAadhaarSendLoading] = useState(false);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const [aadhaarVerifyLoading, setAadhaarVerifyLoading] = useState(false);
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const [aadhaarOtpTimer, setAadhaarOtpTimer] = useState(0);

  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const isMobileValid = /^\d{10}$/.test(formData.mobileNumber);
  const isAadhaarValid = /^\d{12}$/.test(formData.aadhaarNumber);

  const canSendEmailOtp = formData.email && isEmailValid && !emailVerified && emailOtpTimer === 0;
  const canVerifyEmail = emailOtpSent && emailOtp && !emailVerified;
  const canSendAadhaarOtp = formData.aadhaarNumber && isAadhaarValid && formData.mobileNumber && isMobileValid && formData.firstName && formData.lastName && !aadhaarVerified && aadhaarOtpTimer === 0;
  const canVerifyAadhaar = aadhaarOtpSent && aadhaarOtp && !aadhaarVerified;
  const canSubmit = emailVerified && aadhaarVerified && formData.firstName && formData.lastName && formData.role && formData.password.length >= 6;

  const emailHint = !formData.email
    ? "Enter your email address to receive a verification code."
    : isEmailValid
    ? "Email looks good. Send the OTP when ready."
    : "Enter a valid email address.";

  const aadhaarHint = formData.aadhaarNumber && !isAadhaarValid
    ? "Aadhaar must be 12 digits."
    : "Aadhaar is required for identity verification.";

  const mobileHint = formData.mobileNumber && !isMobileValid
    ? "Mobile number must be 10 digits."
    : "Enter your phone first, then Aadhaar for OTP verification.";

  const aadhaarSendHint = !formData.firstName || !formData.lastName
    ? "Enter both first and last name before sending Aadhaar OTP."
    : !formData.mobileNumber
    ? "Enter your mobile number before sending Aadhaar OTP."
    : !formData.aadhaarNumber
    ? "Enter your Aadhaar number before sending OTP."
    : !isAadhaarValid || !isMobileValid
    ? "Correct Aadhaar and mobile number to send OTP."
    : "Ready to send Aadhaar OTP.";

  const currentStep = emailVerified ? (aadhaarVerified ? 3 : 2) : 1;

  const stepLabels = [
    { id: 1, label: "Email", description: "Confirm your contact details" },
    { id: 2, label: "Phone & Aadhaar", description: "Verify your phone and Aadhaar" },
    { id: 3, label: "Finish", description: "Activate your account" }
  ];

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
    setSuccess("");

    if (name === "email") {
      setEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp("");
      setEmailOtpTimer(0);
    }

    if (name === "aadhaarNumber" || name === "mobileNumber") {
      setAadhaarVerified(false);
      setAadhaarOtpSent(false);
      setAadhaarOtp("");
      setAadhaarOtpTimer(0);
    }
  };

  React.useEffect(() => {
    if (emailOtpTimer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setEmailOtpTimer((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [emailOtpTimer]);

  React.useEffect(() => {
    if (aadhaarOtpTimer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setAadhaarOtpTimer((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [aadhaarOtpTimer]);

  // ================= EMAIL OTP =================

  const handleSendEmailOtp = async () => {
    if (!isEmailValid) {
      setError("Enter a valid email address before sending OTP.");
      setSuccess("");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setEmailSendLoading(true);
      await sendEmailOtp(formData.email);
      setEmailOtpSent(true);
      setEmailOtpTimer(300);
      setSuccess("OTP sent to email.");
    } catch (err) {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to send OTP.";
      setError(msg);
      setSuccess("");
    } finally {
      setEmailSendLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      setError("");
      setSuccess("");
      setEmailVerifyLoading(true);
      await verifyEmailOtp(formData.email, emailOtp);
      setEmailVerified(true);
      setEmailOtpTimer(0);
      setSuccess("Email verified");
    } catch {
      setError("Invalid OTP");
      setSuccess("");
    } finally {
      setEmailVerifyLoading(false);
    }
  };

  // ================= AADHAAR OTP =================

  const handleSendAadhaarOtp = async () => {
    try {
      setError("");
      setSuccess("");

      if (formData.aadhaarNumber.length !== 12) {
        setError("Aadhaar must be 12 digits");
        return;
      }

      if (!formData.firstName || !formData.lastName) {
        setError("Enter first name and last name before Aadhaar verification");
        return;
      }

      if (!formData.mobileNumber.match(/^\d{10}$/)) {
        setError("Mobile number must be 10 digits");
        return;
      }

      // Register Aadhaar record if needed, then send OTP
      try {
        await registerAadhaar({
          aadhaarNumber: formData.aadhaarNumber.trim(),
          fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          mobileNumber: formData.mobileNumber.trim()
        });
      } catch (err) {
        const conflict = err.response?.status === 409 ||
          (typeof err.response?.data === "string" && err.response.data.includes("Aadhaar already registered"));

        if (!conflict) {
          throw err;
        }
      }

      setError("");
      setAadhaarSendLoading(true);

      await sendAadhaarOtp(formData.aadhaarNumber.trim());

      setAadhaarOtpSent(true);
      setAadhaarOtpTimer(300);
      setSuccess("OTP sent to Aadhaar linked mobile");
      setError("");

    } catch (err) {

      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            err.response?.data?.error ||
            "Invalid Aadhaar";

      setError(msg);
      setSuccess("");
    } finally {
      setAadhaarSendLoading(false);
    }
  };

  const handleVerifyAadhaarOtp = async () => {
    try {
      setError("");
      setSuccess("");
      setAadhaarVerifyLoading(true);

      await verifyAadhaarOtp(
        formData.aadhaarNumber.trim(),
        aadhaarOtp
      );

      setAadhaarVerified(true);
      setAadhaarOtpTimer(0);
      setSuccess("Mobile verified");
      setError("");

    } catch (err) {

      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            err.response?.data?.error ||
            "Invalid OTP";

      setError(msg);
      setSuccess("");
    } finally {
      setAadhaarVerifyLoading(false);
    }
  };

  // ================= REGISTER =================

  const handleRegister = async (e) => {

    e.preventDefault();

    if (!emailVerified || !aadhaarVerified) {
      setError("Verify Email and Aadhaar first.");
      setSuccess("");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setSuccess("");
      return;
    }

    if (!formData.role) {
      setError("Please select a role.");
      setSuccess("");
      return;
    }

    try {

      await register(formData);

      const res = await login({
        emailOrPhone: formData.email,
        password: formData.password
      });

      const normalizedRole = res.data.role.startsWith("ROLE_")
        ? res.data.role.replace("ROLE_", "")
        : res.data.role;

      contextLogin(res.data.token, normalizedRole);

      navigate(
        normalizedRole === "VENDOR"
          ? "/vendor"
          : "/customer"
      );

    } catch (err) {

      console.log("REGISTER ERROR:", err.response);

      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            err.response?.data?.error ||
            "Registration failed";

      setError(msg);
      setSuccess("");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">

        <div className="register-header">
          <h2>Secure Wedding Service Sign Up</h2>
          <p>Professional onboarding for customers and vendors with trusted identity verification, instant OTP checks, and seamless booking readiness.</p>
          <div className="register-summary">
            <span>Fast verification</span>
            <span>Secure identity</span>
            <span>Instant access</span>
          </div>
        </div>

        <div className="register-steps">
          {stepLabels.map((step) => (
            <div
              key={step.id}
              className={`step-pill ${currentStep === step.id ? "active" : ""} ${currentStep > step.id ? "completed" : ""}`}>
              <span className="step-number">{step.id}</span>
              <div>
                <span className="step-label">{step.label}</span>
                <span className="step-desc">{step.description}</span>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-field">
            <label>Email Address</label>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                name="email"
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                disabled={emailVerified}
                aria-invalid={!isEmailValid && formData.email}
                required
              />
              {emailVerified && <div className="field-badge success">Verified</div>}
            </div>
            <div className="field-hint">{!emailVerified ? emailHint : "Email verified successfully."}</div>
            {!emailVerified ? (
              <button
                type="button"
                className="action-button"
                onClick={handleSendEmailOtp}
                disabled={emailSendLoading || !canSendEmailOtp}
              >
                {emailOtpSent ? "Resend Email OTP" : "Send Email OTP"}
              </button>
            ) : (
              <div className="verified-note">Email verified</div>
            )}
            {emailOtpSent && emailOtpTimer > 0 && (
              <div className="otp-timer">Resend in {formatTimer(emailOtpTimer)}</div>
            )}
          </div>

          {!emailVerified && emailOtpSent && (
            <div className="form-field">
              <label>Email OTP</label>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  placeholder="Enter Email OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="action-button"
                onClick={handleVerifyEmailOtp}
                disabled={emailVerifyLoading || !canVerifyEmail}
              >
                {emailVerifyLoading ? "Verifying..." : "Verify Email OTP"}
              </button>
            </div>
          )}

          <div className="form-field">
            <label>First Name</label>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Last Name</label>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Role</label>
            <div className="input-group">
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="CUSTOMER">Customer</option>
                <option value="VENDOR">Vendor</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Mobile Number</label>
            <div className="input-group">
              <FaIdCard className="input-icon" />
              <input
                name="mobileNumber"
                placeholder="Enter Mobile Number"
                maxLength="10"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({ ...formData, mobileNumber: value });
                }}
                disabled={aadhaarVerified}
                aria-invalid={!isMobileValid && formData.mobileNumber}
                required
              />
            </div>
            <div className="field-hint">{!aadhaarVerified ? mobileHint : "Mobile number verified with Aadhaar OTP."}</div>
          </div>

          <div className="form-field">
            <label>Aadhaar Number</label>
            <div className="input-group">
              <FaIdCard className="input-icon" />
              <input
                name="aadhaarNumber"
                placeholder="Enter Aadhaar Number"
                maxLength="12"
                value={formData.aadhaarNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                  setFormData({ ...formData, aadhaarNumber: value });
                }}
                disabled={aadhaarVerified}
                aria-invalid={!isAadhaarValid && formData.aadhaarNumber}
                required
              />
            </div>
            <div className="field-hint">{!aadhaarVerified ? aadhaarHint : "Aadhaar verified successfully."}</div>
            {!aadhaarVerified ? (
              <>
                <button
                  type="button"
                  className="action-button"
                  onClick={handleSendAadhaarOtp}
                  disabled={aadhaarSendLoading || !canSendAadhaarOtp}
                >
                  {aadhaarOtpSent ? "Resend Aadhaar OTP" : "Send Aadhaar OTP"}
                </button>
                <div className="field-hint">{aadhaarSendHint}</div>
              </>
            ) : (
              <div className="verified-note">Aadhaar verified</div>
            )}
            {aadhaarOtpSent && aadhaarOtpTimer > 0 && (
              <div className="otp-timer">Resend in {formatTimer(aadhaarOtpTimer)}</div>
            )}
          </div>

          {!aadhaarVerified && aadhaarOtpSent && (
            <div className="form-field">
              <label>Aadhaar OTP</label>
              <div className="input-group">
                <FaIdCard className="input-icon" />
                <input
                  placeholder="Enter Aadhaar OTP"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="action-button"
                onClick={handleVerifyAadhaarOtp}
                disabled={aadhaarVerifyLoading || !canVerifyAadhaar}
              >
                {aadhaarVerifyLoading ? "Verifying..." : "Verify Aadhaar OTP"}
              </button>
            </div>
          )}

          <div className="form-field password-field">
            <label>Password</label>
            <div className="input-group password-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={!canSubmit}>
            Complete Registration
          </button>

          {!canSubmit && (
            <div className="auth-hint">
              Finish email and Aadhaar verification, choose your account type, and set a secure password.
            </div>
          )}
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;