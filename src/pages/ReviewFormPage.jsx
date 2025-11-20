import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/reviewform.css'
import { useReview } from "../context/ReviewContext";
import { useEffect, useState } from "react";

function ReviewFormPage() {
    const { register, handleSubmit, formState: { errors: formErrors }, setValue, reset } = useForm();
    const { createReview, updateReview, errors: reviewErrors, getMyReviews, myReviews } = useReview();
    const navigate = useNavigate();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    // En el useEffect, cambiar la forma de cargar la review:
useEffect(() => {
    if (params.id && initialLoad) {
        async function loadReview() {
            try {
                setIsEditing(true);
                setFormLoading(true);
                console.log("Loading review for editing:", params.id);
                
                // Usar getMyReviews del contexto
                await getMyReviews();
                // Buscar la review en myReviews
                const review = myReviews.find(r => r._id === params.id);
                
                if (!review) {
                    throw new Error("Review not found");
                }
                
                console.log("Review loaded:", review);
                
                // Establecer valores del formulario
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
}, [params.id, initialLoad, setValue, getMyReviews, myReviews, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setFormLoading(true);
            console.log("Datos del formulario:", data);
            
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
            
            console.log("Datos convertidos:", reviewDataToSend);
            console.log("Is editing:", isEditing);
            
            if (isEditing && params.id) {
                console.log("Updating review with ID:", params.id);
                await updateReview(params.id, reviewDataToSend);
                console.log("Review updated successfully");
            } else {
                console.log("Creating new review");
                await createReview(reviewDataToSend);
                console.log("Review created successfully");
            }
            
            navigate("/reviews/my-reviews");
             
        } catch (error) {
            console.log("Error completo:", error);
            console.log("Respuesta del error:", error.response?.data);
        } finally {
            setFormLoading(false);
        }
    });

    const renderStarRating = () => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="star-label">
                        <input
                            type="radio"
                            value={star}
                            {...register("punctuation", { required: "Rating is required" })}
                            disabled={formLoading}
                        />
                        <i className='bx bxs-star'></i>
                    </label>
                ))}
            </div>
        );
    };

    return (
        <div className="review-form-page">
            <div className="crystal-card">
                <div className="card-header">
                    <i className='bx bx-message-square-edit'></i>
                    <h1 className="card-title">
                        {isEditing ? "Edit Review" : "Write a Review"}
                    </h1>
                    <p className="card-subtitle">
                        {isEditing ? "Update your gaming experience" : "Share your gaming experience with the community"}
                    </p>
                </div>
                
                {/* Mostrar errores del backend */}
                {reviewErrors.map((error, i) => (
                    <div key={i} className="error-message">
                        {error}
                    </div>
                ))}
                
                <form className="review-form" onSubmit={onSubmit}>
                    {/* Game Title */}
                    <div className="form-group">
                        <div className="input-icon">
                            <i className='bx bx-rename'></i>
                            <input
                                type="text"
                                placeholder="Game title"
                                {...register("gameTitle", { required: "Game title is required" })}
                                disabled={formLoading}
                            />
                        </div>
                        {formErrors.gameTitle && <span className="field-error">{formErrors.gameTitle.message}</span>}
                    </div>

                    {/* Genre */}
                    <div className="form-group">
                        <div className="input-icon">
                            <i className='bx bx-category'></i>
                            <select
                                {...register("genre", { required: "Genre is required" })}
                                disabled={formLoading}
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
                        <div className="input-icon">
                            <i className='bx bx-devices'></i>
                            <select
                                {...register("platform", { required: "Platform is required" })}
                                disabled={formLoading}
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
                        <div className="input-icon">
                            <i className='bx bx-building'></i>
                            <input
                                type="text"
                                placeholder="Development studio"
                                {...register("developer", { required: "Developer is required" })}
                                disabled={formLoading}
                            />
                        </div>
                        {formErrors.developer && <span className="field-error">{formErrors.developer.message}</span>}
                    </div>

                    {/* Star Rating */}
                    <div className="form-group">
                        <label className="form-label">Rating</label>
                        {renderStarRating()}
                        {formErrors.punctuation && <span className="field-error">{formErrors.punctuation.message}</span>}
                    </div>

                    <div className="form-row">
                        {/* Hours Played */}
                        <div className="form-group">
                            <div className="input-icon">
                                <i className='bx bx-time'></i>
                                <input
                                    type="number"
                                    placeholder="Hours played"
                                    min="0"
                                    step="0.5"
                                    {...register("hoursPlayed", { 
                                        min: { value: 0, message: "Hours must be positive" }
                                    })}
                                    disabled={formLoading}
                                />
                            </div>
                            {formErrors.hoursPlayed && <span className="field-error">{formErrors.hoursPlayed.message}</span>}
                        </div>

                        {/* Difficulty */}
                        <div className="form-group">
                            <div className="input-icon">
                                <i className='bx bx-trophy'></i>
                                <select
                                    {...register("difficulty", { required: "Difficulty is required" })}
                                    disabled={formLoading}
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
                    <div className="form-group">
                        <div className="input-icon textarea-icon">
                            <i className='bx bx-text'></i>
                            <textarea
                                rows="6"
                                placeholder="Share your thoughts about the game... What did you like? What could be improved? Your overall experience?"
                                {...register("reviewText")}
                                disabled={formLoading}
                            />
                        </div>
                        {formErrors.reviewText && <span className="field-error">{formErrors.reviewText.message}</span>}
                    </div>

                    {/* Would Recommend */}
                    <div className="form-group">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                {...register("wouldRecommend")}
                                disabled={formLoading}
                            />
                            <span className="checkmark">
                                <i className='bx bx-check'></i>
                            </span>
                            <span className="checkbox-label">I would recommend this game to others</span>
                        </label>
                    </div>

                    {/* Botones de acción */}
                    <div className="form-actions">
                        <button 
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/reviews/my-reviews")}
                            disabled={formLoading}
                        >
                            <i className='bx bx-arrow-back'></i>
                            Cancel
                        </button>
                        
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={formLoading}
                        >
                            <i className={isEditing ? 'bx bx-edit' : 'bx bx-send'}></i>
                            {formLoading 
                                ? (isEditing ? "Updating Review..." : "Publishing Review...") 
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