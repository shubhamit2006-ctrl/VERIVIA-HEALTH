import React from 'react';
import { useApp } from '../context/AppContext';
import { PackageCard } from '../components/PackageCard';
import {
  Award,
  Building2,
  Calendar,
  Languages,
  ArrowRight,
  ShieldCheck,
  Video,
  CheckCircle2,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface DoctorDetailPageProps {
  slug: string;
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { doctor?: string; hospital?: string; treatment?: string }) => void;
}

export const DoctorDetailPage: React.FC<DoctorDetailPageProps> = ({
  slug,
  navigate,
  openEnquiryModal
}) => {
  const { doctors, packages, hospitals } = useApp();

  const doctor = doctors.find(d => d.slug === slug);

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-['Poppins']">Doctor Profile Not Found</h2>
        <button
          onClick={() => navigate('/doctors')}
          className="px-4 py-2 bg-[#2F80C9] text-white rounded-lg text-sm cursor-pointer"
        >
          View All Specialists
        </button>
      </div>
    );
  }

  const doctorPackages = packages.filter(
    p => p.published && (p.doctorId === doctor.id || p.doctorName === doctor.name)
  );

  return (
    <div className="min-h-screen bg-[#F5FAFD] pb-20">
      {/* Header Profile Hero */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Doctor Photo */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl overflow-hidden bg-slate-800 border-2 border-sky-400/40 shadow-2xl shrink-0">
              <img
                src={doctor.photograph || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'}
                alt={doctor.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Core Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{doctor.speciality} • {doctor.experienceYears}+ Years Clinical Practice</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] text-white">
                {doctor.name}
              </h1>

              <p className="text-base text-sky-200 font-medium">{doctor.designation}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-sky-400 mr-1.5" />
                  <span>{doctor.hospitalName}</span>
                </div>
                <div className="flex items-center">
                  <Languages className="w-4 h-4 text-sky-400 mr-1.5" />
                  <span>Languages: {doctor.languages.join(', ')}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={() => openEnquiryModal({ doctor: doctor.name, hospital: doctor.hospitalName })}
                  className="px-6 py-2.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Request Second Opinion from {doctor.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20 space-y-10">
        {/* Biography & Credentials */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Poppins'] mb-3">
              Professional Biography
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {doctor.biography}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            {/* Education */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#0B5A91] uppercase tracking-wider flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Medical Qualifications & Fellowships
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {doctor.education.map((edu: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications & Awards */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center">
                <Award className="w-4 h-4 mr-2 text-emerald-600" />
                Accreditations, Honours & Volume
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {doctor.certifications.map((cert: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Areas of Expertise & Surgical Procedures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
              Clinical Areas of Expertise
            </h3>
            <div className="space-y-2">
              {doctor.expertise.map((item: string, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-[#2F80C9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
              Documented Procedures
            </h3>
            <div className="space-y-2">
              {doctor.procedures.map((proc: string, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 text-xs sm:text-sm text-[#0B5A91] font-medium flex items-center justify-between"
                >
                  <span>{proc}</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded text-slate-500 font-semibold border border-slate-200">
                    High Volume
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Packages supervised by this doctor */}
        {doctorPackages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 font-['Poppins']">
              Treatment Packages by {doctor.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {doctorPackages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onEnquire={name => openEnquiryModal({ doctor: doctor.name, treatment: name })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
