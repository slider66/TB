
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { redirectToCheckout } from '@/lib/stripe';

const PricingSection = ({ onUploadClick }) => {
  const { user } = useAuth();

  const handleStartClick = (plan) => {
    if (user) {
      redirectToCheckout(plan);
    } else {
      onUploadClick();
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
         <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-800 mb-4">Planes para cada necesidad</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">Precios claros y sencillos para empezar sin dudarlo.</p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Basic Plan */}
          <Card className="pricing-card lg:col-span-1">
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
                <Button className="btn-secondary w-full" onClick={() => handleStartClick('basic')}>Empezar ahora</Button>
              </div>
            </CardContent>
          </Card>

          {/* Complete Plan */}
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
                <Button className="btn-primary w-full" onClick={() => handleStartClick('complete')}>Empezar ahora</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Urgent Extra */}
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
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 p-3 rounded-lg text-sm">
            <Shield className="h-5 w-5 mr-2" />
            <p><strong>Garantía de Plazo:</strong> Si no cumplimos, upgrade gratis o devolución parcial.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
