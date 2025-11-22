import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getUserStatsRequest } from "../api/stats.js";

const ProfileContext = createContext();

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};

export function ProfileProvider({ children }) {
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { user, isAuthenticated } = useAuth();

    const loadUserStats = async () => {
        try {
            setLoading(true);
            setErrors([]);
            console.log("Loading user stats...");
            
            const response = await getUserStatsRequest();
            console.log("User stats loaded:", response.data);
            
            setUserStats(response.data);
            return response.data;
        } catch (error) {
            console.error("Error loading user stats:", error);
            let errorMessage = "Error loading profile statistics";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }
            
            setErrors([errorMessage]);
            setUserStats(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const refreshStats = () => {
        if (isAuthenticated) {
            console.log("Refreshing stats...");
            loadUserStats();
        }
    };

    const clearErrors = () => {
        setErrors([]);
    };

    useEffect(() => {
        console.log("ProfileProvider - Auth status:", { isAuthenticated, user });
        if (isAuthenticated && user) {
            console.log("Loading stats for authenticated user");
            loadUserStats();
        } else {
            console.log("User not authenticated, clearing stats");
            setUserStats(null);
        }
    }, [isAuthenticated, user]);

    return (
        <ProfileContext.Provider value={{
            userStats,
            loading,
            errors,
            refreshStats,
            clearErrors
        }}>
            {children}
        </ProfileContext.Provider>
    );
}