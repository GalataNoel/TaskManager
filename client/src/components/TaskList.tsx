// src/components/TaskList.tsx
import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    Paper,
    Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { toggleTask } from '../features/taskSlice';
import { Task } from '../types/task';

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
    const dispatch = useAppDispatch();

    if (tasks.length === 0) {
        return (
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="body1" align="center">
                    No tasks available
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper>
            <List>
                {tasks.map((task) => (
                    <ListItem
                        key={task.id}
                        divider
                        sx={{
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <Checkbox
                            edge="start"
                            checked={task.completed}
                            onChange={() => dispatch(toggleTask(task.id))}
                        />
                        <ListItemText
                            primary={task.title}
                            secondary={task.description}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                },
                            }}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => onEdit(task)}
                                sx={{ mr: 1 }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => onDelete(task.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default TaskList;