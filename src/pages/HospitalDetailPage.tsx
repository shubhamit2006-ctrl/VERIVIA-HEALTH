import React from 'react';
import { useApp } from '../context/AppContext';
import { DoctorCard } from '../components/DoctorCard';
import { PackageCard } from '../components/PackageCard';
import {
  Building2,
  MapPin,
  Award,
  Globe,
  Phone,
  Mail,
  Plane,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Languages,
  Calendar
} from 'lucide-react';

interface HospitalDetailPageProps {
  slug: string;
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { hospital?: string; doctor?: string; treatment?: string }) => void;
}

export const HospitalDetailPage: React.FC<HospitalDetailPageProps> = ({
  slug,
  navigate,
  openEnquiryModal
}) => {
  const { hospitals, doctors, packages, hotels } = useApp();

  const hospital = hospitals.find(h => h.slug === slug);

  if (!hospital) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-['Poppins']">Hospital Not Found</h2>
        <button
          onClick={() => navigate('/hospitals')}
          className="px-4 py-2 bg-[#2F80C9] text-white rounded-lg text-sm cursor-pointer"
        >
          View All Hospitals
        </button>
      </div>
    );
  }

  const hospitalDoctors = doctors.filter(
    d => d.published && (d.hospitalId === hospital.id || d.hospitalName === hospital.name)
  );

  const hospitalPackages = packages.filter(
    p => p.published && (p.hospitalId === hospital.id || p.hospitalName === hospital.name)
  );

  const nearbyHotels = hotels.filter(
    ht => ht.published && (ht.associatedHospitalIds?.includes(hospital.id) || ht.city === hospital.city)
  );

  return (
    <div className="min-h-screen bg-[#F5FAFD] pb-20">
      {/* Hero Banner */}
      <div className="relative bg-slate-900 text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={hospital.coverImage}
            alt={hospital.name}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap gap-2">
              {hospital.accreditation.map((acc: string, i: number) => (
                <span
                  key={i}
                  className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-200 border border-white/15"
                >
                  {acc}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] tracking-tight">
              {hospital.name}
            </h1>

            <div className="flex items-center space-x-2 text-slate-300 text-sm">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{hospital.address}</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <div className="bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-slate-400">Capacity: </span>
                <strong className="text-white">{hospital.beds} Beds</strong>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-slate-400">Established: </span>
                <strong className="text-white">{hospital.establishedYear}</strong>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-slate-400">Airport Proximity: </span>
                <strong className="text-white">{hospital.airportDistance}</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openEnquiryModal({ hospital: hospital.name })}
                className="px-6 py-3 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Request Treatment Quote at {hospital.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20 space-y-10">
        {/* Overview & Facilities */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Poppins'] mb-2">
              About the Institution
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {hospital.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            {/* Facilities */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#0B5A91] uppercase tracking-wider">
                Advanced Facilities & Technology
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {hospital.facilities.map((fac: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* International Patient Services */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                Dedicated International Patient Desk
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {hospital.internationalServices.map((srv: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {hospital.gallery && hospital.gallery.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 font-['Poppins']">Hospital Campus & Suites</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {hospital.gallery.map((img: string, i: number) => (
                <div key={i} className="h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={img}
                    alt={`${hospital.name} photo ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specialists at this hospital */}
        {hospitalDoctors.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 font-['Poppins']">
              Featured Specialists at {hospital.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hospitalDoctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onSelect={s => navigate(`/doctors/${s}`)}
                  onEnquire={name => openEnquiryModal({ hospital: hospital.name, doctor: name })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Packages at this hospital */}
        {hospitalPackages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 font-['Poppins']">
              Indicative Packages at this Centre
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hospitalPackages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onEnquire={name => openEnquiryModal({ hospital: hospital.name, treatment: name })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Nearby Recovery Accommodations */}
        {nearbyHotels.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Poppins']">
                  Nearby Recuperation Accommodations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vetted 4-star and 5-star hotels with wheelchair access within 5km radius.
                </p>
              </div>
              <button
                onClick={() => navigate('/stay')}
                className="text-xs font-semibold text-[#0B5A91] hover:underline cursor-pointer"
              >
                View all stay options
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyHotels.slice(0, 2).map(hotel => (
                <div
                  key={hotel.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">{hotel.name}</div>
                    <div className="text-xs text-slate-500">{hotel.distanceFromHospital}</div>
                  </div>
                  <button
                    onClick={() => navigate(`/stay/${hotel.slug}`)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    View Hotel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
