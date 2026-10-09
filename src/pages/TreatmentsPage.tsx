import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TreatmentCard } from '../components/TreatmentCard';
import { Search, Filter, Sparkles, Layers } from 'lucide-react';

interface TreatmentsPageProps {
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { treatment?: string }) => void;
}

export const TreatmentsPage: React.FC<TreatmentsPageProps> = ({ navigate, openEnquiryModal }) => {
  const { treatments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const publishedTreatments = treatments.filter(t => t.published);

  const categories = ['All', ...Array.from(new Set(publishedTreatments.map(t => t.category)))];

  const filteredTreatments = publishedTreatments.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.conditionsTreated.some((c: string) => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.procedures.some((p: string) => p.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5FAFD] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Clinical Disciplines & Procedures</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            Explore Specialised Medical Treatments
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Discover tertiary surgical options available across accredited Indian hospitals. All displayed costs represent transparent indicative estimates based on typical clinical stays.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl subtle-card-shadow border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search treatments, conditions, or procedures..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#2F80C9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Treatments Grid */}
        {filteredTreatments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
            <p className="text-slate-500 text-sm">No treatments matched your search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-xs font-semibold text-[#2F80C9] underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreatments.map(t => (
              <TreatmentCard
                key={t.id}
                treatment={t}
                onSelect={slug => navigate(`/treatments/${slug}`)}
                onEnquire={name => openEnquiryModal({ treatment: name })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
