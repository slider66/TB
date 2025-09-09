import React from 'react';
import Countdown from 'react-countdown';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileDown, Share2, AlertTriangle, Play, Pause, Check, Archive, User } from 'lucide-react';

const SummaryBar = ({ caseData }) => {
    const { toast } = useToast();

    const getStatusInfo = (status) => {
        const info = {
            'new': { text: 'Nuevo', class: 'status-pending', icon: <Play className="h-4 w-4 mr-2" /> },
            'pending_client': { text: 'Pendiente Cliente', class: 'status-pending', icon: <User className="h-4 w-4 mr-2" /> },
            'in_progress': { text: 'En Progreso', class: 'status-processing', icon: <Play className="h-4 w-4 mr-2" /> },
            'pending_review': { text: 'Pendiente Revisión', class: 'status-pending', icon: <Pause className="h-4 w-4 mr-2" /> },
            'referred': { text: 'Derivado', class: 'status-processing', icon: <Share2 className="h-4 w-4 mr-2" /> },
            'completed': { text: 'Completado', class: 'status-completed', icon: <Check className="h-4 w-4 mr-2" /> },
            'archived': { text: 'Archivado', class: 'status-completed', icon: <Archive className="h-4 w-4 mr-2" /> },
            'urgent': { text: 'Urgente', class: 'status-urgent', icon: <AlertTriangle className="h-4 w-4 mr-2" /> },
        };
        return info[status] || info['new'];
    };

    const getPriorityInfo = (priority) => {
        const info = {
            'low': { text: 'Baja' },
            'medium': { text: 'Media' },
            'high': { text: 'Alta' },
            'urgent': { text: 'Urgente' },
        };
        return info[priority] || info['medium'];
    };

    const statusInfo = getStatusInfo(caseData.status);
    const priorityInfo = getPriorityInfo(caseData.priority);

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span className="text-red-500 font-bold">¡Plazo Vencido!</span>;
        } else {
            return (
                <span className="font-bold text-orange">
                    {days}d {hours}h {minutes}m {seconds}s
                </span>
            );
        }
    };
    
    const showToast = () => {
        toast({
            title: "🚧 Función no implementada",
            description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje. 🚀",
        });
    };

    return (
        <Card className="mb-8">
            <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-neutral-700">Estado:</span>
                        <span className={`status-badge ${statusInfo.class} flex items-center`}>
                           {statusInfo.icon} {statusInfo.text}
                        </span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-700">Prioridad:</span>
                        <span className="font-bold">{priorityInfo.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-700">Cuenta atrás SLA:</span>
                        <Countdown date={caseData.sla_due} renderer={renderer} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-700">Propietario:</span>
                        <span>{caseData.owner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={showToast}><FileDown className="h-4 w-4 mr-2" />Exportar</Button>
                        <Button size="sm" variant="outline" onClick={showToast}><Share2 className="h-4 w-4 mr-2" />Compartir</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SummaryBar;
