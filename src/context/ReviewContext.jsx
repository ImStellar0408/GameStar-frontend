import { createContext, useContext, useState } from "react";
import { 
    createReviewRequest, 
    getGlobalReviewsRequest, 
    getMyReviewsRequest, 
    updateReviewRequest, 
    deleteReviewRequest 
} from "../api/reviews.js";

const ReviewContext = createContext();

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error("useReview must be used within a ReviewProvider");
    }
    return context;
}

export function ReviewProvider({ children }) {
    const [reviews, setReviews] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const createReview = async (reviewData) => {
        try {
            setLoading(true);
            setErrors([]);
            console.log("Creating review with data:", reviewData);
            const res = await createReviewRequest(reviewData);
            console.log("Review created successfully:", res.data);
            
            setMyReviews(prevReviews => [...prevReviews, res.data]);
            setReviews(prevReviews => [...prevReviews, res.data]);
            return res.data;
        } catch (error) {
            console.error("Create review error:", error);
            console.error("Error response:", error.response?.data);
            
            if (error.response?.data?.error) {
                setErrors(error.response.data.error);
            } else if (error.response?.data?.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Failed to create review. Please try again."]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getGlobalReviews = async () => {
        try {
            setLoading(true);
            console.log("Fetching global reviews...");
            const res = await getGlobalReviewsRequest();
            console.log("Global reviews fetched:", res.data);
            setReviews(res.data);
            return res.data;
        } catch (error) {
            console.error("Get global reviews error:", error);
            console.error("Error response:", error.response?.data);
            setErrors(["Failed to load reviews."]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getMyReviews = async () => {
        try {
            setLoading(true);
            console.log("Fetching my reviews...");
            const res = await getMyReviewsRequest();
            console.log("My reviews fetched:", res.data);
            setMyReviews(res.data);
            return res.data;
        } catch (error) {
            console.error("Get my reviews error:", error);
            console.error("Error response:", error.response?.data);
            setErrors(["Failed to load your reviews."]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateReview = async (id, reviewData) => {
        try {
            setLoading(true);
            setErrors([]);
            console.log("Updating review:", id, reviewData);
            const res = await updateReviewRequest(id, reviewData);
            console.log("Review updated successfully:", res.data);
            
            setMyReviews(prevReviews => 
                prevReviews.map(review => review._id === id ? res.data : review)
            );
            setReviews(prevReviews => 
                prevReviews.map(review => review._id === id ? res.data : review)
            );
            return res.data;
        } catch (error) {
            console.error("Update review error:", error);
            console.error("Error response:", error.response?.data);
            
            if (error.response?.data?.error) {
                setErrors(error.response.data.error);
            } else if (error.response?.data?.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Failed to update review. Please try again."]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (id) => {
        try {
            setLoading(true);
            console.log("Deleting review:", id);
            await deleteReviewRequest(id);
            console.log("Review deleted successfully");
            
            setMyReviews(prevReviews => prevReviews.filter(review => review._id !== id));
            setReviews(prevReviews => prevReviews.filter(review => review._id !== id));
        } catch (error) {
            console.error("Delete review error:", error);
            console.error("Error response:", error.response?.data);
            setErrors(["Failed to delete review."]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getReview = async (id) => {
    try {
        setLoading(true);
        // Como no hay endpoint específico, filtramos de las reviews existentes
        const myReviews = await getMyReviewsRequest();
        const review = myReviews.find(r => r._id === id);
        
        if (!review) {
            throw new Error("Review not found");
        }
        return review;
    } catch (error) {
        console.error("Get review error:", error);
        setErrors(["Failed to load the review."]);
        throw error;
    } finally {
        setLoading(false);
    }
};

    const clearErrors = () => setErrors([]);

    return (
        <ReviewContext.Provider value={{ 
            reviews,
            myReviews,
            errors,
            loading,
            createReview,
            getReview,
            getGlobalReviews,
            getMyReviews,
            updateReview,
            deleteReview,
            clearErrors
        }}>
            {children}
        </ReviewContext.Provider>
    );
}