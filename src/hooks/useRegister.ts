import { useState } from "react";
import axios from "axios"; // Importa axios para hacer la solicitud HTTP

export const useRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    lastname: "",
    birthdate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 👉 Maneja cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 👉 Mostrar/ocultar contraseñas
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  // 👉 Enviar el formulario y registrar el usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que las contraseñas coinciden
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      // Enviar los datos del formulario al backend
      const response = await axios.post("http://localhost:8080/api/auth/register", formData);

      console.log("Respuesta del backend:", response.data);
      alert("✅ Registro exitoso, ahora puedes iniciar sesión.");
      
      // Redirigir al login (si es necesario)
      // navigate('/login'); // Si usas react-router-dom, descomenta esto
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("❌ Error al registrar el usuario. Intenta de nuevo.");
    }
  };

  return {
    formData,
    showPassword,
    showConfirmPassword,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
  };
};
