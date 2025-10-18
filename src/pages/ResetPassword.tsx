import { useState } from "react";
import "../styles/ResetPassword.scss";  // Asegúrate de tener tu archivo de estilos correctamente configurado
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ResetPassword = () => {
  const [email, setEmail] = useState("");  // Estado para el correo electrónico
  const [message, setMessage] = useState("");  // Estado para los mensajes (error o éxito)
  const [isLoading, setIsLoading] = useState(false);  // Estado para manejar la carga mientras se procesa la solicitud

  // Función que se ejecuta cuando el formulario es enviado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Evitar el comportamiento por defecto del formulario

    if (!email) {
<<<<<<< HEAD
      setMessage("❌ Please enter your email address");  // Mensaje si no se ingresa el correo
=======
      setMessage("❌ Por favor, introduzca su dirección de correo electrónico");
>>>>>>> ef88470fee262eb329cb8b841d422e040c4c81d1
      return;
    }

    setIsLoading(true);  // Activar estado de carga
    setMessage("");  // Limpiar cualquier mensaje previo

    try {
      // Realizar la solicitud al backend para enviar el enlace de restablecimiento
      const response = await fetch("http://localhost:8080/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),  // Enviar el correo como JSON
      });

      const data = await response.json();  // Obtener la respuesta del backend

      if (response.ok) {
        setMessage("✅ ¡Enlace de restablecimiento enviado! Revisa tu bandeja de entrada.");
      } else {
        setMessage(data.message || "❌ Error al enviar el enlace de restablecimiento.");
      }
    } catch (error) {
      setMessage("❌ Error al intentar enviar el enlace de restablecimiento");
      console.error("Error al enviar el enlace de restablecimiento de contraseña:", error);
    } finally {
      setIsLoading(false);  // Desactivar estado de carga después de la respuesta
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
<<<<<<< HEAD
                  placeholder="Ingrese su correo electrónico"
=======
                  placeholder="Introduce tu correo electrónico"
>>>>>>> ef88470fee262eb329cb8b841d422e040c4c81d1
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  // Actualizar el estado del email
                />
              </div>
            </div>

            <button 
              className="reset-button"
              onClick={handleSubmit}
              disabled={isLoading}  // Deshabilitar el botón mientras se está enviando la solicitud
            >
<<<<<<< HEAD
              {isLoading ? "Enviando..." : "Enviar enlace de restablecimiento"}  {/* Mostrar mensaje de carga */}
=======
              {isLoading ? "Eviando..." : "Enviar enlace de reinicio"}
>>>>>>> ef88470fee262eb329cb8b841d422e040c4c81d1
            </button>

            {message && (
              <div className={`message ${message.includes("sent") ? "success" : "error"}`}>
                {message}  {/* Mostrar el mensaje de éxito o error */}
              </div>
            )}

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
