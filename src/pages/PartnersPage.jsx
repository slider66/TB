import React, { useState } from 'react';
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
import { supabase } from '@/lib/customSupabaseClient';


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


  const PublicPartnersPage = () => {
    const [partner, setPartner] = useState({ name: '', email: '', phone: '', colegiado: '', experiencia: '', especialidad: '', _hp: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ts] = useState(() => Date.now());

    const handleChange = (field) => (e) => {
      setPartner((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      // Honeypot: abort if filled (likely a bot)
      if (partner._hp && partner._hp.trim() !== '') {
        return;
      }

      // Second-level honeypot: minimum dwell time before submit
      if (Date.now() - ts < 1500) {
        return;
      }

      // Normalization and defensive trimming
      const normalizeSpaces = (s) => s.replace(/\s+/g, ' ').trim();
      const safeName = normalizeSpaces(partner.name);
      const safeEmail = partner.email.trim().toLowerCase();
      const safePhone = partner.phone.replace(/[^+\d]/g, '').trim();
      const safeColegiado = partner.colegiado.trim();
      const safeExperiencia = normalizeSpaces(partner.experiencia);
      const safeEspecialidad = partner.especialidad && partner.especialidad !== '' ? partner.especialidad : null;

      // Requiere nº colegiado para Abogado y Asesor Fiscal
      const needsColegiado = ['Abogado', 'Asesor Fiscal'].includes(partner.especialidad);
      if (needsColegiado && !safeColegiado) {
        toast({ title: 'Falta colegiado', description: 'Indica el nº de colegiado.', variant: 'destructive' });
        return;
      }
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const { error } = await supabase
          .from('partner_requests')
          .insert({
            name: safeName,
            email: safeEmail,
            phone: safePhone,
            colegiado: safeColegiado,
            experiencia: safeExperiencia,
            especialidad: safeEspecialidad,
          });
        if (error) throw error;
        toast({ title: 'Solicitud enviada', description: 'Te contactaremos pronto.' });
        setPartner({ name: '', email: '', phone: '', colegiado: '', experiencia: '', especialidad: '', _hp: '' });
      } catch (err) {
        if (err?.code === '23505') {
          toast({ title: 'Solicitud duplicada', description: 'Ya tenemos tu solicitud.' });
        } else if (err?.message?.toLowerCase?.()?.includes('row-level security')) {
          toast({ title: 'Permisos de BD', description: 'RLS bloquea el insert.', variant: 'destructive' });
        } else {
          toast({ title: 'Error', description: 'No se pudo enviar la solicitud.', variant: 'destructive' });
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Honeypot field for bots */}
                <div style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                  <label>
                    No completar
                    <input
                      type="text"
                      name="_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={partner._hp}
                      onChange={handleChange('_hp')}
                    />
                  </label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="partner-name" className="block text-sm font-medium text-neutral-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      id="partner-name"
                      type="text"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                      placeholder="Tu nombre completo"
                      required
                      maxLength={100}
                      autoComplete="name"
                      pattern="^[A-Za-zÀ-ÿ'’\-\.\s]{2,100}$"
                      value={partner.name}
                      onChange={handleChange('name')}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="partner-email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Profesional
                    </label>
                    <input
                      id="partner-email"
                      type="email"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                      placeholder="tu@email.com"
                      required
                      maxLength={100}
                      autoComplete="email"
                      value={partner.email}
                      onChange={handleChange('email')}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="partner-phone" className="block text-sm font-medium text-neutral-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    id="partner-phone"
                    type="tel"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                    placeholder="Tu número de contacto"
                    required
                    maxLength={20}
                    autoComplete="tel"
                    pattern="^[+]?\d{7,20}$"
                    value={partner.phone}
                    onChange={handleChange('phone')}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="partner-especialidad" className="block text-sm font-medium text-neutral-700 mb-2">
                    Especialidad
                  </label>
                  <select id="partner-especialidad" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange" value={partner.especialidad} onChange={handleChange('especialidad')} required disabled={isSubmitting}>
                    <option value="" disabled>Selecciona tu especialidad</option>
                    <option>Gestoría</option>
                    <option>Abogado</option>
                    <option>Asesor Fiscal</option>
                    <option>Consultor</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="partner-colegiado" className="block text-sm font-medium text-neutral-700 mb-2">
                    Número de Colegiado
                  </label>
                  <input
                    id="partner-colegiado"
                    type="text"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                    placeholder="Número de colegiado profesional"
                    maxLength={30}
                    autoComplete="off"
                    pattern="^[A-Za-z0-9\-\/]{3,30}$"
                    value={partner.colegiado}
                    onChange={handleChange('colegiado')}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="partner-experiencia" className="block text-sm font-medium text-neutral-700 mb-2">
                    Experiencia
                  </label>
                  <textarea
                    id="partner-experiencia"
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                    placeholder="Describe tu experiencia y especialidades..."
                    required
                    maxLength={1000}
                    autoComplete="off"
                    value={partner.experiencia}
                    onChange={handleChange('experiencia')}
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="btn-primary w-full text-lg py-4" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando…' : 'Solicitar Acceso'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
    );
  }

  return isPartner ? <PartnerDashboard /> : <PublicPartnersPage />;
};

export default PartnersPage;
