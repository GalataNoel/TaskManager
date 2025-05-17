// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask
} from '../features/taskSlice';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    Paper
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import AddTaskForm from '../components/AddTaskForm';
import EditTaskDialog from '../components/EditTaskDialog';
import { Task } from '../types/task';

const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch();
    // @ts-ignore
    const { tasks, isLoading } = useAppSelector((state) => state.tasks);
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleAddTask = (title: string, description: string) => {
        dispatch(createTask({
            title,
            description,
            completed: false,
            userId: user?.id || ''
        }));
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsEditDialogOpen(true);
    };

    const handleUpdateTask = (id: string, title: string, description: string) => {
        if (!editingTask) return;

        dispatch(updateTask({
            id,
            title,
            description,
            completed: editingTask.completed,
            userId: editingTask.userId,
            createdAt: editingTask.createdAt,
            updatedAt: new Date().toISOString()
        }));
        setIsEditDialogOpen(false);
    };

    const handleDeleteTask = (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            dispatch(deleteTask(id));
        }
    };

    const handleToggleTask = (id: string) => {
        dispatch(toggleTask(id));
    };

    return (
        <Container maxWidth="md">
            <Box my={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">
                    Welcome, {user?.username}
                </Typography>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

            <Typography variant="h5" gutterBottom>
                Your Tasks
            </Typography>

            <AddTaskForm onAddTask={handleAddTask} isLoading={isLoading} />

            {isLoading && tasks.length === 0 ? (
                <Typography>Loading tasks...</Typography>
            ) : (
                <List component={Paper}>
                    {tasks.map((task: Task) => (
                        <ListItem key={task.id} divider>
                            <Checkbox
                                edge="start"
                                checked={task.completed || false}
                                onChange={() => handleToggleTask(task.id)}
                            />
                            <ListItemText
                                primary={task.title}
                                secondary={task.description}
                                sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                            />
                            <IconButton edge="end" onClick={() => handleEditTask(task)}>
                                <Edit />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            )}

            {editingTask && (
                <EditTaskDialog
                    open={isEditDialogOpen}
                    task={editingTask}
                    onClose={() => setIsEditDialogOpen(false)}
                    onSave={handleUpdateTask}
                />
            )}
        </Container>
    );
};

export default DashboardPage;