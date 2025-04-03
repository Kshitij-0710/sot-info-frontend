import React, { useEffect, useState, useRef } from "react";
import { FaCaretDown, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles/homepage.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      if (mobileMenuRef.current && 
         !mobileMenuRef.current.contains(event.target) && 
         !event.target.closest('.mobile-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    // Also handle touch events for mobile devices
    document.addEventListener("touchstart", handleClickOutside);
    
    // Close dropdown on window resize (helps with orientation changes)
    const handleResize = () => {
      setDropdownOpen(false);
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    
    // Dispatch auth state changed event
    window.dispatchEvent(new Event("auth_state_changed"));
    
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (!userData) return "User";
    return userData.name || userData.email || "User";
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Logo moved to the left */}
        <div className="logo">
          <Link to="/">
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" />
          </Link>
        </div>
        
        {/* Mobile Menu Toggle - moved after logo */}
        <button 
          className="mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Desktop Navigation Links */}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`} ref={mobileMenuRef}>
          <Link to="/" className="nav-link">Home</Link>
          
          {/* Dropdown Menu */}
          <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} ref={dropdownRef}>
            <button 
              className="dropdown-toggle nav-link" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Resources <FaCaretDown className={dropdownOpen ? 'rotate' : ''} />
            </button>
            <div className="dropdown-menu" aria-label="Resources submenu">
              <Link to="/projects" onClick={() => setDropdownOpen(false)}>Projects</Link>
              <Link to="/research" onClick={() => setDropdownOpen(false)}>Research</Link>
              <Link to="/achievements" onClick={() => setDropdownOpen(false)}>Achievements</Link>
              <Link to="/placements" onClick={() => setDropdownOpen(false)}>Placements</Link>
              <Link to="/events" onClick={() => setDropdownOpen(false)}>Events</Link>
              <Link to="/posts" onClick={() => setDropdownOpen(false)}>Posts</Link>
            </div>
          </div>
          
          <Link to="/contactpage" className="nav-link">Contact</Link>
          {isLoggedIn && <Link to="/forms" className="nav-link">Forms</Link>}
          
          {/* Register/Login link moved here to be with other nav links */}
          {!isLoggedIn && (
            <Link to="/signup" className="nav-link">Register/Login</Link>
          )}
          
          {/* Mobile menu login/logout - only show logout option when logged in */}
          <div className="mobile-auth">
            {isLoggedIn && (
              <button onClick={handleLogout} className="logout-button mobile-logout">
                <FaSignOutAlt /> Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Auth - only show when logged in */}
      {isLoggedIn && (
        <div className="nav-right">
          <div className="user-menu">
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;