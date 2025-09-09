import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PartnerReferral = ({ caseId }) => {
    const { toast } = useToast();
    // Mock data
    const consentGiven = true;
    const referredPartner = null; // o { name: 'Gestoría Pérez' }

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
                    <Share2 className="h-6 w-6 mr-2 text-orange" />
                    Derivación a Partners
                </CardTitle>
            </CardHeader>
            <CardContent>
                {referredPartner ? (
                    <div>
                        <p className="text-sm">Este caso ha sido derivado a:</p>
                        <p className="font-semibold text-lg">{referredPartner.name}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Check className={`h-5 w-5 ${consentGiven ? 'text-green-500' : 'text-neutral-400'}`} />
                            <p className="text-sm">
                                {consentGiven 
                                    ? "El cliente ha dado su consentimiento para compartir datos." 
                                    : "Consentimiento del cliente pendiente."
                                }
                            </p>
                        </div>
                        <Button className="w-full btn-primary" disabled={!consentGiven} onClick={showToast}>
                            Buscar y Derivar a Partner
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PartnerReferral;
