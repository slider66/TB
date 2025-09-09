
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Zap, 
  AlertTriangle,
  Loader2,
  Plus,
  Minus,
  Star,
  Shield,
  Languages,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [services, setServices] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [addOns, setAddOns] = useState({
    urgent: false,
    secondLang: false,
    telematic: false,
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
      if (error) {
        toast({ title: "Error", description: "No se pudieron cargar las tarifas.", variant: "destructive" });
      } else {
        setServices(data);
        const basicTier = data.find(s => s.code === 'TR_BASIC_48H');
        setSelectedTier(basicTier);
      }
    };
    fetchServices();
  }, [toast]);

  useEffect(() => {
    if (!selectedTier) return;

    let total = selectedTier.base_price_cents;
    const extraPageService = services.find(s => s.code === 'ADDON_EXTRA_PAGE');

    if (pageCount > 3 && extraPageService) {
      total += (pageCount - 3) * extraPageService.base_price_cents;
    }

    if (addOns.urgent) {
      const urgentService = services.find(s => s.code === 'ADDON_URGENT_6H');
      if (urgentService) total += urgentService.base_price_cents;
    }
    if (addOns.secondLang) {
      const langService = services.find(s => s.code === 'ADDON_2ND_LANG');
      if (langService) total += langService.base_price_cents;
    }
    if (addOns.telematic) {
      const telematicService = services.find(s => s.code === 'ADDON_TELEMATIC_REVIEW');
      if (telematicService) total += telematicService.base_price_cents;
    }

    setTotalPrice(total);
  }, [selectedTier, pageCount, addOns, services]);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({ title: "Tipo de archivo no permitido", description: "Solo se aceptan PDF, JPG y PNG.", variant: "destructive" });
        return;
      }
      if (selectedFile.size > 15 * 1024 * 1024) { // 15MB
        toast({ title: "Archivo demasiado grande", description: "El tamaño máximo es de 15MB.", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
      setError(null);
      setUploadState('configuring');
    }
  };

  const handleProceedToPayment = async () => {
    if (!file || !user || !selectedTier) return;

    setUploadState('processing');
    try {
      // 1. Crear un nuevo caso
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          client_user_id: user.id,
          title: `Traducción de ${file.name}`,
          status: 'pending_payment',
          priority: addOns.urgent ? 'urgent' : 'medium',
          service_id: selectedTier.id,
        })
        .select()
        .single();
      if (caseError) throw caseError;

      // 2. Crear la orden
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          client_user_id: user.id,
          status: 'draft',
          currency: 'eur',
          total_cents: totalPrice,
        })
        .select()
        .single();
      if (orderError) throw orderError;

      // 3. Crear los items de la orden
      const orderItems = [{ order_id: orderData.id, service_id: selectedTier.id, qty: 1, unit_price_cents: selectedTier.base_price_cents, vat_rate: selectedTier.vat_rate, total_cents: selectedTier.base_price_cents, case_id: caseData.id }];
      
      // Add-ons
      if (pageCount > 3) {
        const extraPageService = services.find(s => s.code === 'ADDON_EXTRA_PAGE');
        orderItems.push({ order_id: orderData.id, service_id: extraPageService.id, qty: pageCount - 3, unit_price_cents: extraPageService.base_price_cents, vat_rate: extraPageService.vat_rate, total_cents: (pageCount - 3) * extraPageService.base_price_cents, case_id: caseData.id });
      }
      // ... (add other addons similarly)

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      toast({ title: "Orden creada", description: "Redirigiendo al pago..." });
      // En un futuro, aquí se llamaría a Stripe
      // For now, simulate success
      setTimeout(() => {
        setUploadState('success');
        toast({ title: "🚧 Simulación de Pago Exitoso", description: "En un MVP real, aquí iría la pasarela de pago.", className: "bg-blue-500 text-white" });
      }, 2000);

    } catch (e) {
      console.error("Order creation failed:", e);
      setError(e.message);
      setUploadState('error');
      toast({ title: "Error al crear la orden", description: e.message, variant: "destructive" });
    }
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const resetState = () => { setFile(null); setUploadState('idle'); setError(null); };

  const renderContent = () => {
    switch (uploadState) {
      case 'idle':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`upload-zone rounded-2xl p-12 text-center ${dragOver ? 'drag-over' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={() => document.getElementById('file-input').click()}>
            <Upload className="h-16 w-16 text-neutral-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-neutral-700 mb-4">Arrastra tu documento aquí</h3>
            <p className="text-neutral-500 mb-6">PDF, JPG, PNG (máx. 15 págs / 15MB)</p>
            <Button className="btn-primary">Seleccionar Archivo</Button>
            <input id="file-input" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileSelect(e.target.files[0])} />
          </motion.div>
        );
      case 'configuring':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-8 items-start">
            <div className="document-card">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">1. Elige tu plan</h3>
              <div className="space-y-3">
                {services.filter(s => s.code.startsWith('TR_')).map(tier => (
                  <div key={tier.id} onClick={() => setSelectedTier(tier)} className={`tier-select ${selectedTier?.id === tier.id ? 'selected' : ''}`}>
                    <div>
                      <p className="font-bold">{tier.name}</p>
                      <p className="text-sm text-neutral-500">{(tier.base_price_cents / 100).toFixed(2)}€</p>
                    </div>
                    {selectedTier?.id === tier.id && <CheckCircle className="h-6 w-6 text-green-500" />}
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-neutral-800 mt-8 mb-4">2. Ajusta los detalles</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Número de páginas (máx. 15)</Label>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => setPageCount(p => Math.max(1, p - 1))}><Minus className="h-4 w-4" /></Button>
                    <span className="font-bold w-8 text-center">{pageCount}</span>
                    <Button size="icon" variant="outline" onClick={() => setPageCount(p => Math.min(15, p + 1))}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="urgent" checked={addOns.urgent} onCheckedChange={(c) => setAddOns(a => ({...a, urgent: c}))} />
                  <Label htmlFor="urgent" className="flex items-center gap-2"><Zap className="h-4 w-4 text-orange"/>Entrega Urgente (6h) <span className="font-bold ml-auto">+10€</span></Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="secondLang" checked={addOns.secondLang} onCheckedChange={(c) => setAddOns(a => ({...a, secondLang: c}))} />
                  <Label htmlFor="secondLang" className="flex items-center gap-2"><Languages className="h-4 w-4 text-blue-500"/>Segundo Idioma <span className="font-bold ml-auto">+4€</span></Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="telematic" checked={addOns.telematic} onCheckedChange={(c) => setAddOns(a => ({...a, telematic: c}))} />
                  <Label htmlFor="telematic" className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500"/>Revisión Envío Telemático <span className="font-bold ml-auto">+7€</span></Label>
                </div>
              </div>
            </div>
            <div className="document-card sticky top-24">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Resumen del pedido</h3>
              <div className="flex items-center gap-4 p-4 bg-neutral-100 rounded-lg mb-4">
                <FileText className="h-8 w-8 text-orange" />
                <p className="font-semibold truncate">{file?.name}</p>
              </div>
              <div className="space-y-2 text-neutral-700">
                <div className="flex justify-between"><span>{selectedTier?.name}</span> <span>{(selectedTier?.base_price_cents / 100).toFixed(2)}€</span></div>
                {pageCount > 3 && <div className="flex justify-between"><span>Páginas extra ({pageCount - 3})</span> <span>{((pageCount - 3) * 2).toFixed(2)}€</span></div>}
                {addOns.urgent && <div className="flex justify-between"><span>Add-on Urgente</span> <span>10.00€</span></div>}
                {addOns.secondLang && <div className="flex justify-between"><span>Add-on 2º Idioma</span> <span>4.00€</span></div>}
                {addOns.telematic && <div className="flex justify-between"><span>Add-on Telemático</span> <span>7.00€</span></div>}
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>Total</span>
                <span className="text-orange">{(totalPrice / 100).toFixed(2)}€</span>
              </div>
              <p className="text-sm text-neutral-500 text-right mt-1">IVA incluido</p>
              <Button className="btn-primary w-full mt-6 text-lg" onClick={handleProceedToPayment}>
                <CreditCard className="mr-2 h-5 w-5" />
                Proceder al Pago
              </Button>
              <Button variant="link" className="w-full mt-2" onClick={resetState}>Cancelar y subir otro</Button>
            </div>
          </motion.div>
        );
      case 'processing':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="document-card text-center">
            <Loader2 className="h-16 w-16 text-orange mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">Procesando tu orden...</h3>
            <p className="text-neutral-600">Estamos preparando todo para el pago seguro.</p>
          </motion.div>
        );
      case 'success':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="document-card text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">¡Orden recibida!</h3>
            <p className="text-neutral-600 mb-6">Tu documento está en buenas manos. Recibirás una notificación cuando esté listo.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary" onClick={() => navigate('/clients')}>Ir a Mis Casos</Button>
              <Button className="btn-secondary" onClick={resetState}>Subir otro</Button>
            </div>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="document-card text-center bg-red-50 border-red-200">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error en el proceso</h3>
            <p className="text-red-600 mb-6 max-w-md mx-auto">{error || 'Ocurrió un error inesperado.'}</p>
            <Button className="btn-secondary" onClick={() => setUploadState('configuring')}>Volver a configurar</Button>
          </motion.div>
        );
      default: return null;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-6">Sube tu documento oficial</h1>
          <p className="text-xl text-neutral-600">Nuestra IA lo analizará para darte los siguientes pasos</p>
        </motion.div>
        {renderContent()}
      </div>
    </div>
  );
};

export default UploadPage;
