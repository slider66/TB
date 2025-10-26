import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, Zap, UserCheck, Briefcase, ArrowRight, ShieldCheck, Inbox, HelpCircle } from 'lucide-react';

const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="card-hover p-8 rounded-2xl"
  >
    <div className="feature-icon mx-auto">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-neutral-800 mt-4 mb-2">
      {title}
    </h3>
    <p className="text-neutral-600">
      {description}
    </p>
  </motion.div>
);

const howItWorksSteps = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Sube tu documento',
    description: 'Arrastra el archivo, abre la cuenta en segundos y dinos que administracion lo envio.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Validacion y seguridad',
    description: 'Analizamos el archivo y lo desinfectamos. Si detecta riesgo, lo detenemos y te avisamos.',
  },
  {
    icon: <Inbox className="h-6 w-6" />,
    title: 'Revision experta',
    description: 'Nuestros asesores reciben el caso, confirman la legitimidad del documento y lo estudian a fondo.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Entrega en 24 horas',
    description: 'Recibes un informe claro con resumen, pasos y plazos para que actues sin dudas.',
  },
  {
    icon: <HelpCircle className="h-6 w-6" />,
    title: 'Consulta posterior',
    description: 'Si algo no queda claro, puedes abrir una consulta de seguimiento incluida en tu pedido.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold text-neutral-800 mb-6">
            Democratizamos el acceso a la administración
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Eliminamos horas de consultas y ansiedad, ofreciendo claridad para ti y oportunidades para profesionales.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white border border-neutral-200 rounded-2xl shadow-lg p-8 mb-16"
        >
          <p className="uppercase text-sm font-semibold tracking-wide text-orange-500 mb-4 text-center">
            Paso a paso
          </p>
          <h3 className="text-3xl font-bold text-neutral-800 text-center mb-6">
            Asi funciona Traductor Burocratico
          </h3>
          <p className="text-neutral-600 text-center max-w-3xl mx-auto mb-8">
            Te acompaniamos desde la subida del documento hasta la aclaracion final. Todo el proceso es seguro, auditado y con expertos humanos que revisan tu caso.
          </p>
          <div className="grid gap-6 md:grid-cols-5">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex flex-col items-center text-center p-4 rounded-xl hover:shadow-md transition-shadow bg-neutral-50 md:bg-transparent"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 text-orange-600 mb-4">
                  {step.icon}
                </div>
                <h4 className="text-lg font-semibold text-neutral-800 mb-2">
                  {index + 1}. {step.title}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Tabs defaultValue="users" className="w-full max-w-4xl mx-auto">
          <TabsList className="flex justify-center border-b border-neutral-200">
            <TabsTrigger value="users">
              <UserCheck className="mr-2 h-5 w-5"/>
              Para Usuarios
            </TabsTrigger>
            <TabsTrigger value="partners">
              <Briefcase className="mr-2 h-5 w-5"/>
              Para Partners
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white p-8 rounded-b-2xl border-x border-b border-neutral-200 shadow-lg -mt-px">
            <TabsContent value="users">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {[
                  {
                    icon: <FileText />,
                    title: 'Traducción Clara',
                    description: 'Convierte el lenguaje legal y administrativo en explicaciones sencillas.'
                  },
                  {
                    icon: <Zap />,
                    title: 'Respuesta en <24h',
                    description: 'Sube tu documento y recibe un análisis completo y un plan de acción en menos de un día.'
                  },
                  {
                    icon: <Users />,
                    title: 'Conecta con Expertos',
                    description: 'Te ponemos en contacto con profesionales de confianza verificados.'
                  }
                ].map((feature, index) => (
                  <FeatureCard {...feature} index={index} key={index} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="partners">
               <div className="grid md:grid-cols-3 gap-8 text-center">
                {[
                  {
                    icon: <UserCheck />,
                    title: 'Clientes Cualificados',
                    description: 'Accede a un flujo constante de clientes que ya saben qué problema tienen.'
                  },
                  {
                    icon: <Briefcase />,
                    title: 'Cero Prospección',
                    description: 'Invierte tu tiempo en facturar, no en buscar clientes. Nosotros te los traemos.'
                  },
                  {
                    icon: <ArrowRight />,
                    title: 'Expande tu Negocio',
                    description: 'Aumenta tu cartera de clientes y tu reputación digital en nuestra plataforma.'
                  }
                ].map((feature, index) => (
                  <FeatureCard {...feature} index={index} key={index} />
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturesSection;
