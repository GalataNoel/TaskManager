// src/services/taskService.ts
import { Task } from '../types/task';
import { store } from 'store/store';

const API_URL = process.env.REACT_APP_API_URL + '/tasks';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
}

export const getTasks = async (): Promise<Task[]> => {
    const { auth } = store.getState();
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
        }
    });
    return handleResponse(response);
};

export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const { auth } = store.getState();
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    return handleResponse(response);
};

export const updateTask = async (task: Task): Promise<Task> => {
    const { auth } = store.getState();
    const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    return handleResponse(response);
};

export const deleteTask = async (taskId: string): Promise<void> => {
    const { auth } = store.getState();
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${auth.token}`
        }
    });
    await handleResponse(response);
};

export const toggleTask = async (taskId: string): Promise<void> => {
    const { auth } = store.getState();
    const response = await fetch(`${API_URL}/${taskId}/toggle`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${auth.token}`
        }
    });
    await handleResponse(response);
};