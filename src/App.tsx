import { Routes, Route } from 'react-router-dom';

import DisclaimerNotice from './components/common/DisclaimerNotice';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import DashboardPage from './pages/dashboard/DashboardPage';
import HomePage from './pages/home/HomePage';
import PartnersPage from './pages/partners/PartnersPage';
import ContactPage from './pages/responsibility/ContactPage';
import NotFoundPage from './pages/system/NotFoundPage';

const App = () => {
  return (
    <div className="min-h-screen bg-tb-bg-base text-tb-text-base">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-tb-primary focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Saltar al contenido principal
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <DisclaimerNotice />
        <main id="main-content" className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/panel" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
