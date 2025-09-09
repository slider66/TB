
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  TrendingUp,
  Star,
  ArrowRight,
  User,
  Building,
  FileText,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';


const PartnersPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isPartner = user?.user_metadata?.role === 'partner' || user?.user_metadata?.role === 'partner_admin';

  const PartnerDashboard = () => (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-neutral-800 mb-6">
            Panel de Partner
          </h1>
          <p className="text-xl text-neutral-600">
            Gestiona tus leads y clientes.
          </p>
        </motion.div>
        <motion.div 
            className="document-card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">¡Bienvenido, Partner!</h2>
            <p className="text-neutral-600 mb-6">Aquí podrás ver los nuevos clientes que necesitan tus servicios.</p>
             <Button className="btn-primary" onClick={() => toast({
                    title: "🚧 Esta función no está implementada aún",
                    description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
                })}>
                Ver Clientes Potenciales
            </Button>
        </motion.div>
      </div>
    </div>
  );

  const PublicPartnersPage = () => (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-neutral-800 mb-6">
            Área de Partners
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Únete a nuestra red de profesionales y conecta con clientes cualificados 
            que necesitan tus servicios especializados
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <TrendingUp />,
              title: 'Clientes Cualificados',
              description: 'Recibe leads de calidad que ya han identificado sus necesidades específicas'
            },
            {
              icon: <Shield />,
              title: 'Proceso Verificado',
              description: 'Todos los documentos están pre-analizados y categorizados por urgencia'
            },
            {
              icon: <Star />,
              title: 'Reputación Digital',
              description: 'Construye tu reputación con reseñas y valoraciones de clientes satisfechos'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="partner-card text-center"
            >
              <div className="feature-icon mx-auto">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">
                {benefit.title}
              </h3>
              <p className="text-neutral-600">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="document-card mb-12"
        >
          <h2 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
            Profesionales que Buscamos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Gestorías', icon: <Building />, count: '150+' },
              { title: 'Abogados', icon: <User />, count: '200+' },
              { title: 'Asesores Fiscales', icon: <FileText />, count: '120+' },
              { title: 'Consultores', icon: <Users />, count: '80+' }
            ].map((type, index) => (
              <div key={index} className="text-center p-6 bg-neutral-50 rounded-xl">
                <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.cloneElement(type.icon, { className: 'h-8 w-8 text-orange' })}
                </div>
                <h3 className="font-bold text-neutral-800 mb-2">{type.title}</h3>
                <p className="text-sm text-neutral-600">{type.count} activos</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="partner-card max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 text-center">
            Únete a Nuestra Red
          </h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Profesional
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Especialidad
              </label>
              <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange">
                <option>Selecciona tu especialidad</option>
                <option>Gestoría</option>
                <option>Abogado</option>
                <option>Asesor Fiscal</option>
                <option>Consultor</option>
                <option>Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Número de Colegiado
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="Número de colegiado profesional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Experiencia
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="Describe tu experiencia y especialidades..."
              />
            </div>

            <Button 
              type="submit" 
              className="btn-primary w-full text-lg py-4"
              onClick={(e) => {
                e.preventDefault();
                toast({
                  title: "🚧 Esta función no está implementada aún",
                  description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
                });
              }}
            >
              Solicitar Acceso
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );

  return isPartner ? <PartnerDashboard /> : <PublicPartnersPage />;
};

export default PartnersPage;
