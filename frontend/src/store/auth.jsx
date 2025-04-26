import { createContext, useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Holds the authenticated user state
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [AllUsers, setAllUsers] = useState()
    const [role, setRole] = useState("");
    const [path, setPath] = useState();
    const [isLoggedin, setisLoggedin] = useState(true);

    useEffect(() => {
        if (user) {
            setisLoggedin(true)
        } else {
            setisLoggedin(false)
        }
    }, [user])

    useEffect(() => {
        const currentPath = window.location.pathname
            .replace("/", "") // Remove the leading "/"
            .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
        setPath(currentPath);

        if (user) {
            // Fetch user's role and all users
            const userRole = user.role;
            setRole(userRole);
        }
    }, [user]);

    useEffect(() => {
        if (path && path.startsWith('Profile') && path.length > 8) {
            setUserId(path.split('/').pop())
        } else {
            setUserId(null)
        }
    }, [path])

    // Simulate login function
    const login = async (email, password) => {
        try {
            const res = await axiosInstance.post("/auth/login", { email, password });
            setIsAuthLoading(true);
            setUser(res.data);
            toast.success("Logged in successfully");
            window.location.href = "/";
        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error in login", error);
        } finally {
            setIsAuthLoading(false);
        }
    };

    // Simulate signup function
    const signup = async (email, password, fullName, userName, gender) => {
        try {
            const res = await axiosInstance.post("/auth/signup", { email, password, fullName, userName, gender });
            setIsAuthLoading(true);
            setUser(res.data);
            toast.success("Account created successfully");
            window.location.href = "/";
        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error in signup", error);
        } finally {
            setIsAuthLoading(false);
        }
    };

    // Simulate logout function
    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setIsAuthLoading(true);
            toast.success("Logged out successfully");
            setUser(null);
            window.location.href = "/";
        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error in logout", error);
        } finally {
            setIsAuthLoading(false);
        }
    };

    useEffect(() => {
        const userdata = async () => {
            try {
                const res = await axiosInstance.get("/auth/check");
                setUser(res.data);
            } catch (error) {
                setUser(null);
                console.error("Error in checkAuth", error);
                if (error.response.data.message === "Unauthorized - no token provided") {
                    if (window.location.pathname !== "/") {
                        window.location.href = "/"
                    }
                }
            } finally {
                setIsAuthLoading(false);
            }
        };

        const userById = async (userId) => {
            console.log(userId);
            try {
                const res = await axiosInstance.get(`/auth/userById/${userId}`);
                setUser(res.data);
            } catch (error) {
                console.error("Error in userById", error);
                toast.error(error.response.data.message);
            }
        };

        const getAllUsers = async () => {
            try {
                const res = await axiosInstance.get(`/auth/getAllUsers`);
                setAllUsers(res.data);
            } catch (error) {
                console.error("Error in userById", error);
                // toast.error(error.response.data.message);
            }
        }

        userdata();
        getAllUsers();
        if (userId) {
            userById(userId);
        }
    }, [userId])

    const updateprofile = async (data) => {
        try {
            const res = await axiosInstance.put("/auth/updateProfile", {
                data,
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIsAuthLoading(true);
            setUser(res.data.user);
            toast.success(res.data.message);
        } catch (error) {
            console.error("Error in checkAuth", error);
        } finally {
            setIsAuthLoading(false);
        }
    }

    const resetPassword = async (oldPassword, newPassword) => {
        try {
            const res = await axiosInstance.post("/auth/resetPassword", { oldPassword, newPassword });
            setIsAuthLoading(true);
            toast.success(res.data.message);
        } catch (error) {
            console.error("Error in resetPassword", error);
            toast.error(error.response.data.message);
        } finally {
            setIsAuthLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthLoading, user, AllUsers, login, logout, signup, updateprofile, resetPassword, role, isLoggedin }}>
            {children}
        </AuthContext.Provider>
    );
}