import axios from './axios';

export const createReviewRequest = async (reviewData) => {
    return await axios.post(`/reviews`, reviewData, {
        withCredentials: true
    });
};

export const getGlobalReviewsRequest = async () => {
    return await axios.get(`/reviews/global`, {
        withCredentials: true
    });
};

export const getMyReviewsRequest = async () => {
    return await axios.get(`/reviews/my-reviews`, {
        withCredentials: true
    });
};

export const getReviewRequest = async (id) => {  // ¡Añadir esta función!
    return await axios.get(`/reviews/${id}`, {
        withCredentials: true
    });
};

export const updateReviewRequest = async (id, reviewData) => {
    return await axios.put(`/reviews/${id}`, reviewData, {
        withCredentials: true
    });
};

export const deleteReviewRequest = async (id) => {
    return await axios.delete(`/reviews/${id}`, {
        withCredentials: true
    });
};