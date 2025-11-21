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

    // Función segura para formatear fechas
    const formatDateSafe = (dateString) => {
        if (!dateString) return 'Unknown date';
        
        try {
            const date = new Date(dateString);
            // Verificar si la fecha es válida
            if (isNaN(date.getTime())) {
                return 'Unknown date';
            }
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown date';
        }
    };

    // Función para obtener user ID de forma segura - MongoDB usa _id
    const getUserId = () => {
        return user?._id || user?.id || 'Unknown ID';
    };

    // Función para obtener la fecha de creación - MongoDB usa createdAt
    const getCreatedAt = () => {
        return user?.createdAt || user?.createdAt || null;
    };

    // Función para manejar datos de estadísticas de forma segura
    const getSafeStats = () => {
        if (!userStats) return null;
        
        return {
            totalGames: userStats.totalGames || 0,
            totalReviews: userStats.totalReviews || 0,
            averageRating: userStats.averageRating || '0.0',
            totalHoursPlayed: userStats.totalHoursPlayed || 0,
            ratingDistribution: userStats.ratingDistribution || {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
            recommendedCount: userStats.recommendedCount || 0,
            difficultyDistribution: userStats.difficultyDistribution || {Easy: 0, Normal: 0, Hard: 0},
            favoriteGenre: userStats.favoriteGenre || 'None',
            favoritePlatform: userStats.favoritePlatform || 'None',
            completedGames: userStats.completedGames || 0
        };
    };

    const safeStats = getSafeStats();

    // Debug temporal - quita esto después de verificar
    useEffect(() => {
        console.log('=== DEBUG USER DATA ===');
        console.log('User object:', user);
        console.log('User _id:', user?._id);
        console.log('User id:', user?.id);
        console.log('User createdAt:', user?.createdAt);
        console.log('User createdAt type:', typeof user?.createdAt);
        console.log('User stats:', userStats);
    }, [user, userStats]);

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
                {/* Header del Perfil */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        <i className='bx bx-user'></i>
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-username">{user?.username || 'User'}</h1>
                        <p className="profile-email">{user?.email || 'No email'}</p>
                        <div className="profile-meta">
                            <span className="meta-item">
                                <i className='bx bx-calendar'></i>
                                Member since {formatDateSafe(getCreatedAt())}
                            </span>
                            <span className="meta-item">
                                <i className='bx bx-id-card'></i>
                                User ID: {getUserId()}
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

                {/* Estadísticas Principales */}
                {safeStats ? (
                    <div className="stats-section">
                        <h2 className="section-title">Your Gaming Statistics</h2>
                        
                        {/* Tarjetas de Estadísticas Principales */}
                        <div className="stats-grid-main">
                            <div className="stat-card main-stat">
                                <div className="stat-icon">
                                    <i className='bx bx-game'></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{safeStats.totalGames}</h3>
                                    <p>Games in Library</p>
                                </div>
                            </div>

                            <div className="stat-card main-stat">
                                <div className="stat-icon">
                                    <i className='bx bx-message-square-detail'></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{safeStats.totalReviews}</h3>
                                    <p>Reviews Written</p>
                                </div>
                            </div>

                            <div className="stat-card main-stat">
                                <div className="stat-icon">
                                    <i className='bx bx-star'></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{safeStats.averageRating}</h3>
                                    <p>Average Rating</p>
                                </div>
                            </div>

                            <div className="stat-card main-stat">
                                <div className="stat-icon">
                                    <i className='bx bx-time'></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{safeStats.totalHoursPlayed}</h3>
                                    <p>Hours Played</p>
                                </div>
                            </div>
                        </div>

                        {/* Mostrar mensaje si no hay estadísticas reales */}
                        {safeStats.totalGames === 0 && safeStats.totalReviews === 0 && (
                            <div className="empty-stats-warning">
                                <i className='bx bx-info-circle'></i>
                                <p>Add games and write reviews to see detailed statistics!</p>
                            </div>
                        )}

                        {/* Solo mostrar estadísticas detalladas si hay datos */}
                        {(safeStats.totalReviews > 0 || safeStats.totalGames > 0) && (
                            <>
                                {/* Estadísticas Detalladas */}
                                <div className="stats-grid-detailed">
                                    {/* Distribución de Ratings */}
                                    {safeStats.totalReviews > 0 && (
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
                                                                    width: `${(safeStats.ratingDistribution[rating] / safeStats.totalReviews) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="rating-count">
                                                            {safeStats.ratingDistribution[rating]}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Estadísticas de Recomendación */}
                                    {safeStats.totalReviews > 0 && (
                                        <div className="stat-card detailed-stat">
                                            <h4>Recommendations</h4>
                                            <div className="recommendation-stats">
                                                <div className="rec-item">
                                                    <div className="rec-icon positive">
                                                        <i className='bx bx-check-circle'></i>
                                                    </div>
                                                    <div className="rec-content">
                                                        <h3>{safeStats.recommendedCount}</h3>
                                                        <p>Games Recommended</p>
                                                    </div>
                                                </div>
                                                <div className="rec-percentage">
                                                    {Math.round((safeStats.recommendedCount / safeStats.totalReviews) * 100)}% recommendation rate
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Distribución de Dificultad */}
                                    {safeStats.totalReviews > 0 && (
                                        <div className="stat-card detailed-stat">
                                            <h4>Difficulty Preference</h4>
                                            <div className="difficulty-stats">
                                                {Object.entries(safeStats.difficultyDistribution).map(([difficulty, count]) => (
                                                    <div key={difficulty} className="difficulty-item">
                                                        <span className={`difficulty-label ${difficulty.toLowerCase()}`}>
                                                            {difficulty}
                                                        </span>
                                                        <div className="difficulty-bar-container">
                                                            <div 
                                                                className={`difficulty-bar ${difficulty.toLowerCase()}`}
                                                                style={{
                                                                    width: `${(count / safeStats.totalReviews) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="difficulty-count">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Preferencias */}
                                    <div className="stat-card detailed-stat">
                                        <h4>Your Preferences</h4>
                                        <div className="preference-stats">
                                            <div className="preference-item">
                                                <div className="preference-icon">
                                                    <i className='bx bx-category'></i>
                                                </div>
                                                <div className="preference-content">
                                                    <label>Favorite Genre</label>
                                                    <span>{safeStats.favoriteGenre}</span>
                                                </div>
                                            </div>
                                            <div className="preference-item">
                                                <div className="preference-icon">
                                                    <i className='bx bx-devices'></i>
                                                </div>
                                                <div className="preference-content">
                                                    <label>Favorite Platform</label>
                                                    <span>{safeStats.favoritePlatform}</span>
                                                </div>
                                            </div>
                                            <div className="preference-item">
                                                <div className="preference-icon">
                                                    <i className='bx bx-trophy'></i>
                                                </div>
                                                <div className="preference-content">
                                                    <label>Completed Games</label>
                                                    <span>{safeStats.completedGames} / {safeStats.totalGames}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Resumen de Actividad */}
                                <div className="activity-summary">
                                    <h3>Activity Summary</h3>
                                    <div className="summary-grid">
                                        <div className="summary-item">
                                            <i className='bx bx-trending-up'></i>
                                            <div>
                                                <h4>Most Active</h4>
                                                <p>
                                                    {safeStats.totalReviews > 0 ? 
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
                                                    {safeStats.totalReviews >= 20 ? 'Expert Reviewer' :
                                                     safeStats.totalReviews >= 10 ? 'Advanced Reviewer' :
                                                     safeStats.totalReviews >= 5 ? 'Intermediate Reviewer' :
                                                     safeStats.totalReviews >= 1 ? 'Beginner Reviewer' :
                                                     'New Reviewer'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
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