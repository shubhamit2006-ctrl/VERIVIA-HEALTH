import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HotelCard } from '../components/HotelCard';
import { Search, Home, Accessibility, Star } from 'lucide-react';

interface StayPageProps {
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { treatment?: string }) => void;
}

export const StayPage: React.FC<StayPageProps> = ({ navigate, openEnquiryModal }) => {
  const { hotels } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);

  const publishedHotels = hotels.filter(h => h.published);

  const filteredHotels = publishedHotels.filter(hotel => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWheelchair = !wheelchairOnly || hotel.wheelchairAccessible;

    return matchesSearch && matchesWheelchair;
  });

  return (
    <div className="min-h-screen bg-[#F5FAFD] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <Home className="w-3.5 h-3.5" />
            <span>Post-Treatment Recuperation & Hospitality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            Stay Comfortable While You Recover
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            International patients and accompanying family members often require quality accommodation prior to hospital admission and during post-surgical healing. All partner properties offer medical long-stay tariffs, wheelchair access, and proximate transit to hospitals.
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
              placeholder="Search hotel name, location, or city..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={wheelchairOnly}
                onChange={e => setWheelchairOnly(e.target.checked)}
                className="rounded text-[#2F80C9] focus:ring-[#2F80C9]"
              />
              <span>Wheelchair Accessible Only</span>
            </label>
          </div>
        </div>

        {/* Grid */}
        {filteredHotels.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
            <p className="text-slate-500 text-sm">No hotels matched your search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setWheelchairOnly(false);
              }}
              className="text-xs font-semibold text-[#2F80C9] underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map(h => (
              <HotelCard
                key={h.id}
                hotel={h}
                onSelect={slug => navigate(`/stay/${slug}`)}
                onEnquire={name => openEnquiryModal({ treatment: `Stay: ${name}` })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
