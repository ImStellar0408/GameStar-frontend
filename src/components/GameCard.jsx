import { useState } from 'react';
import '../styles/gamecard.css';
import { useGame } from '../context/GameContext';
import { Link } from 'react-router-dom';

function GameCard({ game }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const { deleteGame } = useGame();

    const handleDeleteGame = async (id) => {
        setIsDeleting(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        try {
            await deleteGame(id);
            setIsDeleted(true);
            await new Promise(resolve => setTimeout(resolve, 600));
        } catch (error) {
            console.error('Error deleting game:', error);
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

    // Si está eliminado, no renderizar nada
    if (isDeleted) {
        return null;
    }

    return (
        <div className={`game-card ${isExpanded ? 'expanded' : ''} ${isDeleting ? 'deleting' : ''}`}>
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
                <div className="card-image">
                    <img src={game.coverImageUrl} alt={game.title} />
                    <div className="card-overlay">
                        <i className='bx bx-expand'></i>
                    </div>
                </div>
                <div className="card-info">
                    <h3 className="game-title">{game.title}</h3>
                    <div className="game-meta">
                        <span className="game-year">{game.releaseYear}</span>
                        <span className="game-platform">{game.platform}</span>
                    </div>
                    <div className="game-status">
                        {game.isCompleted ? (
                            <span className="completed">✓ Completed</span>
                        ) : (
                            <span className="playing">▶ Playing</span>
                        )}
                    </div>
                    <div className="created-date">
                        <i className='bx bx-calendar-plus'></i>
                        Added: {formatDate(game.createdAt)}
                    </div>
                </div>
            </div>

            {/* Contenido expandido (solo cuando se hace click) */}
            {isExpanded && (
                <div className="card-expanded">
                    <div className="expanded-content">
                        <div className="expanded-header">
                            <h2>{game.title}</h2>
                            <button className="close-btn" onClick={toggleExpand}>
                                <i className='bx bx-x'></i>
                            </button>
                        </div>
                        
                        <div className="expanded-details">
                            <div className="detail-group">
                                <i className='bx bx-category'></i>
                                <span><strong>Genre:</strong> {game.genre}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-calendar'></i>
                                <span><strong>Release Year:</strong> {game.releaseYear}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-devices'></i>
                                <span><strong>Platform:</strong> {game.platform}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-building'></i>
                                <span><strong>Developer:</strong> {game.developer}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-check-circle'></i>
                                <span><strong>Status:</strong> {game.isCompleted ? 'Completed' : 'In Progress'}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-calendar-plus'></i>
                                <span><strong>Added:</strong> {formatDate(game.createdAt)}</span>
                            </div>
                            <div className="detail-group">
                                <i className='bx bx-calendar-edit'></i>
                                <span><strong>Last Updated:</strong> {formatDate(game.updatedAt)}</span>
                            </div>
                        </div>

                        <div className="expanded-description">
                            <h4>Description</h4>
                            <p>{game.description}</p>
                        </div>

                        <div className="action-buttons">
                            <Link to={`/games/edit/${game._id}`} className="edit-btn">
                                <i className='bx bx-edit'></i>
                                Edit Game
                            </Link>
                            
                            <button 
                                onClick={() => handleDeleteGame(game._id)} 
                                className="delete-btn"
                                disabled={isDeleting}
                            >
                                <i className='bx bx-trash'></i>
                                {isDeleting ? 'Deleting...' : 'Delete Game'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GameCard;