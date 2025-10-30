import { useState, useEffect } from "react";
import "../styles/ProfileEdit.scss";
import {
  FaUser,
  FaSignOutAlt,
  FaSave,
  FaTrash,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";


/**
 * Interface representing user profile data.
 * @interface
 */

interface ProfileData {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}


/**
 * ProfileEdit component — allows users to view, edit, and update their profile information.
 * It also supports password updates, account deletion, and logout functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered profile editing interface.
 */
const ProfileEdit = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * Calculates the age from a given birthdate.
   *
   * @param {string} birthdate - The user's birthdate.
   * @returns {string} The calculated age as a string.
   */
  const calculateAge = (birthdate: string): string => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age.toString();
  };


  /**
   * Loads user data when the component mounts.
   *
   * @effect
   */
  useEffect(() => {
    fetchUserProfile();
  }, []);


    /**
   * Fetches the user's profile information from the backend.
   * If the user is not logged in, they are redirected to the home page.
   *
   * @async
   * @function fetchUserProfile
   * @returns {Promise<void>}
   */
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.get(
        "https://backend-de-peliculas.onrender.com/api/v1/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data.user;

      const age = user.birthdate ? calculateAge(user.birthdate) : "";

      setProfileData({
        firstName: user.username || user.firstName || "",
        lastName: user.lastname || user.lastName || "",
        age: age,
        email: user.email || "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setError("Error al cargar la información del perfil");
    }
  };


    /**
   * Handles input field changes and updates the profile data state.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The input change event.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };


    /**
   * Validates and submits updated user information to the backend.
   * Handles password validation and optional password changes.
   *
   * @async
   * @function handleSaveChanges
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");


    // Validate passwords if being changed
    if (profileData.newPassword || profileData.confirmPassword) {
      if (profileData.newPassword.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|-]).{8,}$/;

      if (!passwordRegex.test(profileData.newPassword)) {
        setError(
          "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo especial."
        );
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

      // Prepare data to send (age is not editable)
      const updateData: any = {
        username: profileData.firstName,
        lastname: profileData.lastName,
        email: profileData.email,
      };

      // Include password only if changed
      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      await axios.put(
        "https://backend-de-peliculas.onrender.com/api/v1/users/profile",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("¡Perfil actualizado exitosamente!");

      // Clear password fields
      setProfileData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));

      // Reload profile data
      setTimeout(() => {
        fetchUserProfile();
      }, 1000);
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);

      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Error al actualizar el perfil";
        setError(errorMsg);
      } else {
        setError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };


    /**
   * Deletes the user's account after confirmation.
   *
   * @async
   * @function handleDeleteAccount
   * @returns {Promise<void>}
   */
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "¿Estás seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      await axios.delete(
        "https://backend-de-peliculas.onrender.com/api/v1/users/profile",
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


    /**
   * Logs the user out and removes the authentication token.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /** Toggles visibility of the new password field. */
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  /** Toggles visibility of the confirm password field. */
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="profile-edit-container">
      {/* Header y menú de navegación */}
      <header className="profile-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>
        <nav className="nav-menu">
          <a href="/#/homemovies">Home</a>
          <a href="/#/movies">Películas</a>
          <a href="/#/about">Sobre Nosotros</a>
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
              <button onClick={handleLogout} className="dropdown-item">
                <FaSignOutAlt /> Salir
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Formulario de edición de perfil */}
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <FaUser />
            </div>
            <h2>Mi Perfil</h2>
            <p className="profile-subtitle">
              Administra la información de tu cuenta
            </p>
          </div>

          <div className="profile-form">
            {/* Formulario de datos */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">
                  Nombre<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">
                  Apellido <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Edad */}
            <div className="form-group">
              <label htmlFor="age">
                Edad
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={profileData.age ? `${profileData.age} años` : "No disponible"}
                readOnly
                style={{ backgroundColor: "#f5f5f531", cursor: "not-allowed" }}
              />
              <small className="form-hint">
                La edad se calcula automáticamente desde tu fecha de nacimiento.
              </small>
            </div>

            {/* Correo electrónico */}
            <div className="form-group">
              <label htmlFor="email">
                Dirección de correo electrónico
                <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  readOnly
                  style={{ backgroundColor: "#f5f5f531", cursor: "not-allowed" }}
                />
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div className="form-section">
              <h3>Cambiar la contraseña (Opcional)</h3>
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder="Déjelo en blanco para mantener la contraseña actual"
                    value={profileData.newPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePassword}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <small className="form-hint">Mínimo 8 caracteres</small>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirmar nueva contraseña
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Vuelva a ingresar la nueva contraseña"
                    value={profileData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPassword}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {error && <div className="error-message">{error}</div>}

              {success && <div className="success-message">{success}</div>}
            </div>

            {/* Botones */}
            <div className="form-actions">
              <button
                type="button"
                className="save-button"
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                <FaSave /> {isLoading ? "Guardando..." : "Guardar cambios"}
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