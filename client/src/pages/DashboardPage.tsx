// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskList from '../components/TaskList';
import TaskControls from '../components/TaskControls';
import AddTaskDialog from '../components/AddTaskDialog';
import EditTaskDialog from '../components/EditTaskDialog';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchTasks,
    updateTask,
    deleteTask,
    selectFilteredTasks,
    selectIsLoading
} from '../features/taskSlice';
import { Task } from '../types/task';



const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector(selectFilteredTasks);
    const isLoading = useAppSelector(selectIsLoading);
    const searchTerm = useAppSelector(state => state.tasks.searchTerm);
    const sortDirection = useAppSelector(state => state.tasks.sortDirection);
    const filterStatus = useAppSelector(state => state.tasks.filterStatus);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleUpdateTask = async (id: string, title: string, description: string | undefined) => {
        if (!editingTask) return;
        dispatch(updateTask({
            ...editingTask,
            title,
            description
        }));
        setIsEditDialogOpen(false);
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId: string) => {
        dispatch(deleteTask(taskId));
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsEditDialogOpen(true);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <TaskControls
                    searchTerm={searchTerm}
                    sortDirection={sortDirection}
                    filterStatus={filterStatus}
                />

                <TaskList
                    tasks={tasks}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                />

                {/* Add Task FAB */}
                <Fab
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <AddIcon />
                </Fab>
            </Box>

            <AddTaskDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />

            {editingTask && (
                <EditTaskDialog
                    open={isEditDialogOpen}
                    task={editingTask}
                    onClose={() => {
                        setIsEditDialogOpen(false);
                        setEditingTask(null);
                    }}
                    onSave={handleUpdateTask}
                />
            )}
        </Container>
    );
};

export default DashboardPage;