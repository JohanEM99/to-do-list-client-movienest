import { useState } from "react";
import "../styles/NewPassword.scss";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    setIsLoading(true);
    setMessage("");

    // Simulación de cambio de contraseña
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setMessage("¡Contraseña actualizada exitosamente!");
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = "/#/";
      }, 2000);
    }, 1500);
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
                <div className="error-message">
                  {message}
                </div>
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
            <p className="redirect-message">Redirigiendo al inicio de sesión...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPassword;