import React from 'react';
import { useApp } from '../context/AppContext';
import { Treatment, Hospital, Doctor, TreatmentPackage } from '../types';
import { HospitalCard } from '../components/HospitalCard';
import { DoctorCard } from '../components/DoctorCard';
import { PackageCard } from '../components/PackageCard';
import {
  ShieldCheck,
  Building2,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Info,
  Layers,
  HeartPulse
} from 'lucide-react';

interface TreatmentDetailPageProps {
  slug: string;
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { treatment?: string; hospital?: string; doctor?: string }) => void;
}

export const TreatmentDetailPage: React.FC<TreatmentDetailPageProps> = ({
  slug,
  navigate,
  openEnquiryModal
}) => {
  const { treatments, hospitals, doctors, packages, formatPrice } = useApp();

  const treatment = treatments.find(t => t.slug === slug);

  if (!treatment) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-['Poppins']">Treatment Not Found</h2>
        <p className="text-sm text-slate-500">The requested treatment speciality could not be located.</p>
        <button
          onClick={() => navigate('/treatments')}
          className="px-4 py-2 bg-[#2F80C9] text-white rounded-lg text-sm cursor-pointer"
        >
          View All Treatments
        </button>
      </div>
    );
  }

  // Linked entities
  const relatedHospitals = hospitals.filter(
    h => h.published && (h.treatments.includes(treatment.id) || h.treatments.includes(treatment.slug))
  );

  const relatedDoctors = doctors.filter(
    d => d.published && (d.relatedTreatments.includes(treatment.id) || d.relatedTreatments.includes(treatment.slug))
  );

  const relatedPackages = packages.filter(
    p => p.published && (p.treatmentId === treatment.id || p.treatmentName === treatment.name)
  );

  return (
    <div className="min-h-screen bg-[#F5FAFD] pb-20">
      {/* Header Banner */}
      <div className="relative bg-slate-900 text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={treatment.coverImage}
            alt={treatment.name}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs text-sky-300 uppercase font-bold tracking-wider">
              <span>{treatment.category}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] tracking-tight">
              {treatment.name} in India
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {treatment.shortDescription}
            </p>

            {/* Quick Indicative Metrics Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                <div className="text-sky-200 text-[10px] uppercase font-semibold">Indicative Cost</div>
                <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">
                  {formatPrice(treatment.indicativeCostMinUSD)} – {formatPrice(treatment.indicativeCostMaxUSD)}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                <div className="text-sky-200 text-[10px] uppercase font-semibold">Hospital Stay</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {treatment.typicalHospitalStay}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 col-span-2 sm:col-span-1">
                <div className="text-sky-200 text-[10px] uppercase font-semibold">Overall India Stay</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {treatment.expectedIndiaStay}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openEnquiryModal({ treatment: treatment.name })}
                className="px-6 py-3 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Get Treatment Estimate for {treatment.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20 space-y-12">
        {/* Cost Transparency Box (Mandatory Requirement) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
                Financial Transparency
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Poppins']">
                Indicative Treatment Pricing & Inclusions
              </h2>
            </div>
            <div className="bg-sky-50 text-[#0B5A91] px-4 py-2 rounded-xl text-xs font-bold border border-sky-100 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-[#2F80C9]" />
              <span>Label: Indicative Cost</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center text-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                Typical Inclusions:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {treatment.costInclusions.map((inc: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center text-rose-700">
                <XCircle className="w-4 h-4 mr-1.5 text-rose-500" />
                Standard Exclusions:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {treatment.costExclusions.map((exc: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mandatory Disclaiming Sentence */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Important Notice: </strong>
              {treatment.costNotes} Final treatment cost is determined after clinical evaluation and hospital confirmation.
            </div>
          </div>
        </div>

        {/* Procedures & Conditions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
              Common Procedures Under {treatment.name}
            </h3>
            <div className="space-y-2">
              {treatment.procedures.map((proc: string, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 font-medium flex items-center justify-between"
                >
                  <span>{proc}</span>
                  <span className="text-[11px] text-[#2F80C9] font-semibold">Accredited</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
              Conditions Treated
            </h3>
            <div className="space-y-2">
              {treatment.conditionsTreated.map((cond: string, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{cond}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clinical Overview & Why Consider India */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 font-['Poppins']">
            Clinical Overview
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {treatment.overview}
          </p>
          <div className="pt-2">
            <h4 className="text-sm font-bold text-[#0B5A91] mb-1">
              Why Global Patients Choose India for {treatment.name}:
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {treatment.whyConsiderIndia}
            </p>
          </div>
        </div>

        {/* Pre-evaluated Packages */}
        {relatedPackages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 font-['Poppins']">
                Indicative Treatment Packages
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPackages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onEnquire={name => openEnquiryModal({ treatment: name })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Leading Hospitals for this treatment */}
        {relatedHospitals.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 font-['Poppins']">
              Leading Partner Hospitals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedHospitals.map(hospital => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onSelect={s => navigate(`/hospitals/${s}`)}
                  onEnquire={name => openEnquiryModal({ hospital: name })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Specialists */}
        {relatedDoctors.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 font-['Poppins']">
              Specialist Faculty
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDoctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onSelect={s => navigate(`/doctors/${s}`)}
                  onEnquire={name => openEnquiryModal({ doctor: name })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Treatment Specific FAQs */}
        {treatment.faqs.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-['Poppins']">
              Clinical FAQs for {treatment.name}
            </h3>
            <div className="space-y-3">
              {treatment.faqs.map((faq: { question: string; answer: string }, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-sm font-semibold text-slate-800">{faq.question}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
