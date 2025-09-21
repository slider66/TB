
import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { Link } from 'react-router-dom';

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceptar"
      declineButtonText="Rechazar"
      cookieName="traductorBurocraticoCookieConsent"
      style={{
        background: 'linear-gradient(to right, #1f2937, #111827)',
        color: '#f9fafb',
        padding: '15px',
        fontSize: '15px',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
        alignItems: 'center',
      }}
      buttonStyle={{
        backgroundColor: '#f97316',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '10px 20px',
      }}
      declineButtonStyle={{
        backgroundColor: '#4b5563',
        color: 'white',
        fontSize: '14px',
        borderRadius: '8px',
        padding: '10px 20px',
      }}
      expires={150}
      enableDeclineButton
    >
      Este sitio web utiliza cookies para mejorar la experiencia del usuario. Al utilizar nuestro sitio web, usted acepta todas las cookies de acuerdo con nuestra{' '}
      <Link to="/cookies-policy" style={{ color: '#fb923c', textDecoration: 'underline' }}>
        Política de Cookies
      </Link>.
    </CookieConsent>
  );
};

export default CookieConsentBanner;
