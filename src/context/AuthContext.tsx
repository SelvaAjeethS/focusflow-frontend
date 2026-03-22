"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { User, AuthResponse } from '@/types/user';
import { toast } from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken) {
                setToken(storedToken);
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Failed to parse user from local storage", e);
                        localStorage.removeItem('user');
                    }
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', { email, password });
            const userData = response.data;

            localStorage.setItem('token', userData.token);
            // Store user data without token if preferred, or whole object. 
            // The prompt says "Store entire response object as user state (excluding token if preferred)".
            // Let's store the whole thing but maybe exclude token to be clean, or just keep it simple.
            // Type User has a token field optional.
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(userData.token);
            setUser(userData);
            toast.success('Successfully logged in!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Login failed', error);
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
            const userData = response.data;

            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(userData.token);
            setUser(userData);
            toast.success('Account created successfully!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Registration failed', error);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
