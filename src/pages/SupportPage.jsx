
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SupportPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts.shift() || '';
      const lastName = nameParts.join(' ') || '';

      setFormData(prev => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, phone, email, message } = formData;
    if (!firstName || !lastName || !phone || !email || !message) {
      toast({
        title: "Campos obligatorios",
        description: "Por favor, rellena todos los campos del formulario.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "🚧 Formulario en construcción",
      description: "Esta función no está implementada aún, pero ¡gracias por tu interés! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>Soporte y Ayuda - Traductor Burocrático</title>
        <meta name="description" content="Contacta con nuestro equipo de soporte para cualquier duda o consulta. Estamos aquí para ayudarte." />
        <meta property="og:title" content="Soporte y Ayuda - Traductor Burocrático" />
        <meta property="og:description" content="Contacta con nuestro equipo de soporte para cualquier duda o consulta." />
      </Helmet>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Soporte y Ayuda</h1>
            <p className="text-xl text-neutral-600">¿Tienes preguntas? Rellena el formulario y te responderemos lo antes posible.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Envíanos tu consulta</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="firstName">Nombre</label>
                    <input id="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="Tu nombre" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="lastName">Apellidos</label>
                    <input id="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Tus apellidos" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="phone">Teléfono</label>
                    <input id="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Tu teléfono" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="email">Email</label>
                    <input id="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="tu@email.com" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="message">Mensaje</label>
                  <textarea id="message" value={formData.message} onChange={handleInputChange} rows="5" placeholder="Escribe tu consulta aquí..." required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"></textarea>
                </div>
                <Button type="submit" className="btn-primary w-full text-lg py-4">
                  <Send className="mr-2 h-5 w-5" />
                  Enviar Consulta
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Información de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="feature-icon !w-12 !h-12 !min-w-[3rem]">
                    <Mail />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800">Email</h3>
                    <p className="text-neutral-600">hola@traductorburocratico.es</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="feature-icon !w-12 !h-12 !min-w-[3rem]">
                    <Phone />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800">Teléfono</h3>
                    <p className="text-neutral-600">(+34) 600 36 72 17</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="feature-icon !w-12 !h-12 !min-w-[3rem]">
                    <MapPin />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800">Oficina</h3>
                    <p className="text-neutral-600">Madrid, España</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;
