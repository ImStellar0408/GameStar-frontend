import { createContext, useState, useContext } from "react";
import { 
    createReviewRequest, 
    getGlobalReviewsRequest, 
    getMyReviewsRequest, 
    updateReviewRequest, 
    deleteReviewRequest,
    getAvailableGamesRequest
} from "../api/reviews.js";
import { getUserGamesRequest } from "../api/games.js";

const ReviewContext = createContext();

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error("useReview must be used within a ReviewProvider");
    }
    return context;
};

export function ReviewProvider({ children }) {
    const [reviews, setReviews] = useState([]);
    const [availableGames, setAvailableGames] = useState([]);
    const [userGames, setUserGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const createReview = async (review) => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await createReviewRequest(review);
            if (res.status === 201) {
                setReviews(prevReviews => [res.data, ...prevReviews]);
                return res.data;
            }
        } catch (error) {
            console.error("Error creating review:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Error creating review"]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getGlobalReviews = async () => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await getGlobalReviewsRequest();
            if (res.status === 200) {
                setReviews(res.data);
                return res.data;
            }
        } catch (error) {
            console.error("Error getting global reviews:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Error loading reviews"]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getMyReviews = async () => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await getMyReviewsRequest();
            if (res.status === 200) {
                setReviews(res.data);
                return res.data;
            }
        } catch (error) {
            console.error("Error getting my reviews:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Error loading your reviews"]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateReview = async (id, review) => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await updateReviewRequest(id, review);
            if (res.status === 200) {
                setReviews(prevReviews => 
                    prevReviews.map(rev => rev._id === id ? res.data : rev)
                );
                return res.data;
            }
        } catch (error) {
            console.error("Error updating review:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Error updating review"]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (id) => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await deleteReviewRequest(id);
            if (res.status === 200) {
                setReviews(prevReviews => prevReviews.filter(rev => rev._id !== id));
                return res.data;
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Error deleting review"]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAvailableGames = async () => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await getAvailableGamesRequest();
            if (res.status === 200) {
                setAvailableGames(res.data);
                return res.data;
            }
        } catch (error) {
            console.error("Error getting available games:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Error loading available games"]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUserGames = async () => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await getUserGamesRequest();
            if (res.status === 200) {
                setUserGames(res.data);
                return res.data;
            }
        } catch (error) {
            console.error("Error getting user games:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Error loading user games"]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearErrors = () => {
        setErrors([]);
    };

    return (
        <ReviewContext.Provider value={{
            reviews,
            availableGames,
            userGames,
            loading,
            errors,
            createReview,
            getGlobalReviews,
            getMyReviews,
            updateReview,
            deleteReview,
            getAvailableGames,
            getUserGames,
            clearErrors
        }}>
            {children}
        </ReviewContext.Provider>
    );
}