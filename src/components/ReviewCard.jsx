import { useState } from 'react';
import '../styles/reviewspage.css';
import { useReview } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function ReviewCard({ review, isOwner = false }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const { deleteReview } = useReview();
    const { user } = useAuth();

    const determineIsOwner = () => {
        if (isOwner) return true;
        if (!user) return false;
        
        if (review.userId && user._id === review.userId._id) return true;
        if (review.user && user._id === review.user._id) return true;
        if (review.userId && typeof review.userId === 'string' && user._id === review.userId) return true;
        
        return false;
    };

    const actualIsOwner = determineIsOwner();

    const handleDeleteReview = async (id) => {
        setIsDeleting(true);
        try {
            await deleteReview(id);
            setIsDeleted(true);
        } catch (error) {
            console.error('Error deleting review:', error);
            setIsDeleting(false);
        }
    };

    const toggleExpand = (e) => {
        if (e.target.closest('.action-btn') || e.target.closest('.action-buttons')) {
            return;
        }
        if (!isDeleting && !isDeleted) {
            setIsExpanded(!isExpanded);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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

    const gameInfo = review.gameId || {};
    const gameTitle = gameInfo.title || review.gameTitle;
    const gameDeveloper = gameInfo.developer || review.developer;
    const gameGenre = gameInfo.genre || review.genre;
    const gamePlatform = gameInfo.platform || review.platform;
    const gameReleaseYear = gameInfo.releaseYear;
    const gameCoverImage = gameInfo.coverImageUrl;

    if (isDeleted) {
        return null;
    }

    return (
        <>
            <div className="review-card">
                <div className="review-card-compact" onClick={toggleExpand}>
                    <div className="compact-header">
                        <div className="game-info">
                            <h3 className="game-title">{gameTitle}</h3>
                            <p className="game-developer">{gameDeveloper}</p>
                        </div>
                        <div className="rating-display">
                            <div className="stars-compact">
                                {renderStars(review.punctuation)}
                            </div>
                            <span className="rating-badge">{review.punctuation}/5</span>
                        </div>
                    </div>

                    <div className="compact-meta">
                        <span className="meta-item">
                            <i className='bx bx-category'></i>
                            {gameGenre}
                        </span>
                        <span className="meta-item">
                            <i className='bx bx-devices'></i>
                            {gamePlatform}
                        </span>
                        <span className="meta-item" style={{ color: getDifficultyColor(review.difficulty) }}>
                            <i className='bx bx-trophy'></i>
                            {review.difficulty}
                        </span>
                    </div>

                    {review.reviewText && (
                        <div className="review-preview">
                            <p>{review.reviewText.substring(0, 100)}...</p>
                        </div>
                    )}

                    <div className="compact-footer">
                        <div className="user-date">
                            <span className="user">
                                <i className='bx bx-user'></i>
                                {review.user?.username || review.userId?.username || 'Anonymous'}
                            </span>
                            <span className="date">
                                <i className='bx bx-calendar'></i>
                                {formatDate(review.createdAt)}
                            </span>
                        </div>
                        <div className="stats">
                            {review.hoursPlayed > 0 && (
                                <span className="hours">
                                    <i className='bx bx-time'></i>
                                    {review.hoursPlayed}h
                                </span>
                            )}
                            {review.wouldRecommend && (
                                <span className="recommended">
                                    <i className='bx bx-check-circle'></i>
                                    Recommended
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {isDeleting && (
                    <div className="delete-overlay">
                        <div className="delete-animation">
                            <i className='bx bx-trash'></i>
                            <span>Deleting Review...</span>
                        </div>
                    </div>
                )}
            </div>

            {isExpanded && (
                <div className="modal-overlay" onClick={() => setIsExpanded(false)}>
                    <div className="review-card-expanded" onClick={(e) => e.stopPropagation()}>
                        <div className="expanded-container">
                            <div className="expanded-header">
                                <div className="title-section">
                                    <h2>{gameTitle}</h2>
                                    <p className="developer">{gameDeveloper}</p>
                                    {gameReleaseYear && (
                                        <p className="release-year">Released: {gameReleaseYear}</p>
                                    )}
                                </div>
                                <button 
                                    className="close-button" 
                                    onClick={() => setIsExpanded(false)}
                                >
                                    <i className='bx bx-x'></i>
                                </button>
                            </div>

                            <div className="expanded-content">
                                
                                <div className="main-rating-section">
                                    <div className="rating-visual">
                                        <div className="stars-large">
                                            {renderStars(review.punctuation)}
                                        </div>
                                        <div className="rating-text">
                                            <span className="score">{review.punctuation}</span>
                                            <span className="out-of">/5</span>
                                        </div>
                                    </div>
                                    {review.wouldRecommend && (
                                        <div className="recommendation-tag">
                                            <i className='bx bx-check-circle'></i>
                                            Recommended
                                        </div>
                                    )}
                                </div>

                                <div className="details-grid">
                                    <div className="detail-card">
                                        <i className='bx bx-category'></i>
                                        <div>
                                            <label>Genre</label>
                                            <span>{gameGenre}</span>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <i className='bx bx-devices'></i>
                                        <div>
                                            <label>Platform</label>
                                            <span>{gamePlatform}</span>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <i className='bx bx-trophy'></i>
                                        <div>
                                            <label>Difficulty</label>
                                            <span style={{ color: getDifficultyColor(review.difficulty) }}>
                                                {review.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <i className='bx bx-time'></i>
                                        <div>
                                            <label>Hours Played</label>
                                            <span>{review.hoursPlayed || 'Not specified'}</span>
                                        </div>
                                    </div>
                                </div>

                                {review.reviewText && (
                                    <div className="review-text-section">
                                        <h4>Review</h4>
                                        <div className="review-text-content">
                                            {review.reviewText}
                                        </div>
                                    </div>
                                )}

                                <div className="user-info-section">
                                    <div className="user-avatar">
                                        <i className='bx bx-user'></i>
                                    </div>
                                    <div className="user-details">
                                        <span className="username">
                                            {review.user?.username || review.userId?.username || 'Anonymous'}
                                        </span>
                                        <span className="review-date">
                                            Reviewed on {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {actualIsOwner && (
                                    <div className="action-buttons">
                                        <Link to={`/reviews/edit/${review._id}`} className="action-btn edit-btn">
                                            <i className='bx bx-edit'></i>
                                            Edit Review
                                        </Link>
                                        <button 
                                            onClick={() => handleDeleteReview(review._id)} 
                                            className="action-btn delete-btn"
                                            disabled={isDeleting}
                                        >
                                            <i className='bx bx-trash'></i>
                                            {isDeleting ? 'Deleting...' : 'Delete Review'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ReviewCard;