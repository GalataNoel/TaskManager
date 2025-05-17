import React from 'react';
import { List } from '@mui/material';
import TaskItem from './TaskItem';
import { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
    onDeleteTask: (id: string) => void;
    onToggleTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask, onToggleTask, onEditTask }) => {
    return (
        <List>
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={onDeleteTask}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                />
            ))}
        </List>
    );
};

export default TaskList;