import Header from '../components/header'
import './home.css'

export default function Home() {
    return (
        <>
            <Header />
            <section className='hero-section'>
                <div className="hero-vid">
                    <video loop autoPlay muted playsInline className='hero-video'>
                        <source src="src/assets/hero1.mp4" type="video/mp4" />
                    </video>

                    <div className="hero-info-1">
                        <h1>THE NEW WAY TO WATCH YOUR GAME PROGRESS</h1>
                        <p>An innovative platform that will allow you to keep track of your favorite games.</p>
                        <button>START</button>
                    </div>

                    <div className="hero-info-2">
                        <h1>THE ULTIMATE GAME LIBRARY MADE BY GAMERS FOR GAMERS</h1>
                    </div>
                </div>
            </section>
        </>
    )
}