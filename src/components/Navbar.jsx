import '../styles/header.css';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav>
      <Link to="/"><img className="nav-logo" src="src/assets/GameStar.svg" alt="GameStar Logo"/></Link>
      <ul>
        <li>
          <Link to="/games">Games</Link>
        </li>
        <li>
          <Link to="/login">Log In</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  )
}

