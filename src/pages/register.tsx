

/**
 * @file Register.tsx
 * @description Registration form component that allows users to create an account. 
 * It includes password validation, visibility toggling, and form submission using a custom hook.
 */

import "../styles/Register.scss";
import { useState } from "react";
import { useRegister } from "../hooks/useRegister";

/**
 * Register component that handles user registration.
 * It validates passwords, manages form inputs, and handles registration requests.
 * 
 * @component
 * @returns {JSX.Element} The rendered registration form.
 */

export default function Register() {
  const {
    formData,
    handleChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    success,
  } = useRegister();

  const [passwordError, setPasswordError] = useState("");


   /**
   * Validates the password based on specific rules (uppercase, lowercase, number, special character, and minimum length).
   * 
   * @param {string} password - The password entered by the user.
   * @returns {boolean} True if the password meets all criteria, false otherwise.
   */
  const validatePassword = (password: string) => {
    // Regular expression for password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|-]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un símbolo especial."
      );
      return false;
    }

    setPasswordError(""); // If valid, clear the error message
    return true;
  };


    /**
   * Handles form submission by validating the password and confirmation fields.
   * If validation passes, it calls the handleSubmit function from the custom hook.
   * 
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords before submitting the form
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmPasswordValid = formData.password === formData.confirmPassword;

    if (!isPasswordValid) return; /// Do not submit if password is invalid
    if (!isConfirmPasswordValid) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    // If validation passes, submit the form
    handleSubmit(e);
  };

  return (
    <div className="container-register">
      <div className="form-container">
        <h1>¡Es hora de empezar!</h1>
        <p>Completa los campos y forma parte de nosotros.</p>
        <br />

        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nombres"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastname"
            placeholder="Apellidos"
            value={formData.lastname}
            onChange={handleChange}
            required
          />

          
          <input
            className="date-color"
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={togglePassword}>
              👁
            </button>
          </div>

          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={toggleConfirmPassword}>
              👁
            </button>
          </div>

          {/* Mensaje de error para contraseñas */}
          {passwordError && (
            <div className="error-message">
              {passwordError}
            </div>
          )}

          {/* Mensaje de error general */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <div className="success-message">
              ✅ Registro exitoso. Redirigiendo...
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registrando..." : "¡Unirme ahora!"}
          </button>
        </form>

        <p>
          ¿Ya tienes una cuenta? <a href="/">Ingreso</a>
        </p>
      </div>
    </div>
  );
}
