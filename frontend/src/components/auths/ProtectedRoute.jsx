import AppLayout from '../../layout/AppLayout';
import React from 'react'
import {Navigate, Outlet} from 'react-router-dom'

const ProtectedRoute = () => {

    const isAuthenticated = true; 
    const loading = false;

    if(loading){
        return (
            <div className="flex">
                <h2>Loading...</h2>
            </div>
        )
    }

    return isAuthenticated ? (
        <AppLayout>
            <Outlet/>
        </AppLayout>
    ): (
        <Navigate to='/login' replace></Navigate>
    )
}   

export default ProtectedRoute;
