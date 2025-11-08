import Header from '../components/header'
import InfoCard from '../components/info-card'
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

            <section className="about-section">
                <p>Welcome to GameStar</p>
                <h1>DISCOVER THE WORLD'S LARGEST SHARED ADVENTURE</h1>

                <div className="image-box">
                    <img src="./src/assets/aboutimg.jpeg" alt="aboutimg" />
                </div>
                <h4>Join a community of gamers and share your experiences.</h4>
                <h5>Connect with friends, share tips, and discover new games together!</h5>
            </section>

            <section className="info-section">
                <h3>EXPLORE ABOUT YOUR FAVORITE GAMES</h3>
                <p>Make your gaming experience more immersive with our detailed game information and community insights.</p>

                <div className="info-cards">

                    <InfoCard
                        title="BATTLE ROYALES"
                        description="Discover the most popular battle royale games and join the fight!"
                        videoSrc="src\assets\feature-1.mp4"
                    />
                    <InfoCard
                        title="RPG ADVENTURES"
                        description="Embark on epic quests and explore vast worlds in our top RPG selections."
                        videoSrc="src\assets\feature-2.mp4"
                    />
                    <InfoCard
                        title="STRATEGY GAMES"
                        description="Test your tactical skills with our collection of the best strategy games."
                        videoSrc="src\assets\feature-3.mp4"
                    />
                    <InfoCard
                        title="2D PLATFORMERS"
                        description="Test your skills with our collection of the best 2D platformers."
                        videoSrc="src\assets\feature-4.mp4"
                    />
                    <InfoCard
                        title="TACTICAL SHOOTERS"
                        description="Test your tactical skills with our collection of the best tactical shooters."
                        videoSrc="src\assets\feature-5.mp4"
                    />

                </div>

            </section>

        </>
    )
}