"use client";

import { Task } from '@/types/task';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
    const statusMap: Record<Task['status'], any> = {
        'Todo': 'secondary',
        'In Progress': 'warning',
        'Done': 'success',
    };

    const priorityMap: Record<Task['priority'], any> = {
        'Low': 'success',
        'Medium': 'info',
        'High': 'destructive',
    };

    const priorityColors: Record<Task['priority'], string> = {
        'Low': 'bg-success',
        'Medium': 'bg-info',
        'High': 'bg-error',
    };

    return (
        <Card className="overflow-hidden border-border/40 bg-card/40 hover:bg-card transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-0.5 relative">
            {/* Priority Indicator Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityColors[task.priority]} opacity-70`} />

            <CardHeader className="p-3 sm:p-4 pb-1.5 pl-4 sm:pl-5">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm sm:text-base font-bold truncate group-hover:text-primary transition-colors tracking-tight">
                            {task.title}
                        </CardTitle>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                        <span className={cn(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            task.status === 'Done' ? 'bg-success' :
                                task.status === 'In Progress' ? 'bg-warning' : 'bg-text-tertiary'
                        )} />
                        <Badge variant={statusMap[task.status]} className="capitalize text-[10px] px-2 py-0.5 h-auto font-black border-none shadow-sm ring-1 ring-white/10 uppercase tracking-tighter">
                            {task.status}
                        </Badge>
                    </div>
                    <Badge variant={priorityMap[task.priority]} className="text-[9px] h-4 px-2 border-none font-black uppercase tracking-widest opacity-90 shadow-sm">
                        {task.priority}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-1 pb-3 pl-4 sm:pl-5">
                <p className="text-text-secondary text-[11px] sm:text-xs leading-relaxed line-clamp-2 min-h-[1rem] opacity-80">
                    {task.description || "No description provided."}
                </p>
            </CardContent>
            {task.dueDate && (
                <CardFooter className="p-1 px-4 sm:px-5 flex justify-start items-center border-t border-border/10 bg-card/20 backdrop-blur-sm min-h-0">
                    <div className="flex items-center gap-1.5 text-text-tertiary text-xs font-bold py-1">
                        <Calendar className="w-2.5 h-2.5 opacity-60" />
                        <span className="opacity-80 uppercase tracking-tighter">{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </CardFooter>
            )}

            {/* Absolute Icons in Bottom Right */}
            <div className="absolute bottom-1 right-1 flex gap-0.5 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(task)}
                    className="h-6 w-6 text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
                >
                    <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(task._id)}
                    className="h-6 w-6 text-error/60 hover:bg-error/10 hover:text-error transition-colors rounded-full"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </Card>
    );
}
