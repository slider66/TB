import { useState } from "react";
import { z } from "zod";

import CaptchaField from "@/components/forms/CaptchaField";

const partnerSchema = z.object({
  name: z.string().min(1, "Indica tu nombre"),
  email: z.string().email("Email no válido"),
  firm: z.string().min(1, "Añade el nombre de tu despacho o figura"),
  province: z.string().min(1, "Selecciona la provincia principal"),
  specialties: z.string().min(1, "Detalla tus especialidades"),
  message: z.string().min(30, "Cuéntanos más sobre tu experiencia y casos habituales"),
  consent: z.boolean().refine((value) => value, { message: "Necesitamos tu consentimiento de tratamiento de datos." }),
  captchaToken: z.string().min(1, "Confirma que no eres un robot"),
});

type PartnerForm = z.infer<typeof partnerSchema>;

const initialForm: PartnerForm = {
  name: "",
  email: "",
  firm: "",
  province: "",
  specialties: "",
  message: "",
  consent: false,
  captchaToken: "",
};

const PartnersPage = () => {
  const [formState, setFormState] = useState<PartnerForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleChange = <Field extends keyof PartnerForm>(field: Field, value: PartnerForm[Field]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validation = partnerSchema.safeParse(formState);
    if (!validation.success) {
      setError(validation.error.errors[0]?.message ?? "Revisa los datos introducidos.");
      return;
    }

    try {
      setStatus("sending");
      const response = await fetch("/functions/v1/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validation.data,
          source: "partner-application",
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo registrar tu solicitud. Inténtalo más tarde.");
      }

      setStatus("sent");
      setFormState(initialForm);
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ha ocurrido un error al enviar tu solicitud.",
      );
    }
  };

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <header className="space-y-4 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-tb-primary/10 px-4 py-1 text-sm font-semibold text-tb-primary">
            Red de profesionales
          </span>
          <h1 className="text-h1 text-tb-text-base">Partners que traducen burocracia en soluciones</h1>
          <p className="max-w-3xl text-body text-tb-text-muted">
            Buscamos despachos, asesorías y profesionales colegiados que quieran acompañar a la
            ciudadanía en recursos, alegaciones y trámites complejos. Nosotros detectamos necesidades,
            vosotros aportáis la estrategia jurídica.
          </p>
        </header>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr,0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[20px] border border-tb-border-subtle bg-tb-bg-alt p-6 shadow-card"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="partner-name" className="text-sm font-semibold text-tb-text-base">
                  Nombre y apellidos
                </label>
                <input
                  id="partner-name"
                  type="text"
                  value={formState.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="partner-email" className="text-sm font-semibold text-tb-text-base">
                  Email profesional
                </label>
                <input
                  id="partner-email"
                  type="email"
                  value={formState.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                  required
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="partner-firm" className="text-sm font-semibold text-tb-text-base">
                  Despacho / firma / entidad
                </label>
                <input
                  id="partner-firm"
                  type="text"
                  value={formState.firm}
                  onChange={(event) => handleChange("firm", event.target.value)}
                  className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="partner-province" className="text-sm font-semibold text-tb-text-base">
                  Provincia principal
                </label>
                <input
                  id="partner-province"
                  type="text"
                  value={formState.province}
                  onChange={(event) => handleChange("province", event.target.value)}
                  className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="partner-specialties" className="text-sm font-semibold text-tb-text-base">
                Especialidades y colegiación
              </label>
              <textarea
                id="partner-specialties"
                rows={3}
                value={formState.specialties}
                onChange={(event) => handleChange("specialties", event.target.value)}
                className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                placeholder="Ej: Contencioso-administrativo, extranjería, derecho tributario. Nº colegiado."
                required
              />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="partner-message" className="text-sm font-semibold text-tb-text-base">
                ¿Cómo encajamos juntos?
              </label>
              <textarea
                id="partner-message"
                rows={5}
                value={formState.message}
                onChange={(event) => handleChange("message", event.target.value)}
                className="rounded-[12px] border border-tb-border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                placeholder="Comparte qué tipos de expedientes trabajas, SLA y cómo prefieres recibir leads."
                required
              />
            </div>

            <div className="mt-4">
              <CaptchaField onTokenChange={(token) => handleChange("captchaToken", token)} />
            </div>

            <label className="mt-4 flex items-start gap-3 rounded-[12px] border border-transparent bg-white px-4 py-3 text-sm text-tb-text-muted">
              <input
                type="checkbox"
                checked={formState.consent}
                onChange={(event) => handleChange("consent", event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-tb-border-subtle text-tb-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
                required
              />
              <span>
                Acepto el tratamiento de mis datos para la gestión de la red de partners y confirmo que estoy
                colegiado/a y al día en mis obligaciones profesionales.
              </span>
            </label>

            {error ? (
              <p role="alert" className="mt-4 rounded-[12px] border border-tb-state-error bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {status === "sent" ? (
              <p className="mt-4 rounded-[12px] border border-tb-state-success bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Gracias por tu interés. Revisaremos la información y te contactaremos para agendar una entrevista breve.
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-6 w-full rounded-[12px] bg-tb-primary px-6 py-3 font-semibold text-white shadow-button transition hover:bg-tb-primaryHover focus:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2 disabled:opacity-60"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Enviando…" : "Enviar candidatura"}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="surface-card">
              <h2 className="text-h3 text-tb-text-base">Qué ofrecemos</h2>
              <ul className="mt-4 space-y-3 text-sm text-tb-text-muted">
                <li>Leads filtrados y con documentación ya analizada.</li>
                <li>Checklist de tareas compartido con el cliente.</li>
                <li>Registro de consentimiento y estado de pagos.</li>
                <li>Canal seguro para compartir documentación adicional.</li>
              </ul>
            </div>
            <div className="surface-card">
              <h3 className="text-h3 text-tb-text-base">Requisitos mínimos</h3>
              <ul className="mt-4 space-y-3 text-sm text-tb-text-muted">
                <li>Colegiación vigente y seguro de responsabilidad civil.</li>
                <li>Compromiso con lenguaje claro y tiempos de respuesta definidos.</li>
                <li>Capacidad de actuar en remoto con firma digital.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;




