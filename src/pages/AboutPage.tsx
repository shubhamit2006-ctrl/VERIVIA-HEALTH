import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_ABOUT_US_CONTENT, INITIAL_TEAM_MEMBERS } from '../initialData';
import { TeamMember } from '../types';
import { db, storage } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import {
  ShieldCheck,
  Stethoscope,
  Workflow,
  Cpu,
  HeartHandshake,
  ArrowRight,
  MessageCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
  openEnquiryModal: (params?: { treatment?: string; hospital?: string; doctor?: string }) => void;
}

const STRENGTH_ICONS = [Stethoscope, Workflow, Cpu, HeartHandshake];

/**
 * Robust Team Member Photograph Component:
 * Pulls image from Firebase Storage if photoStoragePath is present,
 * or from Firestore photoUrl (Data URL or Storage URL),
 * with instant fallback to verified high-resolution static asset if needed.
 */
const TeamMemberPhoto: React.FC<{ member: TeamMember }> = ({ member }) => {
  const getInitialSrc = (): string => {
    if (member.photoUrl) return member.photoUrl;
    if (member.id === 'dr-dk-agrawal') return '/images/team/dr-dk-agrawal.jpg';
    if (member.id === 'swati-soam') return '/images/team/swati-soam.jpg';
    return '';
  };

  const [imgSrc, setImgSrc] = useState<string>(getInitialSrc);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    // 1. If photoStoragePath is provided, pull fresh download URL from Firebase Storage
    if (member.photoStoragePath && storage) {
      const storageRef = ref(storage, member.photoStoragePath);
      getDownloadURL(storageRef)
        .then(downloadUrl => {
          if (!isCancelled && downloadUrl) {
            setImgSrc(downloadUrl);
            setLoadError(false);
          }
        })
        .catch(() => {
          // Fall back to photoUrl or local assets
          if (!isCancelled) {
            if (member.photoUrl) {
              setImgSrc(member.photoUrl);
            } else if (member.id === 'dr-dk-agrawal') {
              setImgSrc('/images/team/dr-dk-agrawal.jpg');
            } else if (member.id === 'swati-soam') {
              setImgSrc('/images/team/swati-soam.jpg');
            }
          }
        });
    } else if (member.photoUrl) {
      setImgSrc(member.photoUrl);
      setLoadError(false);
    } else if (member.id === 'dr-dk-agrawal') {
      setImgSrc('/images/team/dr-dk-agrawal.jpg');
      setLoadError(false);
    } else if (member.id === 'swati-soam') {
      setImgSrc('/images/team/swati-soam.jpg');
      setLoadError(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [member.photoUrl, member.photoStoragePath, member.id]);

  const handleImageError = () => {
    // If external URL or data URL fails, fallback to local verified assets for founders
    if (member.id === 'dr-dk-agrawal' && imgSrc !== '/images/team/dr-dk-agrawal.jpg') {
      setImgSrc('/images/team/dr-dk-agrawal.jpg');
      setLoadError(false);
    } else if (member.id === 'swati-soam' && imgSrc !== '/images/team/swati-soam.jpg') {
      setImgSrc('/images/team/swati-soam.jpg');
      setLoadError(false);
    } else {
      setLoadError(true);
    }
  };

  if (!imgSrc || loadError) {
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 text-[#0B5A91] flex items-center justify-center font-bold text-2xl font-['Poppins'] shrink-0 shadow-xs border-2 border-white">
        {member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={member.fullName}
      onError={handleImageError}
      loading="eager"
      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-md shrink-0 block"
    />
  );
};

export const AboutPage: React.FC<AboutPageProps> = ({ navigate, openEnquiryModal }) => {
  const { aboutUsContent, teamMembers, brand } = useApp();
  const [liveTeam, setLiveTeam] = useState<TeamMember[]>(teamMembers);

  // Update page title on mount
  useEffect(() => {
    document.title = 'About Us | VERIVIA GLOBAL';
  }, []);

  // Directly subscribe to Firestore 'aboutUsTeam' on the live website to pull latest stored images
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'aboutUsTeam'), (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
          setLiveTeam(items.sort((a, b) => a.displayOrder - b.displayOrder));
        }
      }, (err) => {
        console.warn('Live team listener notice:', err);
      });
      return () => unsub();
    } catch {
      // Fallback to app context
    }
  }, []);

  // Sync when teamMembers from context updates
  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      setLiveTeam(teamMembers);
    }
  }, [teamMembers]);

  const content = aboutUsContent && aboutUsContent.heroHeadline ? aboutUsContent : INITIAL_ABOUT_US_CONTENT;
  const publishedTeam = (liveTeam && liveTeam.length > 0 ? liveTeam : INITIAL_TEAM_MEMBERS)
    .filter(m => m.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="min-h-screen bg-[#F5FAFD]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-br from-[#073656] via-[#0B5A91] to-[#1E6FA8] text-white py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2F80C9]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{content.heroEyebrow || 'ABOUT VERIVIA GLOBAL'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Poppins'] leading-tight">
              {content.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-sky-100/90 leading-relaxed font-normal">
              {content.heroSupportingText}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openEnquiryModal()}
                className="px-7 py-3.5 rounded-xl bg-[#2F80C9] hover:bg-[#256bb0] text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-950/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center space-x-2"
              >
                <span>{content.primaryCtaText || 'Share Your Medical Needs'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/how-it-works')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm sm:text-base transition-colors cursor-pointer"
              >
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHO WE ARE */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Foundational Purpose</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
              {content.whoWeAreHeading}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 subtle-card-shadow space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
            {content.whoWeAreContent.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="font-normal text-slate-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OUR LEADERSHIP TEAM */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
              Leadership & Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
              {content.leadershipHeading}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              {content.leadershipSupportingText}
            </p>
          </div>

          {/* Dynamic Leadership Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {publishedTeam.map(member => (
              <div
                key={member.id}
                className="bg-[#F8FBFE] rounded-3xl border border-slate-200/80 p-8 sm:p-10 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow relative"
              >
                <div className="space-y-6">
                  {/* Member Top: Photo + Name + Designation + Descriptor */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <TeamMemberPhoto member={member} />

                    <div className="space-y-1.5 min-w-0">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#0B5A91] text-white text-xs font-bold tracking-wide uppercase">
                        {member.designation}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-slate-900">
                        {member.fullName}
                      </h3>
                      {member.professionalDescriptor && (
                        <p className="text-xs font-semibold text-[#2F80C9] tracking-wide">
                          {member.professionalDescriptor}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Member Biography */}
                  <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-200/60 text-justify">
                    {member.biography.split('\n\n').map((para, pIdx) => (
                      <p key={pIdx} className="text-justify">{para}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                    Verified Leadership Profile
                  </span>
                  <span className="text-[11px] text-slate-400">VERIVIA GLOBAL</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ONE VISION, COMPLEMENTARY STRENGTHS */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            Integrated Strengths
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            {content.strengthsHeading}
          </h2>
          {content.strengthsDescription && (
            <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-2">
              {content.strengthsDescription.split('\n\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
        </div>

        {/* 4 Visual Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.strengths.map((point, idx) => {
            const Icon = STRENGTH_ICONS[idx % STRENGTH_ICONS.length] || ShieldCheck;
            return (
              <div
                key={point.id || idx}
                className="bg-white rounded-2xl p-7 border border-slate-100 subtle-card-shadow space-y-4 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0B5A91] flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold font-['Poppins'] text-slate-900">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
                <div className="text-[11px] font-bold text-[#2F80C9] tracking-wider uppercase pt-2 border-t border-slate-100">
                  Pillar 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR COMMITMENT */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8 text-center">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ethical Standards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins']">
            {content.commitmentHeading}
          </h2>

          <div className="bg-[#F8FBFE] rounded-3xl p-8 sm:p-10 border border-slate-200/80 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
            {content.commitmentContent.split('\n\n').map((p, idx) => (
              <p key={idx} className="font-normal text-slate-600 leading-relaxed">
                {p}
              </p>
            ))}

            {content.brandTagline && (
              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm sm:text-base font-bold text-[#0B5A91] font-['Poppins'] tracking-wide">
                  "{content.brandTagline}"
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-[#0B5A91] via-[#1E6FA8] to-[#2F80C9] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Poppins']">
            {content.closingCtaHeading}
          </h2>
          <p className="text-sm sm:text-base text-sky-100 max-w-2xl mx-auto leading-relaxed">
            {content.closingCtaSupportingText}
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => openEnquiryModal()}
              className="px-8 py-3.5 rounded-xl bg-white text-[#0B5A91] font-bold text-sm sm:text-base hover:bg-sky-50 shadow-lg shadow-sky-950/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {content.closingCtaButtonLabel || 'Share Your Medical Needs'}
            </button>

            <a
              href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20would%20like%20to%20learn%20more%20about%20VERIVIA%20GLOBAL.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base transition-colors inline-flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

          <div className="pt-4 text-xs text-sky-200">
            {brand.address} • Phone: {brand.phone}
          </div>
        </div>
      </section>
    </div>
  );
};
