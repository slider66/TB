import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Link as LinkIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Permissions = ({ caseId }) => {
    const { toast } = useToast();
    
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
                    <Lock className="h-6 w-6 mr-2 text-orange" />
                    Permisos y Acceso
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" onClick={showToast}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Gestionar Permisos por Rol
                </Button>
                <Button variant="outline" className="w-full" onClick={showToast}>
                    <LinkIcon className="h-4 w-4 mr-2" /> Crear Enlace Seguro de Solo Lectura
                </Button>
            </CardContent>
        </Card>
    );
};

export default Permissions;
