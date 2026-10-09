import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  MapPin,
  Building,
  Plane,
  Phone,
  ArrowRight,
  Accessibility,
  Users,
  CheckCircle2,
  Utensils
} from 'lucide-react';

interface HotelDetailPageProps {
  slug: string;
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { treatment?: string; hospital?: string }) => void;
}

export const HotelDetailPage: React.FC<HotelDetailPageProps> = ({
  slug,
  navigate,
  openEnquiryModal
}) => {
  const { hotels, hospitals, formatPrice } = useApp();

  const hotel = hotels.find(h => h.slug === slug);

  if (!hotel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-['Poppins']">Hotel Not Found</h2>
        <button
          onClick={() => navigate('/stay')}
          className="px-4 py-2 bg-[#2F80C9] text-white rounded-lg text-sm cursor-pointer"
        >
          View All Hotels
        </button>
      </div>
    );
  }

  const linkedHospitals = hospitals.filter(h => hotel.associatedHospitalIds?.includes(h.id));

  return (
    <div className="min-h-screen bg-[#F5FAFD] pb-20">
      <div className="relative bg-slate-900 text-white py-16 overflow-hidden">
        {hotel.coverImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={hotel.coverImage}
              alt={hotel.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-sky-300 font-semibold">{hotel.stars}-Star Medical Accommodation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-['Poppins']">
              {hotel.name}
            </h1>

            <div className="flex items-center text-slate-300 text-sm">
              <MapPin className="w-4 h-4 mr-1.5 text-sky-400 shrink-0" />
              <span>{hotel.location}, {hotel.city}</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              <div className="bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-slate-400">Hospital Distance: </span>
                <strong className="text-white">{hotel.distanceFromHospital}</strong>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-slate-400">Airport Distance: </span>
                <strong className="text-white">{hotel.distanceFromAirport}</strong>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => openEnquiryModal({ treatment: `Hotel Booking: ${hotel.name}` })}
                className="px-6 py-3 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Inquire Long-Stay Medical Tariffs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20 space-y-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 subtle-card-shadow border border-slate-100 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Poppins'] mb-2">
              Property Overview & Medical Amenities
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {hotel.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-[#0B5A91] uppercase tracking-wider mb-3">
              Key Amenities for Recovering Patients & Families
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600">
              {hotel.amenities.map((am: string, i: number) => (
                <div key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          {hotel.bookingNotes && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-xs text-[#0B5A91]">
              <strong>Medical Booking Advisory: </strong>
              {hotel.bookingNotes}
            </div>
          )}
        </div>

        {/* Gallery */}
        {hotel.gallery && hotel.gallery.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 font-['Poppins']">Photo Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotel.gallery.map((img: string, i: number) => (
                <div key={i} className="h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={img}
                    alt={`${hotel.name} room view`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked hospitals nearby */}
        {linkedHospitals.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 font-['Poppins']">
              Associated Partner Hospitals in Vicinity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {linkedHospitals.map(hosp => (
                <div
                  key={hosp.id}
                  className="p-4 rounded-xl bg-white subtle-card-shadow border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{hosp.name}</div>
                    <div className="text-xs text-slate-500">{hosp.city}</div>
                  </div>
                  <button
                    onClick={() => navigate(`/hospitals/${hosp.slug}`)}
                    className="text-xs font-semibold text-[#2F80C9] hover:underline"
                  >
                    View Hospital
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
