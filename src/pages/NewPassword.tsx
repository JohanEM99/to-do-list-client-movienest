import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/NewPassword.scss";
import { useParams, useNavigate } from "react-router-dom"; // Usamos useParams para obtener el token
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa"; // Íconos para mostrar/ocultar contraseña.




/**
 * NewPassword component — allows users to reset their password using a token received via email.
 * The token is obtained from the URL and verified with the backend.
 * Users can input and confirm a new password, which is validated before submission.
 *
 * @component
 * @returns {JSX.Element} The rendered password reset page.
 */
const NewPassword = () => {
  /** 
   * Extracts the token from the URL parameters.
   * @type {{ token?: string }}
   */
  const { token } = useParams();

  /** @type {[string, Function]} */
  const [newPassword, setNewPassword] = useState("");

  /** @type {[string, Function]} */
  const [confirmPassword, setConfirmPassword] = useState("");

  /** @type {[string, Function]} */
  const [message, setMessage] = useState("");

  /** @type {[boolean, Function]} */
  const [isSuccess, setIsSuccess] = useState(false);

  /** @type {[boolean, Function]} */
  const [isLoading, setIsLoading] = useState(false);

  /** @type {[boolean, Function]} Controls visibility of the new password field. */
  const [showNewPassword, setShowNewPassword] = useState(false);

  /** @type {[boolean, Function]} Controls visibility of the confirm password field. */
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  /**
   * Redirects the user to the home page if no token is present in the URL.
   * Executed on component mount.
   *
   * @effect
   */

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect if there is no token
    }
  }, [token, navigate]);


  /**
   * Handles form submission and validates password fields before sending a request.
   * It ensures passwords match, meet minimum length requirements, and are not empty.
   * Sends the token and new password to the backend API.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - Form submission event.
   * @returns {Promise<void>}
   */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   // Validate that both fields are filled
    if (!newPassword || !confirmPassword) {
      setMessage("Por favor completa todos los campos");
      setIsSuccess(false);
      return;
    }

    
    // Validate password length
    if (newPassword.length < 8) {
      setMessage("La contraseña debe tener al menos 8 caracteres");
      setIsSuccess(false);
      return;
    }


    
    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true); /// Activate loading state
    setMessage("");

    try {
      // Send token and new password to backend for updating
      await axios.post("https://backend-de-peliculas.onrender.com/api/v1/users/reset-password", {
   // await axios.post("http://localhost:8080/api/v1/users/reset-password", {
        token,        // Token obtained from the URL
        newPassword,  /// New password entered by the user
      });

      setMessage("Contraseña restablecida correctamente.");
      setIsSuccess(true); /// Display success message
    } catch (error) {
      setMessage("Hubo un error al restablecer la contraseña.");
    } finally {
      setIsLoading(false); // Disable loading state after request
    }
  };

  return (
    <div className="new-password-container">
      <div className="new-password-card">
        {!isSuccess ? (
          <>
            <h1>Nueva contraseña</h1>

            <div className="password-form">
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingrese su nueva contraseña"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar la contraseña</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar la contraseña"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {message && !isSuccess && (
                <div className="error-message">{message}</div>
              )}

              <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Cambiando..." : "Cambiar contraseña"}
              </button>
            </div>
          </>
        ) : (
          <div className="success-container">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h2>¡Contraseña actualizada!</h2>
            <p>Tu contraseña ha sido cambiada exitosamente.</p>
            <p className="redirect-message">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPassword;
