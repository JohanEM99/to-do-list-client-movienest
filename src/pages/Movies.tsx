import React, { useState, useEffect } from "react";
import "../styles/Movies.scss";
import { FaStar, FaSearch, FaFilter } from "react-icons/fa";

interface Movie {
  id: number;
  title: string;
  description: string;
  year: number;
  duration: string;
  rating: number;
  genre: string;
  image: string;
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [loading, setLoading] = useState(true);

  const genres = ["Todos", "Acción", "Ciencia Ficción", "Comedia", "Drama", "Horror"];

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchTerm, selectedGenre, movies]);

  const fetchMovies = async () => {
    // Mock data - puedes reemplazar con API de Pexels
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: "La última batalla",
        description: "Un thriller de acción épico sobre un sheriff que defiende su ciudad de un peligroso...",
        year: 2023,
        duration: "125 min",
        rating: 4.5,
        genre: "Acción",
        image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: 2,
        title: "Viaje Cósmico",
        description: "Un relato alucinante que viaja a través del espacio y el tiempo.",
        year: 2024,
        duration: "140 min",
        rating: 4.7,
        genre: "Ciencia ficción",
        image: "https://images.pexels.com/photos/12498606/pexels-photo-12498606.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: 3,
        title: "¡Ríete a carcajadas!",
        description: "Una comedia divertidísima que te hará reír de principio a fin.",
        year: 2024,
        duration: "98 min",
        rating: 4.2,
        genre: "Comedia",
        image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: 4,
        title: "Cuerdas del corazón",
        description: "Un drama emotivo sobre el amor, la pérdida y la redención.",
        year: 2024,
        duration: "132 min",
        rating: 4.6,
        genre: "Drama",
        image: "https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: 5,
        title: "El inquietante",
        description: "Una película de terror aterradora que te mantendrá al borde de tu asiento.",
        year: 2023,
        duration: "105 min",
        rating: 4.4,
        genre: "Horror",
        image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        id: 6,
        title: "Cine Paraíso",
        description: "Un bello homenaje a la época dorada del cine.",
        year: 2024,
        duration: "118 min",
        rating: 4.8,
        genre: "Drama",
        image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ];

    setMovies(mockMovies);
    setFilteredMovies(mockMovies);
    setLoading(false);
  };

  const filterMovies = () => {
    let filtered = movies;

    if (selectedGenre !== "All") {
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
  };

  if (loading) {
    return <div className="loading">Cargando películas...</div>;
  }

  return (
    <div className="movies-container">
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
          <a href="#/" className="login-btn">Ingreso</a>
          <a href="#/register" className="signup-btn">Registro</a>
        </div>
      </header>

      <div className="movies-content">
        <div className="movies-hero">
          <h1>Buscar películas</h1>
          <p>Explora nuestra colección de películas increíbles</p>
        </div>

        <div className="search-filter-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar películas por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button className="filter-toggle">
              <FaFilter /> Genre
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                className={`genre-btn ${selectedGenre === genre ? "active" : ""}`}
                onClick={() => handleGenreClick(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-image">
                <img src={movie.image} alt={movie.title} />
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
                  <span>{movie.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="no-results">
            <p>No se encontraron películas que coincidan con tus criterios.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;