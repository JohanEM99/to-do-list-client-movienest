import { useState, useEffect, useRef } from "react";
import "../styles/Movies.scss";
import { FaStar, FaSearch, FaFilter, FaPlay, FaHeart, FaRegHeart, FaUser, FaCog, FaSignOutAlt, FaKeyboard, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
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
 * Interface representing a Movie object in the app with subtitles support.
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
  // 🎬 Campo para subtítulos
  subtitles?: Array<{
    language: string;
    label: string;
    url: string;
  }>;
}

/**
 * Interface representing a user review
 * @interface
 */
interface Review {
  id: string;
  movieId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  hasRating: boolean;
}

/**
 * Interface representing a user's rating for a movie
 * @interface
 */
interface UserMovieRating {
  movieId: number;
  userId: string;
  rating: number;
  date: string;
}

/**
 * Movies component with subtitles support, reviews, ratings and keyboard accessibility.
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
  const [selectedVideoSubtitles, setSelectedVideoSubtitles] = useState<Movie['subtitles']>(); // 🎬 NUEVO
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  
  // Review and rating states
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews] = useState<Review[]>([]);
  const [movieReviews, setMovieReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [userMovieRatings, setUserMovieRatings] = useState<UserMovieRating[]>([]);
  const [hasRatedThisMovie, setHasRatedThisMovie] = useState(false);
  const [movieAverageRatings, setMovieAverageRatings] = useState<{[key: number]: number}>({}); // 🆕 Cache de ratings
  
  // Keyboard accessibility states
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [focusedMovieIndex, setFocusedMovieIndex] = useState(0);
  
  // Refs for keyboard navigation
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile();
    }
    // ⚠️ ELIMINADO: Ya no cargamos reviews desde localStorage
    // const savedReviews = localStorage.getItem("movieReviews");
    // if (savedReviews) {
    //   setReviews(JSON.parse(savedReviews));
    // }
    
    const savedRatings = localStorage.getItem("userMovieRatings");
    if (savedRatings) {
      setUserMovieRatings(JSON.parse(savedRatings));
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "https://backend-de-peliculas.onrender.com/api/v1/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        const username = user.username || user.firstName || user.email || "Usuario";
        setUserName(username);
      } else {
        console.error("Error en la respuesta del backend:", response.status);
        setUserName("Usuario");
      }
    } catch (error) {
      console.error("Error al cargar perfil de usuario:", error);
      setUserName("Usuario");
    }
  };

  useEffect(() => {
    fetchMovies("cinema movie");
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && !userName) {
      fetchUserProfile();
    }
  }, [isLoggedIn, userName]);

  useEffect(() => {
    filterMovies();
  }, [searchTerm, selectedGenre, movies, showFavorites]);

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
        setFavorites(data || []);
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
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
          const hdVideo = video.video_files.find(file => file.quality === "hd") || video.video_files[0];
          const durationMinutes = Math.floor(video.duration / 60);
          
          // 🎬 Agregar subtítulos solo al primer video como ejemplo
          const subtitles = index === 0 ? [
            {
              language: "es",
              label: "Español",
              // ⚠️ IMPORTANTE: Reemplaza esta URL con la URL de tu archivo .vtt en Cloudinary
              url: "https://res.cloudinary.com/dvqhhcmrs/raw/upload/v1761885200/subtitles/dialog-es.vtt"
            }
            // Puedes agregar más idiomas:
            // {
            //   language: "en",
            //   label: "English",
            //   url: "https://res.cloudinary.com/dvqhhcmrs/raw/upload/v1761885200/subtitles/dialog-en.vtt"
            // }
          ] : undefined;
          
          return {
            id: video.id,
            title: `${query.split(' ')[0]} ${index + 1}`,
            description: `Video creado por ${video.user.name}`,
            year: 2024,
            duration: `${durationMinutes} min`,
            rating: parseFloat((4.0 + Math.random() * 1).toFixed(1)),
            genre: getGenreFromQuery(query),
            image: video.video_pictures[0]?.picture || video.image,
            videoUrl: hdVideo?.link || "",
            subtitles: subtitles // 🎬 Agregar subtítulos
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
    setFocusedMovieIndex(0);
  };

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    if (!showFavorites) {
      const query = genreQueries[genre] || "cinema movie";
      fetchMovies(query);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() && !showFavorites) {
      fetchMovies(searchTerm);
    }
  };

  // 🎬 Actualizado para incluir subtítulos
  const handlePlayVideo = (videoUrl: string, subtitles?: Movie['subtitles']) => {
    setSelectedVideo(videoUrl);
    setSelectedVideoSubtitles(subtitles);
  };

  // 🎬 Actualizado para limpiar subtítulos
  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setSelectedVideoSubtitles(undefined);
  };

  /**
   * Fetches reviews for a specific movie from the backend.
   * @async
   * @param {number} pexelsId - The Pexels ID of the movie
   * @returns {Promise<void>}
   */
  const fetchMovieReviews = async (pexelsId: number) => {
    try {
      const response = await fetch(
        `https://backend-de-peliculas.onrender.com/api/v1/reviews/${pexelsId}`
      );

      if (response.ok) {
        const data = await response.json();
        setMovieReviews(data || []);
      } else {
        console.error("Error al cargar reseñas:", response.status);
        setMovieReviews([]);
      }
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
      setMovieReviews([]);
    }
  };

  /**
   * Fetches average rating for a specific movie from the backend.
   * @async
   * @param {number} pexelsId - The Pexels ID of the movie
   * @returns {Promise<number>} The average rating
   */
  const fetchAverageRating = async (pexelsId: number): Promise<number> => {
    try {
      const response = await fetch(
        `https://backend-de-peliculas.onrender.com/api/v1/reviews/average/${pexelsId}`
      );

      if (response.ok) {
        const data = await response.json();
        // Asume que el backend devuelve { average: 4.5 } o similar
        return data.average || data.averageRating || 0;
      } else {
        console.error("Error al cargar promedio:", response.status);
        return 0;
      }
    } catch (error) {
      console.error("Error al cargar promedio:", error);
      return 0;
    }
  };

  // Carga ratings en lote con límite de concurrencia para evitar peticiones masivas
  const loadAverageRatings = async (ids: number[]) => {
    if (!ids || ids.length === 0) return;

    const concurrency = 3; // número de peticiones simultáneas permitidas
    let index = 0;

    const worker = async () => {
      while (index < ids.length) {
        const id = ids[index++];
        try {
          const rating = await fetchAverageRating(id);
          setMovieAverageRatings(prev => ({ ...prev, [id]: rating }));
        } catch (err) {
          console.error(`Error al cargar promedio para ${id}:`, err);
        }
      }
    };

    // lanzar N workers en paralelo (pool)
    const workers = Array.from({ length: Math.min(concurrency, ids.length) }, () => worker());
    await Promise.all(workers);
  };

  // useEffect para cargar ratings faltantes cuando cambian las películas filtradas
  useEffect(() => {
    const idsToLoad = filteredMovies
      .map(m => m.id)
      .filter(id => movieAverageRatings[id] === undefined || movieAverageRatings[id] === 0);

    if (idsToLoad.length > 0) {
      // no bloquear el render: lanzar en background
      loadAverageRatings(idsToLoad).catch(err => console.error('Error cargando ratings en lote:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredMovies]);

  const handleOpenMovieDetail = async (movie: Movie) => {
    setSelectedMovie(movie);
    setShowMovieDetail(true);
    setEditingReviewId(null);
  
    // ✅ Cargar reseñas y promedio desde backend
    await fetchMovieReviews(movie.id); // 👈 Carga las reseñas desde el backend
    const newAvg = await fetchAverageRating(movie.id);
    setMovieAverageRatings(prev => ({ ...prev, [movie.id]: newAvg }));

    const existingRating = userMovieRatings.find(
    r => r.movieId === movie.id && r.userId === userName
  );
  
    if (existingRating) {
      setUserRating(existingRating.rating);
      setHasRatedThisMovie(true);
    } else {
      setUserRating(0);
      setHasRatedThisMovie(false);
    }

    setReviewText("");
};


  const handleCloseMovieDetail = () => {
    setShowMovieDetail(false);
    setSelectedMovie(null);
    setUserRating(0);
    setHoverRating(0);
    setReviewText("");
    setEditingReviewId(null);
    setHasRatedThisMovie(false);
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para dejar una reseña");
      return;
    }

    if (!userName || userName === "Usuario") {
      alert("Cargando información del usuario, por favor espera un momento...");
      fetchUserProfile();
      return;
    }

    if (!selectedMovie) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontró token de autenticación");
      return;
    }

    if (hasRatedThisMovie) {
      if (!reviewText.trim()) {
        alert("Por favor escribe un comentario");
        return;
      }
    } else {
      if (!reviewText.trim() && userRating === 0) {
        alert("Por favor escribe un comentario o selecciona una calificación");
        return;
      }
    }

    try {
      if (editingReviewId) {
        // 🔄 NUEVO: Actualizar review en el backend (PUT)
       const response = await fetch(
              `https://backend-de-peliculas.onrender.com/api/v1/reviews/${selectedMovie.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  comment: reviewText,
                  rating: userRating,
                }),
              }
            );


        if (!response.ok) {
          throw new Error("Error al actualizar la reseña");
        }

        // Recargar reviews
        await fetchMovieReviews(selectedMovie.id);
        
        setReviewText("");
        setEditingReviewId(null);
        
        alert("¡Comentario actualizado con éxito!");
        return;
      }

      // 🔄 NUEVO: Crear nueva review en el backend (POST)
      const isSubmittingNewRating = userRating > 0 && !hasRatedThisMovie;

      const reviewData = {
        pexelsId: selectedMovie.id,
        userName,
        rating: isSubmittingNewRating ? userRating : 0,
        comment: reviewText,
      };


      const response = await fetch(
        "https://backend-de-peliculas.onrender.com/api/v1/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al enviar la reseña");
      }

      // Actualizar ratings locales si es una nueva calificación
      if (isSubmittingNewRating) {
        const newRating: UserMovieRating = {
          movieId: selectedMovie.id,
          userId: userName,
          rating: userRating,
          date: new Date().toLocaleDateString('es-ES')
        };

        const updatedRatings = [...userMovieRatings, newRating];
        setUserMovieRatings(updatedRatings);
        localStorage.setItem("userMovieRatings", JSON.stringify(updatedRatings));
        setHasRatedThisMovie(true);
      }

      // Recargar reviews desde el backend
      await fetchMovieReviews(selectedMovie.id);
      
      // 🆕 NUEVO: Actualizar el average rating después de agregar/editar review
      const newAvgRating = await fetchAverageRating(selectedMovie.id);
      setMovieAverageRatings(prev => ({...prev, [selectedMovie.id]: newAvgRating}));
      
      setReviewText("");
      
      if (isSubmittingNewRating) {
        alert("¡Calificación y comentario enviados con éxito!");
      } else {
        alert("¡Comentario enviado con éxito!");
      }
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      alert(`Error al enviar reseña: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleEditReview = (review: Review) => {
    setUserRating(review.rating);
    setReviewText(review.comment);
    setEditingReviewId(review.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
      return;
    }

    if (!selectedMovie) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontró token de autenticación");
      return;
    }

    try {
      // 🔄 NUEVO: Eliminar review en el backend (DELETE)
      const response = await fetch(
        `https://backend-de-peliculas.onrender.com/api/v1/reviews/${selectedMovie.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la reseña");
      }

      // Recargar reviews desde el backend
      await fetchMovieReviews(selectedMovie.id);

      // 🆕 NUEVO: Actualizar el average rating después de eliminar review
      const newAvgRating = await fetchAverageRating(selectedMovie.id);
      setMovieAverageRatings(prev => ({...prev, [selectedMovie.id]: newAvgRating}));

      // Reset form if deleting current editing review
      if (editingReviewId === reviewId) {
        setUserRating(0);
        setReviewText("");
        setEditingReviewId(null);
      }

      alert("Reseña eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar reseña:", error);
      alert("Error al eliminar la reseña. Intenta de nuevo.");
    }
  };

  const handleCancelEdit = () => {
    setUserRating(0);
    setReviewText("");
    setEditingReviewId(null);
  };

  const getAverageRating = (movieId: number): number => {
    // 🔄 MODIFICADO: Usar el cache de ratings del backend
    return movieAverageRatings[movieId] || 0;
  };

  const isFavorite = (movieId: number): boolean => {
    return favorites.some(fav => fav.id === movieId);
  };

  const toggleFavorite = async (movie: Movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }

    const isCurrentlyFavorite = isFavorite(movie.id);

    try {
      if (isCurrentlyFavorite) {
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

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    setSearchTerm("");
    setSelectedGenre("Todos");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        window.location.href = '/#/homemovies';
      }

      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (isLoggedIn) {
          window.location.href = '/#/profile';
        }
      }

      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleShowFavorites();
      }

      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }

      if (e.key === '/' && !showShortcuts && !selectedVideo && !showMovieDetail) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (!showShortcuts && !selectedVideo && !showMovieDetail && filteredMovies.length > 0) {
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

      if (e.key === 'Enter' && !showShortcuts && !selectedVideo && !showMovieDetail) {
        if (filteredMovies[focusedMovieIndex]) {
          e.preventDefault();
          handleOpenMovieDetail(filteredMovies[focusedMovieIndex]);
        }
      }

      if (e.key.toLowerCase() === 'f' && !showShortcuts && !selectedVideo && !showMovieDetail) {
        if (filteredMovies[focusedMovieIndex]) {
          e.preventDefault();
          await toggleFavorite(filteredMovies[focusedMovieIndex]);
        }
      }

      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (selectedVideo) {
          handleCloseVideo();
        } else if (showMovieDetail) {
          handleCloseMovieDetail();
        } else if (showDropdown) {
          setShowDropdown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, selectedVideo, showMovieDetail, showDropdown, filteredMovies, focusedMovieIndex, showFavorites, isLoggedIn]);

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

        <div ref={movieGridRef} className="movies-grid" role="list" aria-label="Lista de películas">
          {filteredMovies.map((movie, index) => {
            const avgRating = getAverageRating(movie.id);
            const reviewCount = movieReviews.filter(r => r.movieId === movie.id).length;
            
            // ratings se cargan desde useEffect en lote para evitar muchas peticiones simultáneas
            
            return (
              <div 
                key={movie.id} 
                className={`movie-card ${focusedMovieIndex === index ? 'focused' : ''}`}
                role="listitem"
                tabIndex={0}
                aria-label={`${movie.title}, ${avgRating > 0 ? avgRating : movie.rating} estrellas`}
                onFocus={() => setFocusedMovieIndex(index)}
                onClick={() => handleOpenMovieDetail(movie)}
              >
                <div className="movie-image">
                  <img src={movie.image} alt={movie.title} />
                  <div className="movie-overlay">
                    <button 
                      className="play-button"
                      aria-label={`Ver detalles de ${movie.title}`}
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
                      <FaStar /> {avgRating > 0 ? avgRating : movie.rating}
                      {reviewCount > 0 && <span className="review-count"> ({reviewCount})</span>}
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
            );
          })}
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

      {/* Movie Detail Page with Reviews */}
      {showMovieDetail && selectedMovie && (
        <div className="movie-detail-page">
          <div className="movie-detail-header">
            <button 
              className="back-button" 
              onClick={handleCloseMovieDetail}
              aria-label="Volver a películas"
            >
              <FaArrowLeft /> Volver
            </button>
          </div>

          <div className="movie-detail-content">
            <div className="movie-detail-hero">
              <div className="movie-detail-poster">
                <img src={selectedMovie.image} alt={selectedMovie.title} />
                {/* 🎬 Actualizado para incluir subtítulos */}
                <button 
                  className="play-trailer-btn"
                  onClick={() => handlePlayVideo(selectedMovie.videoUrl, selectedMovie.subtitles)}
                >
                  <FaPlay /> Ver Película
                </button>
              </div>
              
              <div className="movie-detail-info">
                <h1>{selectedMovie.title}</h1>
                <div className="movie-detail-meta">
                  <span className="genre-tag">{selectedMovie.genre}</span>
                  <span>{selectedMovie.year}</span>
                  <span>{selectedMovie.duration}</span>
                </div>
                <div className="movie-rating-summary">
                  <div className="stars-display">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar 
                        key={star}
                        className={star <= (getAverageRating(selectedMovie.id) || selectedMovie.rating) ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                  </div>
                  <span className="rating-number">
                    {getAverageRating(selectedMovie.id) > 0 
                      ? getAverageRating(selectedMovie.id) 
                      : selectedMovie.rating} / 5
                  </span>
                  <span className="review-count-text">
                    ({movieReviews.length} reseña{movieReviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <p className="movie-description-full">{selectedMovie.description}</p>
                
                <button 
                  className={`favorite-detail-btn ${isFavorite(selectedMovie.id) ? 'is-favorite' : ''}`}
                  onClick={async () => await toggleFavorite(selectedMovie)}
                >
                  {isFavorite(selectedMovie.id) ? <FaHeart /> : <FaRegHeart />}
                  {isFavorite(selectedMovie.id) ? 'En Favoritos' : 'Agregar a Favoritos'}
                </button>
              </div>
            </div>

            {/* Review Section */}
            <div className="reviews-section">
              <h2>Reseñas y Puntuaciones</h2>
              
              {isLoggedIn ? (
                <div className="add-review-form">
                  <div className="review-form-user-info">
                    <div className="user-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <h3>{editingReviewId ? 'Editar reseña' : 'Agregar nueva reseña'}</h3>
                      <p className="review-form-info">
                        {editingReviewId 
                          ? 'Editando comentario (la calificación no se puede cambiar)' 
                          : `Escribiendo como: ${userName || 'Cargando...'}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="rating-input">
                    <label>Tu puntuación:</label>
                    {hasRatedThisMovie ? (
                      <div className="rating-locked">
                        <div className="stars-display">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar
                              key={star}
                              className={star <= userRating ? 'star-filled' : 'star-empty'}
                            />
                          ))}
                        </div>
                        <span className="rating-locked-text">
                          Ya has calificado esta película con {userRating} estrella{userRating !== 1 ? 's' : ''}. 
                          Puedes agregar comentarios adicionales sin calificación.
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="stars-input">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar
                              key={star}
                              className={star <= (hoverRating || userRating) ? 'star-hover' : 'star-empty'}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setUserRating(star)}
                            />
                          ))}
                        </div>
                        {userRating > 0 ? (
                          <span className="rating-text">{userRating} de 5 estrellas</span>
                        ) : (
                          <span className="rating-text-hint">Calificación opcional - Solo puedes calificar una vez</span>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="comment-input">
                    <label htmlFor="review-text">Tu comentario{hasRatedThisMovie ? '' : ' (opcional)'}:</label>
                    <textarea
                      id="review-text"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Cuéntanos qué te pareció esta película..."
                      rows={4}
                      maxLength={500}
                    />
                    <span className="char-count">{reviewText.length}/500</span>
                  </div>
                  
                  <div className="review-form-buttons">
                    <button 
                      className="submit-review-btn"
                      onClick={handleSubmitReview}
                      disabled={
                        !userName || 
                        userName === "Usuario" || 
                        (hasRatedThisMovie ? !reviewText.trim() : (!reviewText.trim() && userRating === 0))
                      }
                    >
                      {editingReviewId ? 'Actualizar Reseña' : 'Enviar Reseña'}
                    </button>
                    {editingReviewId && (
                      <button 
                        className="cancel-edit-btn"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="login-prompt">
                  <p>Debes <a href="/#/">iniciar sesión</a> para dejar una reseña</p>
                </div>
              )}

              <div className="reviews-list">
                <h3>Todas las reseñas ({movieReviews.length})</h3>
                {movieReviews.length === 0 ? (
                  <p className="no-reviews">Aún no hay reseñas. ¡Sé el primero en dejar una!</p>
                ) : (
                  movieReviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-user">
                          <div className="user-avatar">
                            <FaUser />
                          </div>
                          <div className="user-info">
                            <span className="user-name">{review.userName}</span>
                            <span className="review-date">{review.date}</span>
                          </div>
                        </div>
                        <div className="review-rating-actions">
                          {review.hasRating && review.rating > 0 && (
                            <div className="review-rating">
                              {[1, 2, 3, 4, 5].map(star => (
                                <FaStar
                                  key={star}
                                  className={star <= review.rating ? 'star-filled' : 'star-empty'}
                                />
                              ))}
                            </div>
                          )}
                          {isLoggedIn && review.userName === userName && (
                            <div className="review-actions">
                              <button 
                                className="edit-review-btn"
                                onClick={() => handleEditReview(review)}
                                title="Editar reseña"
                                aria-label="Editar reseña"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="delete-review-btn"
                                onClick={() => handleDeleteReview(review.id)}
                                title="Eliminar reseña"
                                aria-label="Eliminar reseña"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎬 Video Modal con Subtítulos */}
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
              crossOrigin="anonymous"
            >
              {/* 🎬 Subtítulos dinámicos */}
              {selectedVideoSubtitles?.map((subtitle) => (
                <track
                  key={subtitle.language}
                  kind="subtitles"
                  src={subtitle.url}
                  srcLang={subtitle.language}
                  label={subtitle.label}
                  default={subtitle.language === 'es'}
                />
              ))}
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>
      )}

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
                    <span className="shortcut-description">Ver detalles de película</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-note">Click en tarjeta</span>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Ver detalles (enfocada)</span>
                    <div className="shortcut-keys">
                      <div className="keys-wrapper">
                        <kbd>Enter</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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