import { useState } from 'react';
import { z } from 'zod';

import CallToAction from '@/components/common/CallToAction';
import CaptchaField from '@/components/forms/CaptchaField';

const contactSchema = z.object({
  name: z.string().min(1, 'Indica tu nombre'),
  email: z.string().email('Introduce un email vÃ¡lido'),
  subject: z.string().min(1, 'Selecciona un motivo'),
  message: z.string().min(20, 'CuÃ©ntanos con mÃ¡s detalle cÃ³mo te ayudamos'),
  captchaToken: z.string().min(1, 'Confirma que no eres un robot'),
});

type ContactForm = z.infer<typeof contactSchema>;

const initialForm: ContactForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
  captchaToken: '',
};

const ContactPage = () => {
  const [formState, setFormState] = useState<ContactForm>(initialForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = <Field extends keyof ContactForm>(field: Field, value: ContactForm[Field]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validation = contactSchema.safeParse(formState);
    if (!validation.success) {
      setError(validation.error.errors[0]?.message ?? 'Revisa los campos destacados.');
      return;
    }

    try {
      setStatus('sending');
      // Stub: delegamos en la Edge Function `send-contact-email`.
      const response = await fetch('/functions/v1/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el mensaje. IntÃ©ntalo de nuevo en unos minutos.');
      }

      setStatus('sent');
      setFormState(initialForm);
    } catch (submitError) {
      setStatus('error');
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo enviar tu solicitud. IntÃ©ntalo mÃ¡s tarde.',
      );
    }
  };

  return (
    <div className="bg-tb-bg-alt">
      <section className="mx-auto max-w-5xl px-4 py-16">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-h1 text-tb-text-base">Estamos para ayudarte</h1>
          <p className="max-w-3xl text-body text-tb-text-muted">
            CuÃ©ntanos tu caso, dudas o sugerencias. Responderemos en menos de un dÃ­a laborable. Para
            incidencias urgentes, indica fechas lÃ­mite o procedimientos en curso.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <CallToAction as="link" href="/partners">
              Soy partner y quiero colaborar
            </CallToAction>
            <CallToAction as="link" href="/faq" variant="ghost">
              Preguntas frecuentes
            </CallToAction>
          </div>
        </header>

        <div className="mt-12 grid gap-8 md:grid-cols-[2fr,1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-tb-text-base">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-tb-text-base">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="subject" className="text-sm font-semibold text-tb-text-base">
                Motivo
              </label>
              <select
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={(event) => handleChange('subject', event.target.value)}
                className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                required
              >
                <option value="">Selecciona una opciÃ³n</option>
                <option value="support">Duda sobre un documento</option>
                <option value="partnership">Quiero ser partner</option>
                <option value="press">Prensa y comunicaciÃ³n</option>
                <option value="other">Otro motivo</option>
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-semibold text-tb-text-base">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formState.message}
                onChange={(event) => handleChange('message', event.target.value)}
                className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                placeholder="Describe el requerimiento, plazos, organismo, y quÃ© necesitas aclarar."
                required
              />
            </div>

            <div className="mt-4 rounded-[12px] border border-dashed border-tb-border-subtle bg-tb-bg-alt px-4 py-4 text-sm text-tb-text-muted">
              <p>
                Este formulario emplea <strong>Cloudflare Turnstile</strong> o <strong>reCAPTCHA</strong>{' '}
                para evitar abusos. NingÃºn secreto ni token sensible se expone en el frontend.
              </p>
              <div className="mt-3">
                <CaptchaField onTokenChange={(token) => handleChange('captchaToken', token)} />
              </div>
            </div>

            <p className="mt-4 rounded-[12px] bg-tb-bg-alt px-4 py-3 text-xs text-tb-text-muted">
              * Cualquier orientaciÃ³n ofrecida es informativa. Para valorar la viabilidad de
              recursos recomendamos contactar con un profesional colegiado.
            </p>

            {error ? (
              <p role="alert" className="mt-4 rounded-[12px] border border-tb-state-error bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {status === 'sent' ? (
              <p className="mt-4 rounded-[12px] border border-tb-state-success bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Gracias por escribirnos. Te responderemos por email en menos de 24 horas laborables.
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-6 w-full rounded-[12px] bg-tb-primary px-6 py-3 font-semibold text-white shadow-button transition hover:bg-tb-primaryHover focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2 disabled:opacity-60"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Enviandoâ€¦' : 'Enviar mensaje'}
            </button>
          </form>

          <aside className="space-y-4 rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card">
            <h2 className="text-h3 text-tb-text-base">InformaciÃ³n Ãºtil</h2>
            <ul className="space-y-3 text-sm text-tb-text-muted">
              <li>
                <strong>Telegram:</strong> canal privado para avisos de disponibilidad y nuevas guÃ­as.
              </li>
              <li>
                <strong>Partners:</strong> comparte especialidad, provincia y colegiaciÃ³n. Te contactamos
                tras validar credenciales.
              </li>
              <li>
                <strong>Incidencias:</strong> indica referencias del expediente y organismo emisor para
                priorizar la respuesta.
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

