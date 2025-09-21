import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Payments = ({ caseId }) => {
    const { toast } = useToast();
    // Mock data
    const invoices = [
        { id: 'INV-001', date: '2025-09-05', amount: '75,00 €', status: 'Pagada' },
    ];
    
    const showToast = () => {
        toast({
            title: "🚧 Función no implementada",
            description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje. 🚀",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-2 text-orange" />
                    Pagos y Facturas
                </CardTitle>
            </CardHeader>
            <CardContent>
                {invoices.length > 0 ? (
                    invoices.map(invoice => (
                        <div key={invoice.id} className="flex items-center justify-between text-sm">
                           <div>
                                <p className="font-medium">{invoice.id}</p>
                                <p className="text-xs text-neutral-500">{invoice.date} - {invoice.amount}</p>
                           </div>
                           <div className="flex items-center gap-2">
                                <span className="font-semibold text-green-600">{invoice.status}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={showToast}>
                                    <Download className="h-4 w-4" />
                                </Button>
                           </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-neutral-500 text-center">No hay facturas para este caso.</p>
                )}
                 <Button className="w-full mt-4" variant="outline" onClick={showToast}>
                    Generar Nueva Factura
                </Button>
            </CardContent>
        </Card>
    );
};

export default Payments;