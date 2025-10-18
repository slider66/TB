import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const CookiePreferencesDialog = () => {
  const {
    isPreferencesOpen,
    closePreferences,
    preferences,
    consentMeta,
    showBanner,
    savePreferences,
    acceptAll,
    rejectAll,
  } = useCookieConsent();
  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    if (isPreferencesOpen) {
      setLocalPreferences(preferences);
    }
  }, [preferences, isPreferencesOpen]);

  const togglePreference = (key) => (checked) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: Boolean(checked),
    }));
  };

  const handleOpenChange = (open) => {
    if (!open) {
      closePreferences();
      if (!consentMeta) {
        showBanner();
      }
    }
  };

  const handleSave = () => {
    savePreferences(localPreferences);
  };

  return (
    <Dialog open={isPreferencesOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl bg-white text-neutral-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Preferencias de cookies</DialogTitle>
          <DialogDescription>
            Ajusta qué cookies opcionales permites. Tus preferencias se guardarán durante 24 meses o
            hasta que decidas cambiarlas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Checkbox id="necessary" checked disabled className="mt-1" />
              <div>
                <Label htmlFor="necessary" className="text-base font-semibold text-neutral-800">
                  Cookies necesarias
                </Label>
                <p className="mt-1 text-sm text-neutral-600">
                  Imprescindibles para que la web funcione (gestión de sesiones, seguridad, cesta de
                  la compra, etc.). Se activan siempre y no almacenan información personal.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Checkbox
                id="analytics"
                className="mt-1"
                checked={localPreferences.analytics}
                onCheckedChange={togglePreference('analytics')}
              />
              <div>
                <Label htmlFor="analytics" className="text-base font-semibold text-neutral-800">
                  Cookies analíticas
                </Label>
                <p className="mt-1 text-sm text-neutral-600">
                  Nos ayudan a comprender cómo se utiliza el sitio para mejorarlo (por ejemplo, Google
                  Analytics o herramientas similares). Solo se instalarán si las aceptas.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Checkbox
                id="functional"
                className="mt-1"
                checked={localPreferences.functional}
                onCheckedChange={togglePreference('functional')}
              />
              <div>
                <Label htmlFor="functional" className="text-base font-semibold text-neutral-800">
                  Cookies funcionales
                </Label>
                <p className="mt-1 text-sm text-neutral-600">
                  Permiten una experiencia personalizada (recordar preferencias o integrar contenido de
                  terceros). Puedes activarlas o desactivarlas cuando quieras.
                </p>
              </div>
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              className="sm:w-auto"
              onClick={rejectAll}
            >
              Rechazar no esenciales
            </Button>
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto"
              onClick={acceptAll}
            >
              Aceptar todas
            </Button>
          </div>
          <Button type="button" className="sm:w-auto" onClick={handleSave}>
            Guardar preferencias
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesDialog;
