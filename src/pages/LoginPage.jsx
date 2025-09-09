import React from 'react';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('login');

  const onLoginSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-0 rounded-xl shadow-lg">
          {view === 'login' ? (
            <Login onLoginSuccess={onLoginSuccess} onSwitchToRegister={() => setView('register')} />
          ) : (
            <Register onRegisterSuccess={onLoginSuccess} onSwitchToLogin={() => setView('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;