import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, List, CheckSquare, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PlainLanguage = ({ caseId }) => {
    const { toast } = useToast();
    // Mock data
    const data = {
        summary: "La Agencia Tributaria te pide que aclares de dónde vienen 2,500€ que ingresaste en tu cuenta en 2023. Sospechan que podría ser un ingreso no declarado.",
        obligations: [
            "Debes responder antes del 20 de septiembre de 2025.",
            "Tienes que presentar pruebas que justifiquen el origen del dinero (ej. un contrato de venta, una donación, etc.).",
            "Si no respondes, pueden multarte con hasta 1,500€."
        ],
        next_steps: [
            "Reunir toda la documentación relacionada con esos 2,500€.",
            "Redactar un escrito de alegaciones explicando la situación.",
            "Presentar el escrito y los documentos a través de la Sede Electrónica de la Agencia Tributaria."
        ],
        templates: [
            { name: "Modelo de Alegaciones", type: "docx" },
            { name: "Justificante de Transferencia", type: "pdf" }
        ]
    };
    
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
                    <MessageSquare className="h-6 w-6 mr-2 text-orange" />
                    Traducción a Lenguaje Común
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="summary">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                        <TabsTrigger value="summary">Resumen</TabsTrigger>
                        <TabsTrigger value="obligations">Obligaciones</TabsTrigger>
                        <TabsTrigger value="steps">Pasos</TabsTrigger>
                        <TabsTrigger value="templates">Plantillas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="prose prose-sm max-w-none p-4 bg-neutral-50 rounded-b-lg">
                        <p>{data.summary}</p>
                    </TabsContent>
                    <TabsContent value="obligations" className="prose prose-sm max-w-none p-4 bg-neutral-50 rounded-b-lg">
                        <ul className="space-y-2">
                            {data.obligations.map((item, index) => <li key={index} className="flex items-start"><List className="h-4 w-4 mr-2 mt-1 text-orange flex-shrink-0" /><span>{item}</span></li>)}
                        </ul>
                    </TabsContent>
                    <TabsContent value="steps" className="prose prose-sm max-w-none p-4 bg-neutral-50 rounded-b-lg">
                        <ol className="space-y-2 list-decimal list-inside">
                            {data.next_steps.map((item, index) => <li key={index} className="flex items-start"><CheckSquare className="h-4 w-4 mr-2 mt-1 text-orange flex-shrink-0" /><span>{item}</span></li>)}
                        </ol>
                    </TabsContent>
                    <TabsContent value="templates" className="space-y-2 p-4 bg-neutral-50 rounded-b-lg">
                        {data.templates.map((template, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-neutral-500" />{template.name}</span>
                                <Button size="sm" variant="link" onClick={showToast}>Descargar</Button>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default PlainLanguage;
