import axios from './axios';

export const createGameRequest = async (gameData) => {
    return await axios.post(`/games`, gameData, {
        withCredentials: true
    });
};

export const getGamesRequest = async () => {
    return await axios.get(`/games`, {
        withCredentials: true
    });
};

export const getUserGamesRequest = async () => {
    return await axios.get(`/user-games`, {
        withCredentials: true
    });
};

export const getGameRequest = async (id) => {
    return await axios.get(`/games/${id}`, {
        withCredentials: true
    });
}

export const updateGameRequest = async (id, gameData) => {
    return await axios.put(`/games/${id}`, gameData, {
        withCredentials: true
    });
};

export const deleteGameRequest = async (id) => {
    return await axios.delete(`/games/${id}`, {
        withCredentials: true
    });
};