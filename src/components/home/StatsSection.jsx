import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { number: '10K+', label: 'Documentos Procesados' },
            { number: '95%', label: 'Precisión en Análisis' },
            { number: '<24h', label: 'Tiempo Medio de Respuesta' },
            { number: '500+', label: 'Profesionales Conectados' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="stats-card"
            >
              <div className="stats-number">{stat.number}</div>
              <div className="stats-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;