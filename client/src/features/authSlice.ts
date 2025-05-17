import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@store/store';
import authService from '../services/authService';
import { enqueueSnackbar } from 'notistack';

interface AuthState {
    user: { id: string; username: string } | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: { id: string; username: string }; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoading = false;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;

export const loginUser = (username: string, password: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await authService.login(username, password);
        dispatch(setCredentials(response));
        enqueueSnackbar('Login successful', { variant: 'success' });
    } catch (error: any) {
        dispatch(setError(error.message));
        enqueueSnackbar(error.message, { variant: 'error' });
    }
};

export const registerUser = (username: string, password: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        await authService.register(username, password);
        enqueueSnackbar('Registration successful', { variant: 'success' });
    } catch (error: any) {
        dispatch(setError(error.message));
        enqueueSnackbar(error.message, { variant: 'error' });
    }
};

export default authSlice.reducer;