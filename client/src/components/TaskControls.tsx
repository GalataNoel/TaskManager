// src/components/TaskControls.tsx
import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    SelectChangeEvent,
    ToggleButtonGroup,
    IconButton, ToggleButton, Tooltip, Paper
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearchTerm, setSortDirection, setFilterStatus } from '../features/taskSlice';
import type { RootState } from '../store/store';
import {
    Sort as SortIcon, SortByAlpha as SortByAlphaIcon,
} from '@mui/icons-material';

interface TaskControlsProps {
    searchTerm: string;
    sortDirection: 'asc' | 'desc';
    filterStatus: 'all' | 'completed' | 'active';
}

const TaskControls: React.FC<TaskControlsProps> = ({
                                                       searchTerm,
                                                       sortDirection,
                                                       filterStatus,
                                                   }) => {
    const dispatch = useAppDispatch();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(event.target.value));
    };

    const handleFilterChange = (
        _event: React.MouseEvent<HTMLElement>,
        newFilter: 'all' | 'completed' | 'active' | null
    ) => {
        if (newFilter !== null) {
            dispatch(setFilterStatus(newFilter));
        }
    };

    const handleSortToggle = () => {
        dispatch(setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    size="small"
                    label="Search tasks"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                <ToggleButtonGroup
                    value={filterStatus}
                    exclusive
                    onChange={handleFilterChange}
                    size="small"
                >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="active">Active</ToggleButton>
                    <ToggleButton value="completed">Completed</ToggleButton>
                </ToggleButtonGroup>

                <Tooltip title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}>
                    <IconButton onClick={handleSortToggle}>
                        {sortDirection === 'asc' ? (
                            <SortByAlphaIcon />
                        ) : (
                            <SortIcon />
                        )}
                    </IconButton>
                </Tooltip>
            </Box>
        </Paper>
    );
};

export default TaskControls;