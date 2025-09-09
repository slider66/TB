
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { redirectToCheckout } from '@/lib/stripe';

import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import DeliverablesSection from '@/components/home/DeliverablesSection';
import PricingSection from '@/components/home/PricingSection';
import StatsSection from '@/components/home/StatsSection';
import FinalCTASection from '@/components/home/FinalCTASection';

const HomePage = ({ onUploadClick }) => {
  const { user } = useAuth();
  
  const handleStartClick = async (plan) => {
    if (user) {
      await redirectToCheckout(plan);
    } else {
      onUploadClick();
    }
  };

  return (
    <>
      <Helmet>
        <title>Tu notificación, explicada en minutos | Traductor Burocrático</title>
        <meta name="description" content="Sube tu carta de la Administración y recibe resumen entendible, checklist con plazos y plantillas para responder. Conexión con expertos verificados. 100% RGPD." />
        <meta property="og:title" content="Tu notificación, explicada en minutos | Traductor Burocrático" />
        <meta property="og:description" content="Sube tu carta de la Administración y recibe resumen entendible, checklist con plazos y plantillas para responder. Conexión con expertos verificados. 100% RGPD." />
        <meta property="og:url" content="https://traductorburocratico.es/" />
        <meta property="og:image" content="https://traductorburocratico.es/og-default.jpg" />
        <meta property="og:site_name" content="Traductor Burocrático" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tu notificación, explicada en minutos | Traductor Burocrático" />
        <meta name="twitter:description" content="Sube tu carta de la Administración y recibe resumen entendible, checklist con plazos y plantillas para responder. Conexión con expertos verificados. 100% RGPD." />
        <meta name="twitter:image" content="https://traductorburocratico.es/og-default.jpg" />
      </Helmet>
      <div className="min-h-screen">
        <HeroSection onStartClick={handleStartClick} user={user} />
        <FeaturesSection />
        <DeliverablesSection onStartClick={handleStartClick} />
        <PricingSection onStartClick={handleStartClick} />
        <StatsSection />
        <FinalCTASection onStartClick={handleStartClick} />
      </div>
    </>
  );
};

export default HomePage;
