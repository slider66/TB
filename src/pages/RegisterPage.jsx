import React from 'react';
import Register from '@/components/Register';
import Login from '@/components/Login';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('register');

  const onRegisterSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          {view === 'register' ? (
            <Register onRegisterSuccess={onRegisterSuccess} onSwitchToLogin={() => setView('login')} />
          ) : (
            <Login onLoginSuccess={onRegisterSuccess} onSwitchToRegister={() => setView('register')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;