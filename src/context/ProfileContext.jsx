import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { 
    getUserStatsRequest, 
    getReviewStatsRequest, 
    getGameStatsRequest, 
    getMonthlyActivityRequest 
} from "../api/stats.js";

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
    const [reviewStats, setReviewStats] = useState(null);
    const [gameStats, setGameStats] = useState(null);
    const [monthlyActivity, setMonthlyActivity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { user } = useAuth();

    const loadAllStats = async () => {
        try {
            setLoading(true);
            setErrors([]);

            const [userStatsData, reviewStatsData, gameStatsData, activityData] = await Promise.all([
                getUserStatsRequest(),
                getReviewStatsRequest(),
                getGameStatsRequest(),
                getMonthlyActivityRequest()
            ]);

            setUserStats(userStatsData.data);
            setReviewStats(reviewStatsData.data);
            setGameStats(gameStatsData.data);
            setMonthlyActivity(activityData.data);

        } catch (error) {
            console.error("Error loading stats:", error);
            setErrors(["Error loading profile statistics"]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loadUserStats = async () => {
        try {
            setLoading(true);
            const response = await getUserStatsRequest();
            setUserStats(response.data);
            return response.data;
        } catch (error) {
            console.error("Error loading user stats:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loadReviewStats = async () => {
        try {
            const response = await getReviewStatsRequest();
            setReviewStats(response.data);
            return response.data;
        } catch (error) {
            console.error("Error loading review stats:", error);
            throw error;
        }
    };

    const loadGameStats = async () => {
        try {
            const response = await getGameStatsRequest();
            setGameStats(response.data);
            return response.data;
        } catch (error) {
            console.error("Error loading game stats:", error);
            throw error;
        }
    };

    const loadMonthlyActivity = async (months = 6) => {
        try {
            const response = await getMonthlyActivityRequest(months);
            setMonthlyActivity(response.data);
            return response.data;
        } catch (error) {
            console.error("Error loading monthly activity:", error);
            throw error;
        }
    };

    const refreshStats = () => {
        loadAllStats();
    };

    const clearErrors = () => {
        setErrors([]);
    };

    useEffect(() => {
        if (user) {
            loadAllStats();
        }
    }, [user]);

    return (
        <ProfileContext.Provider value={{
            userStats,
            reviewStats,
            gameStats,
            monthlyActivity,
            loading,
            errors,
            loadAllStats,
            loadUserStats,
            loadReviewStats,
            loadGameStats,
            loadMonthlyActivity,
            refreshStats,
            clearErrors
        }}>
            {children}
        </ProfileContext.Provider>
    );
}