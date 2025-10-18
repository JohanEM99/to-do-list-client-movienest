import React, { useState } from "react";
import "../styles/login.scss";

import { FaEye, FaEyeSlash } from "react-icons/fa"; // íconos de Font Awesome (vía react-icons)

const Home: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMsg("Iniciando sesión... (ejemplo)");
    setTimeout(() => {
      setLoginMsg("Inicio de sesión exitoso ✅");
    }, 1000);
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
            placeholder="Correo electrónico"
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Contraseña"
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

        <div id="loginMsg">{loginMsg}</div>

        <p>
          ¿Necesitas una cuenta?&nbsp;<a href="/register">Crear cuenta</a>
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
