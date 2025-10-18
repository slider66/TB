import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openPreferences, hideBanner } = useCookieConsent();

  const handleCookiePreferences = () => {
    hideBanner();
    openPreferences();
  };

  const footerLinks = {
    Producto: [
      { text: 'Precios', to: '/pricing' },
      { text: 'Cómo funciona', to: '/#features' },
      { text: 'Empezar', to: '/order' },
    ],
    Empresa: [
      { text: 'Partners', to: '/partners' },
      { text: 'Contacto', to: '/contact' },
    ],
    Recursos: [
      { text: 'Preguntas Frecuentes', to: '/faq' },
      { text: 'Soporte', to: '/support' },
    ],
    Legal: [
      { text: 'Términos de Servicio', to: '/terms' },
      { text: 'Política de Privacidad', to: '/privacy-policy' },
      { text: 'Política de Cookies', to: '/cookies-policy' },
      { text: 'Gestionar cookies', type: 'button', onClick: handleCookiePreferences },
    ],
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1 mb-8 lg:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <img src="https://horizons-cdn.hostinger.com/5d895b2d-33c5-4462-8a9e-665d2e957763/806325b9ee47551f89d11b2417c2653a.png" alt="Traductor Burocrático Logo" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-neutral-400">
              Entiende tus trámites sin estrés.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="font-semibold text-white mb-4">{title}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.text}>
                    {link.type === 'button' ? (
                      <button
                        type="button"
                        onClick={link.onClick}
                        className="hover:text-white transition-colors duration-300"
                      >
                        {link.text}
                      </button>
                    ) : (
                      <Link to={link.to} className="hover:text-white transition-colors duration-300">
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500 mb-4 md:mb-0">
            &copy; {currentYear} Traductor Burocrático. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-300">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-300">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-300">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
