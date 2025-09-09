import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Upload,
  Calendar,
  ArrowRight,
  Mail,
  Phone,
  FilterX
} from 'lucide-react';

const mockDocuments = [
  { id: 'dgt-multa-123', name: 'Notificación DGT - Multa de tráfico', date: '2025-09-03', status: 'urgent', deadline: '3 días', type: 'DGT', isActive: true, isDueSoon: true },
  { id: 'ss-req-456', name: 'Requerimiento Seguridad Social', date: '2025-08-28', status: 'pending', deadline: '20 días', type: 'Seguridad Social', isActive: true, isDueSoon: false },
  { id: 'aeat-irpf-789', name: 'Comunicación Hacienda - IRPF 2023', date: '2025-08-25', status: 'completed', deadline: 'Completado', type: 'Hacienda', isActive: false, isDueSoon: false },
  { id: 4, name: 'Resolución de alegaciones', date: '2025-08-20', status: 'completed', deadline: 'Completado', type: 'Ayuntamiento', isActive: false, isDueSoon: false },
  { id: 5, name: 'Citación judicial', date: '2025-09-01', status: 'urgent', deadline: '5 días', type: 'Juzgado', isActive: true, isDueSoon: true },
  { id: 6, name: 'Solicitud de documentación', date: '2025-08-15', status: 'pending', deadline: '15 días', type: 'Hacienda', isActive: true, isDueSoon: false },
  { id: 7, name: 'Aviso de vencimiento de pago', date: '2025-09-05', status: 'pending', deadline: '1 día', type: 'Suministros', isActive: true, isDueSoon: true },
  { id: 8, name: 'Confirmación de trámite online', date: '2025-08-30', status: 'completed', deadline: 'Completado', type: 'General', isActive: false, isDueSoon: false },
  { id: 9, name: 'Notificación de embargo', date: '2025-08-29', status: 'urgent', deadline: '7 días', type: 'Hacienda', isActive: true, isDueSoon: true },
  { id: 10, name: 'Borrador de la declaración de la renta', date: '2025-04-10', status: 'pending', deadline: '60 días', type: 'Hacienda', isActive: true, isDueSoon: false },
  { id: 11, name: 'Certificado de empadronamiento', date: '2025-03-01', status: 'completed', deadline: 'Completado', type: 'Ayuntamiento', isActive: false, isDueSoon: false },
  { id: 12, name: 'Recordatorio cita previa ITV', date: '2025-09-10', status: 'pending', deadline: '4 días', type: 'DGT', isActive: true, isDueSoon: true },
];

const ClientDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);

  const stats = useMemo(() => {
    const activeDocs = mockDocuments.filter(d => d.isActive).length;
    const urgentDocs = mockDocuments.filter(d => d.status === 'urgent').length;
    const completedDocs = mockDocuments.filter(d => d.status === 'completed').length;
    const dueSoonDocs = mockDocuments.filter(d => d.isDueSoon && d.isActive).length;
    return {
      active: { count: activeDocs, label: 'Documentos Activos', icon: <FileText />, color: 'text-blue-600', filter: 'active' },
      urgent: { count: urgentDocs, label: 'Pendientes Urgentes', icon: <Clock />, color: 'text-red-600', filter: 'urgent' },
      completed: { count: completedDocs, label: 'Completados', icon: <CheckCircle />, color: 'text-green-600', filter: 'completed' },
      dueSoon: { count: dueSoonDocs, label: 'Próximos Vencimientos', icon: <Calendar />, color: 'text-orange', filter: 'dueSoon' },
    };
  }, []);

  const filteredDocuments = useMemo(() => {
    if (!activeFilter) return mockDocuments;
    switch (activeFilter) {
      case 'active':
        return mockDocuments.filter(d => d.isActive);
      case 'urgent':
        return mockDocuments.filter(d => d.status === 'urgent');
      case 'completed':
        return mockDocuments.filter(d => d.status === 'completed');
      case 'dueSoon':
        return mockDocuments.filter(d => d.isDueSoon && d.isActive);
      default:
        return mockDocuments;
    }
  }, [activeFilter]);
  
  const handleFilterClick = (filter) => {
    setActiveFilter(current => current === filter ? null : filter);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'urgent': return { text: 'Urgente', class: 'status-urgent' };
      case 'pending': return { text: 'Pendiente', class: 'status-pending' };
      case 'completed': return { text: 'Completado', class: 'status-completed' };
      default: return { text: status, class: '' };
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {Object.values(stats).map((stat, index) => (
          <motion.button
            key={index}
            onClick={() => handleFilterClick(stat.filter)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`stats-card text-center ${activeFilter === stat.filter ? 'ring-2 ring-orange' : ''}`}
          >
            <div className={`${stat.color} mb-3`}>
              {React.cloneElement(stat.icon, { className: 'h-8 w-8 mx-auto' })}
            </div>
            <div className="stats-number">{stat.count}</div>
            <div className="stats-label">{stat.label}</div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="document-card mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-neutral-800">
            {activeFilter ? `Documentos: ${stats[Object.keys(stats).find(key => stats[key].filter === activeFilter)].label}` : 'Todos los Documentos'}
          </h2>
          <div className="flex items-center gap-4">
            {activeFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveFilter(null)}
                className="btn-secondary"
              >
                <FilterX className="h-4 w-4 mr-2" />
                Quitar Filtro
              </Button>
            )}
            <Button 
              className="btn-secondary"
              onClick={() => toast({
                title: "🚧 Esta función no está implementada aún",
                description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
              })}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Nuevo
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => {
            const badge = getStatusBadge(doc.status);
            return (
              <div key={doc.id} className="flex flex-wrap items-center justify-between p-4 bg-neutral-50 rounded-xl gap-4">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-orange" />
                  <div>
                    <h3 className="font-semibold text-neutral-800">{doc.name}</h3>
                    <p className="text-sm text-neutral-500">
                      {doc.type} • {new Date(doc.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`status-badge ${badge.class}`}>
                    {badge.text}
                  </span>
                  <span className="text-sm text-neutral-600">
                    {doc.deadline}
                  </span>
                  <Button 
                    size="sm" 
                    className="btn-secondary"
                    onClick={() => navigate(`/cases/${doc.id}`)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            )
          }) : (
            <div className="text-center py-8">
              <p className="text-neutral-500">No hay documentos que coincidan con el filtro seleccionado.</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="document-card"
        >
          <h3 className="text-xl font-bold text-neutral-800 mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            {[
              'Descargar todos los documentos',
              'Exportar historial de trámites',
              'Configurar notificaciones',
            ].map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => toast({
                  title: "🚧 Esta función no está implementada aún",
                  description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
                })}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                {action}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="document-card"
        >
          <h3 className="text-xl font-bold text-neutral-800 mb-4">
            Soporte y Ayuda
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-orange" />
              <span className="text-neutral-700">soporte@traductorburocratico.es</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-orange" />
              <span className="text-neutral-700">900 123 456</span>
            </div>
            <Button 
              className="btn-primary w-full"
              onClick={() => navigate('/support')}
            >
              Contactar Soporte
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;