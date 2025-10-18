import { useState, useEffect } from "react";
import "../styles/ProfileEdit.scss";
import { FaUser, FaCog, FaSignOutAlt, FaSave, FaTrash, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    birthMonth: "January",
    birthDay: "",
    birthYear: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.get(
        "https://backend-de-peliculas.onrender.com/api/v1/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data.user;
      
      // Separar fecha de nacimiento si viene como string
      const birthDate = user.birthdate ? new Date(user.birthdate) : null;
      
      setProfileData({
        firstName: user.username || user.firstName || "",
        lastName: user.lastname || user.lastName || "",
        birthMonth: birthDate ? months[birthDate.getMonth()] : "January",
        birthDay: birthDate ? birthDate.getDate().toString() : "",
        birthYear: birthDate ? birthDate.getFullYear().toString() : "",
        email: user.email || "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setError("Error al cargar la información del perfil");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setSuccess("");
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validar contraseñas si se están cambiando
    if (profileData.newPassword || profileData.confirmPassword) {
      if (profileData.newPassword.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres");
        return;
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      // Construir fecha de nacimiento
      const birthdate = `${profileData.birthYear}-${String(months.indexOf(profileData.birthMonth) + 1).padStart(2, '0')}-${String(profileData.birthDay).padStart(2, '0')}`;

      // Preparar datos para enviar
      const updateData: any = {
        username: profileData.firstName,
        lastname: profileData.lastName,
        birthdate: birthdate,
        email: profileData.email,
      };

      // Solo incluir password si se está cambiando
      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      const response = await axios.put(
        "https://backend-de-peliculas.onrender.com/api/v1/user/profile",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("¡Perfil actualizado exitosamente!");
      
      // Limpiar campos de contraseña
      setProfileData(prev => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));

      // Recargar datos del perfil
      setTimeout(() => {
        fetchUserProfile();
      }, 1000);

    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || "Error al actualizar el perfil";
        setError(errorMsg);
      } else {
        setError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("¿Estás seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      await axios.delete(
        "https://backend-de-peliculas.onrender.com/api/v1/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Cuenta eliminada exitosamente");
      localStorage.removeItem("token");
      navigate("/");
      
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("Error al eliminar la cuenta. Intenta de nuevo.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="profile-edit-container">
      <header className="profile-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>
        <nav className="nav-menu">
          <a href="/#/homemovies">Home</a>
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
            <span>{profileData.firstName}</span>
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <a href="/#/profile" className="dropdown-item">
                <FaCog /> Profile Settings
              </a>
              <button onClick={handleLogout} className="dropdown-item">
                <FaSignOutAlt /> Logout
              </button>
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
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

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
                  placeholder="Day"
                  min="1"
                  max="31"
                  value={profileData.birthDay}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="birthYear"
                  placeholder="Year"
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
                disabled={isLoading}
              >
                <FaSave /> {isLoading ? "Saving..." : "Save Changes"}
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