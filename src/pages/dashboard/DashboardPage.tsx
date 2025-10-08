
const pendingItems = [
  {
    title: 'Revisar borrador del Ayuntamiento de Madrid',
    deadline: '12/10/2025',
    status: 'Revisión humana requerida',
  },
  {
    title: 'Adjuntar justificante de pago de tasas',
    deadline: '15/10/2025',
    status: 'Pendiente de usuario',
  },
];

const recentActivities = [
  {
    title: 'Documento simplificado y enviado',
    date: '08/10/2025',
    reference: 'Solicitud de bonificación IBI',
  },
  {
    title: 'Partner asignado',
    date: '07/10/2025',
    reference: 'Alejandro Flores · Especialista en recursos tributarios',
  },
];

const DashboardPage = () => (
  <div className="bg-tb-bg-alt">
    <section className="mx-auto max-w-6xl px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-h1 text-tb-text-base">Panel de seguimiento</h1>
        <p className="max-w-3xl text-body text-tb-text-muted">
          Aquí encontrarás el estado de tus documentos, próximas acciones sugeridas y accesos rápidos
          a los resultados simplificados. Estamos desplegando la sincronización en tiempo real mediante
          Supabase Realtime.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-tb-text-muted">
            Documentos activos
          </h2>
          <p className="mt-4 text-4xl font-bold text-tb-text-base">3</p>
          <p className="mt-2 text-sm text-tb-text-muted">En procesamiento o a la espera de tu revisión.</p>
        </article>
        <article className="rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-tb-text-muted">
            Plazos críticos
          </h2>
          <p className="mt-4 text-4xl font-bold text-tb-state-warning">2</p>
          <p className="mt-2 text-sm text-tb-text-muted">
          Recibiras recordatorios 72 h y 24 h antes del vencimiento.
          </p>
        </article>
        <article className="rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-tb-text-muted">
            Partners activos
          </h2>
          <p className="mt-4 text-4xl font-bold text-tb-state-success">1</p>
          <p className="mt-2 text-sm text-tb-text-muted">
            Contacta con tu partner desde la mensajería segura para consultas específicas.
          </p>
        </article>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 text-tb-text-base">Próximos pasos sugeridos</h2>
            <a className="text-sm font-semibold text-tb-primary hover:underline" href="#upload">
              Subir nuevo documento
            </a>
          </div>
          <ul className="mt-6 space-y-4">
            {pendingItems.map((item) => (
              <li key={item.title} className="rounded-[16px] border border-tb-border-subtle bg-tb-bg-alt px-4 py-3">
                <p className="font-semibold text-tb-text-base">{item.title}</p>
                <p className="text-sm text-tb-text-muted">Límite: {item.deadline}</p>
                <span className="mt-2 inline-flex rounded-full bg-tb-primary/10 px-3 py-1 text-xs font-semibold text-tb-primary">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card">
          <h2 className="text-h3 text-tb-text-base">Actividad reciente</h2>
          <ul className="mt-6 space-y-4">
            {recentActivities.map((activity) => (
              <li key={activity.title} className="rounded-[16px] border border-transparent bg-tb-bg-alt px-4 py-3">
                <p className="font-semibold text-tb-text-base">{activity.title}</p>
                <p className="text-sm text-tb-text-muted">
                  {activity.date} · {activity.reference}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10 rounded-[20px] border border-tb-border-subtle bg-white p-6 shadow-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-h3 text-tb-text-base">Tus documentos en un solo lugar</h2>
            <p className="text-sm text-tb-text-muted">
              Puedes solicitar la eliminación anticipada de tus archivos o exportar auditorías de acceso en
              cualquier momento. Cumplimos RGPD y retenemos información solo 12 meses.
            </p>
          </div>
          <a
            href="/contacto"
            className="inline-flex items-center justify-center rounded-[12px] border border-tb-primary px-5 py-3 text-sm font-semibold text-tb-primary transition hover:bg-tb-primary/10"
          >
            Solicitar exportación o borrado
          </a>
        </div>
      </section>
    </section>
  </div>
);

export default DashboardPage;
