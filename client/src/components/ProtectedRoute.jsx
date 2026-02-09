import React from 'react'
import { Navigate, replace } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to={"/login"} replace />
    }
    return children;
    
}

export default ProtectedRoute