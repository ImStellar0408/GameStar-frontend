import { get, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/gameform.css'
import { useGame } from "../context/GameContext";
import { useEffect } from "react";

function GameFormPage() {
    const { register, handleSubmit, formState: { errors: formErrors }, setValue } = useForm();
    const { createGame, errors: gameErrors, loading, getGame } = useGame();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function loadGame(){

            if (params.id) {
                const game = await getGame(params.id);
                setValue("title", game.title);
                setValue("genre", game.genre);
                setValue("platform", game.platform);
                setValue("releaseYear", game.releaseYear);
                setValue("developer", game.developer);
                setValue("coverImageUrl", game.coverImageUrl);
                setValue("description", game.description);
                setValue("isCompleted", game.isCompleted);
            }
        }
        loadGame();
    }, []);


    const onSubmit = handleSubmit(async (data) => {
        try {
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
            await createGame(gameDataToSend);
            navigate("/games");
        } catch (error) {
            console.log("Error completo:", error);
            console.log("Respuesta del error:", error.response?.data);
        }
    });

    return (
        <div className="game-form-page">
            <div className="crystal-card">
                <div className="card-header">
                    <img className="card-icon" src="../src/assets/GameStar.svg" />
                    <h1 className="card-title">Add Video Game</h1>
                    <p className="card-subtitle">Register your gaming adventures</p>
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
                            />
                        </div>
                        {formErrors.description && <span className="field-error">{formErrors.description.message}</span>}
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        <i className='bx bx-plus'></i>
                        {loading ? "Adding Game..." : "Add to Library"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default GameFormPage;