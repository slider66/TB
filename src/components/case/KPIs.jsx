import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Hourglass } from 'lucide-react';

const KPIs = ({ caseId }) => {
    // Mock data
    const kpis = {
        timeToFirstResponse: '30 minutos',
        timeToResolution: null,
        totalTimeSpent: '2.5 horas',
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-orange" />
                    KPIs del Expediente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-neutral-600"><Clock className="h-4 w-4"/> Tiempo 1ª Respuesta</span>
                    <span className="font-semibold">{kpis.timeToFirstResponse}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-neutral-600"><Hourglass className="h-4 w-4"/> Tiempo de Resolución</span>
                    <span className="font-semibold">{kpis.timeToResolution || 'En curso'}</span>
                </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-neutral-600"><Clock className="h-4 w-4"/> Tiempo Total Dedicado</span>
                    <span className="font-semibold">{kpis.totalTimeSpent}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default KPIs;
