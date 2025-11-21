import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/reviewform.css'
import { useReview } from "../context/ReviewContext";
import { useEffect, useState } from "react";

function ReviewFormPage() {
    const { register, handleSubmit, formState: { errors: formErrors }, setValue, watch } = useForm();
    const { createReview, updateReview, errors: reviewErrors, getMyReviews } = useReview();
    const navigate = useNavigate();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const punctuationValue = watch("punctuation", 0);

    useEffect(() => {
        if (params.id && initialLoad) {
            async function loadReview() {
                try {
                    setIsEditing(true);
                    setFormLoading(true);
                    
                    const reviews = await getMyReviews();
                    const review = reviews.find(r => r._id === params.id);
                    
                    if (!review) {
                        throw new Error("Review not found");
                    }
                    
                    setValue("gameTitle", review.gameTitle);
                    setValue("genre", review.genre);
                    setValue("platform", review.platform);
                    setValue("developer", review.developer);
                    setValue("punctuation", review.punctuation);
                    setValue("reviewText", review.reviewText);
                    setValue("hoursPlayed", review.hoursPlayed);
                    setValue("difficulty", review.difficulty);
                    setValue("wouldRecommend", review.wouldRecommend);
                    
                } catch (error) {
                    console.error("Error loading review:", error);
                    navigate("/reviews/my-reviews");
                } finally {
                    setFormLoading(false);
                    setInitialLoad(false);
                }
            }
            loadReview();
        } else if (!params.id) {
            setIsEditing(false);
            setInitialLoad(false);
        }
    }, [params.id, initialLoad, setValue, getMyReviews, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setFormLoading(true);
            
            const reviewDataToSend = {
                gameTitle: data.gameTitle,
                genre: data.genre,
                platform: data.platform,
                developer: data.developer,
                punctuation: Number(data.punctuation),
                reviewText: data.reviewText,
                hoursPlayed: Number(data.hoursPlayed) || 0,
                difficulty: data.difficulty,
                wouldRecommend: Boolean(data.wouldRecommend)
            };
            
            if (isEditing && params.id) {
                await updateReview(params.id, reviewDataToSend);
            } else {
                await createReview(reviewDataToSend);
            }
            
            navigate("/reviews/my-reviews");
             
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setFormLoading(false);
        }
    });

    const handleStarClick = (rating) => {
        setValue("punctuation", rating, { shouldValidate: true });
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
                
                {reviewErrors.map((error, i) => (
                    <div key={i} className="error-message">
                        {error}
                    </div>
                ))}
                
                <form className="review-form" onSubmit={onSubmit}>
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
                            onClick={() => navigate("/reviews/my-reviews")}
                            disabled={formLoading}
                        >
                            <i className='bx bx-arrow-back'></i>
                            Cancel
                        </button>
                        
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={formLoading}
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