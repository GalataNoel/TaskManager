import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

const PrivateRoute: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;