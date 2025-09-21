import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { redirectToCheckout } from '@/lib/stripe';

const CtaSection = ({ onUploadClick }) => {
  const { user } = useAuth();

  const handleStartClick = (plan) => {
    if (user) {
      redirectToCheckout(plan);
    } else {
      onUploadClick();
    }
  };

  return (
    <section className="gradient-orange py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para simplificar tu burocracia?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Sube tu PDF o foto del documento y te guiamos en cada paso.
          </p>
          <Button 
            className="bg-white text-orange hover:bg-neutral-100 text-lg px-8 py-4"
            onClick={() => handleStartClick('UNICO')}
          >
            Empezar Ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;