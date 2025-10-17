import React, { useState, useEffect } from "react";
import "../styles/HomeMovies.scss";
import { FaStar, FaClock, FaPlay } from "react-icons/fa";

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

  const PEXELS_API_KEY = "YOUR_PEXELS_API_KEY"; // Reemplaza con tu API key

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Fetch videos from Pexels API
      const response = await fetch(
        "https://api.pexels.com/videos/search?query=movie&per_page=15",
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      const data = await response.json();

      // Transform Pexels videos to movie format
      const transformedMovies: Movie[] = data.videos.map((video: any, index: number) => ({
        id: video.id,
        title: movieTitles[index] || `Movie ${index + 1}`,
        description: movieDescriptions[index] || "An epic tale of adventure and discovery.",
        year: 2023 + (index % 2),
        duration: `${90 + Math.floor(Math.random() * 60)} min`,
        rating: 4.0 + Math.random() * 1,
        genre: genres[index % genres.length],
        image: video.image,
        video: video.video_files[0]?.link,
        featured: index === 0,
      }));

      setMovies(transformedMovies);
      setFeaturedMovie(transformedMovies[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      // Fallback to mock data
      setMovies(mockMovies);
      setFeaturedMovie(mockMovies[0]);
      setLoading(false);
    }
  };

  const movieTitles = [
    "The Last Stand",
    "Cosmic Journey",
    "Lights Out Lives!",
    "Heart Strings",
    "The Haunting",
    "Cinema Paradiso",
  ];

  const movieDescriptions = [
    "An epic action thriller about a sheriff defending his town from a dangerous cartel.",
    "A mind-bending tale as it journeys through space and time.",
    "A timeless concert that will keep you entertained for life!",
    "An emotional drama about love, loss, and redemption.",
    "A terrifying sequel that will keep you on the edge of your seat.",
    "A beautiful tribute to the golden age of cinema.",
  ];

  const genres = ["Drama", "Sci-fi", "Comedy", "Drama", "Horror", "Drama"];

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
    {
      id: 2,
      title: "Cosmic Journey",
      description: "A mind-bending tale as it journeys through space and time.",
      year: 2024,
      duration: "140 min",
      rating: 4.7,
      genre: "Sci-fi",
      image: "https://images.pexels.com/photos/12498606/pexels-photo-12498606.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 3,
      title: "Lights Out Lives!",
      description: "A timeless concert that will keep you entertained for life!",
      year: 2024,
      duration: "98 min",
      rating: 4.3,
      genre: "Comedy",
      image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 4,
      title: "Heart Strings",
      description: "An emotional drama about love, loss, and redemption.",
      year: 2024,
      duration: "132 min",
      rating: 4.6,
      genre: "Drama",
      image: "https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 5,
      title: "The Haunting",
      description: "A terrifying sequel that will keep you on the edge of your seat.",
      year: 2023,
      duration: "105 min",
      rating: 4.4,
      genre: "Horror",
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 6,
      title: "Cinema Paradiso",
      description: "A beautiful tribute to the golden age of cinema.",
      year: 2024,
      duration: "118 min",
      rating: 4.8,
      genre: "Drama",
      image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

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
          <a href="/#/">Home</a>
          <a href="/#/movies">Movies</a>
          <a href="/#/about">About Us</a>
        </nav>
        <div className="auth-buttons">
          <a href="/#/" className="login-btn">Login</a>
          <a href="/#/register" className="signup-btn">Sign Up</a>
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
        <h2>Ready to Watch?</h2>
        <p>Create an account to start streaming thousands of movies and TV shows instantly.</p>
        <a href="/#/register" className="cta-button">Get Started</a>
      </section>

      {/* Footer */}
      <footer className="movies-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <img src="/logo.png" alt="MovieNest" />
            </div>
            <p>Your ultimate destination for streaming the best movies online.</p>
          </div>
          <div className="footer-column">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/#/">Home</a></li>
              <li><a href="/#/movies">Browse Movies</a></li>
              <li><a href="/#/about">About Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Account</h4>
            <ul>
              <li><a href="/#/">Login</a></li>
              <li><a href="/#/register">Sign Up</a></li>
              <li><a href="/#/profile">My Profile</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>📧 info@movienest.com</li>
              <li>📞 +1 (234) 567-890</li>
              <li>📍 123 Movie Street<br />Los Angeles, CA 90001</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MovieNest. All rights reserved.</p>
          <div className="footer-links">
            <a href="/#/privacy">Privacy Policy</a>
            <span>|</span>
            <a href="/#/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeMovies;