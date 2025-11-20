import { useEffect } from "react";
import { useReview } from "../context/ReviewContext.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import '../styles/reviewspage.css';

function MyReviewsPage() {
    const { getMyReviews, myReviews } = useReview();
    
    useEffect(() => {
        getMyReviews();
    }, []);

    return (
        <div className="reviews-page">
            <div className="page-header">
                <h1>My Reviews</h1>
                <p>Your personal gaming experiences and opinions</p>
            </div>
            
            <div className="reviews-grid">
                {myReviews.map(review => (
                    <ReviewCard key={review._id} review={review} isOwner={true} />
                ))}
            </div>

            {myReviews.length === 0 && (
                <div className="empty-state">
                    <i className='bx bx-message-square-detail'></i>
                    <h2>No reviews yet</h2>
                    <p>Start sharing your gaming experiences by writing your first review!</p>
                </div>
            )}
        </div>
    );
}

export default MyReviewsPage;