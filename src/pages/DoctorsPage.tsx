import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DoctorCard } from '../components/DoctorCard';
import { Search, Stethoscope } from 'lucide-react';

interface DoctorsPageProps {
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { doctor?: string }) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ navigate, openEnquiryModal }) => {
  const { doctors } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('All');

  const publishedDoctors = doctors.filter(d => d.published);

  const specialities = ['All', ...Array.from(new Set(publishedDoctors.map(d => d.speciality)))];

  const filteredDoctors = publishedDoctors.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.subSpeciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpeciality = selectedSpeciality === 'All' || d.speciality === selectedSpeciality;

    return matchesSearch && matchesSpeciality;
  });

  return (
    <div className="min-h-screen bg-[#F5FAFD] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Leadership</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            Distinguished Medical Specialists
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Leading surgeons and consultants across premier hospital networks in India. Consult for independent medical opinions, surgical suitability, and pre-arrival assessments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl subtle-card-shadow border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by doctor name, speciality, or hospital..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {specialities.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpeciality(spec)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedSpeciality === spec
                    ? 'bg-[#2F80C9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
            <p className="text-slate-500 text-sm">No doctors matched your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpeciality('All');
              }}
              className="text-xs font-semibold text-[#2F80C9] underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(d => (
              <DoctorCard
                key={d.id}
                doctor={d}
                onSelect={slug => navigate(`/doctors/${slug}`)}
                onEnquire={name => openEnquiryModal({ doctor: name })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
