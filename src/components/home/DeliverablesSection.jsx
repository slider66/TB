import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckSquare, PenLine as FilePenLine, Globe, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DeliverablesSection = () => {
  const deliverables = [
    {
      icon: <Sparkles className="h-8 w-8 text-orange" />,
      title: 'Resumen en lenguaje común',
      description: 'Te explicamos qué te piden y qué significa, sin jerga legal ni burocrática.',
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-orange" />,
      title: 'Checklist con plazos y documentos',
      description: 'Una lista clara de lo que necesitas entregar y las fechas límite para no olvidarte de nada.',
    },
    {
      icon: <FilePenLine className="h-8 w-8 text-orange" />,
      title: 'Plantillas para responder o alegar',
      description: 'Modelos de escritos listos para rellenar, adaptados a tu caso específico.',
    },
    {
      icon: <Globe className="h-8 w-8 text-orange" />,
      title: 'Enlaces oficiales para tramitar online',
      description: 'Acceso directo a la Sede Electrónica correcta para que presentes tus documentos sin perderte.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-orange" />,
      title: 'Acceso a expertos verificados (opcional)',
      description: 'Si tu caso se complica, te conectamos con nuestra red de profesionales de confianza.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800">
            ¿Qué recibirás exactamente?
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Nuestro objetivo es darte todo lo que necesitas para que resuelvas tu trámite con total autonomía y seguridad.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {deliverables.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-neutral-50 border-neutral-200">
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="bg-orange/10 p-4 rounded-full">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DeliverablesSection;