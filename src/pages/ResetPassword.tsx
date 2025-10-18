import { useState } from "react";
import "../styles/ResetPassword.scss";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("❌ Please enter your email address");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Realizar la solicitud al backend para enviar el enlace de restablecimiento
      const response = await fetch("http://localhost:8080/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Reset link sent! Check your email inbox.");
      } else {
        setMessage(data.message || "❌ Error while sending reset link.");
      }
    } catch (error) {
      setMessage("❌ Error al intentar enviar el enlace de restablecimiento");
      console.error("Error sending reset password link:", error);
    } finally {
      setIsLoading(false);
    }
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
          <a href="#/movies">Películas</a>
          <a href="#/about">Sobre Nosotros</a>
        </nav>
        <div className="auth-buttons">
          <a href="/" className="login-btn">Ingreso</a>
          <a href="#/register" className="signup-btn">Registro</a>
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
          <h1>Restablecer contraseña</h1>
          <p className="reset-description">
            Ingrese su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña.
          </p>

          {/* Form */}
          <div className="reset-form">
            <div className="form-group">
              <label htmlFor="email">Dirección de correo electrónico</label>
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
              <FaArrowLeft />Volver a iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
