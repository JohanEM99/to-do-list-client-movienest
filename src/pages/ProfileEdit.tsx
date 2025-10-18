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
      alert("¡Las contraseñas no coinciden!");
      return;
    }

    console.log("Guardar cambios de perfil:", profileData);
    alert("¡Perfil actualizado exitosamente!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer..")) {
      console.log("Eliminando cuenta...");
      alert("¡Cuenta eliminada exitosamente!");
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
          <a href="#/home">Home</a>
          <a href="#/movies">Películas</a>
          <a href="#/about">Sobre Nosotros</a>
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
              <a href="#/profile" className="dropdown-item">
                <FaCog /> Configuración de perfil
              </a>
              <a href="#/" className="dropdown-item">
                <FaSignOutAlt /> Salir
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
            <h2>Mi Perfil</h2>
            <p className="profile-subtitle">Administra la información de tu cuenta</p>
          </div>

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Nombre <span className="required">*</span></label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellido <span className="required">*</span></label>
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
              <small className="form-hint">Debes tener al menos 13 años para registrarte.</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Dirección de correo electrónico <span className="required">*</span></label>
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
              <h3>Cambiar la contraseña (Optional)</h3>
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Leave blank to keep current password"
                  value={profileData.newPassword}
                  onChange={handleChange}
                />
                <small className="form-hint">Minimo 8 caracteres</small>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
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
                <FaSave /> Guardar cambios
              </button>
              <button 
                type="button" 
                className="delete-button"
                onClick={handleDeleteAccount}
              >
                <FaTrash /> Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;