import React, { useState } from "react";
import "../styles/login.scss";

import { FaEye, FaEyeSlash } from "react-icons/fa"; // Font Awesome icons (via react-icons)
import { useNavigate } from "react-router-dom";  // Importa useNavigate

/**
 * Home component — Handles user login functionality including form validation, 
 * password visibility toggle, API request for authentication, and navigation after login.
 *
 * @component
 * @returns {JSX.Element} The rendered login page
 */


const Home: React.FC = () => {
  /** State to control password visibility */
  const [showPassword, setShowPassword] = useState(false);
  /** State for displaying login feedback messages */
  const [loginMsg, setLoginMsg] = useState("");
  /** State holding form data for email and password fields */
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /** State for displaying error messages */
  const [errorMsg, setErrorMsg] = useState("");
  /** React Router hook for navigation */
  const navigate = useNavigate();

  /**
   * Toggles the visibility of the password input field.
   * @function
   */

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };


  /**
   * Handles input changes for the login form fields.
   * @function
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles login form submission.
   * Performs input validation, sends a POST request to the backend for authentication,
   * stores the JWT token on success, and redirects the user to the HomeMovies page.
   *
   * @async
   * @function
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMsg("");

    // Validate empty fields
    if (!formData.email || !formData.password) {
      setErrorMsg("❌ El correo y la contraseña son obligatorios");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("❌ El formato del correo electrónico no es válido");
      return;
    }

    setLoginMsg("Iniciando sesión...");

    try {
      // Send login request to backend
      const response = await fetch("https://backend-de-peliculas.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginMsg("Inicio de sesión exitoso ✅");
        localStorage.setItem("token", data.token); /// Store token in localStorage
        navigate("/homemovies");  // Redirect to Home Movies page
      } else {
        setErrorMsg(data.message); // Show backend error message
      }
    } catch (error) {
      setErrorMsg("❌ Error al intentar iniciar sesión");
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="container-login">
      <div className="form-container">
        <h1>¡Hola de nuevo!</h1>
        <h2>Acceso a la cuenta</h2>

        <form id="loginForm" onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit">Vamos a iniciar</button>
        </form>

        {errorMsg && <div className="error-msg">{errorMsg}</div>} {/* Mostrar el mensaje de error */}

        <div id="loginMsg">{loginMsg}</div>

        <p>
          ¿Necesitas una cuenta?&nbsp;<a href="#/register">Crear cuenta</a>
        </p>

        <p>
          ¿Problemas para acceder?&emsp;
          <a href="#/reset-password">Restablecer contraseña</a>
        </p>
      </div>

      <div className="image-container">
        <img src="/logo.png" alt="Imagen de Login" />
      </div>

      <footer className="footer">
        <nav className="footer-nav">
          <a href="/">Acceder</a>
          <span>|</span>
          <a href="#/homemovies">Home</a>
          <span>|</span>
          <a href="#/about">Nosotros</a>
        </nav>
        <p className="footer-copy">
          &copy; 2025. Sitio web desarrollado por MovieNest. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
};

export default Home;
