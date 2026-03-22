"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme, mounted } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-card/95 border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 items-center">
                    <div className="flex items-center">
                        <Link
                            href={user ? "/dashboard" : "/"}
                            className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                        >
                            FocusFlow
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="rounded-full w-9 h-9"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5 text-text-secondary" />
                                ) : (
                                    <Sun className="w-5 h-5 text-text-secondary" />
                                )}
                            </Button>
                        )}


                        <div className="h-6 w-px bg-border mx-1" />

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 h-9 p-1 pr-3 rounded-full hover:bg-border/40 transition-all duration-200 group relative overflow-hidden ring-1 ring-border/20 shadow-sm"
                                >
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                                        <UserIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="hidden sm:block text-xs font-bold text-text-primary capitalize truncate max-w-[100px]">
                                        {user.name || 'User'}
                                    </span>
                                    <ChevronDown className={`w-3 h-3 text-text-tertiary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-xl py-2 z-[60] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="px-4 py-3 border-b border-border/50 mb-1">
                                            <p className="text-sm font-bold text-text-primary capitalize truncate">
                                                {user.name || 'User'}
                                            </p>
                                            <p className="text-xs text-text-tertiary truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-error hover:bg-error/5 transition-colors text-left"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
