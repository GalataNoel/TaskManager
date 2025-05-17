import React from 'react';
import { ListItem, ListItemText, IconButton, ListItemSecondaryAction, Checkbox } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggle, onEdit }) => {
    return (
        <ListItem divider>
            <Checkbox
                edge="start"
                checked={task.completed || false}
                tabIndex={-1}
                disableRipple
                onChange={() => onToggle(task.id)}
            />
            <ListItemText
                primary={task.title}
                secondary={task.description}
                sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task)}>
                    <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default TaskItem;