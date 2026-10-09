import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LeadFormModal } from './components/LeadFormModal';
import { HomePage } from './pages/HomePage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { TreatmentDetailPage } from './pages/TreatmentDetailPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { HospitalDetailPage } from './pages/HospitalDetailPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { PackagesPage } from './pages/PackagesPage';
import { StayPage } from './pages/StayPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { JourneyPage } from './pages/JourneyPage';
import { FaqPage } from './pages/FaqPage';
import { AdminPanel } from './pages/AdminPanel';

function AppContent() {
  // Simple, robust client-side routing based on window hash or location
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  // Global Lead Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalPreselected, setLeadModalPreselected] = useState<{
    treatment?: string;
    hospital?: string;
    doctor?: string;
    fullName?: string;
    country?: string;
    city?: string;
    email?: string;
    whatsapp?: string;
    medicalCondition?: string;
  }>({});

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash ? window.location.hash.replace('#', '') : '/';
      setCurrentPath(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEnquiryModal = (params?: {
    treatment?: string;
    hospital?: string;
    doctor?: string;
    fullName?: string;
    country?: string;
    city?: string;
    email?: string;
    whatsapp?: string;
    medicalCondition?: string;
  }) => {
    setLeadModalPreselected(params || {});
    setIsLeadModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsLeadModalOpen(false);
    setLeadModalPreselected({});
  };

  // Route Dispatcher
  const renderRoute = () => {
    // Admin route
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return <AdminPanel navigate={navigate} />;
    }

    // Treatments
    if (currentPath === '/treatments') {
      return <TreatmentsPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
    }
    if (currentPath.startsWith('/treatments/')) {
      const slug = currentPath.replace('/treatments/', '');
      return (
        <TreatmentDetailPage
          slug={slug}
          navigate={navigate}
          openEnquiryModal={openEnquiryModal}
        />
      );
    }

    // Hospitals
    if (currentPath === '/hospitals') {
      return <HospitalsPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
    }
    if (currentPath.startsWith('/hospitals/')) {
      const slug = currentPath.replace('/hospitals/', '');
      return (
        <HospitalDetailPage
          slug={slug}
          navigate={navigate}
          openEnquiryModal={openEnquiryModal}
        />
      );
    }

    // Doctors
    if (currentPath === '/doctors') {
      return <DoctorsPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
    }
    if (currentPath.startsWith('/doctors/')) {
      const slug = currentPath.replace('/doctors/', '');
      return (
        <DoctorDetailPage
          slug={slug}
          navigate={navigate}
          openEnquiryModal={openEnquiryModal}
        />
      );
    }

    // Packages
    if (currentPath === '/packages') {
      return <PackagesPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
    }

    // Stay / Hotels
    if (currentPath === '/stay') {
      return <StayPage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
    }
    if (currentPath.startsWith('/stay/')) {
      const slug = currentPath.replace('/stay/', '');
      return (
        <HotelDetailPage
          slug={slug}
          navigate={navigate}
          openEnquiryModal={openEnquiryModal}
        />
      );
    }

    // How It Works / Journey
    if (currentPath === '/how-it-works') {
      return <JourneyPage openEnquiryModal={() => openEnquiryModal()} />;
    }

    // FAQs
    if (currentPath === '/faq') {
      return <FaqPage />;
    }

    // Default Home Page
    return <HomePage navigate={navigate} openEnquiryModal={openEnquiryModal} />;
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FAFD] font-['Inter'] text-slate-800">
      {/* Header (Hidden in Admin for dedicated CMS chrome) */}
      {!isAdminRoute && (
        <Header
          currentRoute={currentPath}
          navigate={navigate}
          openEnquiryModal={openEnquiryModal}
        />
      )}

      {/* Main Routed Content */}
      <main className="flex-1">{renderRoute()}</main>

      {/* Footer (Hidden in Admin) */}
      {!isAdminRoute && (
        <Footer navigate={navigate} openEnquiryModal={openEnquiryModal} />
      )}

      {/* Universal 2-Step Lead Capture Modal */}
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={closeEnquiryModal}
        preselectedTreatment={leadModalPreselected.treatment}
        preselectedHospital={leadModalPreselected.hospital}
        preselectedDoctor={leadModalPreselected.doctor}
        preselectedName={leadModalPreselected.fullName}
        preselectedCountry={leadModalPreselected.country}
        preselectedCity={leadModalPreselected.city}
        preselectedEmail={leadModalPreselected.email}
        preselectedPhone={leadModalPreselected.whatsapp}
        preselectedCondition={leadModalPreselected.medicalCondition}
      />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
