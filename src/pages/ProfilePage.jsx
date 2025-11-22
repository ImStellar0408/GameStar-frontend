import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import '../styles/profile.css';

function ProfilePage() {
    const { user } = useAuth();
    const { userStats, loading, errors, refreshStats } = useProfile();

    useEffect(() => {
        refreshStats();
    }, []);

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <div className="loading-state">
                        <i className='bx bx-loader-circle bx-spin'></i>
                        <h2>Loading your profile...</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <i className='bx bx-user'></i>
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-username">{user?.username}</h1>
                        <p className="profile-email">{user?.email}</p>
                        <div className="profile-meta">
                            <span className="meta-item">
                                <i className='bx bx-id-card'></i>
                                User ID: {user?.id}
                            </span>
                        </div>
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

                {userStats && (
                    <div className="stats-section">
                        <h2 className="section-title">Your Gaming Statistics</h2>

                        <div className="stats-grid-main">
                            <div className="stat-card main-stat">
                                <div className="stat-icon">
                                    <i className='bx bx-game'></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{userStats.totalGames}</h3>
                                    <p>Games in Library</p>
                                </div>
                            </div>

                            <div className="stat-card main-stat">
                                <div className="stat-icon">
                                    <i className='bx bx-message-square-detail'></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{userStats.totalReviews}</h3>
                                    <p>Reviews Written</p>
                                </div>
                            </div>

                            <div className="stat-card main-stat">
                                <div className="stat-icon">
                                    <i className='bx bx-star'></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{userStats.averageRating || '0.0'}</h3>
                                    <p>Average Rating</p>
                                </div>
                            </div>

                            <div className="stat-card main-stat">
                                <div className="stat-icon">
                                    <i className='bx bx-time'></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{userStats.totalHoursPlayed}</h3>
                                    <p>Hours Played</p>
                                </div>
                            </div>
                        </div>

                        <div className="stats-grid-detailed">
                            <div className="stat-card detailed-stat">
                                <h4>Rating Distribution</h4>
                                <div className="rating-bars">
                                    {[5, 4, 3, 2, 1].map(rating => (
                                        <div key={rating} className="rating-bar">
                                            <span className="rating-label">
                                                <i className='bx bxs-star'></i> {rating}
                                            </span>
                                            <div className="bar-container">
                                                <div 
                                                    className="bar-fill"
                                                    style={{
                                                        width: `${(userStats.ratingDistribution[rating] / userStats.totalReviews) * 100 || 0}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="rating-count">
                                                {userStats.ratingDistribution[rating]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="stat-card detailed-stat">
                                <h4>Recommendations</h4>
                                <div className="recommendation-stats">
                                    <div className="rec-item">
                                        <div className="rec-icon positive">
                                            <i className='bx bx-check-circle'></i>
                                        </div>
                                        <div className="rec-content">
                                            <h3>{userStats.recommendedCount}</h3>
                                            <p>Games Recommended</p>
                                        </div>
                                    </div>
                                    <div className="rec-percentage">
                                        {userStats.totalReviews > 0 ? 
                                            `${Math.round((userStats.recommendedCount / userStats.totalReviews) * 100)}% recommendation rate` :
                                            'No reviews yet'
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card detailed-stat">
                                <h4>Difficulty Preference</h4>
                                <div className="difficulty-stats">
                                    {Object.entries(userStats.difficultyDistribution).map(([difficulty, count]) => (
                                        <div key={difficulty} className="difficulty-item">
                                            <span className={`difficulty-label ${difficulty.toLowerCase()}`}>
                                                {difficulty}
                                            </span>
                                            <div className="difficulty-bar-container">
                                                <div 
                                                    className={`difficulty-bar ${difficulty.toLowerCase()}`}
                                                    style={{
                                                        width: `${(count / userStats.totalReviews) * 100 || 0}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="difficulty-count">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="stat-card detailed-stat">
                                <h4>Your Preferences</h4>
                                <div className="preference-stats">
                                    <div className="preference-item">
                                        <div className="preference-icon">
                                            <i className='bx bx-category'></i>
                                        </div>
                                        <div className="preference-content">
                                            <label>Favorite Genre</label>
                                            <span>{userStats.favoriteGenre}</span>
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-icon">
                                            <i className='bx bx-devices'></i>
                                        </div>
                                        <div className="preference-content">
                                            <label>Favorite Platform</label>
                                            <span>{userStats.favoritePlatform}</span>
                                        </div>
                                    </div>
                                    <div className="preference-item">
                                        <div className="preference-icon">
                                            <i className='bx bx-trophy'></i>
                                        </div>
                                        <div className="preference-content">
                                            <label>Completed Games</label>
                                            <span>{userStats.completedGames} / {userStats.totalGames}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="activity-summary">
                            <h3>Activity Summary</h3>
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <i className='bx bx-trending-up'></i>
                                    <div>
                                        <h4>Most Active</h4>
                                        <p>
                                            {userStats.totalReviews > 0 ? 
                                                'You are an active reviewer!' : 
                                                'Start writing reviews to see your activity'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="summary-item">
                                    <i className='bx bx-award'></i>
                                    <div>
                                        <h4>Reviewer Level</h4>
                                        <p>
                                            {userStats.totalReviews >= 20 ? 'Expert Reviewer' :
                                             userStats.totalReviews >= 10 ? 'Advanced Reviewer' :
                                             userStats.totalReviews >= 5 ? 'Intermediate Reviewer' :
                                             userStats.totalReviews >= 1 ? 'Beginner Reviewer' :
                                             'New Reviewer'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!userStats && !loading && (
                    <div className="empty-stats">
                        <div className="empty-content">
                            <i className='bx bx-stats'></i>
                            <h3>No Statistics Yet</h3>
                            <p>Start adding games and writing reviews to see your statistics!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;