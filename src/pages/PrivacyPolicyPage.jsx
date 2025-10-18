
import React from 'react';
import { motion } from 'framer-motion';

const LAST_UPDATED_DATE = "23 de septiembre de 2024";

const PrivacyPolicyPage = () => {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        <div className="prose lg:prose-xl max-w-4xl mx-auto">
          <h1>Política de Privacidad</h1>
          <p className="lead">Última actualización: {LAST_UPDATED_DATE}</p>

          <h2>1. Responsable del tratamiento</h2>
          <p>
            <strong>Traductor Burocrático</strong> (en adelante, "nosotros", "nuestro") con domicilio en Madrid, España, y correo electrónico de contacto hola@traductorburocratico.es, es el responsable del tratamiento de los datos personales que nos facilitas.
          </p>

          <h2>2. ¿Qué datos personales tratamos y para qué?</h2>
          <p>
            Tratamos los siguientes datos con las finalidades que se indican:
          </p>
          <ul>
            <li>
              <strong>Datos de contacto (email):</strong> Para gestionar tu pedido, comunicarnos contigo sobre el servicio, enviarte el resultado y, si creas una cuenta, para gestionar tu acceso.
            </li>
            <li>
              <strong>Documentos subidos:</strong> Únicamente para prestar el servicio de "traducción" y análisis solicitado. Los documentos se tratan con la máxima confidencialidad.
            </li>
            <li>
              <strong>Datos de navegación y cookies:</strong> Para mejorar la experiencia de usuario, analizar el uso de nuestra web y, si lo consientes, para fines publicitarios. Consulta nuestra <a href="/cookies-policy">Política de Cookies</a>.
            </li>
            <li>
              <strong>Datos de facturación:</strong> Si se realiza un pago, los datos necesarios para emitir la factura correspondiente, en cumplimiento de nuestras obligaciones legales.
            </li>
          </ul>

          <h2>3. Legitimación para el tratamiento de tus datos</h2>
          <p>
            La base legal para el tratamiento de tus datos es:
          </p>
          <ul>
            <li>La <strong>ejecución de un contrato</strong> de prestación de servicios cuando realizas un pedido.</li>
            <li>Tu <strong>consentimiento explícito</strong> para el uso de cookies no esenciales y para el envío de comunicaciones comerciales, si procede.</li>
            <li>El <strong>cumplimiento de obligaciones legales</strong>, como las fiscales y contables.</li>
            <li>Nuestro <strong>interés legítimo</strong> en mantener la seguridad de la web y prevenir el fraude.</li>
          </ul>

          <h2>4. ¿Cuánto tiempo conservamos tus datos?</h2>
          <p>
            Los documentos que subes para su análisis <strong>se eliminan de forma segura y automática de nuestros sistemas activos a los 7 días</strong> de haber completado el servicio. Este plazo nos permite atender posibles solicitudes de revisión.
          </p>
          <p>
            Los datos de tu cuenta y el historial de pedidos se conservarán mientras seas usuario y no solicites su supresión. Los datos de facturación se conservarán durante los plazos legalmente exigidos.
          </p>

          <h2>5. ¿Con quién compartimos tus datos?</h2>
          <p>
            No compartimos tus datos personales con terceros, salvo en los siguientes casos:
          </p>
          <ul>
            <li>
              <strong>Proveedores de servicios</strong> que actúan como encargados del tratamiento (alojamiento web, pasarela de pago, herramientas de análisis), siempre bajo estrictos acuerdos de confidencialidad.
            </li>
            <li>
              <strong>Autoridades públicas, jueces y tribunales</strong>, cuando exista una obligación legal de hacerlo.
            </li>
            <li>
              <strong>Partners profesionales (gestores, abogados):</strong> ÚNICA Y EXCLUSIVAMENTE si, tras nuestro análisis, te ofrecemos esta opción y tú la autorizas de forma expresa para un caso concreto.
            </li>
          </ul>

          <h2>6. Seguridad de los datos</h2>
          <p>
            Hemos adoptado todas las medidas técnicas y organizativas necesarias para garantizar la seguridad e integridad de los datos personales que tratamos, así como para evitar su pérdida, alteración y/o acceso por parte de terceros no autorizados.
          </p>

          <h2>7. Tus derechos</h2>
          <p>
            Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de tus datos enviando un correo electrónico a hola@traductorburocratico.es, indicando el derecho que deseas ejercer y adjuntando una copia de tu DNI o documento identificativo equivalente.
          </p>
          <p>
            También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si consideras que el tratamiento de tus datos no se ajusta a la normativa.
          </p>

          <h2>8. Cambios en la política de privacidad</h2>
          <p>
            Nos reservamos el derecho a modificar la presente política para adaptarla a novedades legislativas o jurisprudenciales. En dichos casos, anunciaremos en esta página los cambios introducidos con razonable antelación a su puesta en práctica.
          </p>
        </div>
      </motion.div>
  );
};

export default PrivacyPolicyPage;
