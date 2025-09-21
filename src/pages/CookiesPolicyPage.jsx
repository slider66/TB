
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const CookiesPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Cookies - Traductor Burocrático</title>
        <meta name="description" content="Información sobre el uso de cookies en Traductor Burocrático." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        <div className="prose lg:prose-xl max-w-4xl mx-auto">
          <h1>Política de Cookies</h1>
          <p className="lead">Última actualización: 19 de septiembre de 2025</p>

          <h2>¿Qué son las cookies?</h2>
          <p>
            Una cookie es un pequeño fichero de texto que un sitio web almacena en el navegador del usuario. Las cookies facilitan el uso y la navegación por una página web y son esenciales para el funcionamiento de internet, aportando innumerables ventajas en la prestación de servicios interactivos.
          </p>

          <h2>Tipos de cookies que utilizamos</h2>
          <p>
            En nuestro sitio web, utilizamos los siguientes tipos de cookies:
          </p>
          <ul>
            <li>
              <strong>Cookies técnicas o esenciales:</strong> Son aquellas imprescindibles para el funcionamiento del sitio. Sin ellas, la página no funcionaría correctamente. Por ejemplo, las que gestionan el consentimiento de cookies o mantienen la sesión del usuario.
            </li>
            <li>
              <strong>Cookies de análisis o rendimiento:</strong> Nos permiten contar las visitas y fuentes de tráfico para poder medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más o las menos populares, y ver cuántas personas visitan el sitio. Toda la información que recogen estas cookies es agregada y, por lo tanto, anónima.
            </li>
            <li>
              <strong>Cookies de funcionalidad:</strong> Permiten al sitio web ofrecer una mayor funcionalidad y personalización. Pueden ser establecidas por nosotros o por terceras partes cuyos servicios hemos agregado a nuestras páginas.
            </li>
            <li>
              <strong>Cookies de publicidad comportamental:</strong> Almacenan información del comportamiento de los usuarios obtenida a través de la observación continuada de sus hábitos de navegación, lo que permite desarrollar un perfil específico para mostrar publicidad en función del mismo.
            </li>
          </ul>

          <h2>Gestión de Cookies</h2>
          <p>
            Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador. A continuación, te ofrecemos enlaces en los que encontrarás información sobre cómo puedes activar tus preferencias en los principales navegadores:
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Internet Explorer / Edge</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
          </ul>
          <p>
            Si decides desactivar las cookies, es posible que algunas funcionalidades de nuestro sitio web no funcionen correctamente.
          </p>

          <h2>Cambios en la Política de Cookies</h2>
          <p>
            Podemos actualizar la Política de Cookies de nuestro sitio web, por lo que te recomendamos revisar esta política cada vez que accedas a nuestro sitio con el objetivo de estar adecuadamente informado sobre cómo y para qué usamos las cookies.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default CookiesPolicyPage;
