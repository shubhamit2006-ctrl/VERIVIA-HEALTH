import React, { useState } from 'react';
import { Doctor, Hospital, Treatment } from '../types';
import { uploadImageToFirebase } from '../utils/imageUpload';
import {
  X,
  Upload,
  Image as ImageIcon,
  Award,
  Building2,
  Stethoscope,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Languages,
  Video,
  ShieldCheck,
  Star,
  ExternalLink,
  RefreshCw,
  Eye
} from 'lucide-react';

interface EditDoctorModalProps {
  doctor: Doctor;
  hospitals: Hospital[];
  treatments: Treatment[];
  onSave: (doctor: Doctor) => Promise<void>;
  onClose: () => void;
}

const COMMON_SPECIALITY_PRESETS = [
  'Cardiovascular & Cardiothoracic Surgery',
  'Hepatobiliary & Liver Transplantation',
  'Medical & Surgical Oncology',
  'Orthopaedics & Robotic Joint Replacement',
  'Neurosciences & Spine Surgery',
  'Organ Transplant & Nephrology',
  'IVF & Reproductive Medicine',
  'Robotic Minimal Access Surgery',
  'Bariatric & Metabolic Surgery',
  'Gastroenterology & GI Surgery'
];

const COMMON_EXPERTISE_PRESETS = [
  'Minimally Invasive Surgery',
  'Robotic Surgical Systems',
  'Complex Valve Reconstruction',
  'Beating Heart Bypass (Off-Pump)',
  'Living Donor Liver Transplant',
  'Adult & Paediatric Oncology',
  'Deep Brain Stimulation (DBS)',
  'Robotic Knee & Hip Replacement',
  'Minimally Invasive Spine Surgery',
  'Immunotherapy & Targeted Care',
  'Total Arterial Revascularisation',
  'Organ Preservation Protocols'
];

const COMMON_PROCEDURES_PRESETS = [
  'Beating Heart CABG',
  'Aortic Valve Replacement (AVR)',
  'Mitral Valve Repair (MVR)',
  'Living-Donor Liver Transplantation',
  'Robotic Total Knee Arthroplasty',
  'Complex Brain Tumour Craniotomy',
  'Endoscopic Spine Decompression',
  'Whipple Procedure for Pancreatic Tumours',
  'Autologous & Allogeneic BMT',
  'Robotic Radical Prostatectomy'
];

const COMMON_LANGUAGE_PRESETS = [
  'English',
  'Hindi',
  'Arabic',
  'French',
  'Russian',
  'Bengali',
  'Punjabi',
  'Swahili',
  'Urdu',
  'Spanish'
];

const COMMON_CONSULTATION_OPTIONS = [
  'Online Video Assessment',
  'Hospital In-Person Review',
  'Tele-Review Available',
  'Second Surgical Opinion',
  'Donor Eligibility Assessment'
];

const PRESET_DOCTOR_PORTRAITS = [
  {
    name: 'Senior Male Cardiac Specialist',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Senior Male Transplant Surgeon',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Senior Female Oncology Consultant',
    url: 'https://images.unsplash.com/photo-1594824813583-b78f6f578ec0?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Senior Male Orthopaedic Surgeon',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Senior Female Neurosciences Specialist',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'
  }
];

