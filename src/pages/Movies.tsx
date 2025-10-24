import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Movies.scss";
import { FaStar, FaSearch, FaFilter, FaPlay } from "react-icons/fa";

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
  videoUrl: string;
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const genres = ["Todos", "Acción", "Drama", "Comedia", "Terror", "Ciencia Ficción"];

  // Mapeo de géneros a queries de búsqueda en Pexels
  const genreQueries: { [key: string]: string } = {
    "Acción": "action movie",
    "Drama": "drama film",
    "Comedia": "comedy movie",
    "Terror": "horror movie",
    "Ciencia Ficción": "sci-fi movie",
    "Todos": "cinema movie"
  };

  useEffect(() => {
    fetchMovies("cinema movie");
    fetchUserProfile();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchTerm, selectedGenre, movies]);

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
          // Obtener video de calidad HD o el primero disponible
          const hdVideo = video.video_files.find(file => file.quality === "hd") || video.video_files[0];
          
          // Convertir duración de segundos a minutos
          const durationMinutes = Math.floor(video.duration / 60);
          
          return {
            id: video.id,
            title: `${query.split(' ')[0]} ${index + 1}`, // Título basado en la búsqueda
            description: `Video creado por ${video.user.name}`,
            year: 2024,
            duration: `${durationMinutes} min`,
            rating: (4.0 + Math.random() * 1).toFixed(1) as any,
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

  const getGenreFromQuery = (query: string): string => {
    for (const [genre, searchQuery] of Object.entries(genreQueries)) {
      if (searchQuery === query) {
        return genre;
      }
    }
    return "Todos";
  };

  const filterMovies = () => {
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
  };

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    const query = genreQueries[genre] || "cinema movie";
    fetchMovies(query);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchMovies(searchTerm);
    }
  };

  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

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
          {user ? (
            <>
              {/* Mostrar el logo del perfil */}
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

      <div className="movies-content">
        <div className="movies-hero">
          <h1>Buscar películas</h1>
          <p>Explora nuestra colección de películas increíbles</p>
        </div>

        <div className="search-filter-section">
          <form onSubmit={handleSearch} className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar películas por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </button>
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

        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-image">
                <img src={movie.image} alt={movie.title} />
                <div className="movie-overlay" onClick={() => handlePlayVideo(movie.videoUrl)}>
                  <button className="play-btn">
                    <FaPlay />
                  </button>
                </div>
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
            <p>No se encontraron películas que coincidan con tus criterios.</p>
          </div>
        )}
      </div>

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

export default Movies;