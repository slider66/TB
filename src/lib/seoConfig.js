// Centralized SEO configuration for the entire application

export const generalConfig = {
  baseURL: 'https://traductorburocratico.es',
  siteName: 'Traductor Burocrático',
  defaultTitle: 'Traductor Burocrático — Entiende tu trámite',
  defaultDescription:
    'Traduce tus trámites al lenguaje común, gestiona tus expedientes y conéctate con profesionales para resolver tus gestiones burocráticas sin estrés.',
  ogImage: 'https://traductorburocratico.es/og-default.jpg',
  twitterCard: 'summary_large_image',
  defaultRobots: 'index,follow',
  defaultOgType: 'website',
};

export const pageSeo = [
  {
    pattern: '/',
    title: 'Traductor Burocrático — Entiende tu trámite',
    description:
      'Traduce tus trámites al lenguaje común, gestiona tus expedientes y conéctate con profesionales para resolver tus gestiones burocráticas sin estrés.',
  },
  {
    pattern: '/order',
    title: 'Solicita tu Traducción — Traductor Burocrático',
    description:
      'Inicia tu solicitud para traducir documentos burocráticos a un lenguaje claro y comprensible. Proceso rápido y sencillo.',
  },
  {
    pattern: '/pricing',
    title: 'Precios — Traductor Burocrático',
    description:
      'Descubre nuestros planes y precios para la traducción de documentos, gestión de expedientes y más. Soluciones a tu medida.',
  },
  {
    pattern: '/clients',
    title: 'Mis Expedientes — Traductor Burocrático',
    description: 'Consulta y gestiona todos tus trámites y documentos desde un único panel.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/partners',
    title: 'Colaboradores — Traductor Burocrático',
    description:
      'Conoce a nuestra red de profesionales y gestorías asociadas para ofrecerte el mejor servicio.',
  },
  {
    pattern: '/faq',
    title: 'Preguntas Frecuentes — Traductor Burocrático',
    description:
      'Encuentra respuestas a las preguntas más comunes sobre nuestros servicios de traducción y gestión de trámites.',
  },
  {
    pattern: '/contact',
    title: 'Contacto — Traductor Burocrático',
    description:
      'Ponte en contacto con nuestro equipo para cualquier consulta o para iniciar tu trámite. Estamos aquí para ayudarte.',
  },
  {
    pattern: '/support',
    title: 'Soporte — Traductor Burocrático',
    description:
      'Obtén ayuda con tus solicitudes, pagos o cualquier otra duda sobre nuestra plataforma.',
  },
  {
    pattern: '/terms',
    title: 'Términos y Condiciones — Traductor Burocrático',
    description:
      'Consulta los términos y condiciones de uso de los servicios de Traductor Burocrático.',
  },
  {
    pattern: '/privacy-policy',
    title: 'Política de Privacidad — Traductor Burocrático',
    description:
      'Conoce cómo tratamos tus datos personales y las medidas que tomamos para proteger tu privacidad.',
  },
  {
    pattern: '/cookies-policy',
    title: 'Política de Cookies — Traductor Burocrático',
    description:
      'Descubre cómo utilizamos cookies y tecnologías similares para mejorar tu experiencia en Traductor Burocrático.',
  },
  {
    pattern: '/login',
    title: 'Iniciar Sesión — Traductor Burocrático',
    description: 'Accede a tu cuenta para gestionar tus trámites y documentos con total seguridad.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/register',
    title: 'Crear Cuenta — Traductor Burocrático',
    description:
      'Regístrate en Traductor Burocrático y recibe traducciones claras de tus trámites en minutos.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/panel',
    title: 'Panel de Usuario — Traductor Burocrático',
    description: 'Gestiona tus documentos, casos y perfil desde tu panel personal.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/account',
    title: 'Mi Cuenta — Traductor Burocrático',
    description: 'Gestiona los datos de tu cuenta y tu perfil.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/account/change-password',
    title: 'Cambiar Contraseña — Traductor Burocrático',
    description: 'Actualiza la contraseña de tu cuenta.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/update-password',
    title: 'Actualizar Contraseña — Traductor Burocrático',
    description: 'Actualiza tu contraseña para acceder a tu cuenta.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/payment/success',
    title: 'Pago Exitoso — Traductor Burocrático',
    description: 'Tu pago se ha completado correctamente. Estamos preparando tu caso.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/payment/cancelled',
    title: 'Pago Cancelado — Traductor Burocrático',
    description: 'El proceso de pago se ha cancelado. Vuelve a intentarlo cuando quieras.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/auth/confirm',
    title: 'Confirmación de Cuenta — Traductor Burocrático',
    description: 'Tu cuenta ha sido confirmada exitosamente. Inicia sesión para continuar.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/auth/callback',
    title: 'Verificando tu sesión — Traductor Burocrático',
    description: 'Estamos validando tu autenticación. Este proceso dura unos segundos.',
    robots: 'noindex, nofollow',
  },
  {
    pattern: '/admin',
    title: 'Panel de Administración — Traductor Burocrático',
    description: 'Gestiona usuarios, servicios y reportes internos.',
    robots: 'noindex, nofollow',
    match: 'prefix',
  },
  {
    pattern: '/cases/:caseId',
    disabled: true,
  },
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matchesPattern = (pattern, path, matchStrategy) => {
  if (matchStrategy === 'prefix') {
    return path === pattern || path.startsWith(pattern.endsWith('/') ? pattern : `${pattern}/`);
  }

  if (pattern.includes(':')) {
    const regexPattern = pattern
      .split('/')
      .map((segment) => (segment.startsWith(':') ? '[^/]+' : escapeRegex(segment)))
      .join('/');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }

  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return path.startsWith(prefix);
  }

  return pattern === path;
};

