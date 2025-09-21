import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onLoginClick, onStartClick }) => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/pricing', text: 'Precios' },
    { to: '/partners', text: 'Partners' },
    { to: '/faq', text: 'Preguntas Frecuentes' },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, y: -20 },
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: -0 },
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-white/95 shadow-md backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="https://horizons-cdn.hostinger.com/5d895b2d-33c5-4462-8a9e-665d2e957763/806325b9ee47551f89d11b2417c2653a.png" alt="Traductor Burocrático Logo" className="h-8 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-medium text-neutral-600 hover:text-orange transition-colors ${
                  isActive ? 'text-orange' : ''
                }`
              }
            >
              {link.text}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mi Cuenta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sesión iniciada</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/panel')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Panel de Casos</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={onLoginClick}>
                Iniciar Sesión
              </Button>
              <Button className="btn-primary" onClick={onStartClick}>
                Empezar ahora
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg pb-6"
          >
            <motion.nav className="flex flex-col items-center gap-6 px-6">
              {navLinks.map((link) => (
                <motion.div key={link.to} variants={mobileLinkVariants}>
                  <NavLink
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium text-neutral-700 hover:text-orange transition-colors ${
                        isActive ? 'text-orange' : ''
                      }`
                    }
                  >
                    {link.text}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div variants={mobileLinkVariants} className="w-full pt-4 border-t border-neutral-200">
                {user ? (
                  <div className="flex flex-col gap-4">
                     <Button variant="outline" className="w-full" onClick={() => { navigate('/panel'); setIsMobileMenuOpen(false); }}>Panel de Casos</Button>
                     <Button variant="outline" className="w-full" onClick={() => { navigate('/account'); setIsMobileMenuOpen(false); }}>Mi Perfil</Button>
                     <Button variant="destructive" className="w-full" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}>Cerrar sesión</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Button variant="outline" className="w-full" onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}>Iniciar Sesión</Button>
                    <Button className="btn-primary w-full" onClick={() => { onStartClick(); setIsMobileMenuOpen(false); }}>Empezar ahora</Button>
                  </div>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;