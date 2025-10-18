import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Users, CreditCard, Settings, BarChart, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import UserManagement from '@/components/admin/UserManagement';
import ServiceManagement from '@/components/admin/ServiceManagement';

const AdminPage = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '', text: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { to: 'users', text: 'Usuarios', icon: <Users className="h-5 w-5" /> },
    { to: 'services', text: 'Servicios', icon: <CreditCard className="h-5 w-5" /> },
    { to: 'reports', text: 'Reportes', icon: <BarChart className="h-5 w-5" /> },
    { to: 'settings', text: 'Configuración', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-100">
        <aside className="w-64 bg-neutral-800 text-white p-4 flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange">Admin Panel</h2>
            <p className="text-sm text-neutral-400 truncate">{user?.email}</p>
          </div>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={`/admin/${item.to}`}
                end={item.to === ''}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-orange text-white'
                      : 'hover:bg-neutral-700'
                  }`
                }
              >
                {item.icon}
                <span>{item.text}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="services" element={<ServiceManagement />} />
                <Route path="*" element={<NotFoundAdmin />} />
            </Routes>
          </motion.div>
        </main>
      </div>
  );
};

const AdminDashboard = () => <div><h1 className="text-3xl font-bold">Dashboard</h1><p>Bienvenido al panel de administración.</p></div>;
const NotFoundAdmin = () => <div><h1 className="text-3xl font-bold">404 - No Encontrado</h1><p>Esta sección no existe en el panel de administración.</p></div>;

export default AdminPage;
