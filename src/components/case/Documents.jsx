import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, File, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Documents = ({ caseId }) => {
    const { toast } = useToast();
    // Mock data
    const documents = [
        { id: 1, name: 'Requerimiento_AEAT.pdf', version: 3, ocr_status: 'completed', size: '2.3 MB' },
        { id: 2, name: 'Nominas_2023.zip', version: 1, ocr_status: 'n/a', size: '10.1 MB' },
        { id: 3, name: 'DNI_anverso.jpg', version: 1, ocr_status: 'processing', size: '800 KB' },
        { id: 4, name: 'Borrador_Respuesta.docx', version: 2, ocr_status: 'error', size: '150 KB' },
    ];
    
    const getOcrStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" title="OCR Completado" />;
            case 'processing': return <Clock className="h-4 w-4 text-blue-500 animate-spin" title="OCR Procesando" />;
            case 'error': return <AlertCircle className="h-4 w-4 text-red-500" title="Error en OCR" />;
            default: return null;
        }
    };
    
    const showToast = () => {
        toast({
            title: "🚧 Función no implementada",
            description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje. 🚀",
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                    <Folder className="h-6 w-6 mr-2 text-orange" />
                    Documentos
                </CardTitle>
                <Button size="sm" className="btn-secondary" onClick={showToast}>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Documento
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <File className="h-5 w-5 text-neutral-500" />
                                <div>
                                    <p className="font-medium text-sm">{doc.name}</p>
                                    <p className="text-xs text-neutral-400">v{doc.version} &bull; {doc.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-xs">
                                    {getOcrStatusIcon(doc.ocr_status)}
                                    <span className="hidden sm:inline">OCR</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={showToast}>Ver Versiones</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Documents;