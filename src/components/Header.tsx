import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../initialData';
import { CurrencyCode } from '../types';
import { VeriviaLogo } from './VeriviaLogo';
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  Search,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  ShieldCheck,
  Building2,
  Stethoscope,
  Activity,
  Home,
  FileSpreadsheet,
  Lock
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { treatment?: string; hospital?: string; doctor?: string }) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate, openEnquiryModal }) => {
  const { brand, selectedCurrency, setSelectedCurrency } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Treatments', route: '/treatments' },
    { label: 'Hospitals', route: '/hospitals' },
    { label: 'Specialists', route: '/doctors' },
    { label: 'Treatment Packages', route: '/packages' },
    { label: 'Recovery & Stay', route: '/stay' },
    { label: 'How It Works', route: '/how-it-works' },
    { label: 'Patient Stories', route: '/testimonials' },
    { label: 'FAQs', route: '/faqs' }
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-200 shadow-xs">
      {/* Top International Strip */}
      <div className="bg-[#0B5A91] text-white py-1.5 px-4 sm:px-8 text-xs font-normal">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-sky-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Accredited International Patient Facilitation
            </span>
            <span className="hidden md:inline text-sky-200/60">|</span>
            <span className="hidden md:inline text-sky-100">
              JCI & NABH Partner Networks
            </span>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            {/* Phone & WhatsApp Quick Links */}
            <a
              href={`tel:${brand.phone}`}
              className="inline-flex items-center text-sky-100 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-sky-300" />
              <span className="hidden sm:inline">{brand.phone}</span>
            </a>
            <a
              href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20would%20like%20to%20enquire%20about%20medical%20treatment%20in%20India.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-emerald-300 hover:text-emerald-200 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1 fill-emerald-400/20" />
              WhatsApp
            </a>

            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="inline-flex items-center px-2 py-0.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer transition-colors"
              >
                <Globe className="w-3 h-3 mr-1 text-sky-200" />
                <span>{selectedCurrency}</span>
                <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
              </button>

              {currencyDropdownOpen && (
                <div
                  id="currency-dropdown-menu"
                  className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg shadow-xl py-1 text-slate-800 text-xs border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Display Currency
                  </div>
                  {Object.keys(CURRENCIES).map(cKey => {
                    const code = cKey as CurrencyCode;
                    return (
                      <button
                        key={code}
                        id={`currency-option-${code}`}
                        onClick={() => {
                          setSelectedCurrency(code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-sky-50 flex items-center justify-between cursor-pointer ${
                          selectedCurrency === code ? 'text-[#2F80C9] font-bold bg-sky-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{code}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{CURRENCIES[code].symbol}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Admin link */}
            <button
              id="header-admin-link"
              onClick={() => handleNavClick('/admin')}
              className="text-sky-200/80 hover:text-white inline-flex items-center text-[11px] pl-2 border-l border-white/20 cursor-pointer"
              title="Staff Portal / CMS"
            >
              <Lock className="w-3 h-3 mr-0.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          id="brand-logo-container"
          onClick={() => handleNavClick('/')}
          className="flex items-center cursor-pointer group py-0.5"
          title="VERIVIA HEALTH - Your Global Gateway to Trusted Healthcare in India"
        >
          <VeriviaLogo
            variant="header"
            logoSrc={brand.logoUrl || '/verivia-header-logo.svg'}
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1 font-medium text-sm text-slate-700">
          {navLinks.slice(0, 6).map(link => {
            const isActive = currentRoute === link.route || currentRoute.startsWith(`${link.route}/`);
            return (
              <button
                key={link.route}
                id={`nav-${link.route.replace('/', '')}`}
                onClick={() => handleNavClick(link.route)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#2F80C9] bg-sky-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Header Action CTAs */}
        <div className="hidden lg:flex items-center space-x-3">
          <button
            id="header-cta-explore"
            onClick={() => handleNavClick('/treatments')}
            className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-[#0B5A91] hover:bg-sky-50/60 rounded-lg transition-colors cursor-pointer"
          >
            Explore
          </button>
          <button
            id="header-cta-get-plan"
            onClick={() => openEnquiryModal()}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#2F80C9] hover:bg-[#0B5A91] rounded-lg shadow-sm shadow-sky-600/20 transition-all hover:shadow-md cursor-pointer flex items-center space-x-1.5"
          >
            <span>{brand.primaryCtaText || 'Get a Treatment Plan'}</span>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center xl:hidden space-x-2">
          <button
            id="mobile-plan-button-quick"
            onClick={() => openEnquiryModal()}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2F80C9] rounded-lg cursor-pointer"
          >
            Enquire
          </button>
          <button
            id="mobile-menu-toggle-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map(link => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#2F80C9] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openEnquiryModal();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2F80C9] text-white font-medium text-sm text-center shadow-xs"
            >
              {brand.primaryCtaText || 'Get a Treatment Plan'}
            </button>
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs text-center flex items-center justify-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
