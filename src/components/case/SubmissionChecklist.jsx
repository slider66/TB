import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const SubmissionChecklist = ({ caseId }) => {
    // Mock data
    const checklist = [
        { id: 1, text: 'Obtener certificado digital o Cl@ve PIN.', completed: true },
        { id: 2, text: 'Acceder a la Sede Electrónica del organismo.', completed: true },
        { id: 3, text: 'Rellenar el formulario de presentación de documentos.', completed: false },
        { id: 4, text: 'Adjuntar Requerimiento_AEAT.pdf (versión 3).', completed: false },
        { id: 5, text: 'Adjuntar escrito de alegaciones.', completed: false },
        { id: 6, text: 'Firmar y registrar la presentación.', completed: false },
        { id: 7, text: 'Descargar y guardar el justificante de registro.', completed: false },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <ListChecks className="h-6 w-6 mr-2 text-orange" />
                    Checklist de Envío Telemático
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {checklist.map(item => (
                        <div key={item.id} className={`flex items-center space-x-3 p-3 rounded-lg ${item.completed ? 'bg-green-50' : 'bg-neutral-50'}`}>
                            <Checkbox id={`check-${item.id}`} checked={item.completed} />
                            <Label htmlFor={`check-${item.id}`} className={`flex-grow ${item.completed ? 'line-through text-neutral-500' : ''}`}>
                                {item.text}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default SubmissionChecklist;
