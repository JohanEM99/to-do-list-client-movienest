import React, { useState, useEffect } from "react";
import "../styles/HomeMovies.scss";
import { FaStar, FaClock, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

const HomeMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
    fetchUserProfile();
  }, []);

  const fetchMovies = async () => {
    try {
      const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || "pjVKkdHUWxAeb3NyKhEXk7j6kP1kv85b67dbekeZaWW2MYoLIuBZuCZN";
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
        const transformedMovies: Movie[] = data.videos.map((video: PexelsVideo, index: number) => {
          const hdVideo = video.video_files.find(file => file.quality === "hd") || video.video_files[0];
          const durationMinutes = Math.floor(video.duration / 60);
          
          const genres = ["Acción", "Drama", "Comedia", "Terror", "Ciencia Ficción", "Aventura"];
          const randomGenre = genres[Math.floor(Math.random() * genres.length)];

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
            featured: index === 0
          };
        });

        setMovies(transformedMovies);
        setFeaturedMovie(transformedMovies[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener películas:", error);
      setLoading(false);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

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
          {user ? (
            <>
              <a href="#/profile" className="profile-btn">
                <img src="editar.png" alt="Profile" className="profile-icon" />
              </a>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/" className="login-btn">Ingreso</a>
              <a href="#/register" className="signup-btn">Registro</a>
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
              onClick={() => featuredMovie.videoUrl && handlePlayVideo(featuredMovie.videoUrl)}
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
          <a href="/#/movies" className="view-all">Ver todos</a>
        </div>
        <div className="movies-grid">
          {movies.slice(0, 6).map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-image">
                <img src={movie.image} alt={movie.title} />
                <div 
                  className="movie-overlay"
                  onClick={() => movie.videoUrl && handlePlayVideo(movie.videoUrl)}
                >
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

      {/* Modal de video */}
      {selectedVideo && (
        <div className="video-modal" onClick={handleCloseVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseVideo}>
              ✕
            </button>
            <video controls autoPlay src={selectedVideo} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeMovies;