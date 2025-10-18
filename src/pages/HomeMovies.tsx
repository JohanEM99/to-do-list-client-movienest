import React, { useState, useEffect } from "react";
import "../styles/HomeMovies.scss";
import { FaStar, FaClock, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  description: string;
  year: number;
  duration: string;
  rating: number;
  genre: string;
  image: string;
  video?: string;
  featured?: boolean;
}

const HomeMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
    fetchUserProfile();
  }, []);

  const fetchMovies = async () => {
    try {
      // Simulación de carga de películas
      const mockMovies: Movie[] = [
        {
          id: 1,
          title: "The Last Stand",
          description: "An epic action thriller about a sheriff defending his town from a dangerous cartel.",
          year: 2023,
          duration: "125 min",
          rating: 4.5,
          genre: "Drama",
          image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800",
          featured: true,
        },
        // Agrega más películas si es necesario
      ];

      setMovies(mockMovies);
      setFeaturedMovie(mockMovies[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://localhost:8080/api/v1/user/profile", {
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
        console.error("Error fetching user profile:", error);
      }
    }
  };

  const handleLogout = () => {
    // Eliminar el token del localStorage y redirigir a la página de login
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
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
          <a href="#/movies">Movies</a>
          <a href="#/about">About Us</a>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <>
              {/* Mostrar el logo del perfil */}
              <a href="#/profile" className="profile-btn">
                <img src="/path-to-your-profile-icon.png" alt="Profile" className="profile-icon" />
              </a>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/" className="login-btn">Login</a>
              <a href="#/register" className="signup-btn">Sign Up</a>
              <a href="#/profile" className="profile-btn">Mi perfil</a>
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
            <span className="featured-badge">⭐ Featured</span>
            <h1>{featuredMovie.title}</h1>
            <p className="hero-description">{featuredMovie.description}</p>
            <div className="hero-meta">
              <span>{featuredMovie.year}</span>
              <span>•</span>
              <span>{featuredMovie.genre}</span>
              <span>•</span>
              <span>{featuredMovie.duration}</span>
            </div>
            <button className="watch-btn">
              <FaPlay /> Watch Now
            </button>
          </div>
        </section>
      )}

      {/* Browse Movies Section */}
      <section className="browse-section">
        <div className="section-header">
          <h2>Browse Movies</h2>
          <a href="/#/movies" className="view-all">View All</a>
        </div>
        <div className="movies-grid">
          {movies.slice(0, 6).map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-image">
                <img src={movie.image} alt={movie.title} />
                <div className="movie-overlay">
                  <button className="play-button">
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

      {/* Call to Action */}
      <section className="cta-section">
        <h2>¿Listo para mirar?</h2>
        <p>Crea una cuenta para comenzar a transmitir miles de películas y programas de TV al instante.</p>
        <a href="/#/register" className="cta-button">Empezar</a>
      </section>

      {/* Footer */}
      <footer className="movies-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <img src="/logo.png" alt="MovieNest" />
            </div>
            <p>Tu destino definitivo para transmitir las mejores películas en línea.</p>
          </div>
          <div className="footer-column">
            <h4>Navegación</h4>
            <ul>
              <li><a href="#/">Home</a></li>
              <li><a href="#/movies">Buscar películas</a></li>
              <li><a href="#/about">Sobre nosotros</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Account</h4>
            <ul>
              <li><a href="#/">Acceso</a></li>
              <li><a href="#/register">Registrarse</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contacto</h4>
            <ul>
              <li>📧 movienestplataforma@gmail.com</li>
              <li>📞 +57 (602) 111-22 33</li>
              <li>📍 123 Calle del cine<br />Los Angeles, CA 90001</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MovieNest. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#/privacy"> </a>
            <span>|</span>
            <a href="#/terms"> </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeMovies;
