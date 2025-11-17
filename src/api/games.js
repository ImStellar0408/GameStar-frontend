import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const createGameRequest = async (gameData) => {
    return await axios.post(`${API_URL}/games`, gameData, {
        withCredentials: true
    });
};

export const getGamesRequest = async () => {
    return await axios.get(`${API_URL}/games`, {
        withCredentials: true
    });
};

export const getGameRequest = async (id) => {
    return await axios.get(`${API_URL}/games/${id}`, {
        withCredentials: true
    });
}

export const updateGameRequest = async (id, gameData) => {
    return await axios.put(`${API_URL}/games/${id}`, gameData, {
        withCredentials: true
    });
};

export const deleteGameRequest = async (id) => {
    return await axios.delete(`${API_URL}/games/${id}`, {
        withCredentials: true
    });
};