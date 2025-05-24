import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { createTask } from '../features/taskSlice';

interface AddTaskDialogProps {
    open: boolean;
    onClose: () => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createTask({
                title,
                description,
                completed: false,
                UserId: '', // This will be set by the server
                createdAt: '',
                updatedAt: ''
            })).unwrap();
            handleClose();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!title.trim()}
                    >
                        Add Task
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddTaskDialog;