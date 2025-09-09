import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Formulario en construcción",
      description: "Esta función no está implementada aún, pero ¡gracias por tu interés! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>Contacto - Traductor Burocrático</title>
        <meta name="description" content="Contacta con nosotros para cualquier duda o consulta. Estamos aquí para ayudarte." />
        <meta property="og:title" content="Contacto - Traductor Burocrático" />
        <meta property="og:description" content="Contacta con nosotros para cualquier duda o consulta. Estamos aquí para ayudarte." />
      </Helmet>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Contacta con Nosotros</h1>
            <p className="text-xl text-neutral-600">¿Tienes preguntas? Estamos aquí para ayudarte.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Nombre</label>
                  <input type="text" placeholder="Tu nombre" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input type="email" placeholder="tu@email.com" className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Mensaje</label>
                  <textarea rows="5" placeholder="Escribe tu consulta aquí..." className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"></textarea>
                </div>
                <Button type="submit" className="btn-primary w-full text-lg py-4">
                  <Send className="mr-2 h-5 w-5" />
                  Enviar Mensaje
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
                    <p className="text-neutral-600">hola@traductorburocratico.com</p>
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