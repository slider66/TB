
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { redirectToCheckout } from '@/lib/stripe';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  UploadCloud, FileText, X, Loader2, CheckCircle, AlertTriangle,
  Zap, Languages, Plus, Minus, CreditCard, Mail, Key, UserPlus, ShieldCheck
} from 'lucide-react';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const OrderPage = () => {
  const [step, setStep] = useState('upload'); // upload, configure, checkout, processing, success
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [pageCount, setPageCount] = useState(1);
  const [addOns, setAddOns] = useState({ urgent: false, translation: false });
  const [totalPrice, setTotalPrice] = useState(0);
  const [services, setServices] = useState({});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGuest, setIsGuest] = useState(true);
  const [userExists, setUserExists] = useState(null); // null, true, false
  const [isLoading, setIsLoading] = useState(false);
  
  const [orderId, setOrderId] = useState(null);
  const [caseId, setCaseId] = useState(null);

  const { user, signIn, signUp } = useAuth();

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setIsGuest(false);
      setUserExists(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
      if (error) {
        toast.error("No se pudieron cargar los servicios.");
      } else {
        const servicesMap = data.reduce((acc, service) => {
          acc[service.code] = service;
          return acc;
        }, {});
        setServices(servicesMap);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (!services.UNICO) return;
    let total = services.UNICO.base_price_cents;
    if (pageCount > 10 && services.ADDON_EXTRA_PAGES) {
      const extraBlocks = Math.ceil((pageCount - 10) / 10);
      total += extraBlocks * services.ADDON_EXTRA_PAGES.base_price_cents;
    }
    if (addOns.urgent && services.ADDON_URGENT) {
      total += services.ADDON_URGENT.base_price_cents;
    }
    if (addOns.translation && services.ADDON_TRANSLATION) {
      total += services.ADDON_TRANSLATION.base_price_cents;
    }
    setTotalPrice(total);
  }, [pageCount, addOns, services]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setStep('configure');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 15 * 1024 * 1024, // 15MB
    multiple: false,
    onDropRejected: (files) => {
      if (files[0].errors[0].code === 'file-too-large') {
        toast.error('El archivo es demasiado grande. Máximo 15MB.');
      } else {
        toast.error('Tipo de archivo no válido. Solo PDF, JPG o PNG.');
      }
    },
  });

  const handleCreateOrderAndUpload = () => {
    if (!file) {
      toast.error("Por favor, selecciona un archivo primero.");
      return;
    }
    setStep('checkout');
  };
  
  const handleCheckout = async () => {
    setIsLoading(true);
    let finalEmail = email;
    let finalUserId = user?.id;

    try {
      if (!file) {
        throw new Error("Por favor, selecciona un archivo antes de continuar.");
      }

      if (!user) {
        if (userExists === false) { // Crear nuevo usuario (invitado o no)
          const { data, error } = await signUp(email, password || `guest_${Date.now()}`, { full_name: 'Invitado' });
          if (error) throw error;
          finalUserId = data.user.id;
        } else if (userExists === true) { // Iniciar sesión
          const { data, error } = await signIn(email, password);
          if (error) throw error;
          finalUserId = data.user.id;
        }
      }

      if (!finalUserId) {
        throw new Error("No se pudo determinar el usuario para la orden.");
      }

      setStep('processing');
      setIsUploading(true);
      setUploadProgress(0);

      const shouldCreateOrder = !orderId || !caseId;
      let currentOrderId = orderId;
      let currentCaseId = caseId;

      if (shouldCreateOrder) {
        const { data: orderData, error: orderError } = await supabase.functions.invoke('create-order-and-checkout', {
          body: {
            file_name: file.name,
            page_count: pageCount,
            add_ons: addOns,
            client_user_id: finalUserId,
          }
        });

        if (orderError) throw orderError;

        currentOrderId = orderData.orderId;
        currentCaseId = orderData.caseId;
        setOrderId(currentOrderId);
        setCaseId(currentCaseId);
        const uploadPath = orderData.uploadInfo?.path;

        if (!uploadPath) {
          throw new Error('No se pudo obtener la ruta de subida del documento.');
        }

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(uploadPath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Error al subir el archivo: ${uploadError.message}`);
        }

        setUploadProgress(100);
        setIsUploading(false);
      }

      if (!currentOrderId || !currentCaseId) {
        throw new Error("No se pudo preparar la orden de compra.");
      }

      // Asociar el usuario a la orden y al caso
      const { error: updateError } = await supabase
        .from('orders')
        .update({ client_user_id: finalUserId })
        .eq('id', currentOrderId);
      if (updateError) throw updateError;

      const { error: caseUpdateError } = await supabase
        .from('cases')
        .update({ client_user_id: finalUserId })
        .eq('id', currentCaseId);
      if (caseUpdateError) throw caseUpdateError;

      await redirectToCheckout(currentOrderId, finalEmail, isGuest);

    } catch (e) {
      toast.error(e.message || "Ocurrió un error durante el proceso de pago.");
      setStep('checkout');
      setIsUploading(false);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const checkUserExists = async () => {
    if (!email) return;
    setIsLoading(true);
    const { data, error } = await supabase.functions.invoke('check-user-exists', { body: { email } });
    if (error) {
      toast.error("Error al verificar el email.");
    } else {
      setUserExists(data.exists);
      if (!data.exists) {
        setIsGuest(true); // Force guest mode if user doesn't exist
      }
    }
    setIsLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <Card {...getRootProps()} className={`w-full max-w-2xl text-center cursor-pointer transition-all ${isDragActive ? 'border-orange shadow-orange' : 'border-dashed'}`}>
            <CardContent className="p-6 sm:p-8 md:p-10 lg:p-6 flex flex-col items-center justify-center text-center">
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-16 w-16 text-neutral-400 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Arrastra o selecciona tu documento</h3>
              <p className="text-neutral-500">Formatos admitidos: PDF, JPG, PNG. Peso máximo: 15MB.</p>
              <p className="flex items-center justify-center gap-2 text-xs text-neutral-500 mt-4">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Tus documentos se eliminan automáticamente tras 7 días.
              </p>
            </CardContent>
          </Card>
        );
      case 'configure':
        return (
          <div className="grid w-full max-w-5xl gap-6 md:gap-8 md:grid-cols-2 items-start">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Configura tu pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 bg-neutral-100 p-3 rounded-lg">
                  <FileText className="h-8 w-8 text-orange" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold whitespace-normal break-words md:truncate" title={file.name}>{file.name}</p>
                    <p className="text-sm text-neutral-500">{formatBytes(file.size)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => { setFile(null); setStep('upload'); }} className="ml-auto">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Número de páginas</Label>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => setPageCount(p => Math.max(1, p - 1))}><Minus className="h-4 w-4" /></Button>
                    <Input type="number" value={pageCount} onChange={e => setPageCount(Number(e.target.value))} className="w-20 text-center font-bold" />
                    <Button size="icon" variant="outline" onClick={() => setPageCount(p => p + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Add-ons opcionales</Label>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox id="urgent" checked={addOns.urgent} onCheckedChange={c => setAddOns(a => ({ ...a, urgent: c }))} />
                    <Label htmlFor="urgent" className="flex items-center gap-2 cursor-pointer"><Zap className="h-5 w-5 text-yellow-500" />Urgente (4h)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox id="translation" checked={addOns.translation} onCheckedChange={c => setAddOns(a => ({ ...a, translation: c }))} />
                    <Label htmlFor="translation" className="flex items-center gap-2 cursor-pointer"><Languages className="h-5 w-5 text-blue-500" />Traducción (EN/FR/PT)</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full md:sticky md:top-24">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between"><span>Plan Único</span><span>{(services.UNICO?.base_price_cents / 100 || 0).toFixed(2)}€</span></div>
                  {pageCount > 10 && <div className="flex justify-between"><span>Páginas extra</span><span>{(Math.ceil((pageCount - 10) / 10) * (services.ADDON_EXTRA_PAGES?.base_price_cents / 100 || 0)).toFixed(2)}€</span></div>}
                  {addOns.urgent && <div className="flex justify-between"><span>Add-on Urgente</span><span>{(services.ADDON_URGENT?.base_price_cents / 100 || 0).toFixed(2)}€</span></div>}
                  {addOns.translation && <div className="flex justify-between"><span>Add-on Traducción</span><span>{(services.ADDON_TRANSLATION?.base_price_cents / 100 || 0).toFixed(2)}€</span></div>}
                </div>
                <hr className="my-4" />
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-orange">{(totalPrice / 100).toFixed(2)}€</span>
                </div>
                <p className="text-sm text-neutral-500 text-right mt-1">IVA incluido</p>
                <Button className="btn-primary w-full mt-6 text-lg" onClick={handleCreateOrderAndUpload}>
                  Continuar al pago
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'checkout':
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Finalizar Compra</CardTitle>
              <CardDescription>Introduce tu email para continuar. Solo pedimos los datos necesarios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} disabled={!!user} />
                  {!user && <Button onClick={checkUserExists} disabled={isLoading || !email}>{isLoading ? <Loader2 className="animate-spin" /> : 'OK'}</Button>}
                </div>
              </div>
              <AnimatePresence>
                {userExists !== null && !user && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    {userExists ? (
                      <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" type="password" placeholder="Tu contraseña" value={password} onChange={e => setPassword(e.target.value)} />
                        <p className="text-sm text-green-600">Hemos detectado una cuenta. Inicia sesión para continuar.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="guest" checked={isGuest} onCheckedChange={setIsGuest} />
                          <Label htmlFor="guest">Continuar como invitado (sin crear cuenta)</Label>
                        </div>
                        {!isGuest && (
                          <div className="space-y-2">
                            <Label htmlFor="password">Crear una contraseña</Label>
                            <Input id="password" type="password" placeholder="Crea una contraseña para acceder luego" value={password} onChange={e => setPassword(e.target.value)} />
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <Button onClick={handleCheckout} className="w-full btn-primary" disabled={isLoading || (userExists === null && !user)}>
                {isLoading ? <Loader2 className="animate-spin" /> : <><CreditCard className="mr-2 h-4 w-4" /> Pagar {(totalPrice / 100).toFixed(2)}€</>}
              </Button>
            </CardContent>
          </Card>
        );
      case 'processing':
        return (
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-6 sm:p-8 md:p-10 lg:p-6 flex flex-col items-center justify-center text-center">
              <Loader2 className="mx-auto h-16 w-16 text-orange animate-spin mb-4" />
              <h3 className="text-2xl font-semibold">Subiendo y procesando...</h3>
              <p className="text-neutral-500">Tu documento se está subiendo de forma segura.</p>
              {isUploading && <Progress value={uploadProgress} className="w-full mt-4" />}
            </CardContent>
          </Card>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-neutral-50 px-4 sm:px-6 py-6 sm:py-8 md:py-4">
        <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-extrabold text-neutral-800">Tu Pedido</h1>
            <p className="text-lg text-neutral-600 mt-2">Un proceso sencillo y seguro.</p>
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center px-0 sm:px-2"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
  );
};

export default OrderPage;
