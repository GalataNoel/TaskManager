// client/src/types.d.ts
import { store } from './store';

declare global {
    type RootState = ReturnType<typeof store.getState>;
    type AppDispatch = typeof store.dispatch;

    interface Task {
        id: string;
        title: string;
        description: string;
        completed: boolean;
        userId: string;
        createdAt?: string;
        updatedAt?: string;
    }
}

// Application-specific types
interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
}

interface User {
    id: string;
    username: string;
    token?: string;
    createdAt?: string;
}

// Extend Material-UI theme if needed
declare module '@mui/material/styles' {
    interface Theme {
        custom?: {
            colors?: {
                primary?: string;
                secondary?: string;
            };
        };
    }
    interface ThemeOptions {
        custom?: {
            colors?: {
                primary?: string;
                secondary?: string;
            };
        };
    }
}