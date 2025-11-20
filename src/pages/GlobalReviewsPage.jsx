import { useEffect, useState } from "react";
import { useReview } from "../context/ReviewContext.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import '../styles/reviewspage.css';

function GlobalReviewsPage() {
    const { getGlobalReviews, reviews, loading, errors } = useReview();
    const [localLoading, setLocalLoading] = useState(true);
    
    useEffect(() => {
        const loadReviews = async () => {
            try {
                setLocalLoading(true);
                await getGlobalReviews();
            } catch (error) {
                console.error("Error loading global reviews:", error);
            } finally {
                setLocalLoading(false);
            }
        };
        
        loadReviews();
    }, []);

    if (localLoading) {
        return (
            <div className="reviews-page">
                <div className="page-header">
                    <h1>Global Reviews</h1>
                    <p>Discover what the community is playing and reviewing</p>
                </div>
                <div className="loading-state">
                    <i className='bx bx-loader-circle bx-spin'></i>
                    <h2>Loading reviews...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-page">
            <div className="page-header">
                <h1>Global Reviews</h1>
                <p>Discover what the community is playing and reviewing</p>
            </div>
            
            {/* Mostrar errores */}
            {errors.length > 0 && (
                <div className="error-banner">
                    {errors.map((error, i) => (
                        <div key={i} className="error-message">
                            {error}
                        </div>
                    ))}
                </div>
            )}
            
            <div className="reviews-grid">
                {reviews.map(review => (
                    <ReviewCard key={review._id} review={review} />
                ))}
            </div>

            {reviews.length === 0 && !loading && (
                <div className="empty-state">
                    <i className='bx bx-message-square-detail'></i>
                    <h2>No reviews yet</h2>
                    <p>Be the first to share your gaming experience!</p>
                </div>
            )}
        </div>
    );
}

export default GlobalReviewsPage;