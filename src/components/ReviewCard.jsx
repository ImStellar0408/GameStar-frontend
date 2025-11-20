import { useState } from 'react';
import '../styles/reviewcard.css';
import { useReview } from '../context/ReviewContext';
import { Link } from 'react-router-dom';

function ReviewCard({ review, isOwner = false }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const { deleteReview } = useReview();

    const handleDeleteReview = async (id) => {
        setIsDeleting(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        try {
            await deleteReview(id);
            setIsDeleted(true);
            await new Promise(resolve => setTimeout(resolve, 600));
        } catch (error) {
            console.error('Error deleting review:', error);
            setIsDeleting(false);
        }
    };

    const toggleExpand = () => {
        if (!isDeleting && !isDeleted) {
            setIsExpanded(!isExpanded);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return '#4ade80';
            case 'Normal': return '#60a5fa';
            case 'Hard': return '#f87171';
            default: return '#6b7280';
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i 
                key={i} 
                className={`bx ${i < rating ? 'bxs-star' : 'bx-star'}`}
                style={{ color: i < rating ? '#fbbf24' : '#6b7280' }}
            ></i>
        ));
    };

    // Si está eliminado, no renderizar nada
    if (isDeleted) {
        return null;
    }

    return (
        <div className={`review-card ${isExpanded ? 'expanded' : ''} ${isDeleting ? 'deleting' : ''}`}>
            {/* Overlay de eliminación */}
            {isDeleting && (
                <div className="delete-overlay">
                    <div className="delete-animation">
                        <i className='bx bx-trash'></i>
                        <span>Deleting...</span>
                    </div>
                </div>
            )}
            
            {/* Card básica (siempre visible) */}
            <div className="card-basic" onClick={toggleExpand}>
                <div className="review-header">
                    <div className="game-info">
                        <h3 className="game-title">{review.gameTitle}</h3>
                        <div className="game-meta">
                            <span className="game-genre">{review.genre}</span>
                            <span className="game-platform">{review.platform}</span>
                        </div>
                    </div>
                    <div className="review-rating">
                        <div className="stars">
                            {renderStars(review.punctuation)}
                        </div>
                        <span className="rating-number">{review.punctuation}/5</span>
                    </div>
                </div>

                <div className="review-preview">
                    <p className="review-text">
                        {review.reviewText || "No review text provided..."}
                    </p>
                </div>

                <div className="review-footer">
                    <div className="review-meta">
                        <span className="reviewer">
                            <i className='bx bx-user'></i>
                            {review.userId?.username || 'Anonymous'}
                        </span>
                        <span className="review-date">
                            <i className='bx bx-calendar'></i>
                            {formatDate(review.createdAt)}
                        </span>
                    </div>
                    <div className="review-stats">
                        <span 
                            className="difficulty"
                            style={{ color: getDifficultyColor(review.difficulty) }}
                        >
                            {review.difficulty}
                        </span>
                        <span className="hours">
                            <i className='bx bx-time'></i>
                            {review.hoursPlayed}h
                        </span>
                        {review.wouldRecommend && (
                            <span className="recommended">
                                <i className='bx bx-check-circle'></i>
                                Recommended
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido expandido */}
            {isExpanded && (
                <div className="card-expanded">
                    <div className="expanded-content">
                        <div className="expanded-header">
                            <h2>{review.gameTitle} Review</h2>
                            <button className="close-btn" onClick={toggleExpand}>
                                <i className='bx bx-x'></i>
                            </button>
                        </div>
                        
                        <div className="expanded-details">
                            <div className="detail-group">
                                <i className='bx bx-category'></i>
                                <span><strong>Genre:</strong> {review.genre}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-devices'></i>
                                <span><strong>Platform:</strong> {review.platform}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-building'></i>
                                <span><strong>Developer:</strong> {review.developer}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-time'></i>
                                <span><strong>Hours Played:</strong> {review.hoursPlayed}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-trophy'></i>
                                <span><strong>Difficulty:</strong> 
                                    <span style={{ color: getDifficultyColor(review.difficulty) }}>
                                        {review.difficulty}
                                    </span>
                                </span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-calendar'></i>
                                <span><strong>Reviewed:</strong> {formatDate(review.createdAt)}</span>
                            </div>
                        </div>

                        {review.reviewText && (
                            <div className="expanded-review">
                                <h4>Review</h4>
                                <p>{review.reviewText}</p>
                            </div>
                        )}

                        <div className="review-verdict">
                            <div className="verdict-content">
                                <div className="rating-display">
                                    <div className="stars-large">
                                        {renderStars(review.punctuation)}
                                    </div>
                                    <span className="rating-text">{review.punctuation}/5 Stars</span>
                                </div>
                                {review.wouldRecommend && (
                                    <div className="recommendation">
                                        <i className='bx bx-check-circle'></i>
                                        <span>Would recommend this game</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isOwner && (
                            <div className="action-buttons">
                                <Link to={`/reviews/edit/${review._id}`} className="edit-btn">
                                    <i className='bx bx-edit'></i>
                                    Edit Review
                                </Link>
                                
                                <button 
                                    onClick={() => handleDeleteReview(review._id)} 
                                    className="delete-btn"
                                    disabled={isDeleting}
                                >
                                    <i className='bx bx-trash'></i>
                                    {isDeleting ? 'Deleting...' : 'Delete Review'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReviewCard;