import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Usamos useNavigate en lugar de useHistory

const NewPassword = () => {
  const { token } = useParams();  // Obtener el token de la URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Usamos useNavigate en lugar de useHistory

  useEffect(() => {
    // Verifica si no hay token y redirige al inicio si es necesario
    if (!token) {
      navigate("/"); // Si no hay token, redirigir al inicio
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true); // Activar el estado de carga

    try {
      // Enviar el token y la nueva contraseña al backend para actualizarlas
      const response = await axios.post("http://localhost:8080/api/v1/users/reset-password", {
        token,
        newPassword,
      });

      setMessage("Contraseña restablecida correctamente.");
    } catch (error) {
      setMessage("Hubo un error al restablecer la contraseña.");
    } finally {
      setIsLoading(false); // Desactivar el estado de carga después de la solicitud
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} // Actualizar nueva contraseña
            required
          />
        </div>
        <div>
          <label>Confirmar Nueva Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Actualizar confirmación de contraseña
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Restablecer Contraseña"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NewPassword;
