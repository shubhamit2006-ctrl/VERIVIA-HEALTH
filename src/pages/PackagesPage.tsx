import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackageCard } from '../components/PackageCard';
import { FileSpreadsheet, Search, Filter } from 'lucide-react';

interface PackagesPageProps {
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { treatment?: string }) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ navigate, openEnquiryModal }) => {
  const { packages } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState('All');

  const publishedPackages = packages.filter(p => p.published);

  const treatmentsList = ['All', ...Array.from(new Set(publishedPackages.map(p => p.treatmentName)))];

  const filteredPackages = publishedPackages.filter(pkg => {
    const matchesSearch =
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.doctorName && pkg.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pkg.treatmentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTreatment = selectedTreatment === 'All' || pkg.treatmentName === selectedTreatment;

    return matchesSearch && matchesTreatment;
  });

  return (
    <div className="min-h-screen bg-[#F5FAFD] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Structured Cost Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            Indicative Treatment Packages
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Transparent bundles combining accredited hospital admissions, surgeon fees, routine investigations, and standard stays. Actual costs are finalised following clinical evaluation.
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
              placeholder="Search package name, procedure, or hospital..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {treatmentsList.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTreatment(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedTreatment === t
                    ? 'bg-[#2F80C9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
            <p className="text-slate-500 text-sm">No packages matched your search.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTreatment('All');
              }}
              className="text-xs font-semibold text-[#2F80C9] underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEnquire={name => openEnquiryModal({ treatment: name })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
