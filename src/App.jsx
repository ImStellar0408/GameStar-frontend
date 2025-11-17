import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import Home from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/games" element={<h1>Games Page</h1>} />
                    <Route path="/add-game" element={<h1>Add Game Page</h1>} />
                    <Route path="/games/:id" element={<h1>Update Page</h1>} />
                    <Route path="/profile" element={<h1>Profile Page</h1>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;