import React from 'react';
import { useApp } from '../context/AppContext';
import { Treatment } from '../types';
import {
  ArrowRight,
  HeartPulse,
  Activity,
  Shield,
  Cpu,
  RefreshCw,
  Users,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  HeartPulse,
  Activity,
  Shield,
  Cpu,
  RefreshCw,
  Users
};

interface TreatmentCardProps {
  treatment: Treatment;
  onSelect: (slug: string) => void;
  onEnquire: (treatmentName: string) => void;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment, onSelect, onEnquire }) => {
  const { formatPrice } = useApp();
  const IconComponent = ICON_MAP[treatment.iconName] || Activity;

  return (
    <div
      id={`treatment-card-${treatment.slug}`}
      className="bg-white rounded-2xl overflow-hidden subtle-card-shadow border border-slate-100/80 hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col group"
    >
      {/* Visual Header with Real Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={treatment.coverImage}
          alt={treatment.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

        {/* Floating Category Pill */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#0B5A91] shadow-xs flex items-center space-x-1">
          <IconComponent className="w-3 h-3 text-[#2F80C9]" />
          <span>{treatment.category}</span>
        </div>

        {/* Indicative Cost Badge */}
        <div className="absolute bottom-3 right-3 bg-[#0B5A91]/90 backdrop-blur-md px-3 py-1 rounded-lg text-white text-right shadow-sm">
          <div className="text-[10px] text-sky-200 font-medium tracking-tight uppercase">Indicative Cost</div>
          <div className="text-sm font-bold font-mono">
            {formatPrice(treatment.indicativeCostMinUSD)} – {formatPrice(treatment.indicativeCostMaxUSD)}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            onClick={() => onSelect(treatment.slug)}
            className="text-lg font-bold text-slate-900 hover:text-[#2F80C9] transition-colors cursor-pointer line-clamp-1 font-['Poppins']"
          >
            {treatment.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {treatment.shortDescription}
          </p>

          {/* Key Procedures Preview */}
          <div className="mt-3.5 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              Common Procedures:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {treatment.procedures.slice(0, 3).map((proc, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-sky-50 text-[#0B5A91] border border-sky-100 line-clamp-1"
                >
                  {proc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stays & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>India Stay: {treatment.expectedIndiaStay}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelect(treatment.slug)}
              className="font-medium text-[#2F80C9] hover:text-[#0B5A91] inline-flex items-center text-xs cursor-pointer group/btn"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3 ml-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onEnquire(treatment.name)}
              className="px-2.5 py-1 rounded-md bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
