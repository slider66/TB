
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const StickyCta = ({ onUploadClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isScrolled = useScrollProgress(0.4);

  const hiddenRoutes = [
    '/upload',
    '/login',
    '/register',
    '/admin',
    '/cases',
    '/payment',
  ];

  const isVisible =
    isScrolled &&
    !hiddenRoutes.some(path => location.pathname.startsWith(path));

  const handleUploadClick = () => {
    if (user) {
      navigate('/upload');
    } else {
      onUploadClick();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg p-4 border-t border-neutral-200 shadow-lg md:hidden z-30"
        >
          <Button className="btn-primary w-full text-lg py-3" onClick={handleUploadClick}>
            <Upload className="mr-2 h-5 w-5" />
            Subir documento
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCta;
