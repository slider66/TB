import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, Phone, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', _hp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData._hp && formData._hp.trim() !== '') {
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast({
        title: 'Campos obligatorios',
        description: 'Por favor, rellena todos los campos.',
        variant: 'destructive',
      });
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      toast({
        title: 'Email no válido',
        description: 'Introduce un correo con formato válido (ej. usuario@dominio.com).',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const metadata = {
        route: '/contact',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      };

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          source: 'contact_page',
          metadata,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Mensaje enviado',
        description: 'Gracias por contactarnos. Te responderemos pronto.',
      });
      setFormData({ name: '', email: '', message: '', _hp: '' });
    } catch (error) {
      const context = error?.context ?? {};
      const detailedMessage =
        context.details ||
        context.error ||
        error?.message ||
        'Hubo un problema al enviar tu mensaje. Por favor, intentalo de nuevo.';

      console.error('Error sending contact form:', {
        error,
        context,
        payload: formData,
      });

      toast({
        title: 'Error al enviar',
        description: detailedMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4 font-montserrat">
              Contacta con Nosotros
            </h1>
            <p className="text-xl text-neutral-600">Tienes preguntas? Estamos aqui para ayudarte.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-montserrat">Envianos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="hidden">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Déjalo en blanco</label>
                  <input
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData._hp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Tu nombre"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Mensaje</label>
                  <textarea
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Escribe tu consulta aqui..."
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  ></textarea>
                </div>
                <Button type="submit" className="btn-primary w-full text-lg py-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-montserrat">Informacion de Contacto</h2>
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
  );
};

export default ContactPage;
