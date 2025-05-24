export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    UserId: string;  // Changed from userId to UserId
    createdAt: string;
    updatedAt: string;
}

export type SortDirection = 'asc' | 'desc';
export type FilterStatus = 'all' | 'completed' | 'active';

export interface TaskState {
    tasks: Task[];
    filteredTasks: Task[];
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
    sortDirection: SortDirection;
    filterStatus: FilterStatus;
}