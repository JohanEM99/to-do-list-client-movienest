/**
 * @file AboutUs.tsx
 * @description React component that renders the "About Us" page for MovieNest.
 * Includes sections for mission, features, statistics, and contact information.
 * Also manages user authentication state and dropdown menu with keyboard shortcuts.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AboutUs.scss";
import { FaFilm, FaAward, FaUsers, FaUser, FaCog, FaSignOutAlt, FaKeyboard } from "react-icons/fa";

/**
 * Main component for the "About MovieNest" page.
 * Displays platform information, mission, features, and user interaction options.
 * 
 * @component
 * @returns {JSX.Element} The rendered AboutUs page.
 */

const AboutUs: React.FC = () => {
  /**
   * Stores the authenticated user's data.
   * @type {object | null}
   */
  const [user, setUser] = useState<any>(null);

  /**
   * Controls the visibility of the user dropdown menu.
   * @type {boolean}
   */
  const [showDropdown, setShowDropdown] = useState(false);

  /**
   * Controls the visibility of the keyboard shortcuts modal.
   * @type {boolean}
   */
  const [showShortcuts, setShowShortcuts] = useState(false);

  /**
   * Navigation hook used to redirect between routes.
   */
  const navigate = useNavigate();

  /**
   * Fetches the user profile when the component is mounted.
   * Runs only once on initial render.
   */
  useEffect(() => {
    fetchUserProfile();
  }, []);

  /**
   * Fetches the authenticated user's profile from the backend API.
   * If a valid token is found in localStorage, it sends a request to retrieve user details.
   * 
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("https://backend-de-peliculas.onrender.com/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener el perfil del usuario.");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error al obtener el perfil de usuario:", error);
      }
    }
  };

  /**
   * Logs the user out by removing their token and redirecting to the homepage.
   * 
   * @function
   * @returns {void}
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Si estamos en un input o textarea, solo permitir ESC
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Alt+H: Ir a Home
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        window.location.href = '/#/homemovies';
      }

      // Alt+P: Ir al Perfil (solo si está logueado)
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (user) {
          window.location.href = '/#/profile';
        }
      }

      // Alt+M: Ir a Películas
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        window.location.href = '/#/movies';
      }

      // Alt+K: Mostrar/ocultar atajos de teclado
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }

      // ESC: Cerrar modal de atajos o dropdown
      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (showDropdown) {
          setShowDropdown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, showDropdown, user]);

  return (
    <div className="about-container">
      {/* Header Section */}
      <header className="about-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>
        <nav className="nav-menu">
          <a href="#/homemovies">Home</a>
          <a href="#/movies">Películas</a>
          <a href="#/about">Sobre Nosotros</a>
        </nav>
        <div className="auth-buttons">
          <button 
            className="shortcuts-btn"
            onClick={() => setShowShortcuts(!showShortcuts)}
            aria-label="Mostrar atajos de teclado"
            title="Atajos de teclado (Alt+K)"
          >
            <FaKeyboard />
          </button>

          {user ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar-small">
                  <FaUser />
                </div>
                <span>{user.name || "Usuario"}</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <a href="#/profile" className="dropdown-item">
                    <FaCog /> Editar Perfil
                  </a>
                  <button onClick={handleLogout} className="dropdown-item">
                    <FaSignOutAlt /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/" className="login-btn">Ingreso</a>
              <a href="#/register" className="signup-btn">Registro</a>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <FaFilm />
          </div>
          <h1>Acerca de MovieNest</h1>
          <p>
            Tu destino definitivo para ver películas premium en streaming. 
            Llevamos la experiencia cinematográfica directamente a tu casa con una amplia colección de películas de todos los géneros.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <div className="mission-text">
            <div className="section-icon">
              <span className="icon-circle">🎯</span>
            </div>
            <h2>Nuestra Misión</h2>
            <p>
              En MovieNest, nos apasiona hacer que el entretenimiento de calidad sea accesible para todos. 
              Nuestra misión es brindar una experiencia de streaming fluida con una amplia biblioteca de películas que satisface todos los gustos 
              y preferencias.
            </p>
            <p>
              Creemos en el poder de la narración y su capacidad para conectar a personas de distintas culturas y orígenes. 
              A través de nuestra plataforma, buscamos acercar la magia del cine a públicos de todo el mundo.
            </p>
          </div>
          <div className="mission-image">
            <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop" alt="Cinema experience" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>¿Por qué elegir MovieNest?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaFilm />
            </div>
            <h3>Amplia biblioteca</h3>
            <p>
              Acceda a miles de películas de todos los géneros, desde clásicos atemporales hasta los últimos estrenos
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaAward />
            </div>
            <h3>Calidad superior</h3>
            <p>
             Disfrute de transmisión de alta definición con calidad de audio y video superior para una experiencia inmersiva.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Fácil de usar</h3>
            <p>
              Interfaz intuitiva diseñada para una navegación sencilla y fluida en todos los dispositivos.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <h2>MovieNest en cifras</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>10K+</h3>
            <p>Películas</p>
          </div>
          <div className="stat-card">
            <h3>1M+</h3>
            <p>Usuarios</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Géneros</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Transmisión</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Ponte en contacto</h2>
        <p>
          ¿Tienes preguntas o comentarios? Nos encantaría saber de ti.
        </p>
        <div className="contact-info">
          <p>📧  movienestplataforma@gmail.com</p>
          <p>📞 +57 (602) 111-22 33</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <img src="/logo.png" alt="MovieNest" />
            </div>
            <p>Tu destino definitivo para ver las mejores películas en línea.</p>
          </div>
          <div className="footer-column">
            <h4>Navegación</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#/movies">Buscar películas</a></li>
              <li><a href="#/about">Sobre nosotros</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Cuenta</h4>
            <ul>
              <li><a href="/">Ingreso</a></li>
              <li><a href="#/register">Registro</a></li>
              <li><a href="#/profile">Mi perfil</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contacto</h4>
            <ul>
              <li>📧 movienestplataforma@gmail.com</li>
              <li>📞 +57 (602) 111-22 33</li>
              <li>📍 123 Calle del cine <br />Los Angeles, CA 90001</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MovieNest. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="/privacy"> </a>
            <span> </span>
            <a href="/terms"> </a>
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div 
          className="shortcuts-modal" 
          onClick={() => setShowShortcuts(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div className="shortcuts-content" onClick={(e) => e.stopPropagation()}>
            <div className="shortcuts-header">
              <div className="header-left">
                <div className="icon-wrapper">
                  <FaKeyboard />
                </div>
                <h2 id="shortcuts-title">Atajos de Teclado</h2>
              </div>
              <button 
                className="close-btn" 
                onClick={() => setShowShortcuts(false)}
                aria-label="Cerrar (Esc)"
              >
                ✕
              </button>
            </div>

            <div className="shortcuts-sections">
              <div className="shortcuts-section">
                <h3 className="section-title">🧭 Navegación General</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span className="shortcut-description">Ir a Inicio</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Alt</kbd>
                        <span className="plus">+</span>
                        <kbd>H</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Ir al Perfil</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Alt</kbd>
                        <span className="plus">+</span>
                        <kbd>P</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Ir a Películas</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Alt</kbd>
                        <span className="plus">+</span>
                        <kbd>M</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Mostrar atajos</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Alt</kbd>
                        <span className="plus">+</span>
                        <kbd>K</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shortcuts-section">
                <h3 className="section-title blue">🖱️ Navegación Básica</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span className="shortcut-description">Cerrar ventana o menú</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Esc</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Cambiar entre secciones</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Tab</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shortcuts-footer">
              Los atajos funcionan tanto en Mac, PC, y Linux. Si estás en Windows/Linux usa <kbd>Alt</kbd> en lugar de <kbd>⌘</kbd>. Puedes activar/desactivar los atajos desde el botón <FaKeyboard /> en el header.
            </div>

            <button 
              className="shortcuts-close-btn" 
              onClick={() => setShowShortcuts(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;