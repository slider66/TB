
import React, { useState, useRef } from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import toast from 'react-hot-toast';
import { Loader2, Send, Paperclip, FileText, X } from 'lucide-react';

const ContactFormDialog = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [botField, setBotField] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('El archivo no puede superar los 5MB.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (botField && botField.trim() !== '') {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      toast.error('Introduce un correo con formato válido (ej. usuario@dominio.com).');
      return;
    }
    setLoading(true);

    const metadata: Record<string, unknown> = {
      route: typeof window !== 'undefined' ? window.location.pathname : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    if (file) {
      metadata.fileName = file.name;
      metadata.fileSize = file.size;
      metadata.fileType = file.type;
    }

    const body = {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      source: 'contact_modal',
      metadata,
    };

    // Note: supabase.functions.invoke with FormData is tricky and might not work as expected
    // for multipart/form-data across all environments. Sending file info and uploading separately
    // is a more robust pattern. For simplicity here, we'll just send the text data.
    // A full implementation would upload the file to storage first, then send the path.

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body,
      });
      if (error) throw error;
      if (data?.error) {
        throw new Error(typeof data.error === 'string' ? data.error : 'No se pudo enviar el mensaje.');
      }

      const successMessage =
        typeof data?.message === 'string'
          ? data.message
          : 'Mensaje enviado. Nos pondremos en contacto contigo pronto.';

      toast.success(successMessage);
      onClose();
      setBotField('');
      setFile(null);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending contact form:', error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'Hubo un error al enviar el mensaje. Intentalo de nuevo.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader className="p-6 pb-4">
        <DialogTitle className="text-2xl font-bold">Contacta para empezar</DialogTitle>
        <DialogDescription>
          Envíanos tu consulta y, si quieres, adjunta el documento. Te responderemos lo antes posible.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="hidden">
          <Label htmlFor="bot-field">Déjalo en blanco</Label>
          <Input
            id="bot-field"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea id="message" placeholder="Escribe tu consulta aquí..." value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file-upload">Adjuntar documento (opcional, máx 5MB)</Label>
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="mr-2 h-4 w-4" />
              Seleccionar archivo
            </Button>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            {file && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-md">
                <FileText className="h-4 w-4" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-neutral-500 hover:text-neutral-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Enviar Consulta
          </Button>
        </div>
      </form>
    </>
  );
};

export default ContactFormDialog;
