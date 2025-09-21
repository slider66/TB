import React from 'react';
import { Helmet } from 'react-helmet-async';
import PricingSection from '@/components/home/PricingSection';

const PricingPage = ({ onStartClick }) => {
  const title = "Precios de traducción de trámites y notificaciones | 59 chars";
  const description = "Precio único para la traducción de tu trámite. Entiende tu notificación de Hacienda, AEAT o Seguridad Social sin sorpresas. Plan claro.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://traductorburocratico.es/pricing" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://traductorburocratico.es/pricing" />
      </Helmet>
      <div className="py-20 md:py-28">
        <PricingSection onStartClick={onStartClick} isPage={true} />
      </div>
    </>
  );
};

export default PricingPage;