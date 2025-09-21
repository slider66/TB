import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Tasks = ({ caseId }) => {
    const { toast } = useToast();
    // Mock data
    const tasks = [
        { id: 1, title: 'Llamar al cliente para pedir documentación adicional', assignee: 'Ana García', due: '2025-09-08', status: 'completed' },
        { id: 2, title: 'Redactar borrador de alegaciones', assignee: 'Ana García', due: '2025-09-10', status: 'pending' },
        { id: 3, title: 'Enviar borrador al cliente para revisión', assignee: 'Cliente', due: '2025-09-12', status: 'pending' },
    ];
    
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
                    <ClipboardList className="h-6 w-6 mr-2 text-orange" />
                    Tareas
                </CardTitle>
                 <Button size="sm" variant="ghost" onClick={showToast}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nueva Tarea
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg">
                            <div>
                                <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-neutral-400' : ''}`}>{task.title}</p>
                                <p className="text-xs text-neutral-500">Asignado a: {task.assignee} &bull; Vence: {new Date(task.due).toLocaleDateString('es-ES')}</p>
                            </div>
                            <Button variant={task.status === 'completed' ? 'secondary' : 'outline'} size="sm" onClick={showToast}>
                                {task.status === 'completed' ? 'Completada' : 'Marcar como completada'}
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Tasks;