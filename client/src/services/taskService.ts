import { Task } from '../types/task';
import api from './axiosConfig';

export const getTasks = async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
};

export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${task.id}`, task);
    return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
};

export const toggleTask = async (taskId: string): Promise<void> => {
    await api.patch(`/tasks/${taskId}/toggle`);
};