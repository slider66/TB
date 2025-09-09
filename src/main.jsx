
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster as HotToaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <HotToaster position="bottom-right" />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
