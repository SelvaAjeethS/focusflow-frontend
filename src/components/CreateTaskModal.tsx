"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskForm from './TaskForm';

interface CreateTaskModalProps {
    onTaskCreated: () => void;
}

export default function CreateTaskModal({ onTaskCreated }: CreateTaskModalProps) {
    const [open, setOpen] = useState(false);

    const handleTaskCreated = () => {
        onTaskCreated();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="fixed bottom-6 right-6 lg:hidden z-50">
                    <Button className="rounded-full shadow-premium h-14 w-14 p-0 bg-primary text-white hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 group border-4 border-background/50 backdrop-blur-sm">
                        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="sr-only">Create Task</span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-transparent shadow-none px-4">
                <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    <DialogHeader className="p-4">
                        <DialogTitle className="text-2xl font-black tracking-tighter text-text-primary uppercase">New Task</DialogTitle>
                    </DialogHeader>
                    <div className="pb-4">
                        <TaskForm onTaskCreated={handleTaskCreated} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
