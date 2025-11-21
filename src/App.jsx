import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GameProvider } from "./context/GameContext.jsx";
import { ReviewProvider } from "./context/ReviewContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";

import Home from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import GameFormPage from "./pages/GameFormPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import GlobalReviewsPage from "./pages/GlobalReviewsPage.jsx";
import ReviewFormPage from "./pages/ReviewFormPage.jsx";
import MyReviewsPage from "./pages/MyReviewsPage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/footer.jsx";

function App() {
    return (
        <AuthProvider>
            <GameProvider>
                <ReviewProvider>
                    <ProfileProvider>
                        <BrowserRouter>
                            <Navbar />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />

                                <Route element={<ProtectedRoute />}>
                                    <Route path="/games" element={<GamePage />} />
                                    <Route path="/games/new" element={<GameFormPage />} />
                                    <Route path="/games/edit/:id" element={<GameFormPage />} />
                                    <Route path="/profile" element={<ProfilePage />} />
                                    <Route path="/reviews/global" element={<GlobalReviewsPage />} />
                                    <Route path="/reviews/my-reviews" element={<MyReviewsPage />} />
                                    <Route path="/reviews/new" element={<ReviewFormPage />} />
                                    <Route path="/reviews/edit/:id" element={<ReviewFormPage />} />
                                </Route>
                            </Routes>
                            <Footer />
                        </BrowserRouter>
                    </ProfileProvider>
                </ReviewProvider>
            </GameProvider>
        </AuthProvider>
    );
}

export default App;