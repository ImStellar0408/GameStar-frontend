import './header.css'

export default function Header() {
  return (
    <header className="container">
      <div className="head-left">
        <img src="src/assets/GameStar.SVG" alt="Logo" />
      </div>

      <div className="head-right">
        <p><a href="#">HOME</a></p>
        <p><a href="#">GAMES</a></p>
        <p><a href="#">ABOUT</a></p>
        <button>SIGN IN</button>
      </div>
    </header>
  )
}

