import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/gameform.css'
import { useGame } from "../context/GameContext";
import { useEffect, useState } from "react";

function GameFormPage() {
    const { register, handleSubmit, formState: { errors: formErrors }, setValue, reset } = useForm();
    const { createGame, updateGame, errors: gameErrors, getGame } = useGame();
    const navigate = useNavigate();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        // Solo ejecutar si hay un ID y es la carga inicial
        if (params.id && initialLoad) {
            async function loadGame() {
                try {
                    setIsEditing(true);
                    setFormLoading(true);
                    console.log("Loading game for editing:", params.id);
                    
                    const game = await getGame(params.id);
                    console.log("Game loaded:", game);
                    
                    // Usar setValue en lugar de reset para evitar re-renders
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
            // Modo creación - asegurar que no estamos en modo edición
            setIsEditing(false);
            setInitialLoad(false);
        }
    }, [params.id, initialLoad, setValue, getGame, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setFormLoading(true);
            console.log("Datos del formulario:", data);
            
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
            
            console.log("Datos convertidos:", gameDataToSend);
            console.log("Is editing:", isEditing);
            
            if (isEditing && params.id) {
                console.log("Updating game with ID:", params.id);
                await updateGame(params.id, gameDataToSend);
                console.log("Game updated successfully");
            } else {
                console.log("Creating new game");
                await createGame(gameDataToSend);
                console.log("Game created successfully");
            }
            
            navigate("/games");
             
        } catch (error) {
            console.log("Error completo:", error);
            console.log("Respuesta del error:", error.response?.data);
        } finally {
            setFormLoading(false);
        }
    });

    return (
        <div className="game-form-page">
            <div className="crystal-card">
                <div className="card-header">
                    <img className="card-icon" src="../src/assets/GameStar.svg" alt="Game Star" />
                    <h1 className="card-title">
                        {isEditing ? "Edit Video Game" : "Add Video Game"}
                    </h1>
                    <p className="card-subtitle">
                        {isEditing ? "Update your game information" : "Register your gaming adventures"}
                    </p>
                </div>
                
                {/* Mostrar errores del backend */}
                {gameErrors.map((error, i) => (
                    <div key={i} className="error-message">
                        {error}
                    </div>
                ))}
                
                <form className="game-form" onSubmit={onSubmit}>
                    {/* Title */}
                    <div className="form-group">
                        <div className="input-icon">
                            <i className='bx bx-rename'></i>
                            <input
                                type="text"
                                placeholder="Game title"
                                {...register("title", { required: "Title is required" })}
                                disabled={formLoading}
                            />
                        </div>
                        {formErrors.title && <span className="field-error">{formErrors.title.message}</span>}
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

                    <div className="form-row">
                        {/* Release Year */}
                        <div className="form-group">
                            <div className="input-icon">
                                <i className='bx bx-calendar'></i>
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
                                />
                            </div>
                            {formErrors.releaseYear && <span className="field-error">{formErrors.releaseYear.message}</span>}
                        </div>

                        {/* Completed */}
                        <div className="form-group">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    {...register("isCompleted")}
                                    disabled={formLoading}
                                />
                                <span className="checkmark">
                                    <i className='bx bx-check'></i>
                                </span>
                                <span className="checkbox-label">Completed</span>
                            </label>
                        </div>
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

                    {/* Cover Image */}
                    <div className="form-group">
                        <div className="input-icon">
                            <i className='bx bx-image'></i>
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
                            />
                        </div>
                        {formErrors.coverImageUrl && <span className="field-error">{formErrors.coverImageUrl.message}</span>}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <div className="input-icon textarea-icon">
                            <i className='bx bx-text'></i>
                            <textarea
                                rows="4"
                                placeholder="Describe the game, your experience or why you're adding it..."
                                {...register("description", { 
                                    required: "Description is required",
                                    minLength: { value: 10, message: "Description must be at least 10 characters" }
                                })}
                                disabled={formLoading}
                            />
                        </div>
                        {formErrors.description && <span className="field-error">{formErrors.description.message}</span>}
                    </div>

                    {/* Botones de acción */}
                    <div className="form-actions">
                        <button 
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/games")}
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
                            <i className={isEditing ? 'bx bx-edit' : 'bx bx-plus'}></i>
                            {formLoading 
                                ? (isEditing ? "Updating Game..." : "Adding Game...") 
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