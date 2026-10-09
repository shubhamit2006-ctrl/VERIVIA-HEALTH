import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PatientLead,
  LeadDocument,
  Hospital,
  Doctor,
  Treatment,
  TreatmentPackage,
  Hotel,
  Testimonial,
  FAQItem,
  BrandSettings,
  JourneyStep
} from '../types';
import { VeriviaLogo } from '../components/VeriviaLogo';
import { EditHotelModal } from '../components/EditHotelModal';
import { EditDoctorModal } from '../components/EditDoctorModal';
import { downloadMedicalDocument } from '../utils/imageUpload';
import * as XLSX from 'xlsx';
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  Activity,
  FileSpreadsheet,
  Home,
  MessageSquare,
  HelpCircle,
  Settings,
  Download,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Lock,
  RefreshCw,
  FileText,
  DollarSign,
  Star,
  MapPin,
  Building,
  Plane,
  Car,
  Accessibility,
  X,
  ExternalLink,
  Image as ImageIcon,
  Workflow,
  ArrowUp,
  ArrowDown,
  HeartHandshake
} from 'lucide-react';
import { INITIAL_JOURNEY_STEPS } from '../initialData';

const JOURNEY_ICON_OPTIONS = [
  { value: 'FileText', label: 'Reports & Clinical Assessment (FileText)' },
  { value: 'Stethoscope', label: 'Doctor Review & 2nd Opinion (Stethoscope)' },
  { value: 'FileSpreadsheet', label: 'Cost Estimates & Plan (FileSpreadsheet)' },
  { value: 'Plane', label: 'Medical Visa & Flights (Plane)' },
  { value: 'Car', label: 'Airport Reception & Transit (Car)' },
  { value: 'Activity', label: 'Hospital Admission & Surgery (Activity)' },
  { value: 'Home', label: 'Recuperation & Stay (Home)' },
  { value: 'HeartHandshake', label: 'Tele-Follow-up & Return (HeartHandshake)' },
  { value: 'ShieldCheck', label: 'Accreditation & Quality (ShieldCheck)' },
  { value: 'CheckCircle2', label: 'Verification & Clearance (CheckCircle2)' },
  { value: 'Building', label: 'Hospital Facility (Building)' }
];

const JOURNEY_ICON_COMPONENTS: Record<string, any> = {
  FileText,
  Stethoscope,
  FileSpreadsheet,
  Plane,
  Car,
  Activity,
  Home,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Building
};

interface AdminPanelProps {
  navigate: (route: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ navigate }) => {
  const {
    brand,
    updateBrand,
    treatments,
    saveTreatment,
    deleteTreatment,
    hospitals,
    saveHospital,
    deleteHospital,
    doctors,
    saveDoctor,
    deleteDoctor,
    packages,
    savePackage,
    deletePackage,
    hotels,
    saveHotel,
    deleteHotel,
    testimonials,
    saveTestimonial,
    deleteTestimonial,
    faqs,
    saveFaq,
    deleteFaq,
    journeySteps,
    saveJourneyStep,
    deleteJourneyStep,
    leads,
    updateLead,
    deleteLead,
    resetToDemoData,
    currentUser,
    authLoading,
    isAdminLoggedIn,
    isAuthorizedAdmin,
    designatedAdminEmail,
    signInWithGoogleAdmin,
    logoutAdmin
  } = useApp();

  // Active admin tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'leads'
    | 'howItWorks'
    | 'hospitals'
    | 'doctors'
    | 'treatments'
    | 'packages'
    | 'hotels'
    | 'testimonials'
    | 'faqs'
    | 'settings'
  >('dashboard');

  // Journey Steps (How It Works) state
  const [editingJourneyStep, setEditingJourneyStep] = useState<JourneyStep | null>(null);
  const [journeyStepToast, setJourneyStepToast] = useState<string | null>(null);

  // Google Sign-In state & feedback
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState<PatientLead | null>(null);
  const [leadInternalNotes, setLeadInternalNotes] = useState('');
  const [previewDoc, setPreviewDoc] = useState<LeadDocument | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  // Filters
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [leadSearch, setLeadSearch] = useState('');

  // Editing state modals
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [editingPackage, setEditingPackage] = useState<TreatmentPackage | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<BrandSettings>(brand);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Handle Google Sign-In
  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    const res = await signInWithGoogleAdmin();
    if (!res.success && res.error) {
      setAuthError(res.error);
    }
    setIsSigningIn(false);
  };

  const handleSwitchAccount = async () => {
    await logoutAdmin();
    await handleSignIn();
  };

  // EXCEL LEAD EXPORT (Mandatory Requirement)
  const handleExportLeads = () => {
    const dataToExport = leads.map(l => ({
      'Lead ID': l.id,
      'Date': new Date(l.createdAt).toLocaleDateString(),
      'Patient Name': l.fullName,
      'Country': l.country,
      'City': l.city || 'N/A',
      'Email': l.email,
      'Phone / WhatsApp': l.whatsapp,
      'Preferred Contact': l.preferredCommunication,
      'Age': l.age || 'N/A',
      'Gender': l.gender || 'N/A',
      'Treatment Required': l.treatmentRequired,
      'Medical Condition': l.medicalCondition || 'N/A',
      'Preferred Hospital': l.preferredHospital || 'Flexible',
      'Preferred City': l.preferredCity || 'Flexible',
      'Expected Travel Month': l.expectedTravelMonth,
      'Lead Status': l.status,
      'Assigned Staff': l.assignedStaff || 'Unassigned',
      'Internal Notes': l.internalNotes || '',
      'Documents Attached': l.documents?.length || 0,
      'Created Timestamp': l.createdAt,
      'Updated Timestamp': l.updatedAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Leads');

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `international-patient-leads-${dateStr}.xlsx`);
  };

  // State 1: Verifying authentication and authorization
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5FAFD] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#0B5A91] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-700">Verifying administrator authorization...</p>
          <p className="text-xs text-slate-400">Verivia Health Secure Management Portal</p>
        </div>
      </div>
    );
  }

  // State 2: Not signed in with Google
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5FAFD] to-[#E9F3FA] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <VeriviaLogo variant="hero" className="w-[280px] h-auto object-contain mx-auto" />
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#0B5A91] border border-sky-100">
              <Lock className="w-3.5 h-3.5 mr-1.5 text-[#0B5A91]" />
              Administrator Management Portal
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-['Poppins']">
              Sign In to Admin Console
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access to patient leads, partner hospitals, clinical treatments, and CMS content is protected by Google Workspace authentication.
            </p>
          </div>

          {/* Designated Administrator Notice Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1.5">
            <div className="flex items-center text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <span>Designated Administrator Account:</span>
            </div>
            <p className="text-xs font-mono text-slate-900 font-semibold pl-5.5 select-all">
              {designatedAdminEmail}
            </p>
            <p className="text-[11px] text-slate-500 pl-5.5 leading-snug">
              Sign in with your Google Workspace account. No separate website password is required.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700 leading-relaxed">
                {authError}
              </div>
            </div>
          )}

          <div className="space-y-3 pt-1">
            {/* Official Google Sign-In button */}
            <button
              type="button"
              disabled={isSigningIn}
              onClick={handleSignIn}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm flex items-center justify-center space-x-3 cursor-pointer shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSigningIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center space-y-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer inline-flex items-center"
              >
                ← Return to Public Website
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Secured by Firebase Authentication & Firestore Security Rules.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Signed in, but NOT authorized as administrator
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5FAFD] to-[#F1F5F9] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-rose-200 p-8 max-w-md w-full space-y-6 text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 font-['Poppins']">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-600">
              Your Google account is signed in, but it does not have administrator authorization for Verivia Health.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Current Account:</span>
              <span className="font-semibold text-slate-800 font-mono truncate max-w-[200px]" title={currentUser.email || ''}>
                {currentUser.email || 'Google User'}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">Status:</span>
              <span className="text-rose-600 font-semibold inline-flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Unauthorized
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-500">
              Authorized Administrator: <strong className="text-slate-700 font-mono">{designatedAdminEmail}</strong>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              disabled={isSigningIn}
              onClick={handleSwitchAccount}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B5A91] hover:bg-[#08284D] text-white font-semibold text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition-colors"
            >
              <span>Switch to Authorized Google Account</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = leadStatusFilter === 'All' || lead.status === leadStatusFilter;
    const q = leadSearch.toLowerCase().trim();
    if (!q) return matchesStatus;

    const nameStr = (lead.fullName || (lead as any).patientName || (lead as any).name || '').toLowerCase();
    const countryStr = (lead.country || '').toLowerCase();
    const cityStr = (lead.city || '').toLowerCase();
    const treatmentStr = (lead.treatmentRequired || (lead as any).preferredTreatment || '').toLowerCase();
    const conditionStr = (lead.medicalCondition || '').toLowerCase();
    const emailStr = (lead.email || '').toLowerCase();
    const phoneStr = (lead.whatsapp || (lead as any).phone || '').toLowerCase();

    const matchesSearch =
      nameStr.includes(q) ||
      countryStr.includes(q) ||
      cityStr.includes(q) ||
      treatmentStr.includes(q) ||
      conditionStr.includes(q) ||
      emailStr.includes(q) ||
      phoneStr.includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <VeriviaLogo variant="mark-only" className="w-8 h-8" inverted={true} />
              <div className="font-bold text-white tracking-tight flex items-center text-sm">
                <span>VERIVIA</span>
                <span className="ml-1 text-sky-400 font-medium">CMS</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              title="Preview Website"
              className="text-xs text-sky-400 hover:text-white"
            >
              Exit
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'leads' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Users className="w-4 h-4" />
                <span>Leads Management</span>
              </div>
              {leads.filter(l => l.status === 'New').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {leads.filter(l => l.status === 'New').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('howItWorks')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'howItWorks' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>How It Works ({journeySteps?.length || 8})</span>
            </button>

            <button
              onClick={() => setActiveTab('hospitals')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'hospitals' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hospitals ({hospitals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'doctors' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Specialists ({doctors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('treatments')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'treatments' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Treatments ({treatments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'packages' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Packages ({packages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hotels')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'hotels' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Hotels / Stay ({hotels.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Testimonials ({testimonials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'faqs' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#2F80C9] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Brand & Global CMS</span>
            </button>
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Authorized Admin</span>
          </div>
          <div className="text-xs text-slate-300 font-mono truncate" title={currentUser?.email || designatedAdminEmail}>
            {currentUser?.email || designatedAdminEmail}
          </div>
          <button
            onClick={logoutAdmin}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-rose-300 hover:text-rose-200 flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        {/* Top bar with quick actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-['Poppins'] capitalize">
              {activeTab} Management
            </h2>
            <p className="text-xs text-slate-500">
              Changes reflect live across the public medical facilitation platform.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportLeads}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="Download full lead database as XLSX"
            >
              <Download className="w-4 h-4" />
              <span>Export Leads (.xlsx)</span>
            </button>
            <button
              onClick={resetToDemoData}
              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
              title="Reload demonstration records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Content</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB: DASHBOARD WIDGETS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stat Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl subtle-card-shadow border border-slate-100">
                <div className="text-xs text-slate-400 uppercase font-semibold">Total Leads</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{leads.length}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">
                  {leads.filter(l => l.status === 'New').length} awaiting first contact
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl subtle-card-shadow border border-slate-100">
                <div className="text-xs text-slate-400 uppercase font-semibold">Published Hospitals</div>
                <div className="text-3xl font-extrabold text-[#0B5A91] mt-1 font-mono">
                  {hospitals.filter(h => h.published).length} / {hospitals.length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">JCI & NABH centres</div>
              </div>
              <div className="bg-white p-5 rounded-2xl subtle-card-shadow border border-slate-100">
                <div className="text-xs text-slate-400 uppercase font-semibold">Active Specialists</div>
                <div className="text-3xl font-extrabold text-[#2F80C9] mt-1 font-mono">
                  {doctors.filter(d => d.published).length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Consultants & Surgeons</div>
              </div>
              <div className="bg-white p-5 rounded-2xl subtle-card-shadow border border-slate-100">
                <div className="text-xs text-slate-400 uppercase font-semibold">Packages & Stays</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                  {packages.length + hotels.length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Indicative Bundles</div>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-['Poppins']">
                  Recent International Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-semibold text-[#2F80C9] hover:underline"
                >
                  View All ({leads.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Country</th>
                      <th className="p-3">Treatment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-semibold text-slate-800">{lead.fullName}</td>
                        <td className="p-3 text-slate-600">{lead.country}</td>
                        <td className="p-3 text-[#0B5A91] font-medium">{lead.treatmentRequired}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#0B5A91]">
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setLeadInternalNotes(lead.internalNotes || '');
                            }}
                            className="px-2.5 py-1 rounded bg-[#2F80C9] text-white text-[11px] font-medium cursor-pointer"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: LEADS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Filter & Search */}
            <div className="bg-white p-4 rounded-2xl subtle-card-shadow border border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  placeholder="Filter by patient name, country, or treatment..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold">Status:</span>
                <select
                  value={leadStatusFilter}
                  onChange={e => setLeadStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Treatment Planning">Treatment Planning</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-3.5">Patient Details</th>
                      <th className="p-3.5">Location & Hospital</th>
                      <th className="p-3.5">Treatment & Condition</th>
                      <th className="p-3.5">Travel & Concierge</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No patient enquiries found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map(lead => {
                        const displayName = lead.fullName || (lead as any).patientName || (lead as any).name || 'Patient';
                        const displayPhone = lead.whatsapp || (lead as any).phone || 'N/A';
                        const displayTreatment = lead.treatmentRequired || (lead as any).preferredTreatment || 'General Evaluation';
                        const displayTravel = lead.expectedTravelMonth || (lead as any).tentativeTravelMonth || 'Flexible';

                        return (
                          <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900 text-sm">{displayName}</div>
                              <div className="text-[11px] text-slate-500">{lead.email}</div>
                              <div className="text-[11px] text-emerald-600 font-medium">{displayPhone}</div>
                              {(lead.age || lead.gender) && (
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {lead.age ? `${lead.age} yrs` : ''} {lead.gender && `• ${lead.gender}`}
                                </div>
                              )}
                              {lead.preferredCommunication && (
                                <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-sky-50 text-[#0B5A91] text-[10px] font-medium border border-sky-100">
                                  via {lead.preferredCommunication}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-700">
                              <div className="font-semibold text-slate-800">{lead.country}</div>
                              <div className="text-[11px] text-slate-400">{lead.city || 'City not specified'}</div>
                              {lead.preferredHospital && (
                                <div className="text-[10px] text-[#0B5A91] font-medium mt-1 truncate max-w-[170px]" title={lead.preferredHospital}>
                                  🏥 {lead.preferredHospital}
                                </div>
                              )}
                              {lead.preferredCity && (
                                <div className="text-[10px] text-slate-500">
                                  📍 Destination: {lead.preferredCity}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-[#0B5A91]">{displayTreatment}</div>
                              {lead.preferredSpeciality && (
                                <div className="text-[10px] text-slate-600 font-medium">
                                  {lead.preferredSpeciality}
                                </div>
                              )}
                              <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                                {lead.medicalCondition || 'No condition specified'}
                              </div>
                            </td>
                            <td className="p-3.5 text-slate-600">
                              <div className="font-medium text-slate-800">{displayTravel}</div>
                              <div className="text-[11px] text-slate-400">
                                {lead.accompanyingPersons ? `${lead.accompanyingPersons} attendant(s)` : '1 attendant'}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {lead.accommodationRequired && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-semibold border border-amber-200/80">
                                    Hotel Req.
                                  </span>
                                )}
                                {lead.airportAssistanceRequired && (
                                  <span className="px-1.5 py-0.5 rounded bg-sky-50 text-[#0B5A91] text-[9px] font-semibold border border-sky-200/80">
                                    Airport Pick-up
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1">
                                📎 {lead.documents?.length || 0} Docs • {new Date(lead.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  lead.status === 'New'
                                    ? 'bg-rose-100 text-rose-800'
                                    : lead.status === 'Converted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-sky-100 text-[#0B5A91]'
                                }`}
                              >
                                {lead.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setLeadInternalNotes(lead.internalNotes || '');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#2F80C9] text-white text-xs font-semibold hover:bg-[#0B5A91] cursor-pointer shadow-2xs"
                              >
                                Manage
                              </button>
                              {deletingLeadId === lead.id ? (
                                <div className="inline-flex items-center space-x-1.5 bg-rose-50 p-1 rounded-lg border border-rose-200">
                                  <button
                                    onClick={() => {
                                      deleteLead(lead.id);
                                      setDeletingLeadId(null);
                                    }}
                                    className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => setDeletingLeadId(null)}
                                    className="px-1.5 py-1 text-slate-500 hover:text-slate-700 text-[10px] cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeletingLeadId(lead.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                  title="Delete lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: HOW IT WORKS / PATIENT JOURNEY (CMS EDITABLE) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'howItWorks' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl subtle-card-shadow border border-slate-100">
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="p-2.5 rounded-xl bg-sky-50 text-[#0B5A91] border border-sky-100">
                    <Workflow className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                      How It Works / Patient Journey Stages
                    </h3>
                    <p className="text-xs text-slate-500">
                      Edit the sequence, stage titles, icons, and clinical care explanations shown on the public website.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const nextNum = (journeySteps?.length || 0) + 1;
                    setEditingJourneyStep({
                      id: `step-${Date.now()}`,
                      stepNumber: nextNum,
                      title: `New Stage ${nextNum}`,
                      description: 'Provide detailed instructions and guidance for this stage of patient care.',
                      icon: 'FileText'
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Step</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm('Reset all journey steps to the default 8 stages? Any custom steps will be overwritten.')) {
                      for (const step of INITIAL_JOURNEY_STEPS) {
                        await saveJourneyStep(step);
                      }
                      setJourneyStepToast('Reset to default 8 stages successfully.');
                      setTimeout(() => setJourneyStepToast(null), 3000);
                    }
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                  title="Reset to default stages"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/how-it-works')}
                  className="px-3 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0B5A91] border border-sky-200 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                  title="View public page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View Public Page</span>
                </button>
              </div>
            </div>

            {/* Toast feedback */}
            {journeyStepToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-semibold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{journeyStepToast}</span>
              </div>
            )}

            {/* List of Steps */}
            <div className="space-y-4">
              {(journeySteps && journeySteps.length > 0 ? journeySteps : INITIAL_JOURNEY_STEPS).map((step, idx, arr) => {
                const IconComponent = JOURNEY_ICON_COMPONENTS[step.icon] || Activity;
                return (
                  <div
                    key={step.id || step.stepNumber}
                    className="p-5 bg-white rounded-2xl subtle-card-shadow border border-slate-100 hover:border-sky-200 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0B5A91] border border-sky-100 flex items-center justify-center shrink-0 shadow-xs">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-[#0B5A91] bg-sky-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Stage {String(step.stepNumber).padStart(2, '0')}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              Icon: {step.icon}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">
                            {step.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={async () => {
                            if (idx === 0) return;
                            const prevStep = arr[idx - 1];
                            const currentNum = step.stepNumber;
                            const prevNum = prevStep.stepNumber;
                            await saveJourneyStep({ ...step, stepNumber: prevNum });
                            await saveJourneyStep({ ...prevStep, stepNumber: currentNum });
                            setJourneyStepToast(`Reordered "${step.title}" up.`);
                            setTimeout(() => setJourneyStepToast(null), 2500);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move step up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={idx === arr.length - 1}
                          onClick={async () => {
                            if (idx === arr.length - 1) return;
                            const nextStep = arr[idx + 1];
                            const currentNum = step.stepNumber;
                            const nextNum = nextStep.stepNumber;
                            await saveJourneyStep({ ...step, stepNumber: nextNum });
                            await saveJourneyStep({ ...nextStep, stepNumber: currentNum });
                            setJourneyStepToast(`Reordered "${step.title}" down.`);
                            setTimeout(() => setJourneyStepToast(null), 2500);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move step down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingJourneyStep({ ...step })}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 text-[#0B5A91] hover:bg-sky-100 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                          title="Edit stage title and language"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Language</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Delete "${step.title}"?`)) {
                              await deleteJourneyStep(step.id || `step-${step.stepNumber}`);
                              setJourneyStepToast(`Deleted stage ${step.stepNumber}.`);
                              setTimeout(() => setJourneyStepToast(null), 2500);
                            }
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Delete stage"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Step Language / Description */}
                    <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-slate-700 text-xs sm:text-sm leading-relaxed">
                      <p className="font-sans whitespace-pre-wrap">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit / Add Modal */}
            {editingJourneyStep && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#0B5A91] flex items-center justify-center">
                        <Workflow className="w-4 h-4" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 font-['Poppins']">
                        {editingJourneyStep.id ? 'Edit Journey Step Language' : 'Add New Patient Journey Step'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingJourneyStep(null)}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await saveJourneyStep(editingJourneyStep);
                      setEditingJourneyStep(null);
                      setJourneyStepToast(`Saved changes for Stage ${editingJourneyStep.stepNumber}: "${editingJourneyStep.title}"`);
                      setTimeout(() => setJourneyStepToast(null), 3000);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Stage Number *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={editingJourneyStep.stepNumber}
                          onChange={e => setEditingJourneyStep({
                            ...editingJourneyStep,
                            stepNumber: parseInt(e.target.value, 10) || 1
                          })}
                          required
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2F80C9]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Timeline Icon *
                        </label>
                        <select
                          value={editingJourneyStep.icon}
                          onChange={e => setEditingJourneyStep({
                            ...editingJourneyStep,
                            icon: e.target.value
                          })}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2F80C9] bg-white"
                        >
                          {JOURNEY_ICON_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Stage Heading / Title *
                      </label>
                      <input
                        type="text"
                        value={editingJourneyStep.title}
                        onChange={e => setEditingJourneyStep({
                          ...editingJourneyStep,
                          title: e.target.value
                        })}
                        placeholder="e.g. Share Medical Reports"
                        required
                        className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2F80C9] font-medium"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          Step Explanation & Language *
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {editingJourneyStep.description.length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={editingJourneyStep.description}
                        onChange={e => setEditingJourneyStep({
                          ...editingJourneyStep,
                          description: e.target.value
                        })}
                        placeholder="Provide clear, comforting guidance for patients at this stage..."
                        required
                        className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#2F80C9] leading-relaxed"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Tip: You can modify the wording and terminology whenever your clinical concierge process evolves.
                      </p>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingJourneyStep(null)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
                      >
                        Save Step Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: HOSPITALS CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                Partner Hospitals & Networks
              </h3>
              <button
                onClick={() => {
                  const newHosp: Hospital = {
                    id: `hosp-${Date.now()}`,
                    name: 'New Partner Hospital',
                    slug: `hospital-${Date.now()}`,
                    city: 'New Delhi',
                    state: 'Delhi',
                    country: 'India',
                    address: 'Hospital Campus Address',
                    logoUrl: '',
                    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
                    gallery: [],
                    description: 'Comprehensive multi-speciality tertiary care hospital with international patient support.',
                    beds: 500,
                    establishedYear: 2015,
                    accreditation: ['JCI Accredited', 'NABH Certified'],
                    specialities: ['Cardiology', 'Oncology', 'Orthopaedics'],
                    treatments: ['cardiac-sciences', 'oncology'],
                    facilities: ['Robotic surgery', 'ICU', 'International Lounge'],
                    internationalServices: ['Airport pick-up', 'Visa assistance', 'Translators'],
                    languages: ['English', 'Arabic', 'French'],
                    airportDistance: '20 km from International Airport',
                    website: 'https://example.com',
                    phone: '+91 11 2345678',
                    email: 'care@example.com',
                    published: true,
                    displayOrder: hospitals.length + 1,
                    featured: false
                  };
                  saveHospital(newHosp);
                  setEditingHospital(newHosp);
                }}
                className="px-4 py-2 rounded-xl bg-[#2F80C9] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hospital</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map(h => (
                <div
                  key={h.id}
                  className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">{h.city}</span>
                      <button
                        onClick={() => saveHospital({ ...h, published: !h.published })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          h.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {h.published ? 'Published' : 'Hidden'}
                      </button>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-['Poppins'] mt-1">{h.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{h.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {h.accreditation.map((acc: string, idx: number) => (
                        <span key={idx} className="text-[10px] bg-sky-50 text-[#0B5A91] px-1.5 py-0.5 rounded">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setEditingHospital(h)}
                      className="text-xs text-[#2F80C9] font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete hospital: ${h.name}?`)) {
                          deleteHospital(h.id);
                        }
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: DOCTORS CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                Distinguished Specialists
              </h3>
              <button
                onClick={() => {
                  const newDoc: Doctor = {
                    id: `doc-${Date.now()}`,
                    name: 'Dr. New Specialist',
                    slug: `dr-specialist-${Date.now()}`,
                    designation: 'Senior Consultant & Surgeon',
                    speciality: 'Cardiovascular Surgery',
                    subSpeciality: 'Minimally Invasive Cardiac Repair',
                    hospitalId: hospitals[0]?.id || 'hosp-1',
                    hospitalName: hospitals[0]?.name || 'Partner Hospital',
                    experienceYears: 20,
                    education: ['MBBS', 'MS Surgery', 'MCh'],
                    certifications: ['Board Certified Specialist'],
                    biography: 'Extensive background in complex tertiary clinical procedures.',
                    expertise: ['Minimally invasive repair', 'Valve reconstruction'],
                    procedures: ['Primary surgery'],
                    languages: ['English', 'Hindi'],
                    photograph: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
                    consultationOptions: ['Video Tele-Review'],
                    relatedTreatments: ['cardiac-sciences'],
                    published: true,
                    displayOrder: doctors.length + 1,
                    featured: false
                  };
                  saveDoctor(newDoc);
                  setEditingDoctor(newDoc);
                }}
                className="px-4 py-2 rounded-xl bg-[#2F80C9] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Doctor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(d => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 p-5 space-y-3 flex flex-col justify-between hover:border-sky-200 transition-all"
                >
                  <div>
                    <div className="flex items-start space-x-3.5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={d.photograph || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'}
                          alt={d.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-full h-full object-cover"
                        />
                        {d.featured && (
                          <div className="absolute top-1 left-1 bg-amber-400 text-slate-900 p-0.5 rounded-md shadow-xs">
                            <Star className="w-2.5 h-2.5 fill-slate-900" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] text-[#0B5A91] font-semibold truncate">{d.speciality}</span>
                          <button
                            onClick={() => saveDoctor({ ...d, published: !d.published })}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer shrink-0 ${
                              d.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {d.published ? 'Active' : 'Hidden'}
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 truncate font-['Poppins']">{d.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{d.hospitalName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{d.experienceYears}+ Yrs Clinical Practice</p>
                      </div>
                    </div>

                    {d.subSpeciality && (
                      <div className="mt-2.5">
                        <span className="text-[10px] bg-sky-50 text-[#0B5A91] px-2 py-0.5 rounded-md font-medium inline-block max-w-full truncate">
                          {d.subSpeciality}
                        </span>
                      </div>
                    )}

                    {/* Expertise summary */}
                    {d.expertise && d.expertise.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {d.expertise.slice(0, 2).map((exp, i) => (
                          <span key={i} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                            {exp}
                          </span>
                        ))}
                        {d.expertise.length > 2 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{d.expertise.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setEditingDoctor(d)}
                      className="text-xs text-[#2F80C9] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Specialist & Photo</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete doctor: ${d.name}?`)) {
                          deleteDoctor(d.id);
                        }
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: TREATMENTS CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'treatments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                Medical Treatments & Indicative Costs
              </h3>
              <button
                onClick={() => {
                  const newT: Treatment = {
                    id: `treatment-${Date.now()}`,
                    name: 'New Speciality Treatment',
                    slug: `treatment-${Date.now()}`,
                    category: 'Surgical Science',
                    shortDescription: 'Advanced tertiary clinical care with international surgical safety.',
                    overview: 'Detailed clinical overview and hospital procedures.',
                    conditionsTreated: ['Condition A', 'Condition B'],
                    procedures: ['Procedure 1', 'Procedure 2'],
                    whyConsiderIndia: 'Experienced surgical boards and FDA approved implants.',
                    typicalHospitalStay: '5 to 7 days',
                    expectedIndiaStay: '14 to 20 days',
                    indicativeCostMinUSD: 4000,
                    indicativeCostMaxUSD: 8000,
                    costInclusions: ['Surgeon charges', 'Standard ICU', 'Pre-op diagnostics'],
                    costExclusions: ['Specialised implants', 'Extended stay'],
                    costNotes: 'Indicative pricing. Actual treatment costs depend on clinical factors.',
                    faqs: [],
                    iconName: 'Activity',
                    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
                    published: true,
                    displayOrder: treatments.length + 1
                  };
                  saveTreatment(newT);
                  setEditingTreatment(newT);
                }}
                className="px-4 py-2 rounded-xl bg-[#2F80C9] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Treatment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatments.map(t => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0B5A91]">{t.category}</span>
                      <button
                        onClick={() => saveTreatment({ ...t, published: !t.published })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          t.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {t.published ? 'Published' : 'Hidden'}
                      </button>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-['Poppins'] mt-1">{t.name}</h4>
                    <div className="text-xs font-mono font-bold text-[#0B5A91] mt-1">
                      ${t.indicativeCostMinUSD} – ${t.indicativeCostMaxUSD} USD
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{t.shortDescription}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setEditingTreatment(t)}
                      className="text-xs text-[#2F80C9] font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete treatment: ${t.name}?`)) {
                          deleteTreatment(t.id);
                        }
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: PACKAGES CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                Treatment Packages
              </h3>
              <button
                onClick={() => {
                  const newPkg: TreatmentPackage = {
                    id: `pkg-${Date.now()}`,
                    packageName: 'New Indicative Treatment Package',
                    treatmentId: treatments[0]?.id || 'cardiac-sciences',
                    treatmentName: treatments[0]?.name || 'Cardiac Sciences',
                    hospitalId: hospitals[0]?.id || 'hosp-1',
                    hospitalName: hospitals[0]?.name || 'Medanta',
                    minPriceUSD: 5000,
                    maxPriceUSD: 7000,
                    hospitalStayDays: '5 days',
                    icuStayDays: '1 day',
                    estimatedIndiaStayDays: '14 days',
                    inclusions: ['Hospital room stay', 'Surgeon charges', 'Standard medications'],
                    exclusions: ['Special implants', 'Comorbidities'],
                    notes: 'Indicative package subject to review.',
                    validity: 'Valid until Dec 2026',
                    published: true,
                    displayOrder: packages.length + 1
                  };
                  savePackage(newPkg);
                  setEditingPackage(newPkg);
                }}
                className="px-4 py-2 rounded-xl bg-[#2F80C9] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#0B5A91] font-semibold">{p.treatmentName}</span>
                      <button
                        onClick={() => savePackage({ ...p, published: !p.published })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          p.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.published ? 'Published' : 'Hidden'}
                      </button>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-['Poppins'] mt-1">{p.packageName}</h4>
                    <div className="text-xs text-slate-500">{p.hospitalName}</div>
                    <div className="text-sm font-bold font-mono text-[#0B5A91] mt-2">
                      ${p.minPriceUSD} – ${p.maxPriceUSD} USD
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setEditingPackage(p)}
                      className="text-xs text-[#2F80C9] font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Package</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete package ${p.packageName}?`)) {
                          deletePackage(p.id);
                        }
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: HOTELS CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                  Recovery Accommodations ({hotels.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage partner hotels, room photos, distance from hospitals, patient amenities, and indicative pricing.
                </p>
              </div>

              <button
                onClick={() => {
                  const newHotel: Hotel = {
                    id: `hotel-${Date.now()}`,
                    name: '',
                    slug: '',
                    stars: 4,
                    city: 'Gurugram, Delhi NCR',
                    location: 'Near Medanta The Medicity',
                    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
                    gallery: [],
                    distanceFromHospital: '500m (4 mins drive) from Medanta & Fortis',
                    distanceFromAirport: '14 km (20 mins drive) from IGI Airport (DEL)',
                    startingPricePerNightUSD: 75,
                    amenities: [
                      'Doctor on-call 24/7',
                      'Wheelchair accessible ramps & elevators',
                      'Kitchenette in Suites with refrigerator',
                      'Special medical diet & Halal food menu'
                    ],
                    familyFriendly: true,
                    wheelchairAccessible: true,
                    longStayAvailable: true,
                    description: 'Modern patient-oriented hotel offering spacious suites, medical diet catering, quiet atmosphere, and wheelchair-accessible bathrooms.',
                    associatedHospitalIds: hospitals.length > 0 ? [hospitals[0].id] : [],
                    contactPhone: '+91 124 4771234',
                    bookingNotes: 'Includes dedicated airport chauffeured transit when booked via Verivia Health patient services.',
                    published: true,
                    displayOrder: hotels.length + 1
                  };
                  setEditingHotel(newHotel);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hotel Property</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(h => (
                <div
                  key={h.id}
                  className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 overflow-hidden hover:border-sky-200 transition-all flex flex-col justify-between group"
                >
                  {/* Hotel Thumbnail with Stars & Price */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={h.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Stars Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-amber-500 shadow-xs flex items-center space-x-1">
                      <div className="flex">
                        {Array.from({ length: h.stars || 4 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-700 font-semibold">{h.stars}-Star</span>
                    </div>

                    {/* Published status button */}
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => saveHotel({ ...h, published: !h.published })}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer backdrop-blur-md shadow-xs transition-colors ${
                          h.published
                            ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-900'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {h.published ? '● Live' : '○ Draft'}
                      </button>
                    </div>

                    {/* Pricing */}
                    <div className="absolute bottom-2.5 right-2.5 bg-[#0B5A91]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono font-bold text-xs shadow-xs">
                      ${h.startingPricePerNightUSD} <span className="text-[10px] font-normal">/ night</span>
                    </div>

                    {/* City */}
                    <div className="absolute bottom-2.5 left-2.5 text-white text-[11px] font-medium flex items-center drop-shadow-sm truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 mr-1 text-sky-300 shrink-0" />
                      <span className="truncate">{h.city}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-['Poppins'] line-clamp-1">
                        {h.name}
                      </h4>
                      {h.location && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {h.location}
                        </p>
                      )}

                      {/* Distance Indicators */}
                      <div className="mt-2.5 p-2 rounded-xl bg-sky-50/60 border border-sky-100 text-xs space-y-1">
                        <div className="flex items-center text-slate-700 font-medium truncate">
                          <Building className="w-3.5 h-3.5 text-[#0B5A91] mr-1.5 shrink-0" />
                          <span className="truncate">{h.distanceFromHospital || 'Proximity info not set'}</span>
                        </div>
                        {h.distanceFromAirport && (
                          <div className="flex items-center text-slate-500 text-[11px] truncate">
                            <Plane className="w-3 h-3 text-sky-500 mr-1.5 shrink-0" />
                            <span className="truncate">{h.distanceFromAirport}</span>
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {h.wheelchairAccessible && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center">
                            <Accessibility className="w-3 h-3 mr-1" />
                            Wheelchair
                          </span>
                        )}
                        {h.familyFriendly && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            Family
                          </span>
                        )}
                        {h.longStayAvailable && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-[#0B5A91]">
                            Long-Stay
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200">
                          {h.associatedHospitalIds?.length || 0} Hospitals Near
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setEditingHotel(h)}
                        className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-xs text-[#0B5A91] font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Full Details</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete recovery hotel "${h.name}" from Firebase?`)) {
                            deleteHotel(h.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete hotel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: TESTIMONIALS CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                Patient Testimonials (Consented)
              </h3>
              <button
                onClick={() => {
                  const newTest: Testimonial = {
                    id: `test-${Date.now()}`,
                    patientName: 'Patient Name',
                    country: 'Kenya',
                    treatment: 'Cardiac Surgery',
                    hospital: 'Medanta',
                    story: 'Very satisfied with the medical care in India.',
                    date: 'March 2026',
                    published: true,
                    displayOrder: testimonials.length + 1
                  };
                  saveTestimonial(newTest);
                }}
                className="px-4 py-2 rounded-xl bg-[#2F80C9] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Story</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold">{t.country}</span>
                      <button
                        onClick={() => saveTestimonial({ ...t, published: !t.published })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          t.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {t.published ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                    <div className="font-bold text-slate-900">{t.patientName}</div>
                    <div className="text-xs text-[#0B5A91]">{t.treatment}</div>
                    <p className="text-xs text-slate-600 italic">"{t.story}"</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => deleteTestimonial(t.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: FAQS CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                Website FAQs
              </h3>
              <button
                onClick={() => {
                  const newFaq: FAQItem = {
                    id: `faq-${Date.now()}`,
                    question: 'New Question regarding travel to India?',
                    answer: 'Detailed explanation regarding patient support.',
                    category: 'General',
                    displayOrder: faqs.length + 1,
                    published: true
                  };
                  saveFaq(newFaq);
                }}
                className="px-4 py-2 rounded-xl bg-[#2F80C9] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map(f => (
                <div
                  key={f.id}
                  className="p-4 bg-white rounded-xl subtle-card-shadow border border-slate-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={f.question}
                      onChange={e => saveFaq({ ...f, question: e.target.value })}
                      className="text-sm font-bold text-slate-900 w-full bg-transparent border-b border-transparent focus:border-[#2F80C9] focus:outline-hidden"
                    />
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => saveFaq({ ...f, published: !f.published })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          f.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {f.published ? 'Published' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => deleteFaq(f.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={f.answer}
                    onChange={e => saveFaq({ ...f, answer: e.target.value })}
                    className="w-full text-xs text-slate-600 bg-slate-50/50 p-2 rounded-lg border border-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: BRAND SETTINGS & CMS (Mandatory Requirement) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl subtle-card-shadow border border-slate-100 p-6 sm:p-8 space-y-6 max-w-4xl">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Poppins']">
                  Global Brand & CMS Configuration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update brand identity, phone numbers, WhatsApp, CTAs, and legal disclaimers.
                </p>
              </div>
              {settingsSaved && (
                <div className="text-xs font-bold text-emerald-600 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  <span>Changes Saved Live!</span>
                </div>
              )}
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                await updateBrand(settingsForm);
                setSettingsSaved(true);
                setTimeout(() => setSettingsSaved(false), 3000);
              }}
              className="space-y-6 text-xs"
            >
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Brand Logo Image (Official Uploaded Logo)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shrink-0 shadow-xs text-center" title="Light Header Logo">
                      <span className="block text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Header Logo</span>
                      <img
                        src="/verivia-header-logo.svg"
                        alt="Brand Header Logo"
                        className="h-10 w-auto object-contain"
                      />
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 shrink-0 shadow-xs text-center" title="White Footer Logo">
                      <span className="block text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">White Footer Logo</span>
                      <img
                        src="/verivia-footer-logo.svg"
                        alt="Brand Footer White Logo"
                        className="h-10 w-auto object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-1.5">
                    <input
                      type="text"
                      value={settingsForm.logoUrl || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                      placeholder="/verivia-header-logo.svg"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                    />
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Brand vector logo:</span>
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '/verivia-header-logo.svg' })}
                        className="text-[#2F80C9] hover:underline font-mono cursor-pointer"
                      >
                        /verivia-header-logo.svg
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.brandName}
                    onChange={e => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Phone Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp Number (with country code)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Office Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={settingsForm.primaryCtaText}
                    onChange={e => setSettingsForm({ ...settingsForm, primaryCtaText: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={settingsForm.secondaryCtaText}
                    onChange={e => setSettingsForm({ ...settingsForm, secondaryCtaText: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Medical Disclaimer Language (Shown on all pages)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.disclaimerText}
                  onChange={e => setSettingsForm({ ...settingsForm, disclaimerText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Save Global Brand Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* LEAD DETAIL & COMMUNICATION MODAL */}
      {selectedLead && (() => {
        const selectedDisplayName = (selectedLead.fullName || (selectedLead as any).patientName || (selectedLead as any).name || '').trim() || 'Patient';
        const selectedPhone = (selectedLead.whatsapp || (selectedLead as any).phone || '').trim() || 'N/A';
        const selectedTreatment = selectedLead.treatmentRequired || (selectedLead as any).preferredTreatment || 'General Medical Evaluation';
        const selectedTravel = selectedLead.expectedTravelMonth || (selectedLead as any).tentativeTravelMonth || 'Flexible';

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
              <div className="bg-gradient-to-r from-[#0B5A91] to-[#2F80C9] p-5 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs text-sky-200 uppercase font-semibold tracking-wider">
                    Comprehensive Patient Enquiry & Clinical Dossier
                  </div>
                  <h3 className="text-lg font-bold font-['Poppins']">
                    {selectedDisplayName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-white hover:text-sky-200 text-sm font-bold cursor-pointer p-1"
                >
                  ✕ Close
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* 1. Patient Demographics & Contact */}
                <div className="space-y-1.5">
                  <div className="font-bold text-[#0B5A91] uppercase tracking-wider text-[11px]">
                    1. Patient Demographics & Contact Details
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Patient Full Name:</span>
                      <strong className="text-slate-800 text-sm">{selectedDisplayName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Country & City:</span>
                      <strong className="text-slate-800">{selectedLead.country}{selectedLead.city ? ` / ${selectedLead.city}` : ''}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email Address:</span>
                      <strong className="text-slate-800 break-all">{selectedLead.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">WhatsApp / Phone:</span>
                      <strong className="text-emerald-700">{selectedPhone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Age & Gender:</span>
                      <strong className="text-slate-800">{selectedLead.age ? `${selectedLead.age} Years` : 'Age N/A'} • {selectedLead.gender || 'Not specified'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Preferred Communication:</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-sky-100 text-[#0B5A91] font-semibold text-[10px]">
                        {selectedLead.preferredCommunication || 'WhatsApp'}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 text-[10px]">Submitted Date & Timestamp: </span>
                      <span className="text-slate-700 font-medium">
                        {new Date(selectedLead.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Clinical Requirements & Medical Preferences */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-bold text-[#0B5A91] uppercase tracking-wider text-[11px]">
                    2. Clinical & Treatment Requirements
                  </div>
                  <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Treatment Required:</span>
                        <div className="text-sm font-bold text-[#0B5A91]">{selectedTreatment}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Target Speciality / Procedure:</span>
                        <div className="font-semibold text-slate-800">
                          {selectedLead.preferredSpeciality || 'General Speciality Evaluation'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Preferred Hospital:</span>
                        <div className="font-semibold text-slate-800">
                          {selectedLead.preferredHospital ? `🏥 ${selectedLead.preferredHospital}` : 'Let Verivia Health recommend best hospital'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Preferred Destination City:</span>
                        <div className="font-semibold text-slate-800">
                          {selectedLead.preferredCity ? `📍 ${selectedLead.preferredCity}` : 'Flexible across top Indian medical hubs'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Primary Diagnosis / Medical Condition:</span>
                      <div className="font-semibold text-slate-800 mt-0.5">
                        {selectedLead.medicalCondition || 'No condition specified by patient'}
                      </div>
                    </div>

                    {selectedLead.medicalDescription && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Clinical History & Symptoms:</span>
                        <div className="p-2.5 rounded-lg bg-white border border-sky-100 text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed">
                          {selectedLead.medicalDescription}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Travel, Attendants & Concierge Stay */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-bold text-[#0B5A91] uppercase tracking-wider text-[11px]">
                    3. Travel & Concierge Stay Logistics
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Expected Travel Timeline:</span>
                      <strong className="text-slate-800">{selectedTravel}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Accompanying Attendants:</span>
                      <strong className="text-slate-800">{selectedLead.accompanyingPersons || '1'} Person(s)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Hotel / Recovery Stay:</span>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${selectedLead.accommodationRequired ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                        {selectedLead.accommodationRequired ? 'Requested (Near Hospital)' : 'Not Requested'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Airport Chauffeur Transfer:</span>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${selectedLead.airportAssistanceRequired ? 'bg-sky-100 text-[#0B5A91]' : 'bg-slate-200 text-slate-600'}`}>
                        {selectedLead.airportAssistanceRequired ? 'Requested (Complimentary)' : 'Not Requested'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Compliance & Patient Authorisations */}
                <div className="flex flex-wrap gap-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Data Privacy Consent: <strong className="text-emerald-700">{selectedLead.privacyConsent ? 'Authorized' : 'Pending'}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Hospital Board Record Sharing: <strong className="text-emerald-700">{selectedLead.hospitalSharingConsent ? 'Authorized' : 'Pending'}</strong></span>
                  </div>
                </div>

              {/* Uploaded Documents */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#2F80C9]" />
                    <span>Attached Medical Reports & Scans ({selectedLead.documents?.length || 0}):</span>
                  </span>
                  {selectedLead.documents && selectedLead.documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        selectedLead.documents.forEach((doc, idx) => {
                          setTimeout(() => downloadMedicalDocument(doc), idx * 300);
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#0B5A91] hover:bg-sky-100 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download All ({selectedLead.documents.length})</span>
                    </button>
                  )}
                </div>

                {selectedLead.documents && selectedLead.documents.length > 0 ? (
                  <div className="space-y-2 mt-1">
                    {selectedLead.documents.map(doc => {
                      const isImage = doc.type?.includes('image') || doc.name?.match(/\.(jpg|jpeg|png|webp)$/i);
                      return (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#0B5A91] flex items-center justify-center shrink-0 shadow-xs">
                              {isImage ? (
                                <ImageIcon className="w-4 h-4 text-[#2F80C9]" />
                              ) : (
                                <FileText className="w-4 h-4 text-[#2F80C9]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 text-xs truncate max-w-xs sm:max-w-sm">
                                {doc.name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                                <span>{doc.size ? `${Math.round(doc.size / 1024)} KB` : 'Attached file'}</span>
                                <span>•</span>
                                <span className="inline-flex items-center text-emerald-600 font-medium">
                                  <CheckCircle2 className="w-3 h-3 mr-0.5" />
                                  Saved in Firebase
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[#0B5A91] hover:bg-sky-50 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                              title="View and inspect scan/report"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#2F80C9]" />
                              <span>View Scan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadMedicalDocument(doc)}
                              className="px-3 py-1.5 rounded-lg bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                              title="Download document to computer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs mt-1">No medical files attached with this enquiry.</p>
                )}
              </div>

              {/* Status Update & Internal Notes */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Lead Pipeline Status
                    </label>
                    <select
                      value={selectedLead.status}
                      onChange={e => {
                        const newStatus = e.target.value as any;
                        updateLead(selectedLead.id, { status: newStatus });
                        setSelectedLead({ ...selectedLead, status: newStatus });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Treatment Planning">Treatment Planning</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Assigned Patient Coordinator
                    </label>
                    <input
                      type="text"
                      value={selectedLead.assignedStaff || ''}
                      onChange={e => {
                        updateLead(selectedLead.id, { assignedStaff: e.target.value });
                        setSelectedLead({ ...selectedLead, assignedStaff: e.target.value });
                      }}
                      placeholder="e.g. Dr. Neha Sharma"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Internal Coordination Notes (Shared with Medical Panel)
                  </label>
                  <textarea
                    rows={3}
                    value={leadInternalNotes}
                    onChange={e => setLeadInternalNotes(e.target.value)}
                    placeholder="Add clinical board opinions, hospital quotations, or visa dispatch remarks..."
                    className="w-full p-2.5 rounded-lg border border-slate-200"
                  />
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Notes are saved directly to Firebase lead document.</span>
                    <button
                      type="button"
                      onClick={() => {
                        updateLead(selectedLead.id, { internalNotes: leadInternalNotes });
                      }}
                      className="px-3.5 py-1.5 bg-[#2F80C9] hover:bg-[#0B5A91] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Save Internal Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* MEDICAL DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#0B5A91] flex items-center justify-center shrink-0">
                  {previewDoc.type?.includes('image') || previewDoc.name?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                    <ImageIcon className="w-5 h-5 text-[#2F80C9]" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#2F80C9]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate font-['Poppins']">
                    {previewDoc.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                    <span>{previewDoc.size ? `${Math.round(previewDoc.size / 1024)} KB` : 'Attached Document'}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" />
                      Stored in Firebase
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => downloadMedicalDocument(previewDoc)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2F80C9] text-white text-xs font-bold hover:bg-[#0B5A91] flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                {(previewDoc.url || previewDoc.dataBase64) && (
                  <a
                    href={previewDoc.url || previewDoc.dataBase64}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer inline-flex items-center"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-900/5 flex items-center justify-center min-h-[400px]">
              {previewDoc.type?.includes('image') || previewDoc.name?.match(/\.(jpg|jpeg|png|webp)$/i) || previewDoc.url?.startsWith('data:image/') || previewDoc.dataBase64?.startsWith('data:image/') ? (
                <div className="max-w-full max-h-[70vh] flex items-center justify-center overflow-auto rounded-xl bg-slate-950 p-2 shadow-lg">
                  <img
                    src={previewDoc.url || previewDoc.dataBase64}
                    alt={previewDoc.name}
                    className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg"
                  />
                </div>
              ) : previewDoc.type?.includes('pdf') || previewDoc.name?.match(/\.pdf$/i) || previewDoc.url?.startsWith('data:application/pdf') || previewDoc.dataBase64?.startsWith('data:application/pdf') ? (
                <iframe
                  src={previewDoc.url || previewDoc.dataBase64}
                  title={previewDoc.name}
                  className="w-full h-[70vh] rounded-2xl border border-slate-200 bg-white shadow-md"
                />
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md shadow-md">
                  <div className="w-16 h-16 bg-sky-50 text-[#2F80C9] rounded-2xl mx-auto flex items-center justify-center">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold text-slate-800">{previewDoc.name}</h5>
                    <p className="text-xs text-slate-500 mt-1">
                      This medical report format can be downloaded and opened directly in your local application.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadMedicalDocument(previewDoc)}
                    className="px-5 py-2.5 rounded-xl bg-[#2F80C9] text-white text-xs font-bold hover:bg-[#0B5A91] inline-flex items-center space-x-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File ({Math.round((previewDoc.size || 0) / 1024)} KB)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT HOSPITAL MODAL */}
      {editingHospital && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">Edit Hospital: {editingHospital.name}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={editingHospital.name}
                  onChange={e => setEditingHospital({ ...editingHospital, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">City & State</label>
                <input
                  type="text"
                  value={editingHospital.city}
                  onChange={e => setEditingHospital({ ...editingHospital, city: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingHospital.description}
                  onChange={e => setEditingHospital({ ...editingHospital, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingHospital.coverImage}
                  onChange={e => setEditingHospital({ ...editingHospital, coverImage: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingHospital(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveHospital(editingHospital);
                  setEditingHospital(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2F80C9] cursor-pointer"
              >
                Save Hospital
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DOCTOR MODAL (Full details, clinical expertise, qualifications, and Firebase image upload) */}
      {editingDoctor && (
        <EditDoctorModal
          doctor={editingDoctor}
          hospitals={hospitals}
          treatments={treatments}
          onSave={async (updatedDoc) => {
            await saveDoctor(updatedDoc);
            setEditingDoctor(null);
          }}
          onClose={() => setEditingDoctor(null)}
        />
      )}

      {/* EDIT TREATMENT MODAL */}
      {editingTreatment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">Edit Treatment: {editingTreatment.name}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Treatment Name</label>
                <input
                  type="text"
                  value={editingTreatment.name}
                  onChange={e => setEditingTreatment({ ...editingTreatment, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Indicative Min USD</label>
                  <input
                    type="number"
                    value={editingTreatment.indicativeCostMinUSD}
                    onChange={e => setEditingTreatment({ ...editingTreatment, indicativeCostMinUSD: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Indicative Max USD</label>
                  <input
                    type="number"
                    value={editingTreatment.indicativeCostMaxUSD}
                    onChange={e => setEditingTreatment({ ...editingTreatment, indicativeCostMaxUSD: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Cost Notes (Mandatory Disclaimer)</label>
                <textarea
                  rows={2}
                  value={editingTreatment.costNotes}
                  onChange={e => setEditingTreatment({ ...editingTreatment, costNotes: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingTreatment(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveTreatment(editingTreatment);
                  setEditingTreatment(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2F80C9] cursor-pointer"
              >
                Save Treatment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PACKAGE MODAL */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">Edit Package: {editingPackage.packageName}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Package Name</label>
                <input
                  type="text"
                  value={editingPackage.packageName}
                  onChange={e => setEditingPackage({ ...editingPackage, packageName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Min Price (USD)</label>
                  <input
                    type="number"
                    value={editingPackage.minPriceUSD}
                    onChange={e => setEditingPackage({ ...editingPackage, minPriceUSD: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Max Price (USD)</label>
                  <input
                    type="number"
                    value={editingPackage.maxPriceUSD}
                    onChange={e => setEditingPackage({ ...editingPackage, maxPriceUSD: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  savePackage(editingPackage);
                  setEditingPackage(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2F80C9] cursor-pointer"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT HOTEL MODAL (Full details, proximity indicators, amenities, and Firebase image upload) */}
      {editingHotel && (
        <EditHotelModal
          hotel={editingHotel}
          hospitals={hospitals}
          onSave={async (updatedHotel) => {
            await saveHotel(updatedHotel);
            setEditingHotel(null);
          }}
          onClose={() => setEditingHotel(null)}
        />
      )}
    </div>
  );
};
