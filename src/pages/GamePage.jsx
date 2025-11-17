import { use, useEffect } from "react";
import { useGame } from "../context/GameContext.jsx";

function GamePage() {
    const {getGames, games} = useGame();
    
    useEffect(() => {
        getGames();
    }, []);

    return (
        <div>

            {games.map(game => (
                <div key={game._id}>
                    <h1>{game.title}</h1>
                    <p>{game.genre}</p>
                    <p>{game.releaseDate}</p>
                    <p>{game.platform}</p>
                    <img src={game.coverImageUrl} alt={game.title} />
                    <p>{game.description}</p>
                </div>
            ))}

        </div>
    )
}

export default GamePage;