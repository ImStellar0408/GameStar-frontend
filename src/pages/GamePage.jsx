import { useEffect } from "react";
import { useGame } from "../context/GameContext.jsx";
import GameCard from "../components/GameCard.jsx";
import { Link } from "react-router-dom";
import '../styles/gamepage.css';

function GamePage() {
    const { getGames, games } = useGame();
    
    useEffect(() => {
        getGames();
    }, []);

    return (
        <div className="games-page">
            <div className="page-container">
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>My Game Library</h1>
                            <p>Your personal collection of gaming adventures</p>
                        </div>
                        <Link to="/games/new" className="action-button">
                            <i className='bx bx-plus'></i>
                            Add New Game
                        </Link>
                    </div>
                </div>

                {games.length > 0 ? (
                    <div className="games-grid">
                        {games.map(game => (
                            <GameCard key={game._id} game={game} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-content">
                            <i className='bx bx-game'></i>
                            <h2>No games yet</h2>
                            <p>Start building your collection by adding your first game!</p>
                            <Link to="/games/new" className="empty-action-button">
                                Add Your First Game
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GamePage;