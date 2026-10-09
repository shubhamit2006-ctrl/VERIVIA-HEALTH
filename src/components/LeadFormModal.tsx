import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LeadDocument } from '../types';
import { uploadMedicalDocumentToFirebase } from '../utils/imageUpload';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Trash2,
  Building2,
  Calendar,
  Users,
  Loader2,
  Eye,
  Image as ImageIcon
} from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTreatment?: string;
  preselectedHospital?: string;
  preselectedDoctor?: string;
  preselectedName?: string;
  preselectedCountry?: string;
  preselectedCity?: string;
  preselectedEmail?: string;
  preselectedPhone?: string;
  preselectedCondition?: string;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  preselectedTreatment = '',
  preselectedHospital = '',
  preselectedDoctor = '',
  preselectedName = '',
  preselectedCountry = '',
  preselectedCity = '',
  preselectedEmail = '',
  preselectedPhone = '',
  preselectedCondition = ''
}) => {
  const { brand, treatments, hospitals, submitLead } = useApp();

  const [fullName, setFullName] = useState(preselectedName);
  const [country, setCountry] = useState(preselectedCountry);
  const [city, setCity] = useState(preselectedCity);
  const [email, setEmail] = useState(preselectedEmail);
  const [whatsapp, setWhatsapp] = useState(preselectedPhone);
  const [preferredCommunication, setPreferredCommunication] = useState<'WhatsApp' | 'Email' | 'Phone Call'>('WhatsApp');

  const [treatmentRequired, setTreatmentRequired] = useState(preselectedTreatment);
  const [medicalCondition, setMedicalCondition] = useState(preselectedCondition);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [preferredSpeciality, setPreferredSpeciality] = useState('');
  const [preferredCity, setPreferredCity] = useState('');
  const [preferredHospital, setPreferredHospital] = useState(preselectedHospital);
  const [medicalDescription, setMedicalDescription] = useState(
    preselectedDoctor ? `Requesting evaluation by ${preselectedDoctor}` : ''
  );

  const [expectedTravelMonth, setExpectedTravelMonth] = useState('Within 1 Month');
  const [accompanyingPersons, setAccompanyingPersons] = useState('1');
  const [accommodationRequired, setAccommodationRequired] = useState(true);
  const [airportAssistanceRequired, setAirportAssistanceRequired] = useState(true);

  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [hospitalSharingConsent, setHospitalSharingConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keep form fields synced whenever modal opens with prefilled parameters
  useEffect(() => {
    if (isOpen) {
      if (preselectedName) setFullName(preselectedName);
      if (preselectedCountry) setCountry(preselectedCountry);
      if (preselectedCity) setCity(preselectedCity);
      if (preselectedEmail) setEmail(preselectedEmail);
      if (preselectedPhone) setWhatsapp(preselectedPhone);
      if (preselectedTreatment) setTreatmentRequired(preselectedTreatment);
      if (preselectedCondition) setMedicalCondition(preselectedCondition);
      if (preselectedHospital) setPreferredHospital(preselectedHospital);
      if (preselectedDoctor) setMedicalDescription(`Requesting evaluation by ${preselectedDoctor}`);
    }
  }, [
    isOpen,
    preselectedName,
    preselectedCountry,
    preselectedCity,
    preselectedEmail,
    preselectedPhone,
    preselectedTreatment,
    preselectedCondition,
    preselectedHospital,
    preselectedDoctor
  ]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    setIsUploadingFiles(true);
    setErrorMessage('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(`Uploading ${file.name}`);

        const result = await uploadMedicalDocumentToFirebase(file);

        const newDoc: LeadDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: result.name,
          size: result.size,
          type: result.type,
          url: result.url,
          dataBase64: result.dataBase64,
          uploadedAt: new Date().toISOString()
        };

        setDocuments(prev => [...prev, newDoc]);
      }
    } catch (err) {
      console.error('Failed to attach document:', err);
      setErrorMessage('Could not attach one or more documents. Please check file format and try again.');
    } finally {
      setIsUploadingFiles(false);
      setUploadProgressText('');
      e.target.value = '';
    }
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !country.trim() || !email.trim() || !whatsapp.trim()) {
      setErrorMessage('Please fill out all required personal contact details.');
      return;
    }

    if (!privacyConsent || !hospitalSharingConsent) {
      setErrorMessage('Please provide consent to process your medical enquiry.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead({
        fullName,
        country,
        city,
        email,
        whatsapp,
        preferredCommunication,
        treatmentRequired: treatmentRequired || 'General Medical Evaluation',
        medicalCondition,
        age,
        gender,
        preferredSpeciality,
        preferredCity,
        preferredHospital,
        medicalDescription,
        expectedTravelMonth,
        accompanyingPersons,
        accommodationRequired,
        airportAssistanceRequired,
        documents,
        privacyConsent,
        hospitalSharingConsent
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to submit your enquiry. Please try again or reach out via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0B5A91] to-[#2F80C9] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-sky-200 uppercase font-semibold tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Confidential International Patient Advisory</span>
            </div>
            <h3 className="text-xl font-bold font-['Poppins']">
              Request Your Personalised Treatment Plan
            </h3>
            <p className="text-xs text-sky-100 mt-0.5">
              Receive hospital options, specialist second opinions, and transparent indicative costs from accredited Indian centres.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-slate-800">
              Thank You. Your Request Has Been Received.
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Our international patient coordination team and medical panel will review your clinical information and contact you via your preferred communication method.
            </p>
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 max-w-md mx-auto text-left text-xs text-slate-700 space-y-1.5">
              <div className="font-semibold text-[#0B5A91] flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1" />
                Next Steps for Your Travel:
              </div>
              <div>• A clinical specialist reviews your submitted reports and notes.</div>
              <div>• You will receive 2-3 indicative hospital & specialist opinions.</div>
              <div>• Medical visa invitation letters will be prepared upon hospital selection.</div>
            </div>
            <div className="pt-4 flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#2F80C9] text-white font-medium hover:bg-[#0B5A91] text-sm cursor-pointer shadow-sm"
              >
                Back to Explorer
              </button>
              <a
                href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20just%20submitted%20my%20medical%20treatment%20enquiry%20for%20${encodeURIComponent(fullName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 text-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>Notify via WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: PERSONAL DETAILS */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0B5A91] uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#2F80C9] mr-2"></span>
                1. Personal & Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. John Doe / Fatimah Ali"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country of Residence *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. Kenya, Oman, UK, Nigeria"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Nairobi / Muscat"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Mobile Number (with country code) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="+968 9123 4567"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Communication
                  </label>
                  <select
                    value={preferredCommunication}
                    onChange={e => setPreferredCommunication(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  >
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Email">Email Communication</option>
                    <option value="Phone Call">Direct Phone Call</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: MEDICAL INFORMATION */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-[#0B5A91] uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#2F80C9] mr-2"></span>
                2. Clinical & Treatment Requirements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Treatment Required
                  </label>
                  <select
                    value={treatmentRequired}
                    onChange={e => setTreatmentRequired(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  >
                    <option value="">Select Treatment...</option>
                    {treatments.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 54"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Gender
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medical Condition / Diagnosis
                  </label>
                  <input
                    type="text"
                    value={medicalCondition}
                    onChange={e => setMedicalCondition(e.target.value)}
                    placeholder="e.g. Severe knee osteoarthritis / Coronary artery blockage"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Hospital in India (Optional)
                  </label>
                  <select
                    value={preferredHospital}
                    onChange={e => setPreferredHospital(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  >
                    <option value="">Let Verivia Health recommend the best hospital</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.name}>
                        {h.name} ({h.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Medical Description & Symptoms
                </label>
                <textarea
                  rows={2}
                  value={medicalDescription}
                  onChange={e => setMedicalDescription(e.target.value)}
                  placeholder="Describe your symptoms, previous treatments, recent doctor advice, or questions you would like answered..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                />
              </div>
            </div>

            {/* SECTION 3: TRAVEL & STAY ASSISTANCE */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-[#0B5A91] uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#2F80C9] mr-2"></span>
                3. Travel & Logistics Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Travel Timeline
                  </label>
                  <select
                    value={expectedTravelMonth}
                    onChange={e => setExpectedTravelMonth(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  >
                    <option value="Urgent (Within 1-2 Weeks)">Urgent (Within 1-2 Weeks)</option>
                    <option value="Within 1 Month">Within 1 Month</option>
                    <option value="Within 2-3 Months">Within 2-3 Months</option>
                    <option value="Exploring Options for Later">Exploring Options for Later</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Accompanying Attendants
                  </label>
                  <select
                    value={accompanyingPersons}
                    onChange={e => setAccompanyingPersons(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] bg-slate-50/50"
                  >
                    <option value="0 (Travelling Alone)">0 (Travelling Alone)</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons (Standard MedX Visa limit)</option>
                    <option value="3+">3 or more</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accommodationRequired}
                    onChange={e => setAccommodationRequired(e.target.checked)}
                    className="rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                  />
                  <span>Need hotel / recovery stay assistance near hospital</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={airportAssistanceRequired}
                    onChange={e => setAirportAssistanceRequired(e.target.checked)}
                    className="rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                  />
                  <span>Need complimentary airport chauffeur transfer</span>
                </label>
              </div>
            </div>

            {/* SECTION 4: MEDICAL DOCUMENT UPLOAD */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-[#0B5A91] uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#2F80C9] mr-2"></span>
                Upload Medical Reports and Scans
              </h4>
              <p className="text-xs text-slate-500">
                Upload MRI, CT, Angiogram summaries, blood tests, or doctor prescriptions (PDF, JPG, PNG up to 25MB each). Files are encrypted and securely stored for clinical board evaluation.
              </p>

              <div className="border-2 border-dashed border-sky-300 bg-sky-50/40 rounded-xl p-5 text-center hover:bg-sky-50 transition-colors relative">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={isUploadingFiles}
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                {isUploadingFiles ? (
                  <div className="flex flex-col items-center justify-center space-y-2 py-2">
                    <Loader2 className="w-7 h-7 text-[#2F80C9] animate-spin" />
                    <span className="text-xs font-semibold text-[#0B5A91]">
                      {uploadProgressText || 'Uploading file...'}
                    </span>
                    <span className="text-[11px] text-slate-400">Please wait while your document is being uploaded</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 mx-auto text-[#2F80C9] mb-1" />
                    <span className="text-xs font-semibold text-[#0B5A91]">
                      Click or drag medical reports & scans from your device
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, JPG, PNG, DOC (up to 25MB)</p>
                  </>
                )}
              </div>

              {documents.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                    <span>Attached Reports ({documents.length}):</span>
                    <span className="text-emerald-600 flex items-center text-[10px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                      Ready for review
                    </span>
                  </div>
                  {documents.map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-sky-100 shadow-xs text-xs text-slate-700"
                    >
                      <div className="flex items-center space-x-2.5 truncate pr-2">
                        <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0B5A91] flex items-center justify-center shrink-0">
                          {doc.type.includes('image') ? (
                            <ImageIcon className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div className="truncate">
                          <span className="truncate font-semibold text-slate-800 block">{doc.name}</span>
                          <span className="text-slate-400 text-[10px]">
                            {Math.round(doc.size / 1024)} KB • Attached
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {(doc.url || doc.dataBase64) && (
                          <a
                            href={doc.url || doc.dataBase64}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#2F80C9] hover:underline p-1 flex items-center space-x-1 cursor-pointer"
                            title="Preview file"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Preview</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(doc.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 5: CONSENTS & SUBMIT */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyConsent}
                  onChange={e => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                />
                <span>
                  I accept the Privacy Policy and consent to the processing of my medical information for clinical review.
                </span>
              </label>

              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={hospitalSharingConsent}
                  onChange={e => setHospitalSharingConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#2F80C9] focus:ring-[#2F80C9]"
                />
                <span>
                  I authorise VERIVIA HEALTH to share my medical reports with accredited hospital boards and certified specialists in India to generate treatment recommendations.
                </span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                <span>256-bit encrypted healthcare transmission</span>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingFiles}
                  className="px-6 py-2.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-bold shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : isUploadingFiles ? (
                    <span>Uploading Documents...</span>
                  ) : (
                    <span>Request My Treatment Plan</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
