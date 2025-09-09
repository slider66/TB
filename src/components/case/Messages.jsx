import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Messages = ({ caseId }) => {
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
                    <MessageCircle className="h-6 w-6 mr-2 text-orange" />
                    Comunicaciones
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="client">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="client">
                            <Users className="h-4 w-4 mr-2" /> Mensajes con Cliente
                        </TabsTrigger>
                        <TabsTrigger value="internal">
                            <Users className="h-4 w-4 mr-2" /> Notas Internas
                        </TabsTrigger>
                    </TabsList>
                    <div className="p-4 bg-neutral-50 rounded-b-lg">
                        <div className="h-48 overflow-y-auto mb-4 p-2 border rounded-md bg-white">
                            {/* Mensajes irían aquí */}
                            <p className="text-sm text-center text-neutral-400 p-4">No hay mensajes todavía.</p>
                        </div>
                        <div className="relative">
                            <textarea
                                placeholder="Escribe un mensaje..."
                                className="w-full p-2 pr-20 border rounded-md text-sm"
                                rows="2"
                            />
                            <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={showToast}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default Messages;
