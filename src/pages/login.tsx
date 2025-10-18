import React, { useState } from "react";
import "../styles/login.scss";

import { FaEye, FaEyeSlash } from "react-icons/fa"; // íconos de Font Awesome (vía react-icons)
import { useNavigate } from "react-router-dom";  // Importa useNavigate

const Home: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState(""); // Mensaje de error
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar mensajes de error previos
    setErrorMsg("");

    // Validación de campos vacíos
    if (!formData.email || !formData.password) {
      setErrorMsg("❌ El correo y la contraseña son obligatorios");
      return;
    }

    // Validación del formato del email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("❌ El formato del correo electrónico no es válido");
      return;
    }

    setLoginMsg("Iniciando sesión...");

    try {
      // Enviar la solicitud de login al backend
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginMsg("Inicio de sesión exitoso ✅");
        localStorage.setItem("token", data.token); // Almacenar el token
        navigate("/homemovies");  // Redirigir al Home Movies (ajustar la ruta según tu configuración)
      } else {
        setErrorMsg(data.message); // Mostrar el mensaje de error del backend
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
