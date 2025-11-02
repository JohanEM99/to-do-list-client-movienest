import React, { useState, useEffect, useRef } from "react";
import "../styles/HomeMovies.scss";
import {
  FaStar,
  FaClock,
  FaPlay,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaKeyboard,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Interface representing a video object from the Pexels API.
 * @interface
 */
interface PexelsVideo {
  id: number;
  image: string;
  duration: number;
  user: {
    name: string;
  };
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
  }>;
}

/**
 * Interface representing a movie object displayed in the app.
 * @interface
 */
interface Movie {
  id: number;
  title: string;
  description: string;
  year: number;
  duration: string;
  rating: number;
  genre: string;
  image: string;
  videoUrl?: string;
  featured?: boolean;
}

/**
 * HomeMovies component — Displays featured and recommended movies, user profile options,
 * and a movie video modal. Fetches movie data from the Pexels API.
 *
 * Cumple con WCAG 2.2 Nivel AA - Criterio 1.4.13 (Contenido en hover o foco)
 *
 * @component
 * @returns {JSX.Element} Rendered HomeMovies component
 */
const HomeMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Estados para WCAG 2.2 - Criterio 1.4.13: Hoverable
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
    fetchUserProfile();
  }, []);

  /**
   * WCAG 2.2 - Criterio 1.4.13: Hoverable y Persistente
   * Control de visibilidad del dropdown basado en hover
   */
  useEffect(() => {
    if (isHoveringMenu || isHoveringDropdown) {
      setShowDropdown(true);
    } else {
      // Pequeño delay para permitir transición suave
      const timer = setTimeout(() => {
        setShowDropdown(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isHoveringMenu, isHoveringDropdown]);

  /**
   * WCAG 2.2 - Criterio 1.4.13: Desestimable
   * Cierre del dropdown al hacer click fuera
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsHoveringMenu(false);
        setIsHoveringDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  /**
   * Keyboard shortcuts y manejo de Escape
   * WCAG 2.2 - Criterio 1.4.13: Desestimable (Escape cierra contenido adicional)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Si estamos en un input o textarea, solo permitir ESC
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Alt+H: Quedarse en Home (o refrescar)
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "h") {
        e.preventDefault();
        window.location.href = "/#/homemovies";
      }

      // Alt+P: Ir al Perfil (solo si está logueado)
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        if (user) {
          window.location.href = "/#/profile";
        }
      }

      // Alt+M: Ir a Películas
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        window.location.href = "/#/movies";
      }

      // Alt+A: Ir a Sobre Nosotros
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        window.location.href = "/#/about";
      }

      // Alt+K: Mostrar/ocultar atajos de teclado
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }

      // ESC: Cerrar modal de video, atajos o dropdown (WCAG 2.2 - Desestimable)
      if (e.key === "Escape") {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (selectedVideo) {
          handleCloseVideo();
        } else if (showDropdown) {
          setShowDropdown(false);
          setIsHoveringMenu(false);
          setIsHoveringDropdown(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShortcuts, selectedVideo, showDropdown, user]);

  /**
   * Fetches movie data from the Pexels API and transforms it into a local Movie format.
   * @async
   * @returns {Promise<void>}
   */
  const fetchMovies = async () => {
    try {
      const PEXELS_API_KEY =
        import.meta.env.VITE_PEXELS_API_KEY ||
        "pjVKkdHUWxAeb3NyKhEXk7j6kP1kv85b67dbekeZaWW2MYoLIuBZuCZN";
      const url = `https://api.pexels.com/videos/search?query=cinema movie&per_page=15`;

      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.videos && data.videos.length > 0) {
        const transformedMovies: Movie[] = data.videos.map(
          (video: PexelsVideo, index: number) => {
            const hdVideo =
              video.video_files.find((file) => file.quality === "hd") ||
              video.video_files[0];
            const durationMinutes = Math.floor(video.duration / 60);

            const genres = [
              "Acción",
              "Drama",
              "Comedia",
              "Terror",
              "Ciencia Ficción",
              "Aventura",
            ];
            const randomGenre =
              genres[Math.floor(Math.random() * genres.length)];

            return {
              id: video.id,
              title: `Película ${index + 1}`,
              description: `Video creado por ${video.user.name}. Una experiencia cinematográfica única.`,
              year: 2024,
              duration: `${durationMinutes} min`,
              rating: parseFloat((4.0 + Math.random() * 1).toFixed(1)),
              genre: randomGenre,
              image: video.video_pictures[0]?.picture || video.image,
              videoUrl: hdVideo?.link || "",
              featured: index === 0,
            };
          }
        );

        setMovies(transformedMovies);
        setFeaturedMovie(transformedMovies[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener películas:", error);
      setLoading(false);
    }
  };

  /**
   * Fetches authenticated user profile from backend.
   * @async
   * @returns {Promise<void>}
   */
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(
          "https://backend-de-peliculas.onrender.com/api/v1/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
   * Handles user logout by clearing authentication token and redirecting to home.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  /**
   * Opens video modal with the selected movie trailer.
   * @param {string} videoUrl - URL of the video to play
   */
  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  /**
   * Closes the open video modal.
   */
  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return <div className="loading">Cargando películas...</div>;
  }

  return (
    <div className="home-movies-container">
      {/* Header */}
      <header className="movies-header">
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
            <div
              className="user-menu"
              ref={dropdownRef}
              onMouseEnter={() => setIsHoveringMenu(true)}
              onMouseLeave={() => setIsHoveringMenu(false)}
            >
              <button
                className="user-button"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-haspopup="true"
                aria-label="Menú de usuario"
                title="Abrir menú de usuario"
              >
                <div className="user-avatar-small">
                  <FaUser />
                </div>
                <span>{user.name || "Usuario"}</span>
              </button>
              {showDropdown && (
                <div
                  className="dropdown-menu"
                  role="menu"
                  aria-label="Opciones de usuario"
                  onMouseEnter={() => setIsHoveringDropdown(true)}
                  onMouseLeave={() => setIsHoveringDropdown(false)}
                >
                  <a
                    href="#/profile"
                    className="dropdown-item"
                    role="menuitem"
                    tabIndex={0}
                  >
                    <FaCog /> Editar Perfil
                  </a>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item"
                    role="menuitem"
                    tabIndex={0}
                  >
                    <FaSignOutAlt /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/" className="login-btn">
                Ingreso
              </a>
              <a href="#/register" className="signup-btn">
                Registro
              </a>
            </>
          )}
        </div>
      </header>

      {/* Featured Movie Hero */}
      {featuredMovie && (
        <section className="hero-banner">
          <div className="hero-overlay"></div>
          <div
            className="hero-background"
            style={{ backgroundImage: `url(${featuredMovie.image})` }}
          ></div>
          <div className="hero-content">
            <span className="featured-badge">⭐ Presentada</span>
            <h1>{featuredMovie.title}</h1>
            <p className="hero-description">{featuredMovie.description}</p>
            <div className="hero-meta">
              <span>{featuredMovie.year}</span>
              <span>•</span>
              <span>{featuredMovie.genre}</span>
              <span>•</span>
              <span>{featuredMovie.duration}</span>
            </div>
            <button
              className="watch-btn"
              onClick={() =>
                featuredMovie.videoUrl &&
                handlePlayVideo(featuredMovie.videoUrl)
              }
              aria-label={`Ver trailer de ${featuredMovie.title}`}
            >
              <FaPlay /> Ver ahora
            </button>
          </div>
        </section>
      )}

      {/* Browse Movies Section */}
      <section className="browse-section">
        <div className="section-header">
          <h2>Buscar películas</h2>
          <a href="/#/movies" className="view-all">
            Ver todos
          </a>
        </div>
        <div className="movies-grid">
          {movies.slice(0, 6).map((movie) => (
            <div key={movie.id} className="movie-card" tabIndex={0}>
              <div className="movie-image">
                <img src={movie.image} alt={movie.title} />
                <div
                  className="movie-overlay"
                  onClick={() =>
                    movie.videoUrl && handlePlayVideo(movie.videoUrl)
                  }
                >
                  <button
                    className="play-button"
                    aria-label={`Reproducir ${movie.title}`}
                    title="Reproducir video"
                  >
                    <FaPlay />
                  </button>
                </div>
                <div className="movie-badges">
                  <span className="genre-badge">{movie.genre}</span>
                  <span className="rating-badge">
                    <FaStar /> {movie.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-description">{movie.description}</p>
                <div className="movie-meta">
                  <span>{movie.year}</span>
                  <span className="duration">
                    <FaClock /> {movie.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action - Solo visible cuando NO está logueado */}
      {!user && (
        <section className="cta-section">
          <h2>¿Listo para mirar?</h2>
          <p>
            Crea una cuenta para comenzar a transmitir miles de películas y
            programas de TV al instante.
          </p>
          <a href="/#/register" className="cta-button">
            Empezar
          </a>
        </section>
      )}

      {/* Footer */}
      <footer className="movies-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <img src="/logo.png" alt="MovieNest" />
            </div>
            <p>
              Tu destino definitivo para transmitir las mejores películas en
              línea.
            </p>
          </div>
          <div className="footer-column">
            <h4>Navegación</h4>
            <ul>
              <li>
                <a href="#/">Home</a>
              </li>
              <li>
                <a href="#/movies">Buscar películas</a>
              </li>
              <li>
                <a href="#/about">Sobre nosotros</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Account</h4>
            <ul>
              <li>
                <a href="#/">Acceso</a>
              </li>
              <li>
                <a href="#/register">Registrarse</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contacto</h4>
            <ul>
              <li>📧 movienestplataforma@gmail.com</li>
              <li>📞 +57 (602) 111-22 33</li>
              <li>
                📍 123 Calle del cine
                <br />
                Los Angeles, CA 90001
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MovieNest. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#/privacy">Política de privacidad</a>
            <span>|</span>
            <a href="#/terms">Términos y condiciones</a>
          </div>
          <div className="footer-links">
            {/* Enlace al PDF en la carpeta docs */}
            <a
              href="/docs/Manual.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-link"
            >
              Manual de Usuario
            </a>
          </div>
        </div>
      </footer>

      {/* Modal de video - WCAG 2.2 AA: Criterio 1.4.13 */}
      {selectedVideo && (
        <div
          className="video-modal"
          onClick={handleCloseVideo}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-title"
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={handleCloseVideo}
              aria-label="Cerrar video"
              title="Cerrar (o presiona Escape)"
            >
              ✕
            </button>
            <h2 id="video-title" className="sr-only">
              Reproductor de video
            </h2>
            <video
              controls
              autoPlay
              src={selectedVideo}
              aria-label="Video de película"
            />
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal - WCAG 2.2 AA Compatible */}
      {showShortcuts && (
        <div
          className="shortcuts-modal"
          onClick={() => setShowShortcuts(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div
            className="shortcuts-content"
            onClick={(e) => e.stopPropagation()}
          >
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
                aria-label="Cerrar"
                title="Cerrar (o presiona Escape)"
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
                    <span className="shortcut-description">
                      Ir a Sobre Nosotros
                    </span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Alt</kbd>
                        <span className="plus">+</span>
                        <kbd>A</kbd>
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
                    <span className="shortcut-description">
                      Cerrar ventana o menú
                    </span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Esc</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">
                      Cambiar entre secciones
                    </span>
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
              Los atajos funcionan tanto en Mac, PC, y Linux. Si estás en
              Windows/Linux usa <kbd>Alt</kbd> en lugar de <kbd>⌘</kbd>. Puedes
              activar/desactivar los atajos desde el botón <FaKeyboard /> en el
              header.
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

export default HomeMovies;