export const EditDoctorModal: React.FC<EditDoctorModalProps> = ({
  doctor,
  hospitals,
  treatments,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Doctor>({
    ...doctor,
    education: doctor.education || [],
    certifications: doctor.certifications || [],
    expertise: doctor.expertise || [],
    procedures: doctor.procedures || [],
    languages: doctor.languages || ['English', 'Hindi'],
    consultationOptions: doctor.consultationOptions || ['Online Video Assessment'],
    relatedTreatments: doctor.relatedTreatments || []
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'photo' | 'expertise' | 'credentials' | 'preview'>('profile');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [newEducationInput, setNewEducationInput] = useState('');
  const [newCertificationInput, setNewCertificationInput] = useState('');
  const [newExpertiseInput, setNewExpertiseInput] = useState('');
  const [newProcedureInput, setNewProcedureInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  // Auto-generate slug from name
  const handleAutoSlug = () => {
    if (formData.name) {
      const generated = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: generated }));
    }
  };

  // Upload Doctor Photograph from device/computer to Firebase
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setIsUploadingPhoto(true);
    setErrorMessage('');
    setUploadSuccessMessage('');
    try {
      // Direct Firebase Upload (Storage or compressed Firestore payload)
      const uploadedUrl = await uploadImageToFirebase(file, 'doctors');
      setFormData(prev => ({ ...prev, photograph: uploadedUrl }));
      setUploadSuccessMessage('Doctor photograph uploaded and saved in Firebase successfully!');
    } catch (err) {
      console.error('Failed to upload doctor photograph:', err);
      setErrorMessage('Could not upload image from your computer. Please try again or paste an image URL.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  // Hospital selection handler
  const handleHospitalChange = (hospitalId: string) => {
    const selected = hospitals.find(h => h.id === hospitalId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        hospitalId: selected.id,
        hospitalName: selected.name
      }));
    } else {
      setFormData(prev => ({ ...prev, hospitalId }));
    }
  };

  // Tag helper for adding item to an array field
  const handleAddItem = (
    field: 'education' | 'certifications' | 'expertise' | 'procedures' | 'languages',
    value: string,
    clearInputFn: (v: string) => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !formData[field].includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], trimmed]
      }));
    }
    clearInputFn('');
  };

  const handleRemoveItem = (
    field: 'education' | 'certifications' | 'expertise' | 'procedures' | 'languages',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Toggle helpers
  const handleToggleLanguage = (lang: string) => {
    setFormData(prev => {
      const exists = prev.languages.includes(lang);
      return {
        ...prev,
        languages: exists ? prev.languages.filter(l => l !== lang) : [...prev.languages, lang]
      };
    });
  };

  const handleToggleConsultationOption = (opt: string) => {
    setFormData(prev => {
      const exists = prev.consultationOptions.includes(opt);
      return {
        ...prev,
        consultationOptions: exists
          ? prev.consultationOptions.filter(o => o !== opt)
          : [...prev.consultationOptions, opt]
      };
    });
  };

  const handleToggleRelatedTreatment = (treatmentId: string) => {
    setFormData(prev => {
      const exists = prev.relatedTreatments.includes(treatmentId);
      return {
        ...prev,
        relatedTreatments: exists
          ? prev.relatedTreatments.filter(t => t !== treatmentId)
          : [...prev.relatedTreatments, treatmentId]
      };
    });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Doctor name is required.');
      setActiveTab('profile');
      return;
    }
    if (!formData.speciality.trim()) {
      setErrorMessage('Primary speciality is required.');
      setActiveTab('profile');
      return;
    }
    if (!formData.hospitalName.trim()) {
      setErrorMessage('Affiliated hospital name is required.');
      setActiveTab('profile');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save doctor to Firebase:', err);
      setErrorMessage('Failed to save doctor details. Please check your connection and try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B5A91] to-[#2F80C9] text-white flex items-center justify-center font-bold shadow-md shadow-sky-900/10">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                {doctor.name ? `Edit Specialist: ${doctor.name}` : 'Add New Medical Specialist'}
              </h3>
              <p className="text-xs text-slate-500">
                All details, qualifications, and computer-uploaded photos are saved directly in Firebase.
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

        {/* Sub-Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50/50 flex space-x-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'profile'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Profile & Affiliation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'photo'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. Photograph & Image</span>
            {formData.photograph && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expertise')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'expertise'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Expertise & Procedures</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {formData.expertise.length + formData.procedures.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'credentials'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>4. Credentials & Languages</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'preview'
                ? 'border-[#2F80C9] text-[#2F80C9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>5. Live Website Preview</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: PROFILE & AFFILIATION */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Doctor Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Doctor's Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Naresh Trehan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>

                {/* Slug with Auto-generate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      URL Slug <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[11px] text-[#2F80C9] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Auto-generate from Name</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. dr-naresh-trehan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Professional Designation / Title
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Chairman & Chief Cardiovascular Surgeon, Head of Robotic Surgery"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              {/* Speciality & Sub-Speciality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Primary Speciality <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.speciality}
                    onChange={e => setFormData({ ...formData, speciality: e.target.value })}
                    placeholder="e.g. Cardiovascular & Cardiothoracic Surgery"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                  {/* Presets */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {COMMON_SPECIALITY_PRESETS.slice(0, 5).map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => setFormData({ ...formData, speciality: spec })}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-[#0B5A91] transition-colors cursor-pointer"
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sub-Speciality / Clinical Focus
                  </label>
                  <input
                    type="text"
                    value={formData.subSpeciality}
                    onChange={e => setFormData({ ...formData, subSpeciality: e.target.value })}
                    placeholder="e.g. Off-Pump CABG, Robotic Cardiac Surgery, Heart Transplants"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>
              </div>

              {/* Affiliated Hospital */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Affiliated Partner Hospital <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.hospitalId}
                    onChange={e => handleHospitalChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  >
                    <option value="">-- Select from Partner Hospitals --</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.city})
                      </option>
                    ))}
                    <option value="custom">Other / Custom Hospital...</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Hospital Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hospitalName}
                    onChange={e => setFormData({ ...formData, hospitalName: e.target.value })}
                    placeholder="e.g. Medanta - The Medicity"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>
              </div>

              {/* Experience Years & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Experience (Years)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={70}
                      value={formData.experienceYears}
                      onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">Years</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                </div>

                <div className="flex flex-col justify-end space-y-2 pt-1">
                  {/* Published Toggle */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={e => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Active & Published on Website
                    </span>
                  </label>

                  {/* Featured Toggle */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Featured Specialist</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTOGRAPH & IMAGE UPLOAD (FROM COMPUTER OR URL) */}
          {activeTab === 'photo' && (
            <div className="space-y-6">
              {uploadSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{uploadSuccessMessage}</span>
                </div>
              )}

              {/* Upload from Computer Box */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/70 transition-colors flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-sky-200 text-[#0B5A91] flex items-center justify-center">
                  {isUploadingPhoto ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#2F80C9]" />
                  ) : (
                    <Upload className="w-6 h-6 text-[#2F80C9]" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Upload Doctor Photograph from Computer
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mt-1">
                    Upload a high-resolution professional portrait of the specialist. It will be compressed client-side and saved straight into Firebase.
                  </p>
                </div>

                <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>{isUploadingPhoto ? 'Uploading to Firebase...' : 'Choose Image File from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingPhoto}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-400">Supported formats: JPEG, PNG, WebP (Max ~10MB)</span>
              </div>

              {/* Current Photo Preview & Direct URL Input */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Photo Preview Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-bold text-slate-700">Active Photograph Preview</span>
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md">
                    {formData.photograph ? (
                      <img
                        src={formData.photograph}
                        alt={formData.name || 'Doctor Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[10px]">No image yet</span>
                      </div>
                    )}
                  </div>

                  {formData.photograph && (
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Connected & Ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photograph: '' })}
                        className="text-[11px] text-rose-500 hover:underline block cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  )}
                </div>

                {/* Direct Image URL & Presets */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Or Paste Direct Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={photoUrlInput}
                        onChange={e => setPhotoUrlInput(e.target.value)}
                        placeholder="https://example.com/doctor-portrait.jpg"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (photoUrlInput.trim()) {
                            setFormData({ ...formData, photograph: photoUrlInput.trim() });
                            setPhotoUrlInput('');
                          }
                        }}
                        className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 cursor-pointer"
                      >
                        Apply URL
                      </button>
                    </div>
                  </div>

                  {/* Curated Presets */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Or Pick from Curated Specialist Portraits
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRESET_DOCTOR_PORTRAITS.map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => setFormData({ ...formData, photograph: preset.url })}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex items-center space-x-2 ${
                            formData.photograph === preset.url
                              ? 'border-[#2F80C9] bg-sky-50/60 ring-2 ring-[#2F80C9]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-slate-800 truncate">
                              {preset.name}
                            </p>
                            <span className="text-[9px] text-[#2F80C9]">Select</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPERTISE, PROCEDURES & TREATMENTS */}
          {activeTab === 'expertise' && (
            <div className="space-y-6">
              {/* Clinical Areas of Expertise */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2F80C9]" />
                    <span>Clinical Areas of Expertise ({formData.expertise.length})</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Shown in doctor cards & detail page</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExpertiseInput}
                    onChange={e => setNewExpertiseInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem('expertise', newExpertiseInput, setNewExpertiseInput);
                      }
                    }}
                    placeholder="Type an expertise area and press Enter (e.g. Robotic Valve Repair)..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem('expertise', newExpertiseInput, setNewExpertiseInput)}
                    className="px-4 py-2 bg-[#2F80C9] text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Active Expertise Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.expertise.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-50 text-[#0B5A91] text-xs font-medium border border-sky-100"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('expertise', idx)}
                        className="text-sky-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.expertise.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No expertise areas added yet. Pick from recommendations below.</span>
                  )}
                </div>

                {/* Recommended Expertise Presets */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Quick Preset Recommendations:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_EXPERTISE_PRESETS.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (!formData.expertise.includes(preset)) {
                            setFormData(prev => ({ ...prev, expertise: [...prev.expertise, preset] }));
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          formData.expertise.includes(preset)
                            ? 'bg-sky-100 text-[#0B5A91] border-sky-200 font-semibold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documented High-Volume Procedures */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Documented Surgical Procedures ({formData.procedures.length})</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Featured in procedure breakdowns</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProcedureInput}
                    onChange={e => setNewProcedureInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem('procedures', newProcedureInput, setNewProcedureInput);
                      }
                    }}
                    placeholder="Type procedure name and press Enter (e.g. Beating Heart CABG)..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem('procedures', newProcedureInput, setNewProcedureInput)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Active Procedure Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.procedures.map((proc, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100"
                    >
                      <span>{proc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('procedures', idx)}
                        className="text-emerald-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.procedures.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No procedures documented yet.</span>
                  )}
                </div>

                {/* Quick Procedures Presets */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Quick Procedure Presets:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_PROCEDURES_PRESETS.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (!formData.procedures.includes(preset)) {
                            setFormData(prev => ({ ...prev, procedures: [...prev.procedures, preset] }));
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          formData.procedures.includes(preset)
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Medical Treatments */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Link to Medical Treatments & Departments
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {treatments.map(t => {
                    const isLinked = formData.relatedTreatments.includes(t.slug) || formData.relatedTreatments.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleRelatedTreatment(t.slug)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isLinked
                            ? 'border-[#2F80C9] bg-sky-50 text-[#0B5A91] font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{t.name}</span>
                        {isLinked && <CheckCircle2 className="w-3.5 h-3.5 text-[#2F80C9] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CREDENTIALS, EDUCATION, LANGUAGES & BIOGRAPHY */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              {/* Biography */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Comprehensive Professional Biography
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.biography.length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.biography}
                  onChange={e => setFormData({ ...formData, biography: e.target.value })}
                  placeholder="Detail the doctor's training, career accomplishments, leadership roles, and clinical mission..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] leading-relaxed"
                />
              </div>

              {/* Medical Qualifications & Fellowships (Education) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-[#0B5A91]" />
                  <span>Medical Qualifications & Fellowships ({formData.education.length})</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEducationInput}
                    onChange={e => setNewEducationInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem('education', newEducationInput, setNewEducationInput);
                      }
                    }}
                    placeholder="e.g. MBBS - King George’s Medical University, Lucknow..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem('education', newEducationInput, setNewEducationInput)}
                    className="px-4 py-2 bg-[#0B5A91] text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  {formData.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B5A91]"></span>
                        <span>{edu}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('education', idx)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {formData.education.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No qualifications added yet.</span>
                  )}
                </div>
              </div>

              {/* Accreditations, Honours & Volume (Certifications) */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Accreditations, Honours & Surgical Volume ({formData.certifications.length})</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCertificationInput}
                    onChange={e => setNewCertificationInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem('certifications', newCertificationInput, setNewCertificationInput);
                      }
                    }}
                    placeholder="e.g. Padma Bhushan & Padma Shri recipient..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem('certifications', newCertificationInput, setNewCertificationInput)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  {formData.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-900"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{cert}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('certifications', idx)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {formData.certifications.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No accreditations or volume records added yet.</span>
                  )}
                </div>
              </div>

              {/* Spoken Languages */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Languages className="w-4 h-4 text-sky-600" />
                  <span>Spoken Languages</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_LANGUAGE_PRESETS.map(lang => {
                    const isSelected = formData.languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleToggleLanguage(lang)}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2F80C9] text-white border-[#2F80C9] font-bold shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Options */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-[#2F80C9]" />
                  <span>Available Consultation & Assessment Modes</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_CONSULTATION_OPTIONS.map(opt => {
                    const isSelected = formData.consultationOptions.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleToggleConsultationOption(opt)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#2F80C9] bg-sky-50 text-[#0B5A91] font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2F80C9] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE WEBSITE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-[#0B5A91] flex items-center space-x-2">
                <Eye className="w-4 h-4 shrink-0 text-[#2F80C9]" />
                <span>
                  Below is a real-time preview of how this specialist will appear to international patients on the website cards and detail profile.
                </span>
              </div>

              {/* Preview 1: Doctor Card Simulation */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Website Listing Card Preview:
                </span>
                <div className="max-w-md bg-white rounded-2xl overflow-hidden subtle-card-shadow border border-slate-100 shadow-md">
                  <div className="p-5 flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={formData.photograph || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-1 text-center">
                        <span className="text-[10px] font-bold text-white font-mono">
                          {formData.experienceYears}+ Yrs Exp
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 text-[11px] font-semibold text-[#0B5A91] mb-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="truncate">{formData.speciality || 'Speciality'}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 truncate font-['Poppins']">
                        {formData.name || 'Doctor Name'}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium truncate">
                        {formData.designation || 'Specialist Consultant'}
                      </p>
                      <div className="flex items-center text-xs text-slate-500 mt-1 truncate">
                        <Building2 className="w-3.5 h-3.5 mr-1 text-sky-600 shrink-0" />
                        <span className="truncate">{formData.hospitalName || 'Partner Hospital'}</span>
                      </div>
                    </div>
                  </div>
                  {/* Focus areas */}
                  <div className="px-5 pb-3">
                    <div className="text-[10px] font-semibold text-slate-400 mb-1">Key Focus Areas:</div>
                    <div className="flex flex-wrap gap-1">
                      {(formData.expertise.length > 0 ? formData.expertise.slice(0, 3) : ['Robotic Surgery', 'Minimally Invasive']).map((exp, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center text-[11px] text-slate-500">
                      <Video className="w-3.5 h-3.5 mr-1 text-[#2F80C9]" />
                      <span>{formData.consultationOptions[0] || 'Tele-Review Available'}</span>
                    </div>
                    <button type="button" className="px-3 py-1 rounded-lg bg-[#2F80C9] text-white text-xs font-semibold">
                      Book Opinion
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview 2: Doctor Profile Detail Hero Simulation */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Doctor Profile Detail Header Preview:
                </span>
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 border-2 border-sky-400/40 shadow-xl shrink-0">
                      <img
                        src={formData.photograph || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{formData.speciality} • {formData.experienceYears}+ Years Clinical Practice</span>
                      </div>
                      <h3 className="text-2xl font-bold font-['Poppins'] text-white">
                        {formData.name}
                      </h3>
                      <p className="text-xs text-sky-200">{formData.designation}</p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
                        <div className="flex items-center">
                          <Building2 className="w-3.5 h-3.5 text-sky-400 mr-1" />
                          <span>{formData.hospitalName}</span>
                        </div>
                        <div className="flex items-center">
                          <Languages className="w-3.5 h-3.5 text-sky-400 mr-1" />
                          <span>Languages: {formData.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Bottom Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between sticky bottom-0 bg-white py-2">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${formData.published ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              <span className="text-xs text-slate-600 font-medium">
                Status: {formData.published ? 'Active & Published' : 'Hidden'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploadingPhoto}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0B5A91] to-[#2F80C9] hover:opacity-95 shadow-md shadow-sky-900/15 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Firebase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Doctor to Firebase</span>
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
