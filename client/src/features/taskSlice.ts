// src/features/taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    getTasks,
    createTask as createTaskApi,
    updateTask as updateTaskApi,
    deleteTask as deleteTaskApi,
    toggleTask as toggleTaskApi
} from '../services/taskService'; // Assuming these functions use fetch or another non-axios method
import { Task } from '../types/task';
//import { enqueueSnackbar } from 'notistack';  // Consider how to handle notifications without direct UI dependencies here

interface TaskState {
    items: Task[];
    isLoading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    items: [],
    isLoading: false,
    error: null
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const tasks = await getTasks();
            return tasks;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch tasks.");
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/create',
    async (taskData: Omit<Task, 'id'>, { rejectWithValue }) => {
        try {
            const newTask = await createTaskApi(taskData);
            return newTask;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create task.");
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/update',
    async (task: Task, { rejectWithValue }) => {
        try {
            const updatedTask = await updateTaskApi(task);
            return updatedTask;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update task.");
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (taskId: string, { rejectWithValue }) => {
        try {
            await deleteTaskApi(taskId);
            return taskId;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete task.");
        }
    }
);

export const toggleTask = createAsyncThunk(
    'tasks/toggle',
    async (taskId: string, { rejectWithValue }) => {
        try {
            await toggleTaskApi(taskId);
            return taskId;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to toggle task.");
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // You can add any synchronous reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || action.error.message || "Failed to fetch tasks.";
            })
            .addCase(createTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.isLoading = false;
                state.items.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || action.error.message || "Failed to create task.";
            })
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.isLoading = false;
                state.items = state.items.map(task => task.id === action.payload.id ? action.payload : task);
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || action.error.message || "Failed to update task.";
            })
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.items = state.items.filter(task => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || action.error.message || "Failed to delete task.";
            })
            .addCase(toggleTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(toggleTask.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.items = state.items.map(task =>
                    task.id === action.payload ? { ...task, completed: !task.completed } : task
                );
            })
            .addCase(toggleTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || action.error.message || "Failed to toggle task.";
            });
    }
});

export default taskSlice.reducer;