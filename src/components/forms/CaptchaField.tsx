import { useEffect, useRef, useState } from "react";

type CaptchaProvider = 'turnstile' | 'recaptcha' | 'development';

type CaptchaFieldProps = {
  onTokenChange: (token: string) => void;
  label?: string;
};

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const provider: CaptchaProvider = TURNSTILE_SITE_KEY
  ? 'turnstile'
  : RECAPTCHA_SITE_KEY
    ? 'recaptcha'
    : 'development';

async function loadScript(src: string, id: string) {
  if (document.getElementById(id)) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`No se pudo cargar el script ${src}`));
    document.body.appendChild(script);
  });
}

const CaptchaField = ({ onTokenChange, label = 'Protección anti-abuso' }: CaptchaFieldProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'bypassed'>(
    provider === 'development' ? 'bypassed' : 'loading',
  );

  useEffect(() => {
    onTokenChange('');

    if (provider === 'development') {
      onTokenChange('dev-bypass-token');
      return () => {
        onTokenChange('');
      };
    }

    let cancelled = false;

    const ensureWidget = async () => {
      if (!containerRef.current) {
        return;
      }

      try {
        if (provider === 'turnstile' && TURNSTILE_SITE_KEY) {
          await loadScript('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', 'turnstile-script');

          if (cancelled || !window.turnstile) {
            throw new Error('Turnstile no disponible.');
          }

          if (widgetIdRef.current && typeof widgetIdRef.current === 'string') {
            window.turnstile.remove(widgetIdRef.current);
          }

          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            callback: (token: string) => {
              onTokenChange(token);
              setStatus('ready');
            },
            "expired-callback": () => {
              onTokenChange('');
              setStatus('loading');
            },
            "error-callback": () => {
              setStatus('error');
            },
          });

          setStatus('ready');
          return;
        }

        if (provider === 'recaptcha' && RECAPTCHA_SITE_KEY) {
          await loadScript('https://www.google.com/recaptcha/api.js?render=explicit', 'recaptcha-script');

          if (cancelled || !window.grecaptcha) {
            throw new Error('reCAPTCHA no disponible.');
          }

          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: (token: string) => {
              onTokenChange(token);
              setStatus('ready');
            },
            "expired-callback": () => {
              onTokenChange('');
              setStatus('loading');
            },
          });

          setStatus('ready');
          return;
        }

        throw new Error('No hay proveedor de CAPTCHA configurado.');
      } catch (error) {
        console.error('[CaptchaField]', error);
        setStatus('error');
      }
    };

    void ensureWidget();

    return () => {
      cancelled = true;
      onTokenChange('');

      if (provider === 'turnstile' && widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current as string);
      }

      if (provider === 'recaptcha' && widgetIdRef.current != null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current as number);
      }
    };
  }, [onTokenChange]);

  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold text-tb-text-base">{label}</span>
      <div
        ref={containerRef}
        className="flex min-h-[80px] items-center justify-center rounded-[12px] border border-dashed border-tb-border-subtle bg-tb-bg-alt"
        data-testid="captcha-widget"
      >
        {provider === 'development' ? (
          <span className="text-xs text-tb-text-muted">Modo desarrollo: CAPTCHA simulado.</span>
        ) : status === 'loading' ? (
          <span className="text-xs text-tb-text-muted">Cargando verificación…</span>
        ) : status === 'error' ? (
          <button
            type="button"
            className="rounded-[12px] border border-tb-primary px-4 py-2 text-xs font-semibold text-tb-primary"
            onClick={() => {
              setStatus('loading');
              onTokenChange('');
              void loadScript(
                provider === 'turnstile'
                  ? 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
                  : 'https://www.google.com/recaptcha/api.js?render=explicit',
                provider === 'turnstile' ? 'turnstile-script' : 'recaptcha-script',
              ).then(() => setStatus('ready')).catch(() => setStatus('error'));
            }}
          >
            Reintentar verificación
          </button>
        ) : (
          <span className="text-xs text-tb-text-muted">Completa el desafío para continuar.</span>
        )}
      </div>
    </div>
  );
};

export default CaptchaField;
