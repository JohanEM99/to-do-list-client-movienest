import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/NewPassword.scss";
import { useParams, useNavigate } from "react-router-dom"; // Usamos useParams para obtener el token
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa"; // Íconos para mostrar/ocultar contraseña

const NewPassword = () => {
  const { token } = useParams();  // Obtener el token de la URL.
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false); // Mostrar/ocultar nueva contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Mostrar/ocultar confirmación de contraseña
  
  const navigate = useNavigate(); // Usamos useNavigate para redirigir después

  // Si no hay token, redirigir al inicio
  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirigir si no hay token
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (!newPassword || !confirmPassword) {
      setMessage("Por favor completa todos los campos");
      setIsSuccess(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("La contraseña debe tener al menos 8 caracteres");
      setIsSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true); // Activar el estado de carga
    setMessage("");

    try {
      // Enviar el token y la nueva contraseña al backend para actualizarlas
      await axios.post("https://backend-de-peliculas.onrender.com/api/v1/users/reset-password", {
   // await axios.post("http://localhost:8080/api/v1/users/reset-password", {
        token,        // El token que se obtiene de la URL
        newPassword,  // La nueva contraseña
      });

      setMessage("Contraseña restablecida correctamente.");
      setIsSuccess(true); // Mostrar el mensaje de éxito
    } catch (error) {
      setMessage("Hubo un error al restablecer la contraseña.");
    } finally {
      setIsLoading(false); // Desactivar el estado de carga después de la solicitud
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
