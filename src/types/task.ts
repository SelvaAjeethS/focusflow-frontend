export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'Todo' | 'In Progress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    dueDate?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskListResponse {
    tasks: Task[];
    page: number;
    totalPages: number;
    totalTasks: number;
}
