import "../styles/header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export default function Header() {
  const { isAuthenticated, loading, logout, user } = useAuth(); 

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

  return (
    <nav>
      <Link to="/">
        <img
          className="nav-logo"
          src="src/assets/GameStar.svg"
          alt="GameStar Logo"
        />
      </Link>
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/games">Games</Link>
            </li>
            <li>
              <Link to="/games/new">Add Game</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>Log Out</Link> 
            </li>
            <li className="welcome-message">
              <i className='bx bx-user'></i>
              Welcome: {user?.username} 
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/games">Games</Link>
            </li>
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