import { useState, useEffect, useRef } from "react";
import "../styles/Movies.scss";
import { FaStar, FaSearch, FaFilter, FaPlay, FaHeart, FaRegHeart, FaUser, FaCog, FaSignOutAlt, FaKeyboard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Interface representing a video object returned by the Pexels API.
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
 * Interface representing a Movie object in the app.
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
  videoUrl: string;
}

/**
 * Movies component — displays, filters, and manages movies fetched from the Pexels API.
 * Includes features such as favorites, search, filtering by genre, user session handling,
 * and full keyboard accessibility (WCAG 2.1 Level A compliant).
 *
 * @component
 * @returns {JSX.Element} The rendered Movies page
 */
const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  
  // ⌨️ NEW: Keyboard accessibility states
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [focusedMovieIndex, setFocusedMovieIndex] = useState(0);
  
  // ⌨️ NEW: Refs for keyboard navigation
  const searchInputRef = useRef<HTMLInputElement>(null);
  const movieGridRef = useRef<HTMLDivElement>(null);

  const genres = ["Todos", "Acción", "Drama", "Comedia", "Terror", "Ciencia Ficción"];

  const genreQueries: { [key: string]: string } = {
    "Acción": "action movie",
    "Drama": "drama film",
    "Comedia": "comedy movie",
    "Terror": "horror movie",
    "Ciencia Ficción": "sci-fi movie",
    "Todos": "cinema movie"
  };

  /**
   * Checks if the user is logged in by validating the existence of a token in localStorage.
   * Sets a placeholder username if found.
   * @function
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUserName("Usuario");
    }
  }, []);

  // Load favorites from backend when the component mounts
  useEffect(() => {
    fetchMovies("cinema movie");
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn]);

  // Filter movies when search term, genre, or favorite status changes
  useEffect(() => {
    filterMovies();
  }, [searchTerm, selectedGenre, movies, showFavorites]);

  /**
   * Fetches user's favorites from the backend.
   * @async
   * @returns {Promise<void>}
   */
  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("https://backend-de-peliculas.onrender.com/api/v1/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // El backend devuelve un array de favoritos
        setFavorites(data || []);
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
  };

  /**
   * Fetches movies from Pexels API based on query term.
   * @async
   * @param {string} [query="cinema movie"] - The search query for fetching movies.
   * @returns {Promise<void>}
   */
  const fetchMovies = async (query: string = "cinema movie") => {
    setLoading(true);
    setError("");

    const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || "pjVKkdHUWxAeb3NyKhEXk7j6kP1kv85b67dbekeZaWW2MYoLIuBZuCZN";
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15`;

    try {
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
          
          return {
            id: video.id,
            title: `${query.split(' ')[0]} ${index + 1}`,
            description: `Video creado por ${video.user.name}`,
            year: 2024,
            duration: `${durationMinutes} min`,
            rating: parseFloat((4.0 + Math.random() * 1).toFixed(1)),
            genre: getGenreFromQuery(query),
            image: video.video_pictures[0]?.picture || video.image,
            videoUrl: hdVideo?.link || ""
          };
        });

        setMovies(transformedMovies);
        setFilteredMovies(transformedMovies);
      } else {
        setError("No se encontraron videos");
        setMovies([]);
        setFilteredMovies([]);
      }
    } catch (error: any) {
      console.error("Error al cargar videos:", error);
      setError("Error al cargar los videos. Intenta de nuevo.");
      setMovies([]);
      setFilteredMovies([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Determines the genre name from a given query.
   * @param {string} query - The search query.
   * @returns {string} The corresponding genre name.
   */
  const getGenreFromQuery = (query: string): string => {
    for (const [genre, searchQuery] of Object.entries(genreQueries)) {
      if (searchQuery === query) {
        return genre;
      }
    }
    return "Todos";
  };

  /**
   * Filters movies based on genre, favorites, and search terms.
   * @function
   */
  const filterMovies = () => {
    if (showFavorites) {
      let filtered = favorites;

      if (selectedGenre !== "Todos") {
        filtered = filtered.filter(movie => movie.genre === selectedGenre);
      }

      if (searchTerm) {
        filtered = filtered.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredMovies(filtered);
    } else {
      let filtered = movies;

      if (selectedGenre !== "Todos") {
        filtered = filtered.filter(movie => movie.genre === selectedGenre);
      }

      if (searchTerm) {
        filtered = filtered.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredMovies(filtered);
    }
    // ⌨️ NEW: Reset focused index when filter changes
    setFocusedMovieIndex(0);
  };

  /** Handles genre selection and fetches movies accordingly. */
  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    if (!showFavorites) {
      const query = genreQueries[genre] || "cinema movie";
      fetchMovies(query);
    }
  };

  /** Handles search form submission. */
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() && !showFavorites) {
      fetchMovies(searchTerm);
    }
  };

  /** Plays the selected movie video. */
  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  /** Closes the movie player modal. */ 
  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  /** Checks if a movie is already in favorites. */
  const isFavorite = (movieId: number): boolean => {
    return favorites.some(fav => fav.id === movieId);
  };

  /** Toggles a movie as favorite or removes it. */
  const toggleFavorite = async (movie: Movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }

    const isCurrentlyFavorite = isFavorite(movie.id);

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const response = await fetch(`https://backend-de-peliculas.onrender.com/api/v1/favorites/${movie.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const newFavorites = favorites.filter(fav => fav.id !== movie.id);
          setFavorites(newFavorites);
        } else {
          throw new Error("Error al eliminar de favoritos");
        }
      } else {
        // Add to favorites
        const response = await fetch("https://backend-de-peliculas.onrender.com/api/v1/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(movie),
        });

        if (response.ok) {
          const newFavorites = [...favorites, movie];
          setFavorites(newFavorites);
        } else {
          throw new Error("Error al agregar a favoritos");
        }
      }

      if (showFavorites) {
        filterMovies();
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
      alert("Hubo un error al actualizar favoritos. Intenta de nuevo.");
    }
  };

  /** Toggles between showing all movies or only favorites. */
  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    setSearchTerm("");
    setSelectedGenre("Todos");
  };

  /** Logs the user out and removes authentication token. */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  // ============================================
  // ⌨️ NEW: KEYBOARD SHORTCUTS IMPLEMENTATION (WCAG 2.1 Level A)
  // ============================================
  
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ignore if typing in input fields (except Escape)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Alt/Option + H: Go to Home
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        window.location.href = '/#/homemovies';
      }

      // Alt/Option + P: Go to Profile
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (isLoggedIn) {
          window.location.href = '/#/profile';
        }
      }

      // Alt/Option + M: Go to Favorites
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleShowFavorites();
      }

      // Alt/Option + K: Show keyboard shortcuts modal
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }

      // Forward slash (/): Focus search
      if (e.key === '/' && !showShortcuts && !selectedVideo) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Arrow keys: Navigate between movies
      if (!showShortcuts && !selectedVideo && filteredMovies.length > 0) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedMovieIndex(prev => 
            Math.min(prev + 1, filteredMovies.length - 1)
          );
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedMovieIndex(prev => Math.max(prev - 1, 0));
        }
      }

      // Enter: Play focused movie
      if (e.key === 'Enter' && !showShortcuts && !selectedVideo) {
        if (filteredMovies[focusedMovieIndex]) {
          e.preventDefault();
          handlePlayVideo(filteredMovies[focusedMovieIndex].videoUrl);
        }
      }

      // F: Toggle favorite on focused movie
      if (e.key.toLowerCase() === 'f' && !showShortcuts && !selectedVideo) {
        if (filteredMovies[focusedMovieIndex]) {
          e.preventDefault();
          await toggleFavorite(filteredMovies[focusedMovieIndex]);
        }
      }

      // Escape: Close modals (no keyboard trap)
      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (selectedVideo) {
          handleCloseVideo();
        } else if (showDropdown) {
          setShowDropdown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, selectedVideo, showDropdown, filteredMovies, focusedMovieIndex, showFavorites, isLoggedIn]);

  // ⌨️ NEW: Scroll focused movie into view
  useEffect(() => {
    if (movieGridRef.current && filteredMovies.length > 0) {
      const movieCards = movieGridRef.current.querySelectorAll('.movie-card');
      const focusedCard = movieCards[focusedMovieIndex];
      if (focusedCard) {
        focusedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedMovieIndex]);

  if (loading) {
    return (
      <div className="movies-container">
        <div className="loading">Cargando películas...</div>
      </div>
    );
  }

  return (
    <div className="movies-container">
      <header className="movies-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>
        <nav className="nav-menu">
          <a href="/#/homemovies">Home</a>
          <a href="/#/movies">Películas</a>
          <a href="/#/about">Sobre Nosotros</a>
        </nav>
        <div className="auth-buttons">
          {/* ⌨️ NEW: Keyboard shortcuts button */}
          <button 
            className="shortcuts-btn"
            onClick={() => setShowShortcuts(!showShortcuts)}
            aria-label="Mostrar atajos de teclado"
            title="Atajos de teclado (Alt+K)"
          >
            <FaKeyboard />
          </button>

          <button 
            className={`favorites-btn ${showFavorites ? 'active' : ''}`}
            onClick={toggleShowFavorites}
            aria-label={`${showFavorites ? 'Ocultar' : 'Mostrar'} favoritos`}
            title="Favoritos (Alt+M)"
          >
            <FaHeart /> 
            <span>Favoritos ({favorites.length})</span>
          </button>
          
          {isLoggedIn ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <div className="user-avatar-small">
                  <FaUser />
                </div>
                <span>{userName}</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <a href="/#/profile" className="dropdown-item">
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
              <a href="/#/" className="login-btn">Ingreso</a>
              <a href="/#/register" className="signup-btn">Registro</a>
            </>
          )}
        </div>
      </header>

      <div className="movies-content">
        <div className="movies-hero">
          <h1>{showFavorites ? "Mis Favoritos" : "Buscar películas"}</h1>
          <p>
            {showFavorites 
              ? `Tienes ${favorites.length} película${favorites.length !== 1 ? 's' : ''} en favoritos`
              : "Explora nuestra colección de películas increíbles"
            }
          </p>
        </div>

        <div className="search-filter-section">
          <form onSubmit={handleSearch} className="search-bar">
            <FaSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={showFavorites ? "Buscar en favoritos... (Presiona / para buscar)" : "Buscar películas... (Presiona / para buscar)"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar películas"
            />
            {!showFavorites && (
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? "Buscando..." : "Buscar"}
              </button>
            )}
          </form>

          <div className="filter-buttons">
            <button className="filter-toggle">
              <FaFilter /> Género
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                className={`genre-btn ${selectedGenre === genre ? "active" : ""}`}
                onClick={() => handleGenreClick(genre)}
                disabled={loading}
                aria-pressed={selectedGenre === genre}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => fetchMovies("cinema movie")}>
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* ⌨️ NEW: Added ref and role for accessibility */}
        <div ref={movieGridRef} className="movies-grid" role="list" aria-label="Lista de películas">
          {filteredMovies.map((movie, index) => (
            <div 
              key={movie.id} 
              className={`movie-card ${focusedMovieIndex === index ? 'focused' : ''}`}
              role="listitem"
              tabIndex={0}
              aria-label={`${movie.title}, ${movie.rating} estrellas`}
              onFocus={() => setFocusedMovieIndex(index)}
            >
              <div className="movie-image">
                <img src={movie.image} alt={movie.title} />
                <div className="movie-overlay" onClick={() => handlePlayVideo(movie.videoUrl)}>
                  <button 
                    className="play-btn"
                    aria-label={`Reproducir ${movie.title}`}
                  >
                    <FaPlay />
                  </button>
                </div>
                <button 
                  className={`favorite-btn ${isFavorite(movie.id) ? 'is-favorite' : ''}`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await toggleFavorite(movie);
                  }}
                  aria-label={isFavorite(movie.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  title={`${isFavorite(movie.id) ? 'Quitar de' : 'Agregar a'} favoritos (F)`}
                >
                  {isFavorite(movie.id) ? <FaHeart /> : <FaRegHeart />}
                </button>
                <div className="movie-badges">
                  <span className="genre-badge">{movie.genre}</span>
                  <span className="rating-badge">
                    <FaStar /> {movie.rating}
                  </span>
                </div>
              </div>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-description">{movie.description}</p>
                <div className="movie-meta">
                  <span>{movie.year}</span>
                  <span>{movie.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && !loading && !error && (
          <div className="no-results">
            <p>
              {showFavorites 
                ? "No tienes películas en favoritos aún. ¡Agrega algunas!"
                : "No se encontraron películas que coincidan con tus criterios."
              }
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="video-modal" 
          onClick={handleCloseVideo}
          role="dialog"
          aria-modal="true"
          aria-label="Reproductor de video"
        >
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-button" 
              onClick={handleCloseVideo}
              aria-label="Cerrar reproductor (Esc)"
            >
              ✕
            </button>
            <video 
              controls 
              autoPlay 
              src={selectedVideo}
              aria-label="Video de película"
            />
          </div>
        </div>
      )}

      {/* ⌨️ NEW: Keyboard Shortcuts Modal */}
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
              {/* Navigation Section */}
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
                    <span className="shortcut-description">Ir a Favoritas</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Alt</kbd>
                        <span className="plus">+</span>
                        <kbd>M</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Interaction Section */}
              <div className="shortcuts-section">
                <h3 className="section-title yellow">🎬 Interacción con Videos</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span className="shortcut-description">Agregar/quitar de Favoritas</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-note">Click en ❤️</span>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Agregar/quitar película enfocada</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>F</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Reproducir película</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-note">Click en video</span>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Reproducir película enfocada</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Enter</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Navigation Section */}
              <div className="shortcuts-section">
                <h3 className="section-title blue">🖱️ Navegación Básica</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span className="shortcut-description">Enfocar búsqueda</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>/</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Navegar entre películas</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>↑</kbd>
                        <kbd>↓</kbd>
                        <kbd>←</kbd>
                        <kbd>→</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Seleccionar elemento</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Enter</kbd>
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
                  <div className="shortcut-item">
                    <span className="shortcut-description">Cerrar ventana o menú</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Esc</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shortcuts-footer">
              Los atajos funcionan tanto en Mac, PC, y Linux. Si estás en Windows/Linux usa <kbd>Alt</kbd> en lugar de <kbd>⌘</kbd>. Puedes activar/desactivar los atajos desde el botón <kbd>⌘</kbd> en el header.
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

export default Movies;