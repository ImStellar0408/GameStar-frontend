import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/gameform.css';
import { useGame } from "../context/GameContext";
import { useEffect, useState } from "react";

function GameFormPage() {
    const { register, handleSubmit, formState: { errors: formErrors }, setValue, watch } = useForm();
    const { createGame, updateGame, errors: gameErrors, getGame } = useGame();
    const navigate = useNavigate();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const isCompletedValue = watch("isCompleted", false);

    useEffect(() => {
        if (params.id && initialLoad) {
            async function loadGame() {
                try {
                    setIsEditing(true);
                    setFormLoading(true);
                    
                    const game = await getGame(params.id);
                    
                    setValue("title", game.title);
                    setValue("genre", game.genre);
                    setValue("platform", game.platform);
                    setValue("releaseYear", game.releaseYear);
                    setValue("developer", game.developer);
                    setValue("coverImageUrl", game.coverImageUrl);
                    setValue("description", game.description);
                    setValue("isCompleted", game.isCompleted);
                    
                } catch (error) {
                    console.error("Error loading game:", error);
                    navigate("/games");
                } finally {
                    setFormLoading(false);
                    setInitialLoad(false);
                }
            }
            loadGame();
        } else if (!params.id) {
            setIsEditing(false);
            setInitialLoad(false);
        }
    }, [params.id, initialLoad, setValue, getGame, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setFormLoading(true);
            
            const gameDataToSend = {
                title: data.title,
                genre: data.genre,
                platform: data.platform,
                releaseYear: Number(data.releaseYear),
                developer: data.developer,
                coverImageUrl: data.coverImageUrl, 
                description: data.description,
                isCompleted: Boolean(data.isCompleted) 
            };
            
            if (isEditing && params.id) {
                await updateGame(params.id, gameDataToSend);
            } else {
                await createGame(gameDataToSend);
            }
            
            navigate("/games");
             
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setFormLoading(false);
        }
    });

    return (
        <div className="game-form-page">
            <div className="form-container">
                <div className="form-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>{isEditing ? "Edit Game" : "Add Video Game"}</h1>
                            <p>{isEditing ? "Update your game information" : "Register your gaming adventures"}</p>
                        </div>
                    </div>
                </div>
                
                {gameErrors.map((error, i) => (
                    <div key={i} className="error-message">
                        {error}
                    </div>
                ))}
                
                <form className="game-form" onSubmit={onSubmit}>
                    <div className="form-grid">
                        {/* Title */}
                        <div className="form-group">
                            <div className="input-wrapper">
                                <i className='bx bx-rename input-icon'></i>
                                <input
                                    type="text"
                                    placeholder="Game title"
                                    {...register("title", { required: "Title is required" })}
                                    disabled={formLoading}
                                    className="form-input"
                                />
                            </div>
                            {formErrors.title && <span className="field-error">{formErrors.title.message}</span>}
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
                                    <option value="Simulation">Simulation</option>
                                    <option value="Horror">Horror</option>
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
                                    <option value="PlayStation 2">PlayStation 2</option>
                                    <option value="PlayStation 1">PlayStation 1</option>
                                    <option value="PS Vita">PS Vita</option>
                                    <option value="Xbox Series X/S">Xbox Series X/S</option>
                                    <option value="Xbox One">Xbox One</option>
                                    <option value="Xbox 360">Xbox 360</option>
                                    <option value="Xbox Classic">Xbox Classic</option>
                                    <option value="Nintendo Switch">Nintendo Switch</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Nintendo 3DS">Nintendo 3DS</option>
                                    <option value="Varios">Varios</option>
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

                    <div className="form-row">
                        {/* Release Year */}
                        <div className="form-group">
                            <div className="input-wrapper">
                                <i className='bx bx-calendar input-icon'></i>
                                <input
                                    type="number"
                                    placeholder="Release year"
                                    min="1950"
                                    max={new Date().getFullYear() + 2}
                                    {...register("releaseYear", { 
                                        required: "Release year is required",
                                        min: { value: 1950, message: "Year must be after 1950" },
                                        max: { value: new Date().getFullYear() + 2, message: "Year cannot be too far in the future" }
                                    })}
                                    disabled={formLoading}
                                    className="form-input"
                                />
                            </div>
                            {formErrors.releaseYear && <span className="field-error">{formErrors.releaseYear.message}</span>}
                        </div>

                        {/* Completed */}
                        <div className="form-group">
                            <div className="checkbox-wrapper">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        {...register("isCompleted")}
                                        disabled={formLoading}
                                        className="checkbox-input"
                                    />
                                    <span className="checkbox-custom">
                                        <i className='bx bx-check'></i>
                                    </span>
                                    <span className="checkbox-label">Completed</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="form-section">
                        <div className="input-wrapper">
                            <i className='bx bx-image input-icon'></i>
                            <input
                                type="url"
                                placeholder="Cover image URL"
                                {...register("coverImageUrl", {
                                    required: "Cover image is required",
                                    pattern: {
                                        value: /^https?:\/\/.+\..+/,
                                        message: "Please enter a valid URL"
                                    }
                                })}
                                disabled={formLoading}
                                className="form-input"
                            />
                        </div>
                        {formErrors.coverImageUrl && <span className="field-error">{formErrors.coverImageUrl.message}</span>}
                    </div>

                    {/* Description */}
                    <div className="form-section">
                        <div className="input-wrapper">
                            <i className='bx bx-text textarea-icon'></i>
                            <textarea
                                rows="4"
                                placeholder="Describe the game, your experience or why you're adding it..."
                                {...register("description", { 
                                    required: "Description is required",
                                    minLength: { value: 10, message: "Description must be at least 10 characters" }
                                })}
                                disabled={formLoading}
                                className="form-textarea"
                            />
                        </div>
                        {formErrors.description && <span className="field-error">{formErrors.description.message}</span>}
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button 
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/games")}
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
                            <i className={isEditing ? 'bx bx-edit' : 'bx bx-plus'}></i>
                            {formLoading 
                                ? (isEditing ? "Updating..." : "Adding...") 
                                : (isEditing ? "Update Game" : "Add to Library")
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GameFormPage;