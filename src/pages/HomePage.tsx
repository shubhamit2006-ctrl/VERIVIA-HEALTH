import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TreatmentCard } from '../components/TreatmentCard';
import { HospitalCard } from '../components/HospitalCard';
import { DoctorCard } from '../components/DoctorCard';
import { PackageCard } from '../components/PackageCard';
import { HotelCard } from '../components/HotelCard';
import { HeartSurgeryCostComparison } from '../components/HeartSurgeryCostComparison';
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  HeartPulse,
  Activity,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Globe2,
  ChevronRight,
  Plane,
  FileCheck,
  Languages,
  Award,
  Users,
  Search,
  Sparkles,
  PhoneCall,
  Clock,
  Layers,
  Car,
  Home,
  HeartHandshake,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string) => void;
  openEnquiryModal: (params?: {
    treatment?: string;
    hospital?: string;
    doctor?: string;
    fullName?: string;
    country?: string;
    city?: string;
    email?: string;
    whatsapp?: string;
    medicalCondition?: string;
  }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, openEnquiryModal }) => {
  const {
    brand,
    treatments,
    hospitals,
    doctors,
    packages,
    hotels,
    testimonials,
    faqs,
    whyIndia,
    journeySteps
  } = useApp();

  // Floating enquiry card state
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryCountry, setEnquiryCountry] = useState('');
  const [enquiryCondition, setEnquiryCondition] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');

  // FAQ Accordion active state
  const [activeFaq, setActiveFaq] = useState<string | null>(faqs[0]?.id || null);

  const handleHeroFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openEnquiryModal({
      fullName: enquiryName,
      country: enquiryCountry,
      email: enquiryEmail,
      whatsapp: enquiryPhone,
      medicalCondition: enquiryCondition,
      treatment: enquiryCondition
    });
  };

  const publishedTreatments = treatments.filter(t => t.published);
  const publishedHospitals = hospitals.filter(h => h.published);
  const publishedDoctors = doctors.filter(d => d.published);
  const publishedPackages = packages.filter(p => p.published);
  const publishedHotels = hotels.filter(h => h.published);
  const publishedTestimonials = testimonials.filter(t => t.published);
  const publishedFaqs = faqs.filter(f => f.published);

  return (
    <div className="min-h-screen bg-[#F5FAFD] flex flex-col">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO (Large full-width healthcare visual + floating enquiry card) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-slate-900 pt-12 pb-24 lg:pt-20 lg:pb-32 text-white">
        {/* Background photo with deep medical gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=85"
            alt="World-Class Medical Care in India"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transform animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Value Hierarchy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Brand Indicator & Trust Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white tracking-wide">VERIVIA HEALTH</span>
                  <span className="text-sky-300/40">|</span>
                  <span className="text-sky-200 font-medium">International Patient Services</span>
                </div>
                <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-xs text-sky-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>JCI & NABH Hospital Alliances</span>
                </div>
              </div>

              {/* Main Headline with Tagline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-['Poppins']">
                Your Global Gateway to{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-blue-200">
                  Trusted Healthcare in India.
                </span>
              </h1>

              {/* Reassuring Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Verivia Health connects international patients and families with leading tertiary hospitals, board-certified surgeons, and personalised treatment packages in India — with complete concierge care from arrival to safe recovery.
              </p>

              {/* Hierarchy Badges (QUALITY -> EXPERTISE -> TRUST -> CONVENIENCE -> VALUE) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center space-x-2 bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <Award className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-slate-200 font-medium">JCI Accreditations</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium">Board-Certified Specialists</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                  <Globe2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-slate-200 font-medium">End-to-End Concierge</span>
                </div>
              </div>

              {/* Hero Action CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  id="hero-primary-cta"
                  onClick={() => openEnquiryModal()}
                  className="px-7 py-3.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center space-x-2"
                >
                  <span>{brand.primaryCtaText || 'Get a Treatment Plan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="hero-secondary-cta"
                  onClick={() => navigate('/treatments')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  {brand.secondaryCtaText || 'Explore Treatments'}
                </button>
              </div>
            </div>

            {/* Right Floating Enquiry Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 floating-card-shadow border border-white/80 relative">
                <div className="absolute -top-3.5 right-6 bg-[#0B5A91] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Free Case Assessment
                </div>

                <div className="mb-5">
                  <h3 className="text-xl font-bold font-['Poppins'] text-slate-900">
                    Looking for treatment in India?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Share your medical requirement to receive clinical second opinions and itemised indicative costs.
                  </p>
                </div>

                <form onSubmit={handleHeroFormSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryName}
                      onChange={e => setEnquiryName(e.target.value)}
                      placeholder="e.g. John Doe / Fatimah Ali"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Country of Residence
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryCountry}
                      onChange={e => setEnquiryCountry(e.target.value)}
                      placeholder="e.g. Kenya, Oman, UAE, UK, Nigeria"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Treatment / Medical Condition
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryCondition}
                      onChange={e => setEnquiryCondition(e.target.value)}
                      placeholder="e.g. Heart bypass, Knee replacement, Cancer care"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryPhone}
                      onChange={e => setEnquiryPhone(e.target.value)}
                      placeholder="+968 9123 4567"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryEmail}
                      onChange={e => setEnquiryEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-slate-400 pt-1">
                    🔒 Strict medical confidentiality. Zero obligation.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Curved / Wave section transition to the next section */}
        <div className="absolute bottom-0 inset-x-0 leading-none">
          <svg
            className="w-full h-8 sm:h-14 text-[#F5FAFD] fill-current"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUST INDICATORS STRIP */}
      {/* ========================================================================= */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-8 items-center text-center">
            <div className="p-3">
              <div className="text-xl sm:text-2xl font-bold text-[#0B5A91] font-['Poppins']">JCI & NABH</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Accredited Centres</div>
            </div>
            <div className="p-3">
              <div className="text-xl sm:text-2xl font-bold text-[#0B5A91] font-['Poppins']">35,000+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Annual Overseas Cases</div>
            </div>
            <div className="p-3">
              <div className="text-xl sm:text-2xl font-bold text-[#0B5A91] font-['Poppins']">15+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Specialist Disciplines</div>
            </div>
            <div className="p-3">
              <div className="text-xl sm:text-2xl font-bold text-[#0B5A91] font-['Poppins']">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Transparent Estimates</div>
            </div>
            <div className="p-3 col-span-2 md:col-span-1">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-['Poppins']">End-to-End</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Visa & Concierge Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHY PATIENTS CONSIDER INDIA */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Excellence & Patient Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            Why Patients Worldwide Consider India
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Leading Indian healthcare institutions blend internationally trained surgical talent with cutting-edge medical technology and dedicated overseas patient services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyIndia.map(point => (
            <div
              key={point.id}
              className="p-6 rounded-2xl bg-white subtle-card-shadow border border-slate-100 hover:border-sky-200 transition-all hover:shadow-lg space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0B5A91] group-hover:bg-[#2F80C9] group-hover:text-white transition-colors flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                {point.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: EXPLORE TREATMENTS */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
                Specialised Clinical Disciplines
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-['Poppins']">
                Comprehensive Medical Treatments
              </h2>
              <p className="text-sm text-slate-500 max-w-xl">
                Explore tertiary procedures, expected stay durations, and indicative pricing across premier accredited surgical faculties.
              </p>
            </div>
            <button
              onClick={() => navigate('/treatments')}
              className="inline-flex items-center text-sm font-semibold text-[#0B5A91] hover:text-[#2F80C9] transition-colors cursor-pointer group"
            >
              <span>View All Specialities</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedTreatments.slice(0, 6).map(treatment => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
                onSelect={slug => navigate(`/treatments/${slug}`)}
                onEnquire={name => openEnquiryModal({ treatment: name })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: FEATURED HOSPITALS */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
              Accredited Medical Centres
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-['Poppins']">
              Leading Partner Hospital Networks
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Institutes equipped with JCI and NABH benchmarks, cutting-edge robotic surgical suites, and dedicated multi-lingual patient desks.
            </p>
          </div>
          <button
            onClick={() => navigate('/hospitals')}
            className="inline-flex items-center text-sm font-semibold text-[#0B5A91] hover:text-[#2F80C9] transition-colors cursor-pointer group"
          >
            <span>Browse All Hospitals</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedHospitals.slice(0, 3).map(hospital => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onSelect={slug => navigate(`/hospitals/${slug}`)}
              onEnquire={name => openEnquiryModal({ hospital: name })}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: FEATURED SPECIALISTS */}
      {/* ========================================================================= */}
      <section className="py-16 bg-sky-50/40 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
                Distinguished Clinicians
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-['Poppins']">
                Consult Renowned Specialists
              </h2>
              <p className="text-sm text-slate-500 max-w-xl">
                Surgeons with extensive international credentials (FRCS, American Board) and thousands of documented successful cases.
              </p>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              className="inline-flex items-center text-sm font-semibold text-[#0B5A91] hover:text-[#2F80C9] transition-colors cursor-pointer group"
            >
              <span>View All Specialists</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedDoctors.slice(0, 3).map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSelect={slug => navigate(`/doctors/${slug}`)}
                onEnquire={name => openEnquiryModal({ doctor: name })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: HOW IT WORKS (13-step Visual Timeline) */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            Clear, Seamless Concierge Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            Your Medical Journey, Simplified
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            From initial report assessment to safe post-treatment recovery at home, our dedicated coordinators guide every step of your care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(journeySteps && journeySteps.length > 0 ? journeySteps.slice(0, 4) : [
            { stepNumber: 1, title: 'Share Medical Reports', description: 'Upload your recent investigations, scans, and clinical history for confidential panel review.' },
            { stepNumber: 2, title: 'Clinical Review & Estimates', description: 'Receive 2-3 hospital options, specialist opinions, and transparent indicative treatment costs.' },
            { stepNumber: 3, title: 'Medical Visa & Travel', description: 'Receive official hospital visa invitation letters and assistance with attendant (MedX) visas.' },
            { stepNumber: 4, title: 'Arrival & Treatment', description: 'Airport reception, hotel check-in, interpreter support, hospital admission, and recovery.' }
          ]).map((step, idx) => (
            <div key={step.stepNumber || idx} className="p-6 bg-white rounded-2xl border border-slate-100 subtle-card-shadow relative space-y-3">
              <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm ${
                idx === 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-[#0B5A91]'
              }`}>
                {String(step.stepNumber).padStart(2, '0')}
              </div>
              <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/how-it-works')}
            className="px-6 py-2.5 rounded-xl bg-sky-50 text-[#0B5A91] border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors cursor-pointer"
          >
            Explore the Complete Patient Journey Guide ({journeySteps?.length || 8} Stages)
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: INDICATIVE PACKAGES */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
                Transparent Cost Comparison
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-['Poppins']">
                Indicative Treatment Packages
              </h2>
              <p className="text-sm text-slate-500 max-w-xl">
                Pre-evaluated bundles linking accredited hospital admission, surgeon fees, and standard stays. Final quotation issued following clinical evaluation.
              </p>
            </div>
            <button
              onClick={() => navigate('/packages')}
              className="inline-flex items-center text-sm font-semibold text-[#0B5A91] hover:text-[#2F80C9] transition-colors cursor-pointer group"
            >
              <span>Explore All Packages</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedPackages.slice(0, 3).map(pkg => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEnquire={name => openEnquiryModal({ treatment: name })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: INTERNATIONAL PATIENT SUPPORT & CONCIERGE */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
              Dedicated Overseas Assistance
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-['Poppins'] leading-tight">
              Personalised Support From Day One
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Travelling abroad for medical treatment requires thoughtful logistics and clear communication. Our multi-lingual patient desk ensures you and your family are supported throughout.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Expedited Medical Visa Letters</h4>
                  <p className="text-xs text-slate-500">Fast-tracked hospital sponsorship documentation for patients and attendant visas.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Airport Pickup & Local Chauffeur</h4>
                  <p className="text-xs text-slate-500">Dedicated vehicle arrival reception with international mobile SIM cards and currency assistance.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Multi-Lingual Interpreters</h4>
                  <p className="text-xs text-slate-500">Native Arabic, French, Russian, and Swahili coordinators during your hospital consultations.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => openEnquiryModal()}
              className="px-6 py-3 rounded-xl bg-[#2F80C9] text-white font-bold text-xs hover:bg-[#0B5A91] transition-colors cursor-pointer shadow-sm"
            >
              Speak with a Patient Coordinator
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
                alt="International Patient Services"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
                <div className="text-white space-y-1">
                  <div className="text-xs font-semibold text-sky-300 uppercase tracking-wider">Compassionate Care</div>
                  <div className="text-xl font-bold font-['Poppins']">Your Health & Comfort Come First</div>
                  <p className="text-xs text-slate-200">Continuous post-discharge follow-ups and telemetry reports shared with your home physician.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: STAY IN INDIA (Hotels & Recuperation) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
                Recuperation & Comfort
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-['Poppins']">
                Stay Comfortable While You Recover
              </h2>
              <p className="text-sm text-slate-500 max-w-xl">
                Partner hotels and serviced apartments located minutes away from hospitals, equipped with wheelchair access and long-stay rates.
              </p>
            </div>
            <button
              onClick={() => navigate('/stay')}
              className="inline-flex items-center text-sm font-semibold text-[#0B5A91] hover:text-[#2F80C9] transition-colors cursor-pointer group"
            >
              <span>Explore All Hotels</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedHotels.slice(0, 3).map(hotel => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onSelect={slug => navigate(`/stay/${slug}`)}
                onEnquire={name => openEnquiryModal({ treatment: `Hotel: ${name}` })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11: PATIENT STORIES (Demonstration Testimonials) */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            Consented Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            Global Patient Experiences
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Real stories from patients and families who travelled to India for specialised cardiac, orthopaedic, and neurosurgical procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedTestimonials.map(test => (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-white subtle-card-shadow border border-slate-100 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-400 text-xs">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{test.story}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                {test.imageUrl ? (
                  <img
                    src={test.imageUrl}
                    alt={test.patientName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0B5A91] font-bold flex items-center justify-center shrink-0">
                    {test.patientName[0]}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-900 font-['Poppins']">
                    {test.patientName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {test.country} • <span className="text-[#0B5A91] font-medium">{test.treatment}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HEART SURGERY COST COMPARISON ABROAD VS HOME */}
      {/* ========================================================================= */}
      <HeartSurgeryCostComparison openEnquiryModal={openEnquiryModal} />

      {/* ========================================================================= */}
      {/* SECTION 12: FAQS ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
              Common Inquiries
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-['Poppins']">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500">
              Clear answers regarding medical visas, hospital accreditations, billing transparency, and post-discharge travel.
            </p>
          </div>

          <div className="space-y-3">
            {publishedFaqs.map(faq => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-800">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180 text-[#2F80C9]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 13: REQUEST TREATMENT PLAN (FINAL CTA STRIP) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-tr from-[#0B5A91] to-[#2F80C9] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            Start Your Medical Planning Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] tracking-tight">
            Take the First Step Toward World-Class Healthcare
          </h2>
          <p className="text-sm sm:text-base text-sky-100 max-w-2xl mx-auto leading-relaxed">
            Our international patient facilitation team is ready to evaluate your clinical reports, recommend leading accredited centres, and prepare your personalised treatment estimates.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openEnquiryModal()}
              className="px-8 py-4 rounded-xl bg-white text-[#0B5A91] font-bold text-sm sm:text-base shadow-xl hover:bg-sky-50 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Request Free Second Opinion
            </button>
            <a
              href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20would%20like%20to%20consult%20regarding%20medical%20treatment%20in%20India.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer flex items-center space-x-2"
            >
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
