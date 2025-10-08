

import CallToAction from '@/components/common/CallToAction';

const NotFoundPage = () => (
  <div className="bg-white">
    <section className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-h1 text-tb-text-base">Página no encontrada</h1>
      <p className="max-w-2xl text-body text-tb-text-muted">
        Puede que el recurso se haya movido o que aún estemos desplegando la funcionalidad.
        Revisa la URL o vuelve al inicio para seguir traduciendo tus trámites burocráticos.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <CallToAction as="link" href="/">
          Volver al inicio
        </CallToAction>
        <CallToAction as="link" href="/contacto" variant="secondary">
          Avísanos del error
        </CallToAction>
      </div>
    </section>
  </div>
);

export default NotFoundPage;
