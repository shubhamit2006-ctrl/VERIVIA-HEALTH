import React from 'react';
import { Hospital } from '../types';
import {
  MapPin,
  Building2,
  Award,
  Globe2,
  ChevronRight,
  ShieldCheck,
  Languages
} from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  onSelect: (slug: string) => void;
  onEnquire: (hospitalName: string) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onSelect, onEnquire }) => {
  return (
    <div
      id={`hospital-card-${hospital.slug}`}
      className="bg-white rounded-2xl overflow-hidden subtle-card-shadow border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      {/* Cover Image & Accreditations */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={hospital.coverImage}
          alt={hospital.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Accreditations badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {hospital.accreditation.slice(0, 2).map((acc, i) => (
            <span
              key={i}
              className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-[#0B5A91] shadow-xs flex items-center"
            >
              <Award className="w-3 h-3 text-amber-500 mr-1" />
              {acc}
            </span>
          ))}
        </div>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center font-medium drop-shadow-xs">
            <MapPin className="w-3.5 h-3.5 mr-1 text-sky-400 shrink-0" />
            <span className="truncate">{hospital.city}</span>
          </div>
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-[11px]">
            {hospital.beds} Beds
          </span>
        </div>
      </div>

      {/* Hospital details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onSelect(hospital.slug)}
              className="text-lg font-bold text-slate-900 hover:text-[#2F80C9] transition-colors cursor-pointer font-['Poppins'] line-clamp-1"
            >
              {hospital.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {hospital.description}
          </p>

          {/* Key specialities */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hospital.specialities.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-[#0B5A91] border border-sky-100"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* International desk highlights */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center text-slate-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              <span>International Patient Services:</span>
            </div>
            <p className="line-clamp-1 text-slate-500">
              {hospital.internationalServices[0] || 'Airport transfer, visa letters & dedicated coordinators'}
            </p>
          </div>
        </div>

        {/* Airport proximity & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center text-[11px] text-slate-400 line-clamp-1 max-w-[170px]">
            <Globe2 className="w-3.5 h-3.5 mr-1 shrink-0 text-sky-500" />
            <span className="truncate">{hospital.languages.slice(0, 3).join(', ')}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelect(hospital.slug)}
              className="px-2.5 py-1 text-xs font-semibold text-[#0B5A91] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => onEnquire(hospital.name)}
              className="px-3 py-1 text-xs font-semibold text-white bg-[#2F80C9] hover:bg-[#0B5A91] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
