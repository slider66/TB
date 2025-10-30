import React from 'react';
import { TBButton } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, Zap, FileText, Languages, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { redirectToCheckout } from '@/lib/stripe';

const PricingSection = ({ onStartClick, isPage = false }) => {
  const { user } = useAuth();

  const handleStartClick = (plan) => {
    if (user) {
      redirectToCheckout(plan);
    } else {
      onStartClick();
    }
  };

  const features = [
    "PDF claro con resumen y checklist paso a paso",
    "Entrega en menos de 24 horas",
    "IA + revisión humana para máxima precisión",
    "1 revisión gratuita si algo no queda claro",
    "Enlaces oficiales para tramitar online",
  ];

  const addons = [
    { icon: <Zap className="h-6 w-6 text-tb-primary" />, title: "Servicio Urgente 4h", price: "+9,90 €" },
    { icon: <FileText className="h-6 w-6 text-tb-primary" />, title: "Documento largo", price: "+4,90 € / 10 pág. extra" },
    { icon: <Languages className="h-6 w-6 text-tb-primary" />, title: "Traducción (EN/FR/PT)", price: "+6,90 €" },
  ];

  const TitleComponent = isPage ? 'h1' : 'h2';

  return (
    <section id="pricing" className="py-20 px-4 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <TitleComponent className="text-4xl font-bold text-neutral-800 mb-4">Una tarifa única, todo incluido</TitleComponent>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Sin sorpresas. Un único pago para que entiendas cualquier documento administrativo de hasta 10 páginas.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <Card className="lg:col-span-3 pricing-card highlighted border-2 border-tb-primary shadow-tb-primary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Plan Único</CardTitle>
              <CardDescription>La solución completa para entender tu burocracia.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-tb-primary mb-6">14,90 € <span className="text-lg font-normal text-neutral-500">IVA incl.</span></div>
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <TBButton variant="primary" size="lg" className="w-full" onClick={() => handleStartClick('UNICO')}>
                Empezar ahora
              </TBButton>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
             <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold"><PlusCircle className="text-tb-primary" />Add-ons Opcionales</CardTitle>
                    <CardDescription>Personaliza tu servicio según tus necesidades.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {addons.map((addon, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {addon.icon}
                                    <span className="font-medium text-neutral-700">{addon.title}</span>
                                </div>
                                <span className="font-bold text-neutral-800">{addon.price}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                    <h4 className="font-bold text-blue-800 mb-2">¿Necesitas más ayuda?</h4>
                    <p className="text-blue-700 text-sm">
                        Si tu caso requiere gestión o defensa, te derivamos a un partner de confianza (solo si lo autorizas).
                        <br/><br/>
                        <em className="text-xs text-blue-600">Aviso: este es un servicio pedagógico de comprensión; no sustituye asesoramiento legal o fiscal.</em>
                    </p>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
