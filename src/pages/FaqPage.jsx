import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Clock, FileText, ShieldCheck, Upload, CheckCircle, MessageSquare, DollarSign, RefreshCw, Lock, Brain, Users, HeartHandshake as Handshake, User, Briefcase, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const FaqPage = () => {
  const faqItems = [
    {
      category: 'Sobre el servicio',
      icon: <Lightbulb className="h-6 w-6 text-blue-500" />,
      questions: [
        {
          question: '¿Qué es Traductor Burocrático?',
          answer:
            'Un servicio que explica en lenguaje claro documentos de la Administración (AEAT, DGT, Seguridad Social, ayuntamientos, etc.). Entregamos un resumen comprensible, un checklist de acciones y, cuando procede, plantillas orientativas. No damos asesoramiento legal o fiscal personalizado ni sustituimos a profesionales colegiados.',
        },
        {
          question: '¿Cómo funciona?',
          answer:
            '1) Subes el documento. 2) Lo analizamos con IA + revisión humana. 3) Recibes explicación, checklist y plazos. 4) Si lo necesitas, te conectamos con un profesional verificado.',
        },
      ],
    },
    {
      category: 'Alcance',
      icon: <FileText className="h-6 w-6 text-green-500" />,
      questions: [
        {
          question: '¿Qué documentos puedo subir?',
          answer:
            'Notificaciones, requerimientos, propuestas de sanción, providencias de apremio, embargos, citaciones, comunicaciones de TGSS/SEPE, resoluciones, tasas, cartas de pago y multas. Formatos aceptados: PDF, JPG/PNG y DOC/DOCX.',
        },
        {
          question: '¿Qué NO hacemos?',
          answer:
            'No redactamos ni presentamos escritos en tu nombre, no interponemos recursos ni representamos ante la Administración. Si lo necesitas, te derivamos a un partner.',
        },
      ],
    },
    {
      category: 'Tiempos y expectativas',
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      questions: [
        {
          question: '¿Cuánto tarda?',
          answer: 'Servicio estándar < 24 h. Opción urgente 4–6 h (según carga y complejidad).',
        },
        {
          question: '¿Garantiza un resultado ante la Administración?',
          answer:
            'No. Nuestra entrega te ayuda a entender y decidir. El resultado depende de tu caso y del órgano gestor. Para estrategia o defensa, te derivamos a un profesional.',
        },
      ],
    },
    {
      category: 'Subida de archivos',
      icon: <Upload className="h-6 w-6 text-orange-500" />,
      questions: [
        {
          question: 'Consejos para fotos de documentos:',
          answer:
            'Buena luz, encuadre completo, sin sombras, resolución alta, páginas ordenadas. Si hay varias, mejor en un único PDF.',
        },
        {
          question: 'Tamaño máximo o errores de subida:',
          answer:
            'Si aparece límite, divide el archivo y súbelo por partes o pega un enlace seguro (Drive/Dropbox) en notas.',
        },
        {
          question: '¿Puedo añadir contexto?',
          answer:
            'Sí: fechas, antecedentes y dudas concretas mejoran el checklist.',
        },
      ],
    },
    {
      category: 'Entregables y calidad',
      icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
      questions: [
        {
          question: '¿Qué recibo exactamente?',
          answer:
            '• Explicación clara del documento.\n• Checklist accionable con plazos y dónde presentarlo.\n• Plantillas/modelos orientativos cuando proceda.\n• Alertas sobre riesgos (caducidad, recargos…).\n• Opcional: propuesta de derivación a partner.',
        },
        {
          question: '¿Revisáis el trabajo?',
          answer:
            'Sí. IA + control humano y chequeos de coherencia/plazos.',
        },
      ],
    },
    {
      category: 'Aclaraciones',
      icon: <MessageSquare className="h-6 w-6 text-red-500" />,
      questions: [
        {
          question: '¿Podéis ampliar o aclarar después?',
          answer:
            'Incluimos una ronda de aclaraciones gratuita por pedido (dudas sobre esa misma notificación). Para cambios de alcance o documentos nuevos, se presupuestan aparte.',
        },
      ],
    },
    {
      category: 'Precios y pago',
      icon: <DollarSign className="h-6 w-6 text-yellow-500" />,
      questions: [
        {
          question: '¿Cómo se calcula el precio?',
          answer:
            'Por documento, según longitud y complejidad. Verás el importe antes de pagar. La urgencia lleva recargo.',
        },
        {
          question: '¿Cómo pago?',
          answer:
            'A través de Stripe: tarjeta, Apple Pay o Google Pay, con 3D Secure.',
        },
        {
          question: '¿Emitís factura?',
          answer:
            'Sí, automática tras el pago. Series anuales por normativa. Si necesitas datos de empresa o IVA intracomunitario, indícalo en el pedido.',
        },
      ],
    },
    {
      category: 'Reembolsos',
      icon: <RefreshCw className="h-6 w-6 text-cyan-500" />,
      questions: [
        {
          question: '¿Devoluciones?',
          answer:
            'Si no recibes la entrega, reembolso íntegro. Si llega fuera del plazo contratado y deja de ser útil, ofrecemos reembolso o crédito; lo tratamos caso por caso para ser justos.',
        },
      ],
    },
    {
      category: 'Privacidad y RGPD',
      icon: <Lock className="h-6 w-6 text-gray-700" />,
      questions: [
        {
          question: '¿Es seguro subir mis documentos?',
          answer:
            'Sí. Cumplimos RGPD y empleamos proveedores con altos estándares de seguridad y controles de acceso.',
        },
        {
          question: 'Retención y borrado:',
          answer:
            'Conservamos lo mínimo y el tiempo necesario para el servicio y obligaciones legales (facturación, soporte). Puedes solicitar borrado anticipado desde tu área o por email.',
        },
      ],
    },
    {
      category: 'IA y derechos',
      icon: <Brain className="h-6 w-6 text-indigo-500" />,
      questions: [
        {
          question: '¿Usáis mis datos para entrenar IA?',
          answer:
            'No utilizamos tus documentos para entrenar modelos públicos. Cuando usamos IA de terceros, limitamos el tratamiento y firmamos los acuerdos necesarios.',
        },
        {
          question: '¿Puedo ejercer mis derechos?',
          answer:
            'Sí: acceso, rectificación, supresión, portabilidad, limitación y oposición en hola@traductorburocratico.es.',
        },
        {
          question: 'Menores de edad:',
          answer: 'Servicio solo para mayores de 18 años.',
        },
      ],
    },
    {
      category: 'Derivación a profesionales',
      icon: <Users className="h-6 w-6 text-pink-500" />,
      questions: [
        {
          question: '¿Cuándo me deriváis?',
          answer:
            'Cuando el caso requiere redacción, representación o estrategia (alegaciones, recursos, inspecciones…).',
        },
        {
          question: '¿Cómo seleccionáis a los partners?',
          answer:
            'Verificación KYC, colegiación/alta profesional, seguro de RC y reseñas. Priorizamos experiencia específica (laboral, fiscal, DGT, extranjería, contencioso…).',
        },
      ],
    },
    {
      category: 'Partners y responsabilidad',
      icon: <Handshake className="h-6 w-6 text-green-600" />,
      questions: [
        {
          question: '¿Hay comisiones por derivación?',
          answer:
            'Modelo transparente de referidos (fee al partner/lead). Para ti, el precio es el mismo que si contrataras directamente.',
        },
        {
          question: '¿Quién responde del trabajo?',
          answer:
            'El partner contratado. Traductor Burocrático actúa como plataforma de conexión, no como despacho.',
        },
      ],
    },
    {
      category: 'Área de clientes',
      icon: <User className="h-6 w-6 text-blue-400" />,
      questions: [
        {
          question: '¿Tengo historial de pedidos?',
          answer:
            'Sí. Verás estado, podrás descargar entregas y pedir borrado. Próximamente: recordatorios de plazos.',
        },
        {
          question: '¿Puedo compartir un pedido?',
          answer:
            'Sí, con enlace seguro o añadiendo un email con permiso de lectura.',
        },
      ],
    },
    {
      category: 'Empresas (B2B)',
      icon: <Briefcase className="h-6 w-6 text-yellow-600" />,
      questions: [
        {
          question: '¿Tenéis plan para empresas y asesorías?',
          answer:
            'Sí: cuentas multiusuario, permisos, SLA, plantillas personalizadas, API/integración y facturación mensual.',
        },
        {
          question: '¿Podéis firmar un DPA específico?',
          answer:
            'Sí, ofrecemos acuerdo de encargo de tratamiento y cláusulas de confidencialidad.',
        },
      ],
    },
    {
      category: 'Idioma, legal y soporte',
      icon: <Globe className="h-6 w-6 text-gray-500" />,
      questions: [
        {
          question: 'Idiomas y accesibilidad:',
          answer:
            'Entregamos en español claro (opcional inglés). Textos con lectura fácil; pide formatos adaptados si los necesitas.',
        },
        {
          question: 'Límites legales:',
          answer:
            'No somos asesoría. Confidencialidad y propiedad de tus documentos garantizadas. Rechazamos casos con conflicto de interés.',
        },
        {
          question: 'Soporte:',
          answer:
            'Email hola@traductorburocratico.es. L–V 9:00–18:00 CET. En urgentes, pon “URGENTE” en el asunto.',
        },
      ],
    },
  ];

  const title = "Preguntas Frecuentes sobre trámites y notificaciones | 59ch";
  const description = "Resolvemos tus dudas sobre la traducción de una notificación de la administración, AEAT o Seguridad Social. Privacidad, precios y plazos.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://traductorburocratico.es/faq" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://traductorburocratico.es/faq" />
      </Helmet>

      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12 leading-tight">
        Preguntas Frecuentes
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {faqItems.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200 flex items-center space-x-4">
                {category.icon}
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIndex) => (
                    <AccordionItem
                      key={qIndex}
                      value={`item-${index}-${qIndex}`}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <AccordionTrigger className="text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FaqPage;