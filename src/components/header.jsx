import './header.css'

export default function Header() {
  return (
    <header className="container">

      <div className="head-left">
        <img src="src/assets/GameStar.SVG" alt="Logo" />
      </div>

      <div className="head-right">
        <p><a href="#" className='home-btn'>HOME</a></p>
        <p><a href="#" className='about-btn'>ABOUT</a></p>
        <p><a href="#" className='info-btn'>INFO</a></p>
        <button>SIGN IN</button>
      </div>
    </header>
  )
}

