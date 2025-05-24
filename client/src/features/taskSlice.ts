import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../types/task';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import type { RootState } from '../store/store';

const API_URL = 'http://localhost:5002/api';

// Configure axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        const { token } = JSON.parse(user);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface TasksState {
    tasks: Task[];
    filteredTasks: Task[];
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
    sortDirection: 'asc' | 'desc';
    filterStatus: 'all' | 'completed' | 'active';
}

const initialState: TasksState = {
    tasks: [],
    filteredTasks: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    sortDirection: 'asc',
    filterStatus: 'all'
};

// Helper function for filtering and sorting tasks
const applyFilters = (
    tasks: Task[],
    searchTerm: string,
    sortDirection: 'asc' | 'desc',
    filterStatus: 'all' | 'completed' | 'active'
) => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Apply completion filter
    if (filterStatus !== 'all') {
        filtered = filtered.filter(task =>
            filterStatus === 'completed' ? task.completed : !task.completed
        );
    }

    // Apply sorting
    filtered.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });

    return filtered;
};

// Async thunks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Task[]>('/tasks');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: Omit<Task, 'id'>, { rejectWithValue }) => {
        try {
            const response = await api.post<Task>('/tasks', taskData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (task: Task, { rejectWithValue }) => {
        try {
            const response = await api.put<Task>(`/tasks/${task.id}`, task);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId: string, { rejectWithValue }) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            return taskId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
        }
    }
);

export const toggleTask = createAsyncThunk(
    'tasks/toggleTask',
    async (taskId: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { tasks: TasksState };
            const task = state.tasks.tasks.find(t => t.id === taskId);
            if (!task) throw new Error('Task not found');

            const updatedTask = {
                ...task,
                completed: !task.completed
            };

            const response = await api.put<Task>(`/tasks/${taskId}`, updatedTask);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle task');
        }
    }
);

// Slice
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearTasks: (state) => {
            state.tasks = [];
            state.filteredTasks = [];
            state.isLoading = false;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            state.filteredTasks = applyFilters(
                state.tasks,
                action.payload,
                state.sortDirection,
                state.filterStatus
            );
        },
        setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
            state.sortDirection = action.payload;
            state.filteredTasks = applyFilters(
                state.tasks,
                state.searchTerm,
                action.payload,
                state.filterStatus
            );
        },
        setFilterStatus: (state, action: PayloadAction<'all' | 'completed' | 'active'>) => {
            state.filterStatus = action.payload;
            state.filteredTasks = applyFilters(
                state.tasks,
                state.searchTerm,
                state.sortDirection,
                action.payload
            );
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload;
                state.filteredTasks = applyFilters(
                    action.payload,
                    state.searchTerm,
                    state.sortDirection,
                    state.filterStatus
                );
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                enqueueSnackbar(action.payload as string, { variant: 'error' });
            })

            // Create task
            .addCase(createTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks.unshift(action.payload);
                state.filteredTasks = applyFilters(
                    state.tasks,
                    state.searchTerm,
                    state.sortDirection,
                    state.filterStatus
                );
                enqueueSnackbar('Task created successfully', { variant: 'success' });
            })
            .addCase(createTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                enqueueSnackbar(action.payload as string, { variant: 'error' });
            })

            // Update task
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                    state.filteredTasks = applyFilters(
                        state.tasks,
                        state.searchTerm,
                        state.sortDirection,
                        state.filterStatus
                    );
                }
                enqueueSnackbar('Task updated successfully', { variant: 'success' });
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                enqueueSnackbar(action.payload as string, { variant: 'error' });
            })

            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
                state.filteredTasks = applyFilters(
                    state.tasks,
                    state.searchTerm,
                    state.sortDirection,
                    state.filterStatus
                );
                enqueueSnackbar('Task deleted successfully', { variant: 'success' });
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                enqueueSnackbar(action.payload as string, { variant: 'error' });
            })

            // Toggle task
            .addCase(toggleTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                    state.filteredTasks = applyFilters(
                        state.tasks,
                        state.searchTerm,
                        state.sortDirection,
                        state.filterStatus
                    );
                }
            })
            .addCase(toggleTask.rejected, (state, action) => {
                state.error = action.payload as string;
                enqueueSnackbar(action.payload as string, { variant: 'error' });
            });
    },
});

// Export actions
export const {
    clearTasks,
    setError,
    setSearchTerm,
    setSortDirection,
    setFilterStatus
} = taskSlice.actions;

// Export selectors
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectFilteredTasks = (state: RootState) => state.tasks.filteredTasks;
export const selectIsLoading = (state: RootState) => state.tasks.isLoading;
export const selectError = (state: RootState) => state.tasks.error;

// Export reducer
export default taskSlice.reducer;