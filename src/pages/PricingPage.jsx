
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { redirectToCheckout } from '@/lib/stripe';

const PricingPage = ({ onStartClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleStartClick = (plan) => {
    if (user) {
      redirectToCheckout(plan);
    } else {
      onStartClick();
    }
  };


  return (
    <>
      <Helmet>
        <title>Tarifas - Traductor Burocrático</title>
        <meta name="description" content="Planes y precios flexibles para traducir y entender tus documentos oficiales. Desde un análisis básico hasta un plan completo con plantillas." />
      </Helmet>
      <div className="min-h-screen py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-neutral-800 mb-6">
              Planes para cada necesidad
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Precios claros y sencillos para empezar sin dudarlo. Elige la tarifa que mejor se adapta a ti.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-16">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="pricing-card lg:col-span-1 h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Básico</CardTitle>
                  <CardDescription>Para una visión clara y rápida.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <div className="text-4xl font-bold text-orange mb-6">9,90 €</div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />Explicación en lenguaje común</li>
                    <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />Checklist de acciones</li>
                  </ul>
                  <div className="mt-auto">
                    <Button className="btn-secondary w-full" onClick={() => handleStartClick('BASIC')}>Empezar ahora</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="pricing-card highlighted lg:col-span-1 border-2 border-orange shadow-orange h-full">
                <div className="highlight-badge">Más Popular</div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Completo</CardTitle>
                  <CardDescription>La opción más completa para actuar.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <div className="text-4xl font-bold text-orange mb-6">19,90 €</div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" /><strong>Todo lo del plan Básico</strong></li>
                    <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />Plantillas para responder</li>
                    <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3" />Mini-glosario de términos</li>
                  </ul>
                  <div className="mt-auto">
                    <Button className="btn-primary w-full" onClick={() => handleStartClick('COMPLETE')}>Empezar ahora</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="pricing-card lg:col-span-1 bg-orange/5 border-orange/20 h-full">
                 <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold"><Zap className="text-orange" />Extra Urgente</CardTitle>
                  <CardDescription>Prioridad máxima para tu tranquilidad.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <div className="text-2xl font-bold text-orange mb-4">+9-12 €</div>
                  <p className="text-neutral-600 mb-auto">
                    Recibe tu análisis en <strong>menos de 4 horas</strong> en horario laboral.
                  </p>
                  <p className="text-xs text-neutral-500 mt-4">
                    Añádelo al seleccionar tu plan al subir el documento.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
            
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center bg-green-100 text-green-800 p-3 rounded-lg text-sm">
              <Shield className="h-5 w-5 mr-2" />
              <p><strong>Garantía de Plazo:</strong> Si no cumplimos, upgrade gratis o devolución parcial.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;