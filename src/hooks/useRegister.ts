// src/hooks/useRegister.ts
import { useState } from "react";
// import { registerUser } from "../services/api"; // Se activará cuando conectes el backend

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

  // 👉 Enviar el formulario (solo simula registro)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    // Simulación temporal (sin backend)
    console.log("Datos del formulario:", formData);
    alert("✅ Registro simulado correctamente");
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
