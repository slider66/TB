import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CookiePreferencesDialog from '@/components/CookiePreferencesDialog';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const CookieConsentBanner = () => {
  const {
    isBannerVisible,
    acceptAll,
    rejectAll,
    openPreferences,
    hideBanner,
  } = useCookieConsent();

  const handleConfigure = () => {
    hideBanner();
    openPreferences();
  };

  return (
    <>
      {isBannerVisible && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6 sm:px-6 sm:pb-8">
          <div className="mx-auto max-w-4xl rounded-2xl bg-neutral-900/95 p-6 text-neutral-50 shadow-2xl backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Gestiona tu privacidad</h2>
            <p className="mt-2 text-sm text-neutral-200">
              Usamos cookies necesarias para que la web funcione y, si nos lo permites, otras para
              conocer el uso del sitio y mejorar tu experiencia. Puedes personalizar tu elección o
              consultar nuestra{' '}
              <Link to="/cookies-policy" className="font-semibold text-orange underline">
                Política de Cookies
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="sm:w-auto"
                onClick={rejectAll}
              >
                Rechazar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="sm:w-auto"
                onClick={handleConfigure}
              >
                Configurar
              </Button>
              <Button
                type="button"
                className="sm:w-auto"
                onClick={acceptAll}
              >
                Aceptar todas
              </Button>
            </div>
          </div>
        </div>
      )}
      <CookiePreferencesDialog />
    </>
  );
};

export default CookieConsentBanner;
