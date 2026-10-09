import React, { useState } from 'react';
import { Hotel, Hospital } from '../types';
import { uploadImageToFirebase } from '../utils/imageUpload';
import {
  X,
  Upload,
  Image as ImageIcon,
  Star,
  Building,
  Plane,
  MapPin,
  Phone,
  Accessibility,
  Users,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface EditHotelModalProps {
  hotel: Hotel;
  hospitals: Hospital[];
  onSave: (hotel: Hotel) => Promise<void>;
  onClose: () => void;
}

const COMMON_AMENITY_PRESETS = [
  'Doctor on-call 24/7',
  'Wheelchair accessible ramps & elevators',
  'Kitchenette in Suites with refrigerator',
  'Special medical diet & Halal food menu',
  '24/7 Pharmacy delivery tie-up',
  'Complimentary scheduled hospital shuttle',
  'Elevator with patient stretcher access',
  'Registered nurse on-call support',
  'Orthopaedic extra-comfort beds',
  'Airport chauffeured pick-up & drop'
];

const PRESET_HOTEL_IMAGES = [
  {
    name: 'Luxury Executive Suite (Delhi NCR)',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Medical Recuperation Suite (Gurugram)',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Heritage Patient Residence (Chennai)',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Modern Serviced Apartment (Bangalore)',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
  }
];

export const EditHotelModal: React.FC<EditHotelModalProps> = ({
  hotel,
  hospitals,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Hotel>({
    ...hotel,
    gallery: hotel.gallery || [],
    amenities: hotel.amenities || [],
    associatedHospitalIds: hotel.associatedHospitalIds || []
  });

  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'amenities' | 'hospitals'>('details');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [newAmenityInput, setNewAmenityInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle auto-generation of slug
  const handleAutoSlug = () => {
    if (formData.name) {
      const generated = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: generated }));
    }
  };

  // Upload Cover Image from device to Firebase
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setErrorMessage('');
    try {
      const uploadedUrl = await uploadImageToFirebase(file, 'hotels/covers');
      setFormData(prev => ({ ...prev, coverImage: uploadedUrl }));
    } catch (err) {
      console.error('Failed to upload cover image:', err);
      setErrorMessage('Could not upload image. Please try again or paste an image URL.');
    } finally {
      setIsUploadingCover(false);
      // Reset input value
      e.target.value = '';
    }
  };

  // Upload Gallery Image from device to Firebase
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingGallery(true);
    setErrorMessage('');
    try {
      const uploadedUrl = await uploadImageToFirebase(file, 'hotels/gallery');
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), uploadedUrl]
      }));
    } catch (err) {
      console.error('Failed to upload gallery image:', err);
      setErrorMessage('Could not upload gallery photo. Please try again or paste a photo URL.');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    if (galleryUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), galleryUrlInput.trim()]
      }));
      setGalleryUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddAmenity = (amenityName: string) => {
    const trimmed = amenityName.trim();
    if (trimmed && !formData.amenities.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, trimmed]
      }));
    }
    setNewAmenityInput('');
  };

  const handleRemoveAmenity = (amenityName: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenityName)
    }));
  };

  const handleToggleHospital = (hospitalId: string) => {
    setFormData(prev => {
      const current = prev.associatedHospitalIds || [];
      const updated = current.includes(hospitalId)
        ? current.filter(id => id !== hospitalId)
        : [...current, hospitalId];
      return { ...prev, associatedHospitalIds: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Hotel name is required.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('City is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save hotel to Firebase:', err);
      setErrorMessage('Failed to save hotel details. Please check your connection and try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B5A91] to-[#2F80C9] text-white flex items-center justify-center font-bold shadow-md shadow-sky-900/10">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                {hotel.name ? `Edit: ${hotel.name}` : 'Add New Recovery Hotel'}
              </h3>
              <p className="text-xs text-slate-500">
                All details and photos get saved directly in Firebase and display across the website.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50/50 flex space-x-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Overview & Distance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'photos'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>2. Cover & Gallery Images</span>
            {formData.coverImage && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Cover photo attached" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('amenities')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'amenities'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Amenities & Patient Comforts ({formData.amenities?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hospitals')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'hospitals'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Nearby Partner Hospitals ({formData.associatedHospitalIds?.length || 0})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: DETAILS & PROXIMITY */}
          {activeTab === 'details' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hotel / Stay Property Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. The Leela Ambience"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">URL Slug *</label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[11px] text-[#2F80C9] hover:underline cursor-pointer"
                    >
                      Generate from name
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. the-leela-ambience"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>
              </div>

              {/* Stars, Pricing, City, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Star Classification
                  </label>
                  <div className="flex space-x-2">
                    {[3, 4, 5].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormData({ ...formData, stars: st })}
                        className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors ${
                          formData.stars === st
                            ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span>{st}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Price per Night (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formData.startingPricePerNightUSD || ''}
                      onChange={e => setFormData({ ...formData, startingPricePerNightUSD: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    City / Medical Hub *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Gurugram, Delhi NCR"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>
              </div>

              {/* Location & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Neighborhood / Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. DLF Cyber City, Sector 24"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Front Desk / Concierge Phone
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="e.g. +91 124 4771234"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>
              </div>

              {/* PROXIMITY & DISTANCES (EXPLICIT USER REQUIREMENT) */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-4">
                <div className="flex items-center space-x-2 text-[#0B5A91] font-bold text-sm">
                  <Building className="w-4 h-4" />
                  <span>Hospital & Airport Proximity Indicators (Displayed on Website Cards & Details)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Distance from Hospital (Displayed on Card) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.distanceFromHospital}
                      onChange={e => setFormData({ ...formData, distanceFromHospital: e.target.value })}
                      placeholder="e.g. 500m (4 mins drive) from Medanta & Fortis"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Shown prominently with building icon on the stay card and detail hero banner.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Distance from Airport (Displayed on Card)
                    </label>
                    <input
                      type="text"
                      value={formData.distanceFromAirport}
                      onChange={e => setFormData({ ...formData, distanceFromAirport: e.target.value })}
                      placeholder="e.g. 14 km (20 mins drive) from IGI Airport (DEL)"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Shown with plane icon on the stay card and detail page.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Overview */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Property Overview & Patient Accommodations Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the comforts, hygiene standards, quiet surroundings, elevator access, and patient-tailored services..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              {/* Medical Booking Advisory */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Medical Booking Advisory / Notes
                </label>
                <input
                  type="text"
                  value={formData.bookingNotes}
                  onChange={e => setFormData({ ...formData, bookingNotes: e.target.value })}
                  placeholder="e.g. Includes dedicated airport chauffeured transit when booked via Verivia Health patient services."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              {/* Publishing and Order */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                <label className="flex items-center space-x-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                  />
                  <span>Publish this hotel publicly on the website</span>
                </label>

                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-slate-700">Display Order:</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-20 px-2 py-1 text-center text-sm rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COVER & GALLERY IMAGES (EXPLICIT USER REQUIREMENT: SAVED IN FIREBASE) */}
          {activeTab === 'photos' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Cover Image Section */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-[#2F80C9]" />
                      <span>Primary Hotel Cover Photo *</span>
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      This image is displayed on the homepage, stay catalog, and detail hero banner. Uploaded files are automatically compressed and saved in Firebase.
                    </p>
                  </div>
                  {formData.coverImage && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Saved in Firebase</span>
                    </span>
                  )}
                </div>

                {/* Cover Image Preview & Upload Controls */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-6">
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center group shadow-xs">
                      {formData.coverImage ? (
                        <>
                          <img
                            src={formData.coverImage}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xs">
                              Current Cover Photo
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 text-slate-400">
                          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="font-medium text-xs">No cover image selected</p>
                        </div>
                      )}

                      {isUploadingCover && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 text-[#0B5A91]">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="font-bold text-xs">Saving image to Firebase...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-3">
                    {/* Device Upload Button */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Upload Image from Device (Saved to Firebase)
                      </label>
                      <label className="w-full py-2.5 px-4 rounded-xl border border-[#2F80C9] bg-sky-50/70 hover:bg-sky-100 text-[#0B5A91] font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>Choose Photo (JPG, PNG, WebP)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          disabled={isUploadingCover}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="text-center text-slate-400 text-[10px] font-semibold uppercase">
                      — OR PASTE IMAGE URL —
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Direct Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.coverImage}
                        onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Options */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quick Select Curated Medical Hotel Photos:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_HOTEL_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                        className={`text-left p-1.5 rounded-xl border text-[11px] transition-all cursor-pointer flex items-center space-x-2 ${
                          formData.coverImage === preset.url
                            ? 'border-[#2F80C9] bg-sky-50 font-bold text-[#0B5A91]'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        <span className="line-clamp-2 leading-tight">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery Photos Section */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Room & Facility Photo Gallery ({formData.gallery?.length || 0})</span>
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Showcase patient rooms, recovery beds, bathrooms with grab rails, and common lounge areas.
                    </p>
                  </div>
                </div>

                {/* Gallery Upload Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <label className="py-2 px-3 rounded-xl border border-emerald-600/30 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-xs">
                    {isUploadingGallery ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                    ) : (
                      <Upload className="w-4 h-4 text-emerald-700" />
                    )}
                    <span>Upload Gallery Photo to Firebase</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      disabled={isUploadingGallery}
                      className="hidden"
                    />
                  </label>

                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={galleryUrlInput}
                      onChange={e => setGalleryUrlInput(e.target.value)}
                      placeholder="Or paste photo URL..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Gallery Grid */}
                {formData.gallery && formData.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formData.gallery.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shadow-xs"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110 cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic py-2 text-center">
                    No gallery photos added yet. Upload room photos to help international patients choose.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AMENITIES & PATIENT COMFORTS */}
          {activeTab === 'amenities' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Badges / Checkboxes */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#0B5A91]">
                  Patient & Family Key Features (Badges on Website)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-sky-50/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.wheelchairAccessible}
                      onChange={e => setFormData({ ...formData, wheelchairAccessible: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center">
                        <Accessibility className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Wheelchair Accessible
                      </div>
                      <div className="text-[10px] text-slate-500">Ramps, wide doors & elevators</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-sky-50/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.familyFriendly}
                      onChange={e => setFormData({ ...formData, familyFriendly: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-slate-700" />
                        Family Suites
                      </div>
                      <div className="text-[10px] text-slate-500">Space for medical attendants</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-sky-50/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.longStayAvailable}
                      onChange={e => setFormData({ ...formData, longStayAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                    />
                    <div>
                      <div className="font-bold text-slate-800 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-[#0B5A91]" />
                        Long-Stay Tariffs
                      </div>
                      <div className="text-[10px] text-slate-500">Discounted weekly/monthly rates</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Active Amenities Chips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">
                    Current Amenities for Recovering Patients ({formData.amenities.length})
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 min-h-[60px]">
                  {formData.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-2xs group"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(amenity)}
                        className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                        title="Remove amenity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {formData.amenities.length === 0 && (
                    <span className="text-slate-400 italic text-xs">No amenities added yet.</span>
                  )}
                </div>

                {/* Add Custom Amenity Input */}
                <div className="flex space-x-2 pt-1">
                  <input
                    type="text"
                    value={newAmenityInput}
                    onChange={e => setNewAmenityInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAmenity(newAmenityInput);
                      }
                    }}
                    placeholder="Type custom amenity (e.g. Arabic speaking staff, Oxygen concentrator on request)..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddAmenity(newAmenityInput)}
                    className="px-4 py-2 bg-[#2F80C9] hover:bg-[#0B5A91] text-white rounded-xl font-bold cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Quick Add Presets */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 mb-2">
                    Quick-add common medical stay amenities:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_AMENITY_PRESETS.map((preset, idx) => {
                      const alreadyAdded = formData.amenities.includes(preset);
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => handleAddAmenity(preset)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                            alreadyAdded
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                          }`}
                        >
                          {alreadyAdded ? '✓ ' : '+ '}
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NEARBY PARTNER HOSPITALS */}
          {activeTab === 'hospitals' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Associate Partner Hospitals in Vicinity
                </h4>
                <p className="text-slate-500 text-xs">
                  Select which accredited hospitals in India are close to this accommodation. This hotel will be recommended on those hospital pages and mapped for incoming international patients.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {hospitals.map(hosp => {
                  const isChecked = formData.associatedHospitalIds?.includes(hosp.id);
                  return (
                    <div
                      key={hosp.id}
                      onClick={() => handleToggleHospital(hosp.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#2F80C9] bg-sky-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#2F80C9] border-[#2F80C9] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{hosp.name}</div>
                          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-sky-600" />
                            <span>{hosp.city}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {hosp.slug}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              * Required fields. All photos & details update live on the website.
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving || isUploadingCover || isUploadingGallery}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2F80C9] hover:bg-[#0B5A91] transition-all shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Firebase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Hotel to Firebase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
