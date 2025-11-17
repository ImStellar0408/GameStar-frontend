import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GameProvider } from "./context/GameContext.jsx";

import Home from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import GameFormPage from "./pages/GameFormPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
    return (
        <AuthProvider>
            <GameProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/games" element={<GamePage />} />
                            <Route path="/add-game" element={<GameFormPage />} />
                            <Route path="/games/:id" element={<GameFormPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>

                    </Routes>
                </BrowserRouter>
            </GameProvider>
        </AuthProvider>
    );
}

export default App;