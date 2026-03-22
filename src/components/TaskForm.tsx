"use client";

import { useState } from 'react';
import { Task } from '@/types/task';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface TaskFormProps {
    onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Task['status']>('Todo');
    const [priority, setPriority] = useState<Task['priority']>('Medium');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/tasks', {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            });
            setTitle('');
            setDescription('');
            setStatus('Todo');
            setPriority('Medium');
            setDueDate('');
            onTaskCreated();
            toast.success('Task created successfully!');
        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.message || 'Failed to create task. Please try again.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 space-y-3.5">
            <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-black text-text-primary uppercase tracking-wider">
                    Task Title
                </Label>
                <Input
                    id="title"
                    required
                    placeholder="What needs to be done?"
                    className="h-9 text-sm bg-card border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-tertiary/40 shadow-inner-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-black text-text-primary uppercase tracking-wider">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Add details and context..."
                    className="min-h-[90px] text-sm resize-none bg-card border-border/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all py-2.5 placeholder:text-text-tertiary/40 shadow-inner-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-black text-text-primary uppercase tracking-wider">Status</Label>
                    <Select
                        value={status}
                        onValueChange={(value) => setStatus(value as Task['status'])}
                    >
                        <SelectTrigger id="status" className="h-9 text-sm bg-card border-border/40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="border-border/20 bg-card/95 backdrop-blur-md">
                            <SelectItem value="Todo" className="text-sm">To Do</SelectItem>
                            <SelectItem value="In Progress" className="text-sm">In Progress</SelectItem>
                            <SelectItem value="Done" className="text-sm">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="priority" className="text-xs font-black text-text-primary uppercase tracking-wider">Priority</Label>
                    <Select
                        value={priority}
                        onValueChange={(value) => setPriority(value as Task['priority'])}
                    >
                        <SelectTrigger id="priority" className="h-9 text-sm bg-card border-border/40">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="border-border/20 bg-card/95 backdrop-blur-md">
                            <SelectItem value="Low" className="text-sm">Low</SelectItem>
                            <SelectItem value="Medium" className="text-sm">Medium</SelectItem>
                            <SelectItem value="High" className="text-sm">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="dueDate" className="text-xs font-black text-text-primary uppercase tracking-wider">Due Date</Label>
                <Input
                    type="date"
                    id="dueDate"
                    className="h-9 text-sm bg-card border-border/40 placeholder:text-text-tertiary/40 shadow-inner-sm"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9 text-[11px] font-black uppercase tracking-widest shadow-premium mt-3 bg-primary hover:bg-primary/90 text-white transition-all active:scale-[0.98]"
            >
                {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
        </form>
    );
}
