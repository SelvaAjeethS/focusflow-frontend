"use client";

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
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

interface EditTaskModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export default function EditTaskModal({ task, isOpen, onClose, onUpdate }: EditTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Task['status']>('Todo');
    const [priority, setPriority] = useState<Task['priority']>('Medium');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
            setPriority(task.priority);
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task) return;

        setIsSubmitting(true);
        try {
            await api.put(`/tasks/${task._id}`, {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            });
            toast.success('Task updated successfully!');
            onUpdate();
            onClose();
        } catch (error: any) {
            console.error('Failed to update task', error);
            const message = error.response?.data?.message || 'Failed to update task.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                <DialogHeader className="p-4 pb-2 border-b bg-card/50">
                    <DialogTitle className="text-lg font-bold text-text-primary">Edit Task</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="edit-title" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                            Title
                        </Label>
                        <Input
                            id="edit-title"
                            required
                            placeholder="Task title"
                            className="h-8 text-xs bg-background/50 border-border/40"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="edit-description" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                            Description
                        </Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Add details..."
                            className="min-h-[80px] text-xs resize-none bg-background/50 border-border/40 py-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="edit-status" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                                Status
                            </Label>
                            <Select
                                value={status}
                                onValueChange={(value) => setStatus(value as Task['status'])}
                            >
                                <SelectTrigger id="edit-status" className="h-8 text-xs bg-background/50 border-border/40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todo" className="text-xs">To Do</SelectItem>
                                    <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
                                    <SelectItem value="Done" className="text-xs">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit-priority" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                                Priority
                            </Label>
                            <Select
                                value={priority}
                                onValueChange={(value) => setPriority(value as Task['priority'])}
                            >
                                <SelectTrigger id="edit-priority" className="h-8 text-xs bg-background/50 border-border/40">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low" className="text-xs">Low</SelectItem>
                                    <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                                    <SelectItem value="High" className="text-xs">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="edit-dueDate" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                            Due Date
                        </Label>
                        <Input
                            type="date"
                            id="edit-dueDate"
                            className="h-8 text-xs bg-background/50 border-border/40"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-border/50 mt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 h-9 text-xs font-semibold hover:bg-border/30"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex-1 h-9 text-xs font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
