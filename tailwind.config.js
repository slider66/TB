/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Traductor Burocrático Design Tokens
        tb: {
          // Primarios
          primary: '#FF6600',
          primaryHover: '#FF8533',
          primaryActive: '#E65C00',
          disabled: '#FFD8B0',
          // Textos
          text: {
            base: '#1C1C1C',
            muted: '#5C5C5C',
            inverse: '#FFFFFF',
          },
          // Fondos
          bg: {
            base: '#FFFFFF',
            alt: '#FAFAFA',
            card: '#FFFFFF',
          },
          // Bordes
          border: {
            subtle: '#E5E5E5',
          },
          // Estados
          state: {
            success: '#1FA971',
            warning: '#D97706',
            error: '#DC2626',
          },
        },
        // Alias para compatibilidad (deprecados - migrar a tb.*)
        'primary-orange': '#FF6600',
        'primary-orange-light': '#FF8533',
        'primary-orange-dark': '#E65C00',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        ui: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.05)',
        button: '0 2px 6px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xs: '8px',
        sm: '10px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      spacing: {
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
      },
      fontSize: {
        h1: ['34px', { lineHeight: '40px', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '36px', fontWeight: '600' }],
        h3: ['22px', { lineHeight: '30px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        small: ['14px', { lineHeight: '20px', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '18px', fontWeight: '400' }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ],
}
