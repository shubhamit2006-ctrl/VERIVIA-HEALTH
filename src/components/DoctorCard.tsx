import React from 'react';
import { Doctor } from '../types';
import {
  Award,
  Building2,
  Calendar,
  Languages,
  ArrowRight,
  ShieldCheck,
  Video
} from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (slug: string) => void;
  onEnquire: (doctorName: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, onEnquire }) => {
  return (
    <div
      id={`doctor-card-${doctor.slug}`}
      className="bg-white rounded-2xl overflow-hidden subtle-card-shadow border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      <div className="p-6 flex items-start gap-4">
        {/* Doctor Photo */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
          <img
            src={doctor.photograph || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'}
            alt={doctor.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/70 to-transparent p-1 text-center">
            <span className="text-[10px] font-bold text-white font-mono">
              {doctor.experienceYears}+ Yrs Exp
            </span>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 text-[11px] font-semibold text-[#0B5A91] mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="truncate">{doctor.speciality}</span>
          </div>
          <h3
            onClick={() => onSelect(doctor.slug)}
            className="text-base sm:text-lg font-bold text-slate-900 hover:text-[#2F80C9] transition-colors cursor-pointer font-['Poppins'] truncate"
          >
            {doctor.name}
          </h3>
          <p className="text-xs text-slate-600 font-medium line-clamp-1">
            {doctor.designation}
          </p>

          <div className="flex items-center text-xs text-slate-500 mt-1.5 line-clamp-1">
            <Building2 className="w-3.5 h-3.5 mr-1 text-sky-600 shrink-0" />
            <span className="truncate">{doctor.hospitalName}</span>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-2">
            <span className="bg-sky-50 text-[#0B5A91] px-2 py-0.5 rounded font-medium truncate">
              {doctor.subSpeciality}
            </span>
          </div>
        </div>
      </div>

      {/* Expertise tags */}
      <div className="px-6 pb-4 flex-1">
        <div className="text-[11px] font-semibold text-slate-500 mb-1">Key Focus Areas:</div>
        <div className="flex flex-wrap gap-1.5">
          {doctor.expertise.slice(0, 3).map((exp, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700"
            >
              {exp}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center text-[11px] text-slate-500">
          <Video className="w-3.5 h-3.5 mr-1 text-[#2F80C9]" />
          <span>Tele-Review Available</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelect(doctor.slug)}
            className="text-xs font-semibold text-[#0B5A91] hover:underline cursor-pointer"
          >
            Profile
          </button>
          <button
            onClick={() => onEnquire(`Consultation with ${doctor.name}`)}
            className="px-3 py-1 rounded-lg bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Book Opinion
          </button>
        </div>
      </div>
    </div>
  );
};
