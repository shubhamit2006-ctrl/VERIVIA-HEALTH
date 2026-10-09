import React from 'react';
import { useApp } from '../context/AppContext';
import { Hotel } from '../types';
import {
  Star,
  MapPin,
  Building,
  Check,
  Plane,
  Phone,
  ArrowRight,
  Accessibility,
  Users
} from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (slug: string) => void;
  onEnquire: (hotelName: string) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect, onEnquire }) => {
  const { formatPrice } = useApp();

  return (
    <div
      id={`hotel-card-${hotel.slug}`}
      className="bg-white rounded-2xl overflow-hidden subtle-card-shadow border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={hotel.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
          alt={hotel.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

        {/* Stars Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-500 shadow-xs flex items-center space-x-1">
          <div className="flex">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] text-slate-700 font-semibold ml-1">{hotel.stars}-Star Medical Stay</span>
        </div>

        {/* Price tag */}
        <div className="absolute bottom-3 right-3 bg-[#0B5A91]/90 backdrop-blur-md px-3 py-1 rounded-lg text-white shadow-sm text-right">
          <div className="text-[10px] text-sky-200 uppercase font-medium">Starting From</div>
          <div className="text-sm font-bold font-mono">
            {formatPrice(hotel.startingPricePerNightUSD)} <span className="text-[10px] font-normal">/ night</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <h3
              onClick={() => onSelect(hotel.slug)}
              className="text-base font-bold text-slate-900 hover:text-[#2F80C9] transition-colors cursor-pointer font-['Poppins'] line-clamp-1"
            >
              {hotel.name}
            </h3>
          </div>

          <div className="flex items-center text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1 text-sky-600 shrink-0" />
            <span className="truncate">{hotel.location}, {hotel.city}</span>
          </div>

          {/* Proximity indicators */}
          <div className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-slate-600 bg-sky-50/50 p-2.5 rounded-xl border border-sky-100">
            <div className="flex items-center space-x-1.5 truncate">
              <Building className="w-3.5 h-3.5 text-[#0B5A91] shrink-0" />
              <span className="truncate font-medium">{hotel.distanceFromHospital}</span>
            </div>
            <div className="flex items-center space-x-1.5 truncate">
              <Plane className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="truncate">{hotel.distanceFromAirport}</span>
            </div>
          </div>

          {/* Patient-friendly badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hotel.wheelchairAccessible && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center">
                <Accessibility className="w-3 h-3 mr-1" />
                Wheelchair Accessible
              </span>
            )}
            {hotel.familyFriendly && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 flex items-center">
                <Users className="w-3 h-3 mr-1" />
                Family Suites
              </span>
            )}
            {hotel.longStayAvailable && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-[#0B5A91] border border-sky-100">
                Medical Long-Stay Rates
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Doctor on-call support</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelect(hotel.slug)}
              className="text-xs font-semibold text-[#0B5A91] hover:underline cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => onEnquire(`Stay booking at ${hotel.name}`)}
              className="px-3 py-1 rounded-lg bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Book Stay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
