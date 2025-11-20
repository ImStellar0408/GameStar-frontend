import { useEffect } from "react";
import { useGame } from "../context/GameContext.jsx";
import GameCard from "../components/GameCard.jsx";
import '../styles/gamepage.css';

function GamePage() {
    const { getGames, games } = useGame();
    
    useEffect(() => {
        getGames();
    }, []);

    return (
        <div className="game-page">
            <div className="page-header">
                <h1>My Game Library</h1>
                <p>Your personal collection of gaming adventures</p>
            </div>
            
            <div className="games-grid">
                {games.map(game => (
                    <GameCard key={game._id} game={game} />
                ))}
            </div>

            {games.length === 0 && (
                <div className="empty-state">
                    <i className='bx bx-game'></i>
                    <h2>No games yet</h2>
                    <p>Start building your collection by adding your first game!</p>
                </div>
            )}
        </div>
    );
}

export default GamePage;