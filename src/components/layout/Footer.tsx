import CallToAction from '@/components/common/CallToAction';

const Footer = () => {
  return (
    <footer className="border-t border-tb-border-subtle bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-h3 text-tb-text-base">Seguimos contigo</h3>
          <p className="text-sm text-tb-text-muted">
            Traductor Burocrático simplifica notificaciones y procedimientos. Cada entrega incluye
            un resumen accionable, checklist de plazos y derivación a partners colegiados cuando
            procede.
          </p>
          <CallToAction as="link" href="/partners" variant="secondary">
            ¿Eres partner? Únete
          </CallToAction>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-tb-text-base uppercase tracking-[0.08em]">
            Seguridad y cumplimiento
          </h4>
          <ul className="space-y-2 text-sm text-tb-text-muted">
            <li>RLS activado en Supabase y buckets privados</li>
            <li>Escaneo de archivos con antivirus + VirusTotal</li>
            <li>CSP estricta, HSTS, Turnstile/Recaptcha en formularios</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-tb-text-base uppercase tracking-[0.08em]">
            Contacto
          </h4>
          <ul className="space-y-1 text-sm text-tb-text-muted">
            <li>
              <a className="hover:text-tb-primary" href="mailto:hola@traductorburocratico.es">
                hola@traductorburocratico.es
              </a>
            </li>
            <li>Horario de soporte: L-V 9:00 - 18:00 CET</li>
            <li>
              <a className="hover:text-tb-primary" href="/contacto">
                Centro de ayuda
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-tb-border-subtle bg-tb-bg-alt">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-tb-text-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Traductor Burocrático. Todos los derechos reservados.</span>
          <div className="flex flex-wrap gap-4">
            <a href="/privacidad" className="hover:text-tb-primary">
              Privacidad
            </a>
            <a href="/legal" className="hover:text-tb-primary">
              Aviso legal
            </a>
            <a href="/cookies" className="hover:text-tb-primary">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
