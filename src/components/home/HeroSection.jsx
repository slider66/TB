
import React from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = ({ onUploadClick }) => {
  return (
    <section className="relative w-full py-20 md:py-28 lg:py-36 bg-neutral-50 overflow-hidden hero-pattern">
        <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-800 leading-tight mb-6 max-w-4xl"
          >
            Traduce tu documento oficial a lenguaje claro <span className="text-gradient">en minutos</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-600 mb-10 max-w-3xl"
          >
            Sube tu archivo y recibe una explicación sencilla y revisada por un humano.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Button
              className="btn-primary flex items-center justify-center gap-2 text-lg py-4 px-6 md:px-8 w-full sm:w-auto text-wrap"
              onClick={onUploadClick}
            >
              <UploadCloud className="h-6 w-6" />
              Subir documento
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="space-y-2"
          >
            <p className="text-sm md:text-base text-neutral-500 max-w-2xl">
              No es asesoría legal, es información práctica para que entiendas tus trámites.
            </p>
            <p className="flex items-center justify-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Tus documentos se eliminan automáticamente tras 7 días.
            </p>
          </motion.div>
        </div>
      </section>
  );
};

export default HeroSection;
