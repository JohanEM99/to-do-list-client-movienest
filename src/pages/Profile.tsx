import React, { useState, useEffect } from "react";
import "../styles/Profile.scss"; // Agrega estilos personalizados
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Hacer una solicitud al backend para obtener la información del usuario
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Usar el token guardado en el LocalStorage
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener el perfil del usuario.");
        }

        const data = await response.json();
        setUser(data.user); // Asumiendo que el backend devuelve un objeto 'user'
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Eliminar el token del LocalStorage y redirigir al usuario a la página de inicio
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <div className="logo">
          <img src="/logo.png" alt="MovieNest Logo" />
        </div>
        <nav className="nav-menu">
          <a href="#/homemovies">Home</a>
          <a href="#/movies">Movies</a>
          <a href="#/about">About Us</a>
        </nav>
        <div className="auth-buttons">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Profile Information */}
      <div className="profile-content">
        <h1>My Profile</h1>
        <div className="profile-card">
          <div className="profile-image">
            <img src="https://via.placeholder.com/150" alt="User Profile" />
          </div>
          <div className="profile-details">
            <h2>{user?.username}</h2>
            <p>Email: {user?.email}</p>
            <p>Joined: {new Date(user?.createdAt).toLocaleDateString()}</p>
            <button className="edit-btn">
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
