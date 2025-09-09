import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, User, Users, Shield, DollarSign, Scale, Mail } from 'lucide-react';

const Section = ({ icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
    className="mb-12"
  >
    <div className="flex items-center mb-4">
      <div className="feature-icon !w-12 !h-12 !min-w-[3rem] !mb-0 mr-4">{icon}</div>
      <h2 className="text-2xl font-bold text-neutral-800 m-0">{title}</h2>
    </div>
    <div className="prose prose-neutral lg:prose-lg max-w-none">{children}</div>
  </motion.div>
);

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones - Traductor Burocrático</title>
        <meta name="description" content="Consulta los términos y condiciones de uso de la plataforma Traductor Burocrático." />
        <meta property="og:title" content="Términos y Condiciones - Traductor Burocrático" />
        <meta property="og:description" content="Consulta los términos y condiciones de uso de la plataforma." />
      </Helmet>
      <div className="min-h-screen bg-neutral-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Términos y Condiciones</h1>
            <p className="text-xl text-neutral-600">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>

          <Section icon={<FileText />} title="1. Identidad y objeto del servicio">
            <p>Traductor Burocrático (el “Sitio” o “Servicio”) es una plataforma que <strong>traduce documentos administrativos a lenguaje claro</strong>, genera <strong>checklists de acción</strong> y <strong>facilita el contacto</strong> con profesionales externos (“Partners”).</p>
            <blockquote className="border-l-4 border-orange bg-orange/10 p-4 rounded-r-lg">
              <strong>Importante:</strong> No somos un despacho profesional. Nuestra labor es informativa y pedagógica, no de asesoramiento legal o fiscal. No representamos a usuarios ni realizamos trámites.
            </blockquote>
          </Section>
          
          <Section icon={<User />} title="2. Definiciones Clave">
             <ul>
              <li><strong>Usuario</strong>: persona que utiliza el Servicio para comprender un documento.</li>
              <li><strong>Documento</strong>: archivo que el Usuario sube para su análisis pedagógico.</li>
              <li><strong>Traducción pedagógica</strong>: resumen orientativo en lenguaje claro.</li>
              <li><strong>Partner</strong>: profesional independiente inscrito en nuestro directorio.</li>
            </ul>
          </Section>

          <Section icon={<Shield />} title="3. Alcance y limitaciones">
            <p><strong>3.1. Carácter informativo:</strong> Los contenidos generados son orientativos y pueden contener errores. No sustituyen el criterio de un profesional.</p>
            <p><strong>3.2. No intermediación:</strong> La relación con un Partner es exclusiva entre el usuario y dicho profesional. No garantizamos su servicio.</p>
            <p><strong>3.3. Uso de IA generativa:</strong> Parte del servicio usa IA, por lo que los resultados pueden ser inexactos. Revisa siempre la información.</p>
          </Section>

          <Section icon={<Users />} title="4. Cuentas de usuario">
            <p>Debes ser mayor de 18 años para crear una cuenta. Eres responsable de la seguridad de tus credenciales y del uso aceptable de la plataforma (no subir malware, no vulnerar derechos, etc.).</p>
          </Section>
          
          <Section icon={<FileText />} title="5. Contenidos y propiedad intelectual">
            <p>Tus documentos siguen siendo tuyos. Nos concedes una licencia limitada para procesarlos y prestarte el servicio. El resto de contenidos del sitio son nuestra propiedad.</p>
          </Section>

          <Section icon={<Shield />} title="6. Privacidad y Seguridad">
            <p>Tratamos tus datos conforme al RGPD. Usamos proveedores para funcionar y, si hay transferencias de datos, se hacen con garantías. Los documentos se eliminan tras un plazo razonable. Para más detalles, consulta nuestra <strong>Política de Privacidad</strong>.</p>
          </Section>

          <Section icon={<DollarSign />} title="7. Precios y Pagos">
            <p>Los precios se muestran en el sitio. Si eres consumidor, tienes 14 días para desistir, salvo que el servicio ya se haya prestado. Las suscripciones de Partners se renuevan automáticamente y pueden cancelarse en cualquier momento.</p>
          </Section>

          <Section icon={<Users />} title="8. Área de Partners">
            <p>Los Partners deben cumplir la normativa aplicable y actúan por su cuenta y riesgo. Podemos verificar su identidad y suspender cuentas por incumplimiento.</p>
          </Section>

          <Section icon={<Scale />} title="9. Garantías y Responsabilidad">
             <p>El servicio se presta “tal cual”. Eres responsable de las decisiones que tomes. Nuestra responsabilidad económica se limita al importe que hayas pagado en los últimos 12 meses.</p>
          </Section>
          
          <Section icon={<FileText />} title="10. Modificaciones y Ley Aplicable">
            <p>Podemos modificar estos términos, notificándote con antelación. La ley aplicable es la española y, para cualquier disputa, los tribunales de Madrid (o tu domicilio si eres consumidor).</p>
          </Section>

          <Section icon={<Mail />} title="11. Contacto">
            <p>Para cualquier consulta legal o de servicio, puedes escribir a <a href="mailto:legal@traductorburocratico.es" className="text-orange hover:underline">legal@traductorburocratico.es</a>.</p>
          </Section>

        </div>
      </div>
    </>
  );
};

export default TermsPage;