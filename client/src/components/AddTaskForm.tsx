import React, { useState } from 'react';
import { TextField, Button, Box, Paper } from '@mui/material';

interface AddTaskFormProps {
    onAddTask: (title: string, description: string) => void;
    isLoading: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, isLoading }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && description.trim()) {
            onAddTask(title, description);
            setTitle('');
            setDescription('');
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Task Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <TextField
                    label="Task Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    {isLoading ? 'Adding...' : 'Add Task'}
                </Button>
            </Box>
        </Paper>
    );
};

export default AddTaskForm;