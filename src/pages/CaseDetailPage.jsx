import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import SummaryBar from '@/components/case/SummaryBar';
import CaseData from '@/components/case/CaseData';
import ClientInfo from '@/components/case/ClientInfo';
import Documents from '@/components/case/Documents';
import PlainLanguage from '@/components/case/PlainLanguage';
import SubmissionChecklist from '@/components/case/SubmissionChecklist';
import Tasks from '@/components/case/Tasks';
import Messages from '@/components/case/Messages';
import PartnerReferral from '@/components/case/PartnerReferral';
import Payments from '@/components/case/Payments';
import AuditHistory from '@/components/case/AuditHistory';
import Permissions from '@/components/case/Permissions';
import KPIs from '@/components/case/KPIs';

const CaseDetailPage = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Mock data for now
    const caseData = {
        id: caseId,
        title: "Requerimiento de la Agencia Tributaria",
        status: "urgent", // 'new', 'pending_client', 'in_progress', 'pending_review', 'referred', 'completed', 'archived', 'urgent'
        sla_due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: "urgent", // 'low', 'medium', 'high', 'urgent'
        owner: "Ana García (Revisor)",
    };

    if (!user) {
        return (
          <div className="min-h-screen flex items-center justify-center text-center px-4 py-20">
            <div>
              <h1 className="text-3xl font-bold text-orange mb-4">Acceso Denegado</h1>
              <p className="text-xl text-neutral-600 mb-8">Debes iniciar sesión para ver los detalles del expediente.</p>
              <Button onClick={() => navigate('/')} className="btn-primary">Volver al Inicio</Button>
            </div>
          </div>
        );
    }
    
    const pageTitle = `Expediente: ${caseData.title} | Traductor Burocrático`;
    const pageDescription = `Gestiona y visualiza los detalles del expediente ${caseId}: ${caseData.title}.`;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button variant="ghost" onClick={() => navigate('/clients')} className="mb-6 text-neutral-600 hover:text-neutral-900">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Mis Expedientes
                    </Button>

                    <h1 className="text-3xl font-bold text-neutral-800 mb-2">Expediente: {caseData.title}</h1>
                    <p className="text-lg text-neutral-500 mb-8">ID: {caseId}</p>

                    <SummaryBar caseData={caseData} />
                </motion.div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <CaseData caseId={caseId} />
                        <Documents caseId={caseId} />
                        <PlainLanguage caseId={caseId} />
                        <SubmissionChecklist caseId={caseId} />
                        <Tasks caseId={caseId} />
                        <Messages caseId={caseId} />
                        <AuditHistory caseId={caseId} />
                    </div>
                    <div className="space-y-8">
                        <ClientInfo caseId={caseId} />
                        <PartnerReferral caseId={caseId} />
                        <Payments caseId={caseId} />
                        <Permissions caseId={caseId} />
                        <KPIs caseId={caseId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseDetailPage;