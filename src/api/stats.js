import axios from './axios';

export const getUserStatsRequest = async () => {
    return await axios.get(`/stats/user`, {
        withCredentials: true
    });
};

export const getReviewStatsRequest = async () => {
    return await axios.get(`/stats/reviews`, {
        withCredentials: true
    });
};

export const getGameStatsRequest = async () => {
    return await axios.get(`/stats/games`, {
        withCredentials: true
    });
};

export const getMonthlyActivityRequest = async (months = 6) => {
    return await axios.get(`/stats/activity?months=${months}`, {
        withCredentials: true
    });
};