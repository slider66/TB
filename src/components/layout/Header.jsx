
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

const Header = ({ onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    const protectedRoutes = ['/upload', '/clients', '/account', '/cases'];
    if (protectedRoutes.some(p => path.startsWith(p)) && !user) {
      onLoginClick();
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
      navigate(path);
    }
  };

  const navLinks = [
    { to: '/', text: 'Inicio' },
    { to: '/pricing', text: 'Precios' },
    { to: '/upload', text: 'Subir Documento' },
  ];
  
  const userRole = user?.user_metadata?.role;
  if (!user) {
     navLinks.push({ to: '/partners', text: 'Quiero ser partner' });
  }

  const activeLinkClass = 'text-orange';
  const inactiveLinkClass = 'text-neutral-600 hover:text-orange';

  const navigateToDashboard = () => {
    if (userRole === 'client') {
      navigate('/clients');
    } else if (userRole === 'partner_admin' || userRole === 'partner_member' || userRole === 'reviewer') {
      navigate('/partners');
    } else if (isAdmin) {
      navigate('/admin');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gradient">
              Traductor Burocrático
            </span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                onClick={(e) => handleNavClick(e, link.to)}
                className={`font-medium transition-colors ${
                  window.location.pathname === link.to ? activeLinkClass : inactiveLinkClass
                }`}
              >
                {link.text}
              </a>
            ))}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                     <span className="font-medium text-neutral-700 flex items-center gap-2">
                        <UserCircle className="h-8 w-8 text-orange"/>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Conectado</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={navigateToDashboard}>
                      Mis Expedientes
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => navigate('/account')}>
                      Mi Cuenta
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/support')}>
                      Soporte
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Salir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            ) : (
              <Button className="btn-primary" onClick={onLoginClick}>
                Iniciar Sesión
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-600 hover:text-orange"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-200"
            >
              <div className="py-4 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={(e) => handleNavClick(e, link.to)}
                    className={`block w-full text-left font-medium transition-colors ${
                      window.location.pathname === link.to ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    {link.text}
                  </a>
                ))}
                {user ? (
                   <>
                    <a href="#" onClick={(e) => handleNavClick(e, userRole === 'client' ? '/clients' : '/partners')} className={`block w-full text-left font-medium transition-colors ${inactiveLinkClass}`}>Mis Expedientes</a>
                    <a href="#" onClick={(e) => handleNavClick(e, '/account')} className={`block w-full text-left font-medium transition-colors ${inactiveLinkClass}`}>Mi Cuenta</a>
                     {isAdmin && (
                      <a href="#" onClick={(e) => handleNavClick(e, '/admin')} className={`block w-full text-left font-medium transition-colors ${inactiveLinkClass}`}>
                        <ShieldCheck className="mr-2 h-4 w-4 inline-block" />
                        Admin Panel
                      </a>
                    )}
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2"/>
                      <span>Salir</span>
                    </Button>
                  </>
                ) : (
                   <Button
                    className="btn-primary w-full"
                    onClick={() => {
                      onLoginClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;
