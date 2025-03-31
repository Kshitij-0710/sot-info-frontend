import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./styles/homepage.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status whenever the component mounts or location changes
  useEffect(() => {
    checkAuthStatus();
    
    // Check for token expiration
    const checkTokenExpiration = () => {
      const tokenExpiry = localStorage.getItem('token_expiry');
      if (tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10);
        const currentTime = new Date().getTime();
        
        if (currentTime > expiryTime) {
          // Token has expired, log the user out
          handleLogout();
          console.log('Token expired, user logged out automatically');
        }
      }
    };
    
    // Check token expiration immediately
    checkTokenExpiration();
    
    // Set interval to check expiration every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    
    // Listen for storage events (login/logout in other tabs)
    window.addEventListener("storage", checkAuthStatus);
    
    // Custom event for login state changes
    window.addEventListener("auth_state_changed", checkAuthStatus);
    
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("auth_state_changed", checkAuthStatus);
      clearInterval(interval);
    };
  }, [location.pathname]); // Re-run when route changes

  const checkAuthStatus = () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("token_expiry");
    
    // Check if token exists and hasn't expired
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
        // Token expired
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
    
    // Dispatch auth state changed event
    window.dispatchEvent(new Event("auth_state_changed"));
    
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <button className="menu-button" onClick={() => setMenuOpen(prev => !prev)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          {!isLoggedIn && (
            <Link to="/signup" className="login-link">Register/Login</Link>
          )}
        </div>

        <div className="logo">
          <Link to="/">
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" />
          </Link>
        </div>
      </nav>

      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        userData={userData}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;