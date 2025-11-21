import { useState } from 'react';
import '../styles/gamepage.css';
import { useGame } from '../context/GameContext';
import { Link } from 'react-router-dom';

function GameCard({ game }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const { deleteGame } = useGame();

    const handleDeleteGame = async (id) => {
        setIsDeleting(true);
        try {
            await deleteGame(id);
            setIsDeleted(true);
        } catch (error) {
            console.error('Error deleting game:', error);
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

    if (isDeleted) {
        return null;
    }

    return (
        <>
            {/* Card Normal - DISEÑO VERTICAL */}
            <div className="game-card">
                <div className="game-card-compact" onClick={toggleExpand}>
                    <div className="card-image">
                        <img src={game.coverImageUrl} alt={game.title} />
                        <div className="card-overlay">
                            <i className='bx bx-expand'></i>
                        </div>
                        <div className="status-badge">
                            {game.isCompleted ? '✓ Completed' : '▶ Playing'}
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="game-info">
                            <h3 className="game-title">{game.title}</h3>
                            <p className="game-developer">{game.developer}</p>
                        </div>

                        <div className="game-meta">
                            <div className="meta-row">
                                <span className="meta-item">
                                    <i className='bx bx-category'></i>
                                    {game.genre}
                                </span>
                                <span className="meta-item">
                                    <i className='bx bx-calendar'></i>
                                    {game.releaseYear}
                                </span>
                            </div>
                            <div className="meta-row">
                                <span className="meta-item">
                                    <i className='bx bx-devices'></i>
                                    {game.platform}
                                </span>
                            </div>
                        </div>

                        <div className="card-footer">
                            <span className="date-added">
                                <i className='bx bx-calendar-plus'></i>
                                Added {formatDate(game.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Overlay de eliminación */}
                {isDeleting && (
                    <div className="delete-overlay">
                        <div className="delete-animation">
                            <i className='bx bx-trash'></i>
                            <span>Deleting Game...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Expandido (se mantiene igual) */}
            {isExpanded && (
                <div className="modal-overlay" onClick={() => setIsExpanded(false)}>
                    <div className="game-card-expanded" onClick={(e) => e.stopPropagation()}>
                        <div className="expanded-container">
                            {/* Header */}
                            <div className="expanded-header">
                                <div className="title-section">
                                    <h2>{game.title}</h2>
                                    <p className="developer">{game.developer}</p>
                                </div>
                                <button 
                                    className="close-button" 
                                    onClick={() => setIsExpanded(false)}
                                >
                                    <i className='bx bx-x'></i>
                                </button>
                            </div>

                            {/* Contenido Principal */}
                            <div className="expanded-content">
                                {/* Imagen y Info Principal */}
                                <div className="main-info-section">
                                    <div className="game-image">
                                        <img src={game.coverImageUrl} alt={game.title} />
                                        <div className="status-tag">
                                            {game.isCompleted ? '✓ Completed' : '▶ In Progress'}
                                        </div>
                                    </div>
                                    <div className="basic-details">
                                        <div className="detail-group">
                                            <i className='bx bx-calendar'></i>
                                            <div>
                                                <label>Release Year</label>
                                                <span>{game.releaseYear}</span>
                                            </div>
                                        </div>
                                        <div className="detail-group">
                                            <i className='bx bx-category'></i>
                                            <div>
                                                <label>Genre</label>
                                                <span>{game.genre}</span>
                                            </div>
                                        </div>
                                        <div className="detail-group">
                                            <i className='bx bx-devices'></i>
                                            <div>
                                                <label>Platform</label>
                                                <span>{game.platform}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grid de Detalles */}
                                <div className="details-grid">
                                    <div className="detail-card">
                                        <i className='bx bx-building'></i>
                                        <div>
                                            <label>Developer</label>
                                            <span>{game.developer}</span>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <i className='bx bx-check-circle'></i>
                                        <div>
                                            <label>Status</label>
                                            <span className={game.isCompleted ? 'completed' : 'playing'}>
                                                {game.isCompleted ? 'Completed' : 'In Progress'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <i className='bx bx-calendar-plus'></i>
                                        <div>
                                            <label>Added</label>
                                            <span>{formatDate(game.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="detail-card">
                                        <i className='bx bx-calendar-edit'></i>
                                        <div>
                                            <label>Last Updated</label>
                                            <span>{formatDate(game.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="description-section">
                                    <h4>Description</h4>
                                    <div className="description-content">
                                        {game.description}
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="action-buttons">
                                    <Link to={`/games/edit/${game._id}`} className="action-btn edit-btn">
                                        <i className='bx bx-edit'></i>
                                        Edit Game
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteGame(game._id)} 
                                        className="action-btn delete-btn"
                                        disabled={isDeleting}
                                    >
                                        <i className='bx bx-trash'></i>
                                        {isDeleting ? 'Deleting...' : 'Delete Game'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default GameCard;