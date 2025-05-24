// src/components/EditTaskDialog.tsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';
import { Task } from '../types/task';

interface EditTaskDialogProps {
    open: boolean;
    task: Task;
    onClose: () => void;
    onSave: (id: string, title: string, description: string | undefined) => void;  // Updated this line
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({ open, task, onClose, onSave }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(task.id, title, description || undefined);  // Handle empty string as undefined
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Edit Task</DialogTitle>
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
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={!title.trim()}>
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditTaskDialog;