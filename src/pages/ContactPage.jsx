
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, Phone, MapPin, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/customSupabaseClient';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Campos obligatorios",
        description: "Por favor, rellena todos los campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "✅ Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: "❌ Error al enviar",
        description: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = "Contacto para dudas sobre notificación de Hacienda | 56 chars";
  const description = "Contacta para resolver dudas sobre tu trámite con la administración. Te ayudamos a entender tu notificación de Hacienda, AEAT o TGSS.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://traductorburocratico.es/contact" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://traductorburocratico.es/contact" />
      </Helmet>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4 font-montserrat">Contacta con Nosotros</h1>
            <p className="text-xl text-neutral-600">¿Tienes preguntas? Estamos aquí para ayudarte.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-montserrat">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Nombre</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Tu nombre" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Mensaje</label>
                  <textarea rows="5" name="message" value={formData.message} onChange={handleInputChange} placeholder="Escribe tu consulta aquí..." required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"></textarea>
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
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 font-montserrat">Información de Contacto</h2>
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

export default ContactPage;
