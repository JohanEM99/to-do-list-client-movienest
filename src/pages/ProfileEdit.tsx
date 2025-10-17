import React, { useState } from "react";
import "../styles/ProfileEdit.scss";
import { FaUser, FaCog, FaSignOutAlt, FaSave, FaTrash, FaEnvelope } from "react-icons/fa";

interface ProfileData {
  firstName: string;
  lastName: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileEdit: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "wilson",
    lastName: "espinal",
    birthMonth: "September",
    birthDay: "8",
    birthYear: "1999",
    email: "wilson.espinal@correoumvallle.edu.co",
    newPassword: "",
    confirmPassword: "",
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Saving profile changes:", profileData);
    alert("Profile updated successfully!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Deleting account...");
      alert("Account deleted successfully!");
      window.location.href = "/#/";
    }
  };

  return (
    <div className="profile-edit-container">
      <header className="profile-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>
        <nav className="nav-menu">
          <a href="/#/home">Home</a>
          <a href="/#/movies">Movies</a>
          <a href="/#/about">About Us</a>
        </nav>
        <div className="user-menu">
          <button 
            className="user-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar-small">
              <FaUser />
            </div>
            <span>wilson</span>
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <a href="/#/profile" className="dropdown-item">
                <FaCog /> Profile Settings
              </a>
              <a href="/#/" className="dropdown-item">
                <FaSignOutAlt /> Logout
              </a>
            </div>
          )}
        </div>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <FaUser />
            </div>
            <h2>My Profile</h2>
            <p className="profile-subtitle">Manage your account information</p>
          </div>

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Date of Birth <span className="required">*</span></label>
              <div className="date-inputs">
                <select
                  name="birthMonth"
                  value={profileData.birthMonth}
                  onChange={handleChange}
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="birthDay"
                  placeholder="8"
                  min="1"
                  max="31"
                  value={profileData.birthDay}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="birthYear"
                  placeholder="1999"
                  min="1900"
                  max="2025"
                  value={profileData.birthYear}
                  onChange={handleChange}
                />
              </div>
              <small className="form-hint">You must be at least 13 years old to register.</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address <span className="required">*</span></label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Change Password (Optional)</h3>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Leave blank to keep current password"
                  value={profileData.newPassword}
                  onChange={handleChange}
                />
                <small className="form-hint">Minimum 8 characters</small>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={profileData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button"
                className="save-button"
                onClick={handleSaveChanges}
              >
                <FaSave /> Save Changes
              </button>
              <button 
                type="button" 
                className="delete-button"
                onClick={handleDeleteAccount}
              >
                <FaTrash /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;