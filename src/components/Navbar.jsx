import "../styles/header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { isAuthenticated, loading, logout, user } = useAuth(); 
  const [gamesDropdown, setGamesDropdown] = useState(false);
  const [reviewsDropdown, setReviewsDropdown] = useState(false);
  const gamesDropdownRef = useRef(null);
  const reviewsDropdownRef = useRef(null);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (gamesDropdownRef.current && !gamesDropdownRef.current.contains(event.target)) {
        setGamesDropdown(false);
      }
      if (reviewsDropdownRef.current && !reviewsDropdownRef.current.contains(event.target)) {
        setReviewsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <nav>
        <div>Loading...</div>
      </nav>
    );
  }

  const handleLogout = () => {
    logout(); 
  };

  const toggleGamesDropdown = () => {
    setGamesDropdown(!gamesDropdown);
    setReviewsDropdown(false); // Cerrar el otro dropdown
  };

  const toggleReviewsDropdown = () => {
    setReviewsDropdown(!reviewsDropdown);
    setGamesDropdown(false); // Cerrar el otro dropdown
  };

  const closeAllDropdowns = () => {
    setGamesDropdown(false);
    setReviewsDropdown(false);
  };

  return (
    <nav>
      <Link to="/" onClick={closeAllDropdowns}>
        <img
          className="nav-logo"
          src="src/assets/GameStar.svg"
          alt="GameStar Logo"
        />
      </Link>
      <ul>
        {isAuthenticated ? (
          <>
            {/* Games Dropdown */}
            <li 
              className="dropdown"
              ref={gamesDropdownRef}
            >
              <span 
                className="dropdown-toggle"
                onClick={toggleGamesDropdown}
              >
                Games <i className='bx bx-chevron-down'></i>
              </span>
              {gamesDropdown && (
                <div className="dropdown-menu">
                  <Link to="/games" onClick={closeAllDropdowns}>
                    <i className='bx bx-library'></i>
                    My Library
                  </Link>
                  <Link to="/games/new" onClick={closeAllDropdowns}>
                    <i className='bx bx-plus'></i>
                    Add Game
                  </Link>
                </div>
              )}
            </li>

            {/* Reviews Dropdown */}
            <li 
              className="dropdown"
              ref={reviewsDropdownRef}
            >
              <span 
                className="dropdown-toggle"
                onClick={toggleReviewsDropdown}
              >
                Reviews <i className='bx bx-chevron-down'></i>
              </span>
              {reviewsDropdown && (
                <div className="dropdown-menu">
                  <Link to="/reviews/global" onClick={closeAllDropdowns}>
                    <i className='bx bx-globe'></i>
                    Global Reviews
                  </Link>
                  <Link to="/reviews/my-reviews" onClick={closeAllDropdowns}>
                    <i className='bx bx-user'></i>
                    My Reviews
                  </Link>
                  <Link to="/reviews/new" onClick={closeAllDropdowns}>
                    <i className='bx bx-edit'></i>
                    Write Review
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link to="/" onClick={handleLogout}>Log Out</Link> 
            </li>
            
            <Link to="/profile"><li className="welcome-message">
              <i className='bx bx-user'></i>
              Welcome: {user?.username} 
            </li></Link>
            
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Log In</Link>
            </li>
            <li>
              <Link to="/register">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}