import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HospitalCard } from '../components/HospitalCard';
import { Search, Building2, MapPin, Award } from 'lucide-react';

interface HospitalsPageProps {
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { hospital?: string }) => void;
}

export const HospitalsPage: React.FC<HospitalsPageProps> = ({ navigate, openEnquiryModal }) => {
  const { hospitals } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedAccreditation, setSelectedAccreditation] = useState<string>('All');

  const publishedHospitals = hospitals.filter(h => h.published);

  const cities = ['All', ...Array.from(new Set(publishedHospitals.map(h => h.city)))];

  const filteredHospitals = publishedHospitals.filter(h => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.specialities.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCity = selectedCity === 'All' || h.city === selectedCity;

    const matchesAccreditation =
      selectedAccreditation === 'All' ||
      h.accreditation.some((a: string) => a.toLowerCase().includes(selectedAccreditation.toLowerCase()));

    return matchesSearch && matchesCity && matchesAccreditation;
  });

  return (
    <div className="min-h-screen bg-[#F5FAFD] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Healthcare Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            Partner Hospitals & Medical Centres
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            All partner hospitals maintain high international clinical safety benchmarks (JCI / NABH) and operate dedicated International Patient Departments with multi-lingual assistance.
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
              placeholder="Search hospital name, city, or speciality..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCity === city
                    ? 'bg-[#2F80C9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Hospitals Grid */}
        {filteredHospitals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
            <p className="text-slate-500 text-sm">No hospitals matched your search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('All');
              }}
              className="text-xs font-semibold text-[#2F80C9] underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map(h => (
              <HospitalCard
                key={h.id}
                hospital={h}
                onSelect={slug => navigate(`/hospitals/${slug}`)}
                onEnquire={name => openEnquiryModal({ hospital: name })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
