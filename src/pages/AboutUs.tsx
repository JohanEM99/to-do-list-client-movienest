import React from "react";
import "../styles/AboutUs.scss";
import { FaFilm, FaAward, FaUsers } from "react-icons/fa";

const AboutUs: React.FC = () => {
  return (
    <div className="about-container">
      {/* Header Section */}
      <header className="about-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>
        <nav className="nav-menu">
          <a href="/">Home</a>
          <a href="/movies">Movies</a>
          <a href="/about">About Us</a>
        </nav>
        <div className="auth-buttons">
          <a href="/" className="login-btn">Login</a>
          <a href="/register" className="signup-btn">Sign Up</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <FaFilm />
          </div>
          <h1>About MovieNest</h1>
          <p>
            Your ultimate destination for streaming premium movies. We bring the cinema experience right
            to your home with a vast collection of films across all genres.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <div className="mission-text">
            <div className="section-icon">
              <span className="icon-circle">🎯</span>
            </div>
            <h2>Our Mission</h2>
            <p>
              At MovieNest, we're passionate about making quality entertainment accessible to everyone. Our
              mission is to provide a seamless streaming experience with an extensive library of movies that cater to
              diverse tastes and preferences.
            </p>
            <p>
              We believe in the power of storytelling and its ability to connect people across cultures and
              backgrounds. Through our platform, we aim to bring the magic of cinema to audiences worldwide.
            </p>
          </div>
          <div className="mission-image">
            <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop" alt="Cinema experience" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose MovieNest?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaFilm />
            </div>
            <h3>Extensive Library</h3>
            <p>
              Access thousands of movies across all genres, from timeless classics to the latest releases.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaAward />
            </div>
            <h3>Premium Quality</h3>
            <p>
              Enjoy high-definition streaming with superior audio and video quality for an immersive experience.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>User-Friendly</h3>
            <p>
              Intuitive interface designed for easy navigation and seamless browsing across all devices.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <h2>MovieNest by the Numbers</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>10K+</h3>
            <p>Movies</p>
          </div>
          <div className="stat-card">
            <h3>1M+</h3>
            <p>Users</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Genres</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Streaming</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Get in Touch</h2>
        <p>
          Have questions or feedback? We'd love to hear from you. Our dedicated support team is
          available 24/7 to assist you.
        </p>
        <div className="contact-info">
          <p>📧 info@movienest.com</p>
          <p>📞 +1 (234) 567-890</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <img src="/logo.png" alt="MovieNest" />
            </div>
            <p>Your ultimate destination for streaming the best movies online.</p>
          </div>
          <div className="footer-column">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/movies">Browse Movies</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Account</h4>
            <ul>
              <li><a href="/">Login</a></li>
              <li><a href="/register">Sign Up</a></li>
              <li><a href="/profile">My Profile</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>📧 info@movienest.com</li>
              <li>📞 +1 (234) 567-890</li>
              <li>📍 123 Movie Street<br />Los Angeles, CA 90001</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MovieNest. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <span>|</span>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;