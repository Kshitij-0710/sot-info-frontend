import React from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import "./styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose, isLoggedIn, userData, handleLogout }) => {
  const getUserDisplayName = () => {
    if (!userData) return "User";
    return userData.name || userData.email || "User";
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "show" : ""}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-content">
          {isLoggedIn && (
            <div className="user-profile">
              <img 
                src={`${import.meta.env.BASE_URL}images/pfp.jpeg`} 
                alt="Profile" 
                className="profile-img"
              />
              <span className="user-name">{getUserDisplayName()}</span>
            </div>
          )}

          <nav className="sidebar-nav">
            <Link to="/" onClick={onClose}>Home</Link>
            <Link to="/projects" onClick={onClose}>Projects</Link>
            <Link to="/research" onClick={onClose}>Research</Link>
            <Link to="/events" onClick={onClose}>Events</Link>
            <Link to="/achievements" onClick={onClose}>Achievements</Link>
            <Link to="/placements" onClick={onClose}>Placements</Link>
            <Link to="/contactpage" onClick={onClose}>Contact</Link>
            {isLoggedIn && <Link to="/forms" onClick={onClose}>Forms</Link>}
          </nav>

          <div className="sidebar-footer">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <Link to="/signup" onClick={onClose} className="login-button">
                Register/Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 