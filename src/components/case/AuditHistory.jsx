import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

const AuditHistory = ({ caseId }) => {
    // Mock data
    const history = [
        { id: 1, action: "Documento 'Requerimiento_AEAT.pdf' subido (v1)", user: "Cliente", date: "2025-09-05 10:30" },
        { id: 2, action: "Estado cambiado a 'En Progreso'", user: "Ana García", date: "2025-09-05 11:00" },
        { id: 3, action: "Nueva tarea 'Llamar al cliente' creada", user: "Ana García", date: "2025-09-05 11:01" },
        { id: 4, action: "Documento 'Requerimiento_AEAT.pdf' actualizado a v2", user: "Sistema (OCR)", date: "2025-09-05 11:05" },
        { id: 5, action: "Documento 'Requerimiento_AEAT.pdf' actualizado a v3", user: "Ana García", date: "2025-09-06 09:15" },
    ].reverse();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <History className="h-6 w-6 mr-2 text-orange" />
                    Historial / Auditoría
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {history.map(item => (
                        <div key={item.id} className="flex items-start gap-3 text-sm">
                            <div className="mt-1 h-2 w-2 rounded-full bg-orange flex-shrink-0"></div>
                            <div>
                                <p>{item.action}</p>
                                <p className="text-xs text-neutral-500">{item.user} &bull; {item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default AuditHistory;
