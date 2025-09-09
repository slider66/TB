
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';
import AdminRoute from '@/components/AdminRoute';
import StickyCta from '@/components/layout/StickyCta';

const HomePage = lazy(() => import('@/pages/HomePage'));
const UploadPage = lazy(() => import('@/pages/UploadPage'));
const ClientsPage = lazy(() => import('@/pages/ClientsPage'));
const PartnersPage = lazy(() => import('@/pages/PartnersPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const AuthConfirmPage = lazy(() => import('@/pages/AuthConfirmPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const PanelPage = lazy(() => import('@/pages/PanelPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const CaseDetailPage = lazy(() => import('@/pages/CaseDetailPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const PaymentCancelledPage = lazy(() => import('@/pages/PaymentCancelledPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

function App() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const closeModals = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  useEffect(() => {
    if (user) {
      closeModals();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={openLogin} />
      <main className="pb-20 md:pb-0">
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-orange" /></div>}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage onUploadClick={openLogin} />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/pricing" element={<PricingPage onStartClick={openLogin} />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/cases/:caseId" element={<CaseDetailPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/auth/confirm" element={<AuthConfirmPage onLoginClick={openLogin} />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/panel" element={<PanelPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/cancelled" element={<PaymentCancelledPage />} />
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <StickyCta onUploadClick={openLogin} />
      <Dialog open={isLoginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 bg-white rounded-xl">
          <Login onLoginSuccess={closeModals} onSwitchToRegister={openRegister} />
        </DialogContent>
      </Dialog>
      <Dialog open={isRegisterOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 bg-white rounded-xl">
          <Register onRegisterSuccess={closeModals} onSwitchToLogin={openLogin} />
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}

export default App;
