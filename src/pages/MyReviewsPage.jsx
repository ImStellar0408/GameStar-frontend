import { useEffect, useState } from "react";
import { useReview } from "../context/ReviewContext.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import { Link } from "react-router-dom";
import '../styles/reviewspage.css';

function MyReviewsPage() {
    const { getMyReviews, reviews, loading, errors } = useReview();
    const [localLoading, setLocalLoading] = useState(true);
    
    useEffect(() => {
        const loadReviews = async () => {
            try {
                setLocalLoading(true);
                await getMyReviews();
            } catch (error) {
                console.error("Error loading my reviews:", error);
            } finally {
                setLocalLoading(false);
            }
        };
        
        loadReviews();
    }, []);

    if (localLoading) {
        return (
            <div className="reviews-page">
                <div className="page-container">
                    <div className="page-header">
                        <div className="header-content">
                            <div className="header-text">
                                <h1>My Reviews</h1>
                                <p>Your personal gaming reviews and experiences</p>
                            </div>
                        </div>
                    </div>
                    <div className="loading-state">
                        <i className='bx bx-loader-circle bx-spin'></i>
                        <h2>Loading your reviews...</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-page">
            <div className="page-container">
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>My Reviews</h1>
                            <p>Your personal gaming reviews and experiences</p>
                        </div>
                        <Link to="/reviews/new" className="action-button">
                            <i className='bx bx-plus'></i>
                            Write New Review
                        </Link>
                    </div>
                </div>

                {errors.length > 0 && (
                    <div className="error-banner">
                        {errors.map((error, i) => (
                            <div key={i} className="error-message">
                                {error}
                            </div>
                        ))}
                    </div>
                )}

                {reviews.length > 0 ? (
                    <div className="reviews-grid">
                        {reviews.map(review => (
                            <ReviewCard key={review._id} review={review} isOwner={true} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-content">
                            <i className='bx bx-message-square-detail'></i>
                            <h2>No reviews yet</h2>
                            <p>Start sharing your gaming experiences with the community!</p>
                            <Link to="/reviews/new" className="empty-action-button">
                                <i className='bx bx-plus'></i>
                                Write Your First Review
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyReviewsPage;