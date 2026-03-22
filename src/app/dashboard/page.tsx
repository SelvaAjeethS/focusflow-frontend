"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import EditTaskModal from '@/components/EditTaskModal';
import TaskFilters from '@/components/TaskFilters';
import CreateTaskModal from '@/components/CreateTaskModal';
import { Button } from '@/components/ui/button'; // Added this line
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { Task, TaskListResponse } from '@/types/task';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);

    // Filters State
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: '',
        sort: 'createdAt',
    });

    // Edit Modal State
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...filters
            });

            const response = await api.get<TaskListResponse>(`/tasks?${queryParams.toString()}`);
            setTasks(response.data.tasks);
            setTotalPages(response.data.totalPages);
            setTotalTasks(response.data.totalTasks);
            setError('');
        } catch (err) {
            setError('Failed to load tasks.');
            console.error(err);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchTasks();
        }
    }, [authLoading, user, router, fetchTasks]);

    const handleDeleteTask = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter((task) => task._id !== id));
            setTotalTasks(prev => prev - 1);
            toast.success('Task deleted successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete task');
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsEditModalOpen(true);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to page 1 on filter change
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }

    if (authLoading || (!user && !error)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-text-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                {/* Unified Header Section */}
                <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tighter leading-none mb-0.5">
                                Dashboard
                            </h1>
                            <p className="text-[10px] sm:text-xs text-text-tertiary font-bold uppercase tracking-[0.2em] opacity-50">
                                My Workspace
                            </p>
                        </div>
                        <div className="flex-grow max-w-2xl">
                            <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
                        </div>
                    </div>
                </div>

                {/* Mobile Create Task Trigger - Moved to a Floating Position via CreateTaskModal itself */}
                <CreateTaskModal onTaskCreated={fetchTasks} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Create Task Sidebar - High-tension Desktop Only */}
                    <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20">
                        <div className="bg-card/30 backdrop-blur-sm rounded-3xl border border-border/10 p-1 shadow-premium">
                            <div className="p-2">
                                <h2 className="text-xl font-black tracking-tighter text-text-primary uppercase opacity-80">Add Task</h2>
                            </div>
                            <TaskForm onTaskCreated={fetchTasks} />
                        </div>
                    </div>

                    {/* Right: Task List - Full width on Mobile */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-black tracking-tight text-text-primary uppercase">Your Tasks</h2>
                                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[10px] font-black bg-primary/10 text-primary border-none">
                                    {totalTasks} Total
                                </Badge>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-32 rounded-xl bg-card/40 animate-pulse border border-border/20" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-12 text-center bg-error/5 rounded-2xl border border-error/20">
                                <p className="text-error font-bold mb-2">Error loading tasks</p>
                                <Button variant="outline" size="sm" onClick={fetchTasks}>Try Again</Button>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="p-16 text-center bg-card/30 rounded-3xl border-2 border-dashed border-border/40 backdrop-blur-md">
                                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-1">No tasks yet</h3>
                                <p className="text-text-tertiary text-sm max-w-[240px] mx-auto">Create your first task to start your productivity journey!</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {tasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onDelete={handleDeleteTask}
                                            onEdit={(task) => {
                                                setEditingTask(task);
                                                setIsEditModalOpen(true);
                                            }}
                                        />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="h-8 w-8 p-0 rounded-full"
                                        >
                                            ←
                                        </Button>
                                        <span className="text-[11px] font-bold text-text-secondary bg-card px-3 py-1 rounded-full border border-border/40 shadow-sm">
                                            Page {page} of {totalPages}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="h-8 w-8 p-0 rounded-full"
                                        >
                                            →
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <EditTaskModal
                task={editingTask}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={fetchTasks}
            />
        </div>
    );
}