const calculateSpecificity = (pattern, matchStrategy) => {
  if (matchStrategy === 'prefix') {
    return pattern.length * 10 - 5;
  }

  const isWildcard = pattern.endsWith('*');
  const cleanedPattern = isWildcard ? pattern.slice(0, -1) : pattern;
  const segments = cleanedPattern.split('/').filter(Boolean);
  const dynamicSegments = segments.filter((segment) => segment.startsWith(':')).length;

  return segments.length * 20 - dynamicSegments * 5 - (isWildcard ? 10 : 0);
};

export const getSeoForPath = (path) => {
  const normalizedPath = path === '/' ? '/' : path.replace(/\/+$/, '');

  let bestMatch = null;
  let bestScore = -Infinity;

  for (const entry of pageSeo) {
    const matchStrategy = entry.match;
    if (matchesPattern(entry.pattern, normalizedPath, matchStrategy)) {
      const score = calculateSpecificity(entry.pattern, matchStrategy);
      if (score > bestScore) {
        bestMatch = entry;
        bestScore = score;
      }
    }
  }

  if (!bestMatch) {
    bestMatch = pageSeo.find((entry) => entry.pattern === '/') ?? {};
  }

  if (bestMatch?.disabled) {
    return { disabled: true };
  }

  const canonicalURL = `${generalConfig.baseURL}${normalizedPath === '/' ? '' : normalizedPath}`;

  return {
    title: bestMatch?.title ?? generalConfig.defaultTitle,
    description: bestMatch?.description ?? generalConfig.defaultDescription,
    canonical: canonicalURL,
    ogImage: bestMatch?.ogImage ?? generalConfig.ogImage,
    ogType: bestMatch?.ogType ?? generalConfig.defaultOgType,
    twitterCard: bestMatch?.twitterCard ?? generalConfig.twitterCard,
    robots: bestMatch?.robots ?? generalConfig.defaultRobots,
    siteName: generalConfig.siteName,
    extraMeta: bestMatch?.meta ?? [],
  };
};
