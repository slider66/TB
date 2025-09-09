import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShieldCheck, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ClientInfo = ({ caseId }) => {
    const { toast } = useToast();
    // Mock data
    const client = {
        name: 'Carlos Sánchez',
        email: 'carlos.sanchez@example.com',
        phone: '+34 611 223 344',
        rgpd_consent: true,
        kyc_status: 'verified', // 'none', 'pending', 'verified', 'rejected'
    };

    const getKycStatusInfo = (status) => {
        const info = {
            'none': { text: 'No iniciado', class: 'text-neutral-500' },
            'pending': { text: 'Pendiente', class: 'text-yellow-500' },
            'verified': { text: 'Verificado', class: 'text-green-600' },
            'rejected': { text: 'Rechazado', class: 'text-red-500' },
        };
        return info[status] || info['none'];
    };
    
    const kycStatusInfo = getKycStatusInfo(client.kyc_status);

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
                    <User className="h-6 w-6 mr-2 text-orange" />
                    Información del Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-sm text-neutral-500">{client.email}</p>
                    <p className="text-sm text-neutral-500">{client.phone}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className={`h-5 w-5 ${client.rgpd_consent ? 'text-green-600' : 'text-neutral-400'}`} />
                        <span className="text-sm">Consentimiento RGPD: {client.rgpd_consent ? 'Otorgado' : 'No otorgado'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileCheck className={`h-5 w-5 ${kycStatusInfo.class}`} />
                        <span className="text-sm">Estado KYC: <span className={`font-semibold ${kycStatusInfo.class}`}>{kycStatusInfo.text}</span></span>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={showToast}>
                    Ver Perfil Completo
                </Button>
            </CardContent>
        </Card>
    );
};

export default ClientInfo;
