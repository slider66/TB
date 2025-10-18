// Centralized SEO configuration for the entire application

const generalConfig = {
  baseURL: "https://traductorburocratico.es",
  ogImage: "https://traductorburocratico.es/og-default.jpg",
  twitterCard: "summary_large_image",
};

export const pageSeo = {
  "/": {
    title: "Traductor Burocrático — Entiende tu trámite",
    description: "Traduce tus trámites al lenguaje común, gestiona tus expedientes y conéctate con profesionales para resolver tus gestiones burocráticas sin estrés.",
  },
  "/order": {
    title: "Solicita tu Traducción — Traductor Burocrático",
    description: "Inicia tu solicitud para traducir documentos burocráticos a un lenguaje claro y comprensible. Proceso rápido y sencillo.",
  },
  "/pricing": {
    title: "Precios — Traductor Burocrático",
    description: "Descubre nuestros planes y precios para la traducción de documentos, gestión de expedientes y más. Soluciones a tu medida.",
  },
  "/partners": {
    title: "Colaboradores — Traductor Burocrático",
    description: "Conoce a nuestra red de profesionales y gestorías asociadas para ofrecerte el mejor servicio.",
  },
  "/faq": {
    title: "Preguntas Frecuentes — Traductor Burocrático",
    description: "Encuentra respuestas a las preguntas más comunes sobre nuestros servicios de traducción y gestión de trámites.",
  },
  "/contact": {
    title: "Contacto — Traductor Burocrático",
    description: "Ponte en contacto con nuestro equipo para cualquier consulta o para iniciar tu trámite. Estamos aquí para ayudarte.",
  },
  "/support": {
    title: "Soporte — Traductor Burocrático",
    description: "Obtén ayuda con tus solicitudes, pagos o cualquier otra duda sobre nuestra plataforma.",
  },
  "/terms": {
    title: "Términos y Condiciones — Traductor Burocrático",
    description: "Consulta los términos y condiciones de uso de los servicios de Traductor Burocrático.",
  },
  // Add other pages here as needed
};

// Function to generate full SEO details for a page
export const getSeoForPath = (path) => {
  const pageDetails = pageSeo[path] || pageSeo["/"]; // Fallback to home page
  const canonicalUrl = `${generalConfig.baseURL}${path === "/" ? "" : path}`;

  return {
    ...pageDetails,
    canonical: canonicalUrl,
    ogImage: generalConfig.ogImage,
    twitterCard: generalConfig.twitterCard,
  };
};
