import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext.jsx";
import GameCard from "../components/GameCard.jsx";
import { Link } from "react-router-dom";
import '../styles/gamepage.css';

function GamePage() {
    const { getGames, games } = useGame();
    const [filteredGames, setFilteredGames] = useState([]);
    const [filters, setFilters] = useState({
        genre: '',
        platform: '',
        status: '',
        search: ''
    });

    const allGenres = [
        'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing',
        'Shooter', 'Indie', 'Metroidvania', 'Simulation', 'Horror',
        'Platformer', 'Fighting', 'Puzzle'
    ];

    const allPlatforms = [
        'PC', 'PlayStation 5', 'PlayStation 4', 'PlayStation 3',
        'PlayStation 2', 'PlayStation 1', 'PS Vita',
        'Xbox Series X/S', 'Xbox One', 'Xbox 360', 'Xbox Classic',
        'Nintendo Switch', 'Mobile', 'Nintendo 3DS', 'Multiple'
    ];

    useEffect(() => {
        getGames();
    }, []);

    useEffect(() => {
        let result = [...games];

        if (filters.genre) {
            result = result.filter(game => game.genre === filters.genre);
        }
        if (filters.platform) {
            result = result.filter(game => game.platform === filters.platform);
        }
        if (filters.status) {
            if (filters.status === 'completed') {
                result = result.filter(game => game.isCompleted);
            } else if (filters.status === 'playing') {
                result = result.filter(game => !game.isCompleted);
            }
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(game =>
                game.title.toLowerCase().includes(searchLower) ||
                (game.developer && game.developer.toLowerCase().includes(searchLower))
            );
        }

        setFilteredGames(result);
    }, [games, filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            genre: '',
            platform: '',
            status: '',
            search: ''
        });
    };

    const exportToPDF = () => {
        const completedGames = games.filter(game => game.isCompleted).length;
        const completionRate = games.length > 0 ? ((completedGames / games.length) * 100).toFixed(1) : 0;

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>My Game Library - GameStar</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    
                    body { 
                        font-family: 'Inter', sans-serif; 
                        margin: 0;
                        padding: 40px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: #2d3748;
                        min-height: 100vh;
                    }
                    .container {
                        max-width: 1000px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    .header { 
                        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                        color: white;
                        padding: 40px;
                        text-align: center;
                    }
                    .header h1 { 
                        margin: 0 0 10px 0;
                        font-size: 2.5rem;
                        font-weight: 700;
                    }
                    .header p { 
                        margin: 0;
                        opacity: 0.9;
                        font-size: 1.1rem;
                    }
                    .stats-grid { 
                        display: grid; 
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px; 
                        padding: 30px 40px;
                        background: #f8fafc;
                    }
                    .stat-card { 
                        background: white;
                        padding: 25px 20px;
                        border-radius: 16px;
                        text-align: center;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                        border: 1px solid #e2e8f0;
                    }
                    .stat-number { 
                        font-size: 2.5rem; 
                        font-weight: 700; 
                        color: #6366f1;
                        display: block;
                        line-height: 1;
                        margin-bottom: 8px;
                    }
                    .stat-label { 
                        color: #64748b; 
                        font-size: 0.9rem;
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .content {
                        padding: 2px;
                    }
                    .section-title {
                        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                        color: white;
                        padding: 20px 30px;
                        border-radius: 12px;
                        margin: 30px 0 20px 0;
                        font-size: 1.3rem;
                        font-weight: 600;
                    }
                    .games-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 10px;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    }
                    .games-table th { 
                        background: #1e293b;
                        color: white;
                        padding: 18px 16px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 0.9rem;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .games-table td { 
                        padding: 16px;
                        border-bottom: 1px solid #e2e8f0;
                        background: white;
                    }
                    .games-table tr:hover td { 
                        background: #f8fafc; 
                    }
                    .status-completed { 
                        color: #10b981; 
                        font-weight: 600;
                        background: #d1fae5;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 0.85rem;
                        display: inline-block;
                    }
                    .status-playing { 
                        color: #f59e0b; 
                        font-weight: 600;
                        background: #fef3c7;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 0.85rem;
                        display: inline-block;
                    }
                    .footer { 
                        background: #1e293b;
                        color: #94a3b8;
                        text-align: center;
                        padding: 30px;
                        font-size: 0.9rem;
                    }
                    @media print {
                        body { 
                            background: white !important;
                            padding: 20px !important;
                        }
                        .container {
                            box-shadow: none !important;
                            margin: 0 !important;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎮 My Game Library</h1>
                        <p>Generated from GameStar • ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-number">${games.length}</span>
                            <span class="stat-label">Total Games</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${completedGames}</span>
                            <span class="stat-label">Completed</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${completionRate}%</span>
                            <span class="stat-label">Completion Rate</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${filteredGames.length}</span>
                            <span class="stat-label">Showing</span>
                        </div>
                    </div>

                    <div class="content">
                        <div class="section-title">Games Collection</div>
                        <table class="games-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Developer</th>
                                    <th>Genre</th>
                                    <th>Platform</th>
                                    <th>Year</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredGames.map(game => `
                                    <tr>
                                        <td><strong>${game.title}</strong></td>
                                        <td>${game.developer}</td>
                                        <td>${game.genre}</td>
                                        <td>${game.platform}</td>
                                        <td>${game.releaseYear || 'N/A'}</td>
                                        <td>
                                            <span class="${game.isCompleted ? 'status-completed' : 'status-playing'}">
                                                ${game.isCompleted ? '✓ Completed' : '▶ Playing'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="footer">
                        <p>Generated by GameStar • ${filteredGames.length} games shown • ${games.length} total in library</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = function () {
            printWindow.print();
            setTimeout(() => {
                printWindow.close();
            }, 500);
        };
    };

    const hasActiveFilters = filters.genre || filters.platform || filters.status || filters.search;

    return (
        <div className="games-page">
            <div className="page-container">
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>My Game Library</h1>
                            <p>Your personal collection of gaming adventures</p>
                            <div className="library-stats">
                                <span className="stat">{games.length} total games</span>
                                <span className="stat">{games.filter(g => g.isCompleted).length} completed</span>
                                <span className="stat">{allGenres.length} genres</span>
                            </div>
                        </div>
                        <div className="header-actions">
                            <Link to="/games/new" className="action-button primary">
                                <i className='bx bx-plus'></i>
                                Add New Game
                            </Link>
                            <button onClick={exportToPDF} className="action-button secondary">
                                <i className='bx bx-download'></i>
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="filters-section">
                    <div className="filters-header">
                        <div className="filters-title">
                            <i className='bx bx-filter-alt'></i>
                            <h3>Filter Games</h3>
                        </div>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="clear-filters-btn">
                                <i className='bx bx-x'></i>
                                Clear All Filters
                            </button>
                        )}
                    </div>

                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>
                                <i className='bx bx-search'></i>
                                Search Games
                            </label>
                            <div className="search-input-wrapper">
                                <i className='bx bx-search'></i>
                                <input
                                    type="text"
                                    placeholder="Search by title or developer..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="filter-input"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>
                                <i className='bx bx-category'></i>
                                Genre
                            </label>
                            <div className="filter-select-wrapper">
                                <select
                                    value={filters.genre}
                                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Genres</option>
                                    {allGenres.map(genre => (
                                        <option key={genre} value={genre}>{genre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>
                                <i className='bx bx-devices'></i>
                                Platform
                            </label>
                            <div className="filter-select-wrapper">
                                <select
                                    value={filters.platform}
                                    onChange={(e) => handleFilterChange('platform', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Platforms</option>
                                    {allPlatforms.map(platform => (
                                        <option key={platform} value={platform}>{platform}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>
                                <i className='bx bx-check-circle'></i>
                                Status
                            </label>
                            <div className="filter-select-wrapper">
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="playing">In Progress</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="results-count">
                        <div className="count-badge">
                            <i className='bx bx-game'></i>
                            <span>
                                Showing <strong>{filteredGames.length}</strong> of <strong>{games.length}</strong> games
                                {hasActiveFilters && ' (filtered)'}
                            </span>
                        </div>
                    </div>
                </div>

                {filteredGames.length > 0 ? (
                    <div className="games-grid">
                        {filteredGames.map(game => (
                            <GameCard key={game._id} game={game} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-content">
                            {games.length === 0 ? (
                                <>
                                    <i className='bx bx-game'></i>
                                    <h2>Your library is empty</h2>
                                    <p>Start building your collection by adding your first game!</p>
                                    <Link to="/games/new" className="empty-action-button">
                                        <i className='bx bx-plus'></i>
                                        Add Your First Game
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <i className='bx bx-search-alt'></i>
                                    <h2>No games found</h2>
                                    <p>No games match your current filters. Try adjusting your search criteria.</p>
                                    <button onClick={clearFilters} className="empty-action-button">
                                        <i className='bx bx-x'></i>
                                        Clear All Filters
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GamePage;