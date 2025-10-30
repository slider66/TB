import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import OrderFlow from '@/components/order/OrderFlow';

const MisCasos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      fetchCases();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          services:service_id (name),
          case_details (*)
        `)
        .eq('client_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cases:', error);
        setCases([]);
      } else {
        setCases(data || []);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { label: 'Nuevo', icon: FileText, color: 'bg-blue-100 text-blue-800' },
      awaiting_docs: { label: 'Esperando Documentos', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      in_review: { label: 'En Revisión', icon: AlertCircle, color: 'bg-orange-100 text-orange-800' },
      needs_info: { label: 'Requiere Información', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
      completed: { label: 'Completado', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      closed: { label: 'Cerrado', icon: XCircle, color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.new;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { label: 'Baja', color: 'bg-gray-100 text-gray-600' },
      normal: { label: 'Normal', color: 'bg-blue-100 text-blue-600' },
      high: { label: 'Alta', color: 'bg-orange-100 text-orange-600' },
      urgent: { label: 'Urgente', color: 'bg-red-100 text-red-600' }
    };

    const config = priorityConfig[priority] || priorityConfig.normal;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredCases = cases.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'open') return ['new', 'awaiting_docs', 'in_review', 'needs_info'].includes(c.status);
    if (filter === 'closed') return ['completed', 'closed'].includes(c.status);
    return c.status === filter;
  });

  const counts = {
    all: cases.length,
    open: cases.filter(c => ['new', 'awaiting_docs', 'in_review', 'needs_info'].includes(c.status)).length,
    closed: cases.filter(c => ['completed', 'closed'].includes(c.status)).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange" />
      </div>
    );
  }

  // Si no hay casos, mostrar el flujo completo de pedido
  if (cases.length === 0) {
    return <OrderFlow embedded={true} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Mis Casos</h2>
        <p className="text-neutral-600">Gestiona y visualiza el estado de tus traducciones</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-orange text-white'
              : 'bg-white text-neutral-700 border border-neutral-200 hover:border-orange'
          }`}
        >
          Todos ({counts.all})
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'open'
              ? 'bg-orange text-white'
              : 'bg-white text-neutral-700 border border-neutral-200 hover:border-orange'
          }`}
        >
          Abiertos ({counts.open})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'closed'
              ? 'bg-orange text-white'
              : 'bg-white text-neutral-700 border border-neutral-200 hover:border-orange'
          }`}
        >
          Cerrados ({counts.closed})
        </button>
      </div>

      {/* Lista de casos */}
      <div className="grid gap-4">
          {filteredCases.map((caso, index) => (
            <motion.div
              key={caso.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/cases/${caso.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="h-5 w-5 text-orange mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-neutral-800">
                          {caso.title || `Caso #${caso.id.slice(0, 8)}`}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          Servicio: {caso.services?.name || 'N/A'}
                        </p>
                        {caso.description && (
                          <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                            {caso.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(caso.status)}
                      {getPriorityBadge(caso.priority)}
                      {caso.due_date && (
                        <Badge className="bg-purple-100 text-purple-700">
                          <Clock className="h-3 w-3 mr-1" />
                          Vence: {new Date(caso.due_date).toLocaleDateString('es-ES')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-neutral-500 text-right">
                    <p>Creado:</p>
                    <p className="font-medium">
                      {new Date(caso.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default MisCasos;
