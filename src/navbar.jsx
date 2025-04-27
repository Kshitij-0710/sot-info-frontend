// All imports unchanged
import React, { useEffect, useState } from "react";
import { FaBars, FaSignOutAlt, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./styles/homepage.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
    const checkTokenExpiration = () => {
      const tokenExpiry = localStorage.getItem('token_expiry');
      if (tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10);
        const currentTime = new Date().getTime();
        if (currentTime > expiryTime) {
          handleLogout();
          console.log('Token expired, user logged out automatically');
        }
      }
    };
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);
    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("auth_state_changed", checkAuthStatus);
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("auth_state_changed", checkAuthStatus);
      clearInterval(interval);
    };
  }, [location.pathname]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("token_expiry");
    if (token && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry, 10);
      const currentTime = new Date().getTime();
      if (currentTime <= expiryTime) {
        setIsLoggedIn(true);
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setUserData(user);
          } catch (e) {
            console.error("Failed to parse user data:", e);
          }
        }
      } else {
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("auth_state_changed"));
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (!userData) return "User";
    return userData.name || userData.email || "User";
  };

  const toggleCategoriesDropdown = (e) => {
    if (window.innerWidth <= 768) return;
    e.preventDefault();
    setCategoriesOpen(!categoriesOpen);
  };

  useEffect(() => {
    const closeDropdown = () => setCategoriesOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const handleCategoryClick = (e) => {
    e.stopPropagation();
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" />
        </Link>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(true)}>
        <FaBars />
      </div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="close-icon" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </div>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <div className="mobile-submenu">
          <div className="mobile-submenu-header" onClick={(e) => {
            e.stopPropagation();
            setCategoriesOpen(!categoriesOpen);
          }}>
            Categories <FaChevronDown className={categoriesOpen ? "rotate-icon" : ""} />
          </div>
          <div className={`mobile-submenu-content ${categoriesOpen ? "open" : ""}`}>
            <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
            <Link to="/research" onClick={() => setMenuOpen(false)}>Research</Link>
            <Link to="/achievements" onClick={() => setMenuOpen(false)}>Achievements</Link>
            <Link to="/faculty" onClick={() => setMenuOpen(false)}>Faculty</Link> {/* ✅ New link */}
          </div>
        </div>
        <Link to="/placements" onClick={() => setMenuOpen(false)}>Placements</Link>
        <Link to="/contactpage" onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
        {isLoggedIn ? (
          <>
            <Link to="/forms" onClick={() => setMenuOpen(false)}>Forms</Link>
            <div className="user-dropdown">
              <img 
                src={`${import.meta.env.BASE_URL}images/pfp.jpeg`} 
                alt="Profile" 
                className="profile-img"
              />
              <div className="dropdown-content">
                <span>Hello, {getUserDisplayName()}</span>
                <button onClick={handleLogout} className="logout-button">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/signup" onClick={() => setMenuOpen(false)}>Register/Login</Link>
        )}
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <div className="categories-dropdown" onClick={handleCategoryClick}>
          <a href="#" onClick={toggleCategoriesDropdown}>
            Categories <FaChevronDown className={categoriesOpen ? "rotate-icon" : ""} />
          </a>
          <div className={`categories-dropdown-content ${categoriesOpen ? "open" : ""}`}>
            <Link to="/projects">Projects</Link>
            <Link to="/research">Research</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/events">Events</Link>
            <Link to="/faculty">Faculty</Link> {/* ✅ New link */}
          </div>
        </div>
        <Link to="/posts">Posts</Link>
        <Link to="/placements">Placements</Link>
        <Link to="/contactpage">Contact</Link>
        {isLoggedIn && <Link to="/forms">My Work</Link>}
        {isLoggedIn ? (
          <div className="user-dropdown">
            <img 
              src={`${import.meta.env.BASE_URL}images/pfp.jpeg`} 
              alt="Profile" 
              className="profile-img"
            />
            <div className="dropdown-content">
              <span>Hello, <br />{getUserDisplayName()}</span>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/signup">Register/Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
