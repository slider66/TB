
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import toast from 'react-hot-toast';
import { Loader2, RefreshCw, Save, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('services').select('*').order('created_at');
            if (error) throw error;
            setServices(data);
        } catch (error) {
            toast.error('Error al cargar servicios: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleInputChange = (serviceId, field, value) => {
        setServices(services.map(s => s.id === serviceId ? { ...s, [field]: value } : s));
    };

    const handleSaveService = async (serviceId) => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        setSaving(prev => ({...prev, [serviceId]: true}));
        try {
            const { error } = await supabase.from('services').update({
                name: service.name,
                base_price_cents: service.base_price_cents,
                is_active: service.is_active,
                stripe_price_id: service.stripe_price_id
            }).eq('id', serviceId);

            if (error) throw error;
            toast.success(`Servicio ${service.name} actualizado.`);
        } catch (error) {
            toast.error('No se pudo actualizar el servicio: ' + error.message);
            fetchServices(); // Revert
        } finally {
            setSaving(prev => ({...prev, [serviceId]: false}));
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Gestión de Servicios y Precios</CardTitle>
                 <div className="flex justify-between items-center mt-4">
                    <p className="text-neutral-500">Modifica los precios, nombres y estado de los servicios.</p>
                     <Button onClick={() => fetchServices()} variant="outline" disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-orange" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {services.map(service => (
                            <div key={service.id} className="p-4 border rounded-lg flex items-center space-x-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <input
                                        value={service.name}
                                        onChange={e => handleInputChange(service.id, 'name', e.target.value)}
                                        className="p-2 border rounded"
                                        placeholder="Nombre del servicio"
                                    />
                                    <input
                                        type="number"
                                        value={service.base_price_cents}
                                        onChange={e => handleInputChange(service.id, 'base_price_cents', parseInt(e.target.value, 10))}
                                        className="p-2 border rounded"
                                        placeholder="Precio en céntimos"
                                    />
                                    <input
                                        value={service.stripe_price_id}
                                        onChange={e => handleInputChange(service.id, 'stripe_price_id', e.target.value)}
                                        className="p-2 border rounded"
                                        placeholder="ID de Precio de Stripe"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`active-${service.id}`}
                                            checked={service.is_active}
                                            onCheckedChange={checked => handleInputChange(service.id, 'is_active', checked)}
                                        />
                                        <label htmlFor={`active-${service.id}`}>Activo</label>
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => handleSaveService(service.id)} disabled={saving[service.id]}>
                                    {saving[service.id] ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ServiceManagement;
