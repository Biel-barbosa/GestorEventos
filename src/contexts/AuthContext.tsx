
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "../types";
import { mockUsers } from "../services/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, displayName: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Mock login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, you would validate with a server
      // For demo, we'll just check if the user exists in our mock data
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      
      setCurrentUser(updatedUser);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, displayName: string, password: string) => {
    setLoading(true);
    try {
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error("User already exists");
      }
      
      // Mock user creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: `user-${mockUsers.length + 1}`,
        email,
        displayName,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // In a real app, we would send this to the server
      mockUsers.push(newUser);
      
      setCurrentUser(newUser);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to create account. " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
