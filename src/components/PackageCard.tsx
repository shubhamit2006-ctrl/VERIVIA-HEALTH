import React from 'react';
import { useApp } from '../context/AppContext';
import { TreatmentPackage } from '../types';
import {
  CheckCircle2,
  Building2,
  User,
  Clock,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';

interface PackageCardProps {
  pkg: TreatmentPackage;
  onSelectTreatment?: (treatmentId: string) => void;
  onEnquire: (packageName: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelectTreatment, onEnquire }) => {
  const { formatPrice } = useApp();

  return (
    <div
      id={`package-card-${pkg.id}`}
      className="bg-white rounded-2xl overflow-hidden subtle-card-shadow border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-sky-50/50 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#0B5A91] bg-sky-100/70 px-2.5 py-0.5 rounded-full">
              {pkg.treatmentName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">{pkg.validity}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 font-['Poppins'] leading-snug">
            {pkg.packageName}
          </h3>

          {/* Pricing Highlight */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Indicative Package</span>
              <div className="text-xl sm:text-2xl font-extrabold text-[#0B5A91] font-mono">
                {formatPrice(pkg.minPriceUSD)} – {formatPrice(pkg.maxPriceUSD)}
              </div>
            </div>
          </div>
        </div>

        {/* Core Metadata Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Hospital Stay</div>
              <div className="font-semibold text-slate-800 mt-0.5">{pkg.hospitalStayDays}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">India Stay Total</div>
              <div className="font-semibold text-slate-800 mt-0.5">{pkg.estimatedIndiaStayDays}</div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="font-medium text-slate-800">{pkg.hospitalName}</span>
            </div>
            {pkg.doctorName && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Supervised by: <strong className="text-slate-800">{pkg.doctorName}</strong></span>
              </div>
            )}
          </div>

          {/* Inclusions checklist */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Key Inclusions:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {pkg.inclusions.slice(0, 4).map((inc, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0">
        <div className="text-[10px] text-slate-400 mb-3 leading-tight flex items-start space-x-1">
          <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
          <span>Final quotation is subject to specialist review of recent medical documents.</span>
        </div>
        <button
          onClick={() => onEnquire(pkg.packageName)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <span>Request Detailed Estimate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
