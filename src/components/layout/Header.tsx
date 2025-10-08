import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import CallToAction from '@/components/common/CallToAction';
import { mainNavigation } from '@/data/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-tb-border-subtle bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-tb-primary text-lg font-bold text-white">
            TB
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-tb-text-base">Traductor Burocrático</span>
            <span className="text-sm text-tb-text-muted">
              Entiende qué te pide la Administración, sin jerga.
            </span>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-tb-text-base md:flex">
          {mainNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'text-tb-primary underline decoration-2 underline-offset-8'
                  : 'hover:text-tb-primaryHover'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:block">
          <CallToAction as="link" href="#upload" variant="primary">
            Subir documento
          </CallToAction>
        </div>
        <button
          type="button"
          className="md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Abrir menú</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-6 w-6 text-tb-text-base"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div
        id="mobile-nav"
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} border-t border-tb-border-subtle bg-white`}
      >
        <nav className="flex flex-col gap-2 px-4 py-4 text-sm font-semibold text-tb-text-base">
          {mainNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-[12px] bg-tb-primary/10 px-3 py-2 text-tb-primary'
                  : 'rounded-[12px] px-3 py-2 hover:bg-tb-primary/5'
              }
            >
              {item.label}
            </NavLink>
          ))}
          <CallToAction as="link" href="#upload" variant="primary">
            Subir documento
          </CallToAction>
        </nav>
      </div>
    </header>
  );
};

export default Header;
