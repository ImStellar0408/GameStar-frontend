import { createContext, useContext, useState } from "react";
import { createGameRequest, getGamesRequest, updateGameRequest, deleteGameRequest, getGameRequest } from "../api/games.js";

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}

export function GameProvider({ children }) {
    const [games, setGames] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const createGame = async (gameData) => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await createGameRequest(gameData);
            console.log("Game created:", res.data);
            

            setGames(prevGames => [...prevGames, res.data]);
            return res.data;
        } catch (error) {
            console.log("Create game error:", error.response?.data);
            
            if (error.response?.data?.error) {
                setErrors(error.response.data.error);
            } else if (error.response?.data?.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Failed to create game. Please try again."]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getGames = async () => {
        try {
            setLoading(true);
            const res = await getGamesRequest();
            console.log("Games fetched:", res.data);
            setGames(res.data);
            return res.data;
        } catch (error) {
            console.log("Get games error:", error);
            setErrors(["Failed to load games."]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getGame = async (id) => {
        try {
            setLoading(true);
            const res = await getGameRequest(id);
            return res.data;
        } catch (error) {
            console.log("Get game error:", error);
            setErrors(["Failed to load the game."]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

        const updateGame = async (id, gameData) => {
        try {
            setLoading(true);
            setErrors([]);
            console.log("Updating game in context:", id, gameData);
            
            const res = await updateGameRequest(id, gameData);
            console.log("Update response:", res.data);
            
            setGames(prevGames => 
                prevGames.map(game => game._id === id ? res.data : game)
            );
            return res.data;
        } catch (error) {
            console.log("Update game error:", error.response?.data);
            
            if (error.response?.data?.error) {
                setErrors(error.response.data.error);
            } else if (error.response?.data?.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Failed to update game. Please try again."]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteGame = async (id) => {
        try {
            setLoading(true);
            await deleteGameRequest(id);
            
            setGames(prevGames => prevGames.filter(game => game._id !== id));
        } catch (error) {
            console.log("Delete game error:", error);
            setErrors(["Failed to delete game."]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearErrors = () => setErrors([]);

    return (
        <GameContext.Provider value={{ 
            games, 
            errors,
            loading,
            createGame,
            getGames,
            getGame,
            updateGame,
            deleteGame,
            clearErrors
        }}>
            {children}
        </GameContext.Provider>
    );
}