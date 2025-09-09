
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { redirectToCheckout } from '@/lib/stripe';

const HeroSection = ({ onUploadClick }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStartClick = (plan) => {
    if (user) {
      redirectToCheckout(plan);
    } else {
      onUploadClick();
    }
  };

  const handlePartnerClick = () => {
    navigate('/partners');
  };

  return (
    <section className="hero-pattern py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Tu notificación,</span>
            <br />
            <span className="text-neutral-800">explicada en minutos.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            Traduce documentos administrativos al lenguaje común y conecta con profesionales que pueden ayudarte. Rápido, claro y 100% RGPD
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="btn-primary text-lg px-8 py-4"
              onClick={() => handleStartClick('complete')}
            >
              <Upload className="mr-2 h-5 w-5" />
              Subir documento
            </Button>
            <Button 
              className="btn-secondary text-lg px-8 py-4"
              onClick={() => toast({
                title: "🚧 Esta función no está implementada aún",
                description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
              })}
            >
              <Play className="mr-2 h-5 w-5" />
              Probar con un documento de ejemplo
            </Button>
          </div>
          <div className="mt-4 text-sm text-neutral-500">
            PDF/JPG/PNG · máx. 10 MB · Datos cifrados · Orientación comprensible con plazos. Te conectamos con profesionales verificados a un clic.
          </div>
          {!user && (
            <div className="mt-8">
              <Button variant="link" className="text-orange hover:text-orange/80" onClick={handlePartnerClick}>
                ¿Eres un profesional? Quiero ser partner <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
