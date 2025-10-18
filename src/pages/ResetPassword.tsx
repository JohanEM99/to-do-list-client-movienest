import { useState } from "react";
import "../styles/ResetPassword.scss";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setMessage("");

    // Simulación de envío de email
    setTimeout(() => {
      setIsLoading(false);
      setMessage("Reset link sent! Check your email inbox.");
      console.log("Reset password link sent to:", email);
    }, 1500);
  };

  return (
    <div className="reset-password-container">
      {/* Header */}
      <header className="reset-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>
        <nav className="nav-menu">
          <a href="#/home">Home</a>
          <a href="#/movies">Movies</a>
          <a href="#/about">About Us</a>
        </nav>
        <div className="auth-buttons">
          <a href="/" className="login-btn">Login</a>
          <a href="#/register" className="signup-btn">Sign Up</a>
        </div>
      </header>

      {/* Reset Password Content */}
      <div className="reset-content">
        <div className="reset-card">
          {/* Logo */}
          <div className="reset-logo">
            <img src="/logo.png" alt="MovieNest" />
          </div>

          {/* Title and Description */}
          <h1>Reset Password</h1>
          <p className="reset-description">
            Enter your email address and we'll send you a link to reset your password
          </p>

          {/* Form */}
          <div className="reset-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              className="reset-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            {message && (
              <div className={`message ${message.includes("sent") ? "success" : "error"}`}>
                {message}
              </div>
            )}

            <a href="/#/" className="back-to-login">
              <FaArrowLeft /> Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;