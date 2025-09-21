import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar } from 'lucide-react';

const CaseData = ({ caseId }) => {
    // Mock data
    const data = {
        agency: "Agencia Tributaria",
        procedure_name: "Requerimiento de información sobre IRPF 2023",
        external_reference: "REF-AEAT-2025-12345XYZ",
        internal_reference: "TB-2025-09-001",
        official_deadline: "2025-09-20",
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-orange" />
                    Datos del Caso
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-neutral-600">Organismo</p>
                        <p>{data.agency}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-neutral-600">Procedimiento</p>
                        <p>{data.procedure_name}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-neutral-600">Referencia del Organismo</p>
                        <p>{data.external_reference}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-neutral-600">Referencia Interna</p>
                        <p>{data.internal_reference}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="font-semibold text-neutral-600">Plazos Oficiales</p>
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-neutral-500" />
                           <span>Fecha límite: {new Date(data.official_deadline).toLocaleDateString('es-ES')}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CaseData;