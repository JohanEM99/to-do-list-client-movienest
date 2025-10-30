import { useState } from "react";
import "../styles/ResetPassword.scss";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

/**
 * Component for resetting the user's password by sending a recovery email.
 * This component allows the user to enter their email address and receive
 * a password reset link from the backend API.
 *
 * @component
 * @returns {JSX.Element} The ResetPassword page component.
 */
const ResetPassword = () => {
  /** State for storing user's email input */
  const [email, setEmail] = useState("");
  /** State for displaying messages (success or error) */
  const [message, setMessage] = useState("");
  /** Loading state to manage async request process */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the form submission for requesting a password reset email.
   *
   * @async
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>} Sends a POST request to the backend API.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Validate email before sending request
    if (!email) {
      setMessage("❌ Por favor, introduzca su dirección de correo electrónico");
      return;
    }

    setIsLoading(true); // Enable loading state
    setMessage(""); // Clear previous messages

    try {
      // Send POST request to backend API for password reset
      const response = await fetch(
        "https://backend-de-peliculas.onrender.com/api/auth/request-password-reset",
        {
          // Local development endpoint example:
          // "http://localhost:8080/api/auth/request-password-reset",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Send email as JSON body
        }
      );

      const data = await response.json(); // Parse JSON response

      // Handle success and error messages based on response status
      if (response.ok) {
        setMessage("✅ ¡Enlace de restablecimiento enviado! Revisa tu bandeja de entrada.");
      } else {
        setMessage(data.message || "❌ Error al enviar el enlace de restablecimiento.");
      }
    } catch (error) {
      // Handle request or network error
      setMessage("❌ Error al intentar enviar el enlace de restablecimiento");
      console.error("Error al enviar el enlace de restablecimiento de contraseña:", error);
    } finally {
      // Disable loading state after request completion
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      {/* === Header Section === */}
      <header className="reset-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>

        <nav className="nav-menu">
          <a href="#/home">Home</a>
          <a href="#/movies">Películas</a>
          <a href="#/about">Sobre Nosotros</a>
        </nav>

        <div className="auth-buttons">
          <a href="/" className="login-btn">Ingreso</a>
          <a href="#/register" className="signup-btn">Registro</a>
        </div>
      </header>

      {/* === Password Reset Content === */}
      <div className="reset-content">
        <div className="reset-card">
          {/* App Logo */}
          <div className="reset-logo">
            <img src="/logo.png" alt="MovieNest" />
          </div>

          {/* Title and Description */}
          <h1>Restablecer contraseña</h1>
          <p className="reset-description">
            Ingrese su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña.
          </p>

          {/* === Password Reset Form === */}
          <div className="reset-form">
            <div className="form-group">
              <label htmlFor="email">Dirección de correo electrónico</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Introduce tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              className="reset-button"
              onClick={handleSubmit}
              disabled={isLoading} // Disable button while request is processing
            >
              {isLoading ? "Enviando..." : "Enviar enlace de reinicio"}
            </button>

            {/* Display success or error messages */}
            {message && (
              <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
                {message}
              </div>
            )}

            {/* Link to return to login page */}
            <a href="/#/" className="back-to-login">
              <FaArrowLeft /> Volver a iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
