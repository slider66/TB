import React from 'react';
import { NavLink } from 'react-router-dom';

const FooterLink = ({ to, children }) => (
  <li>
    <NavLink to={to} className="hover:text-orange transition-colors">
      {children}
    </NavLink>
  </li>
);

function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-bold text-gradient">
              Traductor Burocrático
            </span>
            <p className="text-neutral-400 mt-4">
              Simplificamos la burocracia para que puedas centrarte en lo importante.
            </p>
          </div>
          <div>
            <span className="font-semibold text-white mb-4 block">Servicios</span>
            <ul className="space-y-2 text-neutral-400">
              <li>Análisis de Documentos</li>
              <li>Checklist de Acciones</li>
              <li>Conexión con Profesionales</li>
              <li>Gestión de Trámites</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-white mb-4 block">Soporte</span>
            <ul className="space-y-2 text-neutral-400">
              <FooterLink to="/support">Centro de Ayuda</FooterLink>
              <FooterLink to="/support">Contacto</FooterLink>
              <FooterLink to="/faq">Preguntas Frecuentes</FooterLink>
              <FooterLink to="/terms">Términos y Condiciones</FooterLink>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-white mb-4 block">Contacto</span>
            <ul className="space-y-2 text-neutral-400">
              <li>hola@traductorburocratico.com</li>
              <li>(+34) 600 36 72 17</li>
              <li>Madrid, España</li>
            </ul>
          </div>
        </div>
        <div className="section-divider my-8"></div>
        <div className="text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Traductor Burocrático. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;