import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/reviewform.css'
import { useReview } from "../context/ReviewContext";
import { useEffect, useState, useRef } from "react";

function ReviewFormPage() {
    const { register, handleSubmit, formState: { errors: formErrors }, setValue, watch, reset } = useForm();
    const { createReview, updateReview, errors: reviewErrors, getMyReviews, getAvailableGames, availableGames, clearErrors } = useReview();
    const navigate = useNavigate();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [currentVideoKey, setCurrentVideoKey] = useState(0);

    const punctuationValue = watch("punctuation", 0);
    const selectedGameId = watch("gameId");

    // Limpiar errores al montar el componente
    useEffect(() => {
        clearErrors();
    }, []);

    useEffect(() => {
        if (params.id) {
            // Modo edición
            async function loadReview() {
                try {
                    setIsEditing(true);
                    setFormLoading(true);
                    clearErrors();
                    
                    const reviews = await getMyReviews();
                    const review = reviews.find(r => r._id === params.id);
                    
                    if (!review) {
                        throw new Error("Review not found");
                    }

                    setEditingReview(review);
                    
                    // Cargar juegos disponibles para mostrar en el selector
                    await getAvailableGames();
                    
                    // Manejar gameId - puede ser string o objeto poblado
                    const gameIdValue = review.gameId?._id || review.gameId;
                    
                    reset({
                        gameId: gameIdValue || "",
                        punctuation: review.punctuation,
                        reviewText: review.reviewText || "",
                        hoursPlayed: review.hoursPlayed || 0,
                        difficulty: review.difficulty,
                        wouldRecommend: review.wouldRecommend || false,
                        gameTitle: review.gameTitle,
                        genre: review.genre,
                        platform: review.platform,
                        developer: review.developer
                    });
                    
                } catch (error) {
                    console.error("Error loading review:", error);
                    navigate("/reviews/my-reviews");
                } finally {
                    setFormLoading(false);
                }
            }
            loadReview();
        } else {
            // Modo creación - cargar juegos disponibles
            setIsEditing(false);
            setEditingReview(null);
            getAvailableGames().catch(error => {
                console.error("Error loading available games:", error);
            });
        }
    }, [params.id]);

    // Efecto para cargar datos del juego seleccionado (solo en modo creación)
    useEffect(() => {
        if (!isEditing && selectedGameId && availableGames.length > 0) {
            const game = availableGames.find(g => g._id === selectedGameId);
            if (game) {
                setValue("gameTitle", game.title, { shouldValidate: true });
                setValue("genre", game.genre, { shouldValidate: true });
                setValue("platform", game.platform, { shouldValidate: true });
                setValue("developer", game.developer, { shouldValidate: true });
                
                // Cambiar la key cuando cambia el juego para forzar reinicio del video
                setCurrentVideoKey(prev => prev + 1);
            }
        }
    }, [selectedGameId, availableGames, setValue, isEditing]);

    // Función para determinar si una URL es un formato animado
    const isAnimatedMedia = (url) => {
        if (!url) return false;
        const animatedExtensions = ['.gif', '.webm', '.mp4', '.mov', '.avi'];
        const urlLower = url.toLowerCase();
        return animatedExtensions.some(ext => urlLower.includes(ext));
    };

    // Función para determinar el tipo de medio
    const getMediaType = (url) => {
        if (!url) return 'image';
        const urlLower = url.toLowerCase();
        
        if (urlLower.includes('.gif')) return 'gif';
        if (urlLower.includes('.webm')) return 'video';
        if (urlLower.includes('.mp4')) return 'video';
        if (urlLower.includes('.mov')) return 'video';
        if (urlLower.includes('.avi')) return 'video';
        
        return 'image';
    };

    // Hook para manejar el video
    const useVideoReset = (videoUrl) => {
        const videoRef = useRef(null);

        useEffect(() => {
            if (videoRef.current && videoUrl) {
                // Reiniciar el video cuando cambia la URL
                videoRef.current.load();
                videoRef.current.play().catch(error => {
                    console.log('Auto-play prevented:', error);
                });
            }
        }, [videoUrl]);

        return videoRef;
    };

    // Componente para video con reinicio automático
    const VideoPlayer = ({ src, className }) => {
        const videoRef = useVideoReset(src);

        const handleVideoLoad = () => {
            if (videoRef.current) {
                videoRef.current.play().catch(error => {
                    console.log('Auto-play prevented:', error);
                });
            }
        };

        return (
            <video 
                ref={videoRef}
                key={`video-${currentVideoKey}-${src}`}
                className={className}
                autoPlay 
                muted 
                loop 
                playsInline
                onLoadedData={handleVideoLoad}
                onError={(e) => console.error('Video loading error:', e)}
            >
                <source src={src} type={src.includes('.webm') ? 'video/webm' : 'video/mp4'} />
                Tu navegador no soporta el elemento de video.
            </video>
        );
    };

    // Función para renderizar la portada del juego
    const renderGameCover = (game) => {
        if (!game?.coverImageUrl) return null;

        const mediaType = getMediaType(game.coverImageUrl);
        const isAnimated = isAnimatedMedia(game.coverImageUrl);

        return (
            <div className="game-cover">
                <div className="game-cover-content">
                    {isAnimated && (
                        <span className="animated-badge">
                            {mediaType === 'gif' ? 'GIF' : 'VIDEO'}
                        </span>
                    )}
                    
                    {mediaType === 'video' ? (
                        <VideoPlayer 
                            src={game.coverImageUrl} 
                            className="game-cover-video"
                        />
                    ) : mediaType === 'gif' ? (
                        <img 
                            key={`gif-${currentVideoKey}-${game.coverImageUrl}`}
                            src={game.coverImageUrl} 
                            alt={game.title}
                            className="game-cover-animated"
                            loading="lazy"
                            onError={(e) => {
                                console.error('GIF loading error:', e);
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <img 
                            src={game.coverImageUrl} 
                            alt={game.title}
                            className="game-cover-img"
                            loading="lazy"
                            onError={(e) => {
                                console.error('Image loading error:', e);
                                e.target.style.display = 'none';
                            }}
                        />
                    )}
                </div>
            </div>
        );
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            setFormLoading(true);
            clearErrors();
            
            // Preparar datos para enviar - solo campos editables en modo edición
            const reviewDataToSend = {
                punctuation: Number(data.punctuation),
                reviewText: data.reviewText,
                hoursPlayed: Number(data.hoursPlayed) || 0,
                difficulty: data.difficulty,
                wouldRecommend: Boolean(data.wouldRecommend)
            };

            // En modo creación, incluir gameId
            if (!isEditing) {
                reviewDataToSend.gameId = data.gameId;
            }
            
            if (isEditing && params.id) {
                await updateReview(params.id, reviewDataToSend);
            } else {
                await createReview(reviewDataToSend);
            }
            
            navigate("/reviews/my-reviews");
             
        } catch (error) {
            console.log("Error submitting review:", error);
        } finally {
            setFormLoading(false);
        }
    });

    const handleStarClick = (rating) => {
        setValue("punctuation", rating, { shouldValidate: true });
    };

    const handleCancel = () => {
        clearErrors();
        navigate("/reviews/my-reviews");
    };

    const renderStarRating = () => {
        return (
            <div className="star-rating-container">
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <div 
                            key={star} 
                            className={`star-item ${star <= punctuationValue ? 'active' : ''}`}
                            onClick={() => handleStarClick(star)}
                        >
                            <i className='bx bxs-star'></i>
                        </div>
                    ))}
                </div>
                <div className="rating-text">
                    {punctuationValue > 0 ? `${punctuationValue} out of 5` : "Select your rating"}
                </div>
            </div>
        );
    };

    // Encontrar el juego seleccionado para mostrar en la vista previa
    const selectedGame = selectedGameId ? availableGames.find(game => game._id === selectedGameId) : null;

    // En modo edición, usar los datos de la review que se está editando
    const displayGame = isEditing && editingReview ? {
        title: editingReview.gameTitle,
        developer: editingReview.developer,
        genre: editingReview.genre,
        platform: editingReview.platform,
        releaseYear: editingReview.gameId?.releaseYear,
        coverImageUrl: editingReview.gameId?.coverImageUrl || editingReview.coverImageUrl
    } : selectedGame;

    return (
        <div className="review-form-page">
            <div className="form-container">
                <div className="form-header">
                    <div className="header-content">
                        <h1 className="header-title">
                            {isEditing ? "Edit Review" : "Write a Review"}
                        </h1>
                        <p className="header-subtitle">
                            {isEditing ? "Update your gaming experience" : "Share your gaming experience with the community"}
                        </p>
                    </div>
                </div>
                
                {reviewErrors.length > 0 && (
                    <div className="error-banner">
                        {reviewErrors.map((error, i) => (
                            <div key={i} className="error-message">
                                {error}
                            </div>
                        ))}
                    </div>
                )}
                
                <form className="review-form" onSubmit={onSubmit}>
                    {/* Selección de Juego - Solo en modo creación */}
                    {!isEditing && (
                        <div className="form-section">
                            <label className="section-label">Select Game from Your Library</label>
                            <div className="input-wrapper">
                                <i className='bx bx-game input-icon'></i>
                                <select
                                    {...register("gameId", { required: "Please select a game from your library" })}
                                    disabled={formLoading}
                                    className="form-input"
                                >
                                    <option value="">Choose a game to review...</option>
                                    {availableGames.map(game => (
                                        <option key={game._id} value={game._id}>
                                            {game.title} ({game.platform}) - {game.developer}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {formErrors.gameId && <span className="field-error">{formErrors.gameId.message}</span>}
                        </div>
                    )}

                    {/* Información del juego seleccionado */}
                    {displayGame && (
                        <div className="game-preview">
                            <div className="game-preview-content">
                                <div className="game-preview-header">
                                    <h4>{displayGame.title}</h4>
                                    {displayGame.releaseYear && (
                                        <span className="game-year">{displayGame.releaseYear}</span>
                                    )}
                                    {isEditing && (
                                        <span className="edit-badge">Editing Review</span>
                                    )}
                                </div>
                                <div className="game-preview-details">
                                    <span className="game-detail">
                                        <i className='bx bx-category'></i>
                                        {displayGame.genre}
                                    </span>
                                    <span className="game-detail">
                                        <i className='bx bx-devices'></i>
                                        {displayGame.platform}
                                    </span>
                                    <span className="game-detail">
                                        <i className='bx bx-building'></i>
                                        {displayGame.developer}
                                    </span>
                                </div>
                                {/* Renderizar portada del juego */}
                                {renderGameCover(displayGame)}
                            </div>
                        </div>
                    )}

                    {/* Mensaje cuando no hay juegos disponibles (solo en modo creación) */}
                    {!isEditing && availableGames.length === 0 && !formLoading && (
                        <div className="empty-games-state">
                            <div className="empty-games-content">
                                <i className='bx bx-game'></i>
                                <h4>No games available for review</h4>
                                <p>You need to add games to your library before you can review them, or you may have already reviewed all your games.</p>
                                <button 
                                    type="button" 
                                    className="empty-games-button"
                                    onClick={() => navigate("/games/new")}
                                >
                                    <i className='bx bx-plus'></i>
                                    Add Game to Library
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Campos de juego (solo en modo creación o si no hay juego seleccionado) */}
                    {(!isEditing && !selectedGame) && (
                        <div className="form-grid">
                            {/* Game Title */}
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <i className='bx bx-rename input-icon'></i>
                                    <input
                                        type="text"
                                        placeholder="Game title"
                                        {...register("gameTitle", { required: "Game title is required" })}
                                        disabled={formLoading}
                                        className="form-input"
                                    />
                                </div>
                                {formErrors.gameTitle && <span className="field-error">{formErrors.gameTitle.message}</span>}
                            </div>

                            {/* Genre */}
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <i className='bx bx-category input-icon'></i>
                                    <select
                                        {...register("genre", { required: "Genre is required" })}
                                        disabled={formLoading}
                                        className="form-input"
                                    >
                                        <option value="">Select genre</option>
                                        <option value="Action">Action</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="RPG">RPG</option>
                                        <option value="Strategy">Strategy</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Racing">Racing</option>
                                        <option value="Shooter">Shooter</option>
                                        <option value="Indie">Indie</option>
                                        <option value="Metroidvania">Metroidvania</option>
                                        <option value="Simulation">Simulation</option>
                                        <option value="Horror">Horror</option>
                                        <option value="Platformer">Platformer</option>
                                        <option value="Fighting">Fighting</option>
                                        <option value="Puzzle">Puzzle</option>
                                    </select>
                                </div>
                                {formErrors.genre && <span className="field-error">{formErrors.genre.message}</span>}
                            </div>

                            {/* Platform */}
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <i className='bx bx-devices input-icon'></i>
                                    <select
                                        {...register("platform", { required: "Platform is required" })}
                                        disabled={formLoading}
                                        className="form-input"
                                    >
                                        <option value="">Select platform</option>
                                        <option value="PC">PC</option>
                                        <option value="PlayStation 5">PlayStation 5</option>
                                        <option value="PlayStation 4">PlayStation 4</option>
                                        <option value="PlayStation 3">PlayStation 3</option>
                                        <option value="Xbox Series X/S">Xbox Series X/S</option>
                                        <option value="Xbox One">Xbox One</option>
                                        <option value="Nintendo Switch">Nintendo Switch</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Multiple">Multiple Platforms</option>
                                    </select>
                                </div>
                                {formErrors.platform && <span className="field-error">{formErrors.platform.message}</span>}
                            </div>

                            {/* Developer */}
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <i className='bx bx-building input-icon'></i>
                                    <input
                                        type="text"
                                        placeholder="Development studio"
                                        {...register("developer", { required: "Developer is required" })}
                                        disabled={formLoading}
                                        className="form-input"
                                    />
                                </div>
                                {formErrors.developer && <span className="field-error">{formErrors.developer.message}</span>}
                            </div>
                        </div>
                    )}

                    {/* Star Rating */}
                    <div className="form-section">
                        <label className="section-label">Rating</label>
                        {renderStarRating()}
                        {formErrors.punctuation && <span className="field-error">{formErrors.punctuation.message}</span>}
                    </div>

                    <div className="form-row">
                        {/* Hours Played */}
                        <div className="form-group">
                            <div className="input-wrapper">
                                <i className='bx bx-time input-icon'></i>
                                <input
                                    type="number"
                                    placeholder="Hours played"
                                    min="0"
                                    step="0.5"
                                    {...register("hoursPlayed", { 
                                        min: { value: 0, message: "Hours must be positive" }
                                    })}
                                    disabled={formLoading}
                                    className="form-input"
                                />
                            </div>
                            {formErrors.hoursPlayed && <span className="field-error">{formErrors.hoursPlayed.message}</span>}
                        </div>

                        {/* Difficulty */}
                        <div className="form-group">
                            <div className="input-wrapper">
                                <i className='bx bx-trophy input-icon'></i>
                                <select
                                    {...register("difficulty", { required: "Difficulty is required" })}
                                    disabled={formLoading}
                                    className="form-input"
                                >
                                    <option value="">Select difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            {formErrors.difficulty && <span className="field-error">{formErrors.difficulty.message}</span>}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="form-section">
                        <div className="input-wrapper">
                            <i className='bx bx-text textarea-icon'></i>
                            <textarea
                                rows="5"
                                placeholder="Share your thoughts about the game... What did you like? What could be improved? Your overall experience?"
                                {...register("reviewText", {
                                    required: "Review text is required",
                                    minLength: { value: 10, message: "Review must be at least 10 characters" }
                                })}
                                disabled={formLoading}
                                className="form-textarea"
                            />
                        </div>
                        {formErrors.reviewText && <span className="field-error">{formErrors.reviewText.message}</span>}
                    </div>

                    {/* Would Recommend */}
                    <div className="form-checkbox">
                        <label className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                {...register("wouldRecommend")}
                                disabled={formLoading}
                                className="checkbox-input"
                            />
                            <span className="checkbox-custom">
                                <i className='bx bx-check'></i>
                            </span>
                            <span className="checkbox-label">I would recommend this game to others</span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button 
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={formLoading}
                        >
                            <i className='bx bx-arrow-back'></i>
                            Cancel
                        </button>
                        
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={formLoading || (!isEditing && availableGames.length === 0)}
                        >
                            {formLoading 
                                ? (isEditing ? "Updating..." : "Publishing...") 
                                : (isEditing ? "Update Review" : "Publish Review")
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReviewFormPage;