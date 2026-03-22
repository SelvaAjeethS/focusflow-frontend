"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface TaskFiltersProps {
    filters: {
        status: string;
        priority: string;
        search: string;
        sort: string;
    };
    onFilterChange: (key: string, value: string) => void;
}

export default function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-3 items-center w-full">
            <div className="relative flex-1 w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary transition-colors group-focus-within:text-primary opacity-60" />
                <Input
                    placeholder="Search tasks..."
                    className="pl-10 h-9 text-sm bg-card/40 border-border/30 focus:bg-card focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-tertiary/70 rounded-full shadow-inner-sm"
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full lg:w-auto items-center">
                <Select
                    value={filters.status || "all"}
                    onValueChange={(val) => onFilterChange('status', val === "all" ? "" : val)}
                >
                    <SelectTrigger className="w-full sm:min-w-[100px] h-9 text-xs bg-card/40 border-border/30 rounded-full hover:bg-card/60 transition-colors">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Todo">Todo</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.priority || "all"}
                    onValueChange={(val) => onFilterChange('priority', val === "all" ? "" : val)}
                >
                    <SelectTrigger className="w-full sm:min-w-[100px] h-9 text-xs bg-card/40 border-border/30 rounded-full hover:bg-card/60 transition-colors">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.sort}
                    onValueChange={(val) => onFilterChange('sort', val)}
                >
                    <SelectTrigger className="w-full sm:min-w-[110px] h-9 text-xs bg-card/40 border-border/30 rounded-full hover:bg-card/60 transition-colors">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                        <SelectItem value="createdAt">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
