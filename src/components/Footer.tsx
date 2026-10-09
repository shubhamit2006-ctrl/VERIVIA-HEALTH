import React from 'react';
import { useApp } from '../context/AppContext';
import { VeriviaLogo } from './VeriviaLogo';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Heart,
  Lock,
  Globe
} from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
  openEnquiryModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, openEnquiryModal }) => {
  const { brand, treatments } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <VeriviaLogo
                variant="footer"
                inverted={true}
                showTagline={false}
                logoSrc={brand.logoUrl || '/verivia-footer-logo.svg'}
                onClick={() => navigate('/')}
              />
            </div>
            <p className="text-xs sm:text-sm font-medium text-white/95 tracking-wide">
              {brand.tagline || 'Your Global Gateway to Trusted Healthcare in India'}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {brand.footerText}
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{brand.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${brand.phone}`} className="hover:text-white transition-colors">{brand.phone}</a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${brand.email}`} className="hover:text-white transition-colors">{brand.email}</a>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-600/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Official WhatsApp Desk
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Explore Care</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/treatments')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  All Treatments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/hospitals')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Accredited Hospitals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/doctors')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Distinguished Doctors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/packages')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Indicative Treatment Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/stay')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Hotels & Recuperation Stay
                </button>
              </li>
            </ul>
          </div>

          {/* Specialities */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Key Specialities</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {treatments.filter(t => t.published).slice(0, 5).map(t => (
                <li key={t.id}>
                  <button
                    onClick={() => navigate(`/treatments/${t.slug}`)}
                    className="hover:text-sky-400 transition-colors cursor-pointer line-clamp-1 text-left"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* International Support & Admin */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Patient Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('/how-it-works')} className="hover:text-white cursor-pointer">
                  Treatment Journey (13 Steps)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faqs')} className="hover:text-white cursor-pointer">
                  Medical Visa & Travel FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/testimonials')} className="hover:text-white cursor-pointer">
                  Global Patient Testimonials
                </button>
              </li>
              <li>
                <button onClick={openEnquiryModal} className="text-sky-400 font-medium hover:underline cursor-pointer">
                  Request Free Second Opinion
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => navigate('/admin')}
                  className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center cursor-pointer"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Staff Administration CMS
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical & Legal Disclaimer Banner (Mandatory Requirement) */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Legal & Medical Advisory Notice: </span>
              {brand.disclaimerText}
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>{brand.copyrightText}</div>
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-slate-300 cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/terms')} className="hover:text-slate-300 cursor-pointer">
              Terms of Use
            </button>
            <span className="text-slate-400">Quality • Expertise • Trust • Convenience</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
