import { useState } from "react";
import axios from "axios";

interface FormData {
  username: string;
  lastname: string;
  birthdate: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorResponse {
  message?: string;
  errors?: string[];
}

export const useRegister = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    lastname: "",
    birthdate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Maneja cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (error) setError("");
  };

  // Mostrar/ocultar contraseñas
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  // Validaciones del formulario
  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError("El nombre es requerido");
      return false;
    }

    if (!formData.lastname.trim()) {
      setError("El apellido es requerido");
      return false;
    }

    if (!formData.birthdate) {
      setError("La fecha de nacimiento es requerida");
      return false;
    }

    // Validar que sea mayor de 13 años
    const birthDate = new Date(formData.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) {
      setError("Debes tener al menos 13 años para registrarte");
      return false;
    }

    if (!formData.email.trim()) {
      setError("El correo electrónico es requerido");
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("El correo electrónico no es válido");
      return false;
    }

    if (!formData.password) {
      setError("La contraseña es requerida");
      return false;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  // Enviar el formulario y registrar el usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para enviar (sin confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;

      // Enviar los datos del formulario al backend
      const response = await axios.post(
        "https://backend-de-peliculas.onrender.com/api/auth/register",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta del backend:", response.data);
      setSuccess(true);
      
      // Mostrar mensaje de éxito
      alert("✅ Registro exitoso. Redirigiendo al inicio de sesión...");

      // Limpiar formulario
      setFormData({
        username: "",
        lastname: "",
        birthdate: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = "/#/";
      }, 2000);

    } catch (error) {
      console.error("Error al registrar usuario:", error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as ErrorResponse;
        
        if (error.response?.status === 400) {
          setError(errorData?.message || "Datos inválidos. Verifica la información.");
        } else if (error.response?.status === 409) {
          setError("Este correo electrónico ya está registrado");
        } else if (error.response?.status === 500) {
          setError("Error del servidor. Intenta de nuevo más tarde.");
        } else {
          setError(errorData?.message || "Error al registrar el usuario. Intenta de nuevo.");
        }
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
  };
};