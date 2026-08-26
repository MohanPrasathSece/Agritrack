import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Give a small delay to ensure profile creation logic in AuthContext completes
            const timer = setTimeout(() => {
                if (localStorage.getItem('agritrack_new_user') === 'true' || user.role === 'new_user') {
                    localStorage.removeItem('agritrack_new_user');
                    navigate('/select-role');
                } else {
                    navigate('/dashboard');
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [user, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-800">Verifying your account...</h2>
                <p className="text-gray-500 mt-2">Please wait while we set things up.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
