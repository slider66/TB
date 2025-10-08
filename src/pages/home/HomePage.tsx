import CallToAction from '@/components/common/CallToAction';
import UploadDocumentCard from '@/components/common/UploadDocumentCard';

const heroHighlights = [
  'Resumen claro en menos de 24h',
  'Checklist de plazos y documentos',
  'Derivación segura a partners colegiados',
];

const featureItems = [
  {
    title: 'Traducción pedagógica',
    description:
      'Cada párrafo se reescribe en lenguaje claro, respetando el significado original y señalando acciones sugeridas.',
  },
  {
    title: 'Alertas críticas',
    description:
      'Detectamos fechas límite, requerimientos de pago y riesgos potenciales. Te avisamos por email y en el panel.',
  },
  {
    title: 'Seguimiento completo',
    description:
      'Seguimiento del expediente, subida de nuevas pruebas y mensajería segura con el equipo y partners.',
  },
];

const steps = [
  {
    title: '1. Sube el documento',
    description:
      'Validamos el tipo de archivo y ejecutamos un antivirus + VirusTotal antes de procesarlo.',
  },
  {
    title: '2. Simplificación con IA + revisión humana',
    description:
      'El motor de IA genera un borrador que revisa un agente. Añadimos opciones y checklist accionable.',
  },
  {
    title: '3. Entrega segura',
    description:
      'Accede al resultado desde el panel o mediante URL firmada. Podemos derivarte a un partner colegiado.',
  },
];

const HomePage = () => (
  <div className="bg-gradient-to-b from-white via-white to-tb-bg-alt">
    <section className="mx-auto max-w-6xl px-4 py-16 md:flex md:items-center md:justify-between md:gap-16">
      <div className="space-y-6 md:w-1/2">
        <span className="inline-flex items-center gap-2 rounded-full bg-tb-primary/10 px-3 py-1 text-sm font-semibold text-tb-primary">
          Nuevo · Traducimos tu burocracia a lenguaje claro
        </span>
        <h1 className="text-h1 text-tb-text-base">
          Tu documentación oficial, explicada con claridad y lista para actuar.
        </h1>
        <p className="max-w-xl text-body text-tb-text-muted">
          Subes la notificación, la analizamos y te devolvemos un resumen claro con pasos siguientes,
          fechas límite y recomendaciones. Sin jerga jurídica, sin quebraderos de cabeza.
        </p>
        <div className="flex flex-wrap gap-3">
          <CallToAction as="link" href="#upload">
            Subir documento
          </CallToAction>
          <CallToAction as="link" href="/contacto" variant="secondary">
            Hablar con el equipo
          </CallToAction>
        </div>
        <ul className="grid gap-2 text-sm text-tb-text-muted md:grid-cols-2">
          {heroHighlights.map((item) => (
            <li key={item} className="flex items-center gap-2 rounded-[12px] bg-white px-3 py-2 shadow-card">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tb-primary/15 text-tb-primary">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10 md:mt-0 md:w-1/2">
        <UploadDocumentCard />
      </div>
    </section>

    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-h2 text-tb-text-base">Cómo funciona</h2>
        <p className="mt-4 text-center text-body text-tb-text-muted">
          Combinamos IA, revisión humana y partners especializados para ofrecerte respuestas claras y
          accionables.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-[20px] border border-transparent bg-tb-bg-alt p-6 shadow-card transition hover:-translate-y-1 hover:border-tb-primary/30 hover:shadow-lg"
            >
              <h3 className="text-h3 text-tb-text-base">{step.title}</h3>
              <p className="mt-3 text-sm text-tb-text-muted">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-8 md:grid-cols-3">
        {featureItems.map((feature) => (
          <article key={feature.title} className="rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card">
            <h3 className="text-h3 text-tb-text-base">{feature.title}</h3>
            <p className="mt-3 text-sm text-tb-text-muted">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-tb-primary text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-h2 text-white">¿Quieres recibir un aviso cuando lancemos nuevos flujos?</h2>
          <p className="mt-3 max-w-xl text-body text-white/80">
            Apúntate para conocer nuevas plantillas, integraciones con oficinas públicas y mejoras en
            el panel.
          </p>
        </div>
        <CallToAction as="link" href="/contacto" variant="ghost">
          Quiero recibir novedades
        </CallToAction>
      </div>
    </section>
  </div>
);

export default HomePage;
