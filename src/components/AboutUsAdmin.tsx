import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AboutUsContent, TeamMember, ComplementaryStrength } from '../types';
import { uploadTeamPhotoToStorage, deleteTeamPhotoFromStorage } from '../utils/imageUpload';
import {
  Users,
  FileText,
  Save,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon,
  Shield,
  Sparkles,
  Info
} from 'lucide-react';

export const AboutUsAdmin: React.FC = () => {
  const {
    aboutUsContent,
    teamMembers,
    updateAboutUsContent,
    saveTeamMember,
    deleteTeamMember,
    reorderTeamMembers
  } = useApp();

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'team'>('content');

  // =========================================================================
  // PAGE CONTENT EDITOR STATE
  // =========================================================================
  const [contentForm, setContentForm] = useState<AboutUsContent>(aboutUsContent);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [contentFeedback, setContentFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setContentForm(aboutUsContent);
  }, [aboutUsContent]);

  const handleContentChange = (field: keyof AboutUsContent, value: any) => {
    setContentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleStrengthChange = (index: number, field: 'title' | 'description', value: string) => {
    setContentForm(prev => {
      const copy = [...prev.strengths];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return { ...prev, strengths: copy };
    });
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    setContentFeedback(null);

    // Validation
    if (!contentForm.heroHeadline.trim() || !contentForm.whoWeAreHeading.trim()) {
      setContentFeedback({ type: 'error', message: 'Hero Headline and Who We Are Heading are required.' });
      setIsSavingContent(false);
      return;
    }

    const res = await updateAboutUsContent(contentForm);
    if (res.success) {
      setContentFeedback({ type: 'success', message: 'About Us page content saved and published successfully!' });
      setTimeout(() => setContentFeedback(null), 4000);
    } else {
      setContentFeedback({ type: 'error', message: res.error || 'Failed to save changes.' });
    }
    setIsSavingContent(false);
  };

  const handleResetContent = () => {
    if (window.confirm('Discard all unsaved changes and reload saved content?')) {
      setContentForm(aboutUsContent);
      setContentFeedback(null);
    }
  };

  // =========================================================================
  // LEADERSHIP / MANAGEMENT TEAM STATE & MODALS
  // =========================================================================
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberFormData, setMemberFormData] = useState<{
    fullName: string;
    designationPreset: 'Founder' | 'Co-Founder' | 'Other';
    customDesignation: string;
    professionalDescriptor: string;
    biography: string;
    displayOrder: number;
    published: boolean;
    photoUrl: string;
    photoStoragePath: string;
  }>({
    fullName: '',
    designationPreset: 'Founder',
    customDesignation: '',
    professionalDescriptor: '',
    biography: '',
    displayOrder: 1,
    published: true,
    photoUrl: '',
    photoStoragePath: ''
  });

  // Selected new photo file for upload
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('Saving Profile...');
  const [memberSaveError, setMemberSaveError] = useState<string | null>(null);

  // Deletion confirmation state
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success / error banner for team tab
  const [teamToast, setTeamToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const openAddMemberModal = () => {
    setEditingMember(null);
    setMemberFormData({
      fullName: '',
      designationPreset: 'Founder',
      customDesignation: '',
      professionalDescriptor: '',
      biography: '',
      displayOrder: (teamMembers.length || 0) + 1,
      published: true,
      photoUrl: '',
      photoStoragePath: ''
    });
    setSelectedPhotoFile(null);
    setPhotoPreviewUrl('');
    setMemberSaveError(null);
    setIsMemberModalOpen(true);
  };

  const openEditMemberModal = (member: TeamMember) => {
    setEditingMember(member);
    const isStandard = member.designation === 'Founder' || member.designation === 'Co-Founder';
    setMemberFormData({
      fullName: member.fullName,
      designationPreset: isStandard ? (member.designation as 'Founder' | 'Co-Founder') : 'Other',
      customDesignation: isStandard ? '' : member.designation,
      professionalDescriptor: member.professionalDescriptor,
      biography: member.biography,
      displayOrder: member.displayOrder,
      published: member.published,
      photoUrl: member.photoUrl || '',
      photoStoragePath: member.photoStoragePath || ''
    });
    setSelectedPhotoFile(null);
    setPhotoPreviewUrl(member.photoUrl || '');
    setMemberSaveError(null);
    setIsMemberModalOpen(true);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME type check
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setMemberSaveError('Please select a JPEG, PNG, or WebP photograph.');
      return;
    }

    // Size limit check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMemberSaveError('Photograph size must be less than 5MB.');
      return;
    }

    setMemberSaveError(null);
    setSelectedPhotoFile(file);

    // Create client-side preview
    const preview = URL.createObjectURL(file);
    setPhotoPreviewUrl(preview);
  };

  const handleRemovePhoto = () => {
    setSelectedPhotoFile(null);
    setPhotoPreviewUrl('');
    setMemberFormData(prev => ({ ...prev, photoUrl: '', photoStoragePath: '' }));
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberSaveError(null);

    if (!memberFormData.fullName.trim()) {
      setMemberSaveError('Full Name is required.');
      return;
    }

    const resolvedDesignation =
      memberFormData.designationPreset === 'Other'
        ? memberFormData.customDesignation.trim() || 'Leadership'
        : memberFormData.designationPreset;

    setIsUploadingPhoto(true);
    setUploadStatusText(selectedPhotoFile ? 'Uploading photo to Firebase...' : 'Saving profile...');

    const targetId = editingMember ? editingMember.id : `member-${Date.now()}`;
    let finalPhotoUrl = memberFormData.photoUrl;
    let finalPhotoStoragePath = memberFormData.photoStoragePath;

    // If a new photograph was selected from disk, upload to Firebase
    if (selectedPhotoFile) {
      try {
        setUploadStatusText('Uploading photo to Firebase...');
        const { downloadUrl, storagePath } = await uploadTeamPhotoToStorage(targetId, selectedPhotoFile);
        finalPhotoUrl = downloadUrl;
        finalPhotoStoragePath = storagePath;

        // Clean up previous photo if replacing
        if (editingMember?.photoStoragePath && editingMember.photoStoragePath !== storagePath) {
          deleteTeamPhotoFromStorage(editingMember.photoStoragePath).catch(() => {});
        }
      } catch (uploadErr: any) {
        console.error('Storage upload error:', uploadErr);
        setMemberSaveError(uploadErr?.message || 'Failed to upload photo to Firebase.');
        setIsUploadingPhoto(false);
        return;
      }
    }

    setUploadStatusText('Saving profile to Firebase Firestore...');

    const payload: TeamMember = {
      id: targetId,
      fullName: memberFormData.fullName.trim(),
      designation: resolvedDesignation,
      professionalDescriptor: memberFormData.professionalDescriptor.trim(),
      biography: memberFormData.biography.trim(),
      displayOrder: Number(memberFormData.displayOrder) || 1,
      published: memberFormData.published,
      photoUrl: finalPhotoUrl,
      photoStoragePath: finalPhotoStoragePath,
      createdAt: editingMember?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const res = await saveTeamMember(payload);
    setIsUploadingPhoto(false);

    if (res.success) {
      setIsMemberModalOpen(false);
      setTeamToast({ type: 'success', message: `${payload.fullName} saved successfully.` });
      setTimeout(() => setTeamToast(null), 3000);
    } else {
      setMemberSaveError(res.error || 'Failed to save member record.');
    }
  };

  const handleTogglePublish = async (member: TeamMember) => {
    const updated = { ...member, published: !member.published };
    const res = await saveTeamMember(updated);
    if (res.success) {
      setTeamToast({
        type: 'success',
        message: `${member.fullName} is now ${updated.published ? 'visible publicly' : 'hidden from public page'}.`
      });
      setTimeout(() => setTeamToast(null), 3000);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === teamMembers.length - 1) return;

    const copy = [...teamMembers];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    await reorderTeamMembers(copy);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    const res = await deleteTeamMember(deletingMember.id);
    setIsDeleting(false);
    if (res.success) {
      setTeamToast({ type: 'success', message: `Deleted ${deletingMember.fullName}.` });
      setTimeout(() => setTeamToast(null), 3000);
      setDeletingMember(null);
    } else {
      setTeamToast({ type: 'error', message: res.error || 'Failed to delete member.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-['Poppins'] text-slate-900">
              About Us Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0B5A91]">
              Live CMS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage public About Us copy, vision statements, and leadership profiles with Firebase Storage photo uploads.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('content')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeSubTab === 'content'
                ? 'bg-white text-[#0B5A91] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Page Content</span>
          </button>
          <button
            onClick={() => setActiveSubTab('team')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeSubTab === 'team'
                ? 'bg-white text-[#0B5A91] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Leadership Team ({teamMembers.length})</span>
          </button>
        </div>
      </div>

      {/* Global Toast / Feedback */}
      {contentFeedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 ${
            contentFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {contentFeedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{contentFeedback.message}</span>
        </div>
      )}

      {teamToast && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 ${
            teamToast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {teamToast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{teamToast.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PAGE CONTENT EDITOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'content' && (
        <form onSubmit={handleSaveContent} className="space-y-6">
          {/* Section 1: Hero */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Poppins'] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2F80C9]"></span>
              <span>1. Hero Section</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Eyebrow *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.heroEyebrow}
                  onChange={e => handleContentChange('heroEyebrow', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary CTA Button Label *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.primaryCtaText}
                  onChange={e => handleContentChange('primaryCtaText', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Headline *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.heroHeadline}
                  onChange={e => handleContentChange('heroHeadline', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Supporting Text
                </label>
                <textarea
                  rows={3}
                  value={contentForm.heroSupportingText}
                  onChange={e => handleContentChange('heroSupportingText', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Who We Are */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Poppins'] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2F80C9]"></span>
              <span>2. Who We Are</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Heading *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.whoWeAreHeading}
                  onChange={e => handleContentChange('whoWeAreHeading', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Body Copy (Paragraphs preserved with double line-breaks)
                </label>
                <textarea
                  rows={6}
                  required
                  value={contentForm.whoWeAreContent}
                  onChange={e => handleContentChange('whoWeAreContent', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9] font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Leadership Intro Text */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Poppins'] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2F80C9]"></span>
              <span>3. Leadership Section Header</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Heading *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.leadershipHeading}
                  onChange={e => handleContentChange('leadershipHeading', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supporting Line
                </label>
                <input
                  type="text"
                  value={contentForm.leadershipSupportingText}
                  onChange={e => handleContentChange('leadershipSupportingText', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 italic">
              Note: Individual team members, biographies, and photos are managed under the "Leadership Team" sub-tab above.
            </p>
          </div>

          {/* Section 4: Complementary Strengths */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Poppins'] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2F80C9]"></span>
              <span>4. One Vision, Complementary Strengths</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Heading *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.strengthsHeading}
                  onChange={e => handleContentChange('strengthsHeading', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Description
                </label>
                <textarea
                  rows={3}
                  value={contentForm.strengthsDescription}
                  onChange={e => handleContentChange('strengthsDescription', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
                  The Four Pillars (Visual Cards)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentForm.strengths.map((st, idx) => (
                    <div key={st.id || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-[#0B5A91] uppercase">Point {idx + 1}</span>
                      <input
                        type="text"
                        placeholder="Pillar Title"
                        value={st.title}
                        onChange={e => handleStrengthChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                      />
                      <textarea
                        rows={2}
                        placeholder="Pillar Description"
                        value={st.description}
                        onChange={e => handleStrengthChange(idx, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Our Commitment */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Poppins'] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2F80C9]"></span>
              <span>5. Our Commitment & Tagline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commitment Heading *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.commitmentHeading}
                  onChange={e => handleContentChange('commitmentHeading', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={contentForm.brandTagline}
                  onChange={e => handleContentChange('brandTagline', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commitment Copy
                </label>
                <textarea
                  rows={4}
                  value={contentForm.commitmentContent}
                  onChange={e => handleContentChange('commitmentContent', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Closing Call to Action */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Poppins'] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2F80C9]"></span>
              <span>6. Final Call to Action</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Closing CTA Heading *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.closingCtaHeading}
                  onChange={e => handleContentChange('closingCtaHeading', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CTA Button Label *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.closingCtaButtonLabel}
                  onChange={e => handleContentChange('closingCtaButtonLabel', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supporting Text
                </label>
                <textarea
                  rows={2}
                  value={contentForm.closingCtaSupportingText}
                  onChange={e => handleContentChange('closingCtaSupportingText', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleResetContent}
              disabled={isSavingContent}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard Changes</span>
            </button>

            <button
              type="submit"
              disabled={isSavingContent}
              className="px-6 py-2.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center space-x-2"
            >
              {isSavingContent ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving & Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Publish Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: LEADERSHIP TEAM CRUD */}
      {/* ========================================================================= */}
      {activeSubTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Poppins']">
                Management & Leadership Profiles
              </h2>
              <p className="text-xs text-slate-500">
                Founders and management members rendered dynamically on the About Us page.
              </p>
            </div>

            <button
              onClick={openAddMemberModal}
              className="px-4 py-2.5 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          </div>

          {/* Members List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-3">
                  {/* Top Bar with Badges & Reorder */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#0B5A91]">
                        Order #{member.displayOrder}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 ${
                          member.published
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {member.published ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        <span>{member.published ? 'Published' : 'Hidden'}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={idx === teamMembers.length - 1}
                        title="Move Down"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Profile Header: Photo + Info */}
                  <div className="flex items-start space-x-4">
                    {member.photoUrl || member.id === 'dr-dk-agrawal' || member.id === 'swati-soam' ? (
                      <img
                        src={
                          member.photoUrl ||
                          (member.id === 'dr-dk-agrawal'
                            ? '/images/team/dr-dk-agrawal.jpg'
                            : '/images/team/swati-soam.jpg')
                        }
                        alt={member.fullName}
                        onError={(e) => {
                          const fallback = member.id === 'dr-dk-agrawal' ? '/images/team/dr-dk-agrawal.jpg' : '/images/team/swati-soam.jpg';
                          if ((e.currentTarget as HTMLImageElement).src !== fallback) {
                            (e.currentTarget as HTMLImageElement).src = fallback;
                          }
                        }}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-sky-100 text-[#0B5A91] flex items-center justify-center font-bold text-lg shrink-0 font-['Poppins']">
                        {member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {member.fullName}
                      </h3>
                      <div className="inline-block px-2 py-0.5 rounded-md bg-[#2F80C9]/10 text-[#0B5A91] text-xs font-semibold">
                        {member.designation}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {member.professionalDescriptor}
                      </p>
                    </div>
                  </div>

                  {/* Biography Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed pt-1">
                    {member.biography}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleTogglePublish(member)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer flex items-center space-x-1"
                  >
                    {member.published ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditMemberModal(member)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeletingMember(member)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT MEMBER MODAL */}
      {/* ========================================================================= */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setIsMemberModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold font-['Poppins'] text-slate-900">
                {editingMember ? 'Edit Team Profile' : 'Add Leadership Profile'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload photos directly from your computer to Firebase Storage.
              </p>
            </div>

            {memberSaveError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{memberSaveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. D. K. Agrawal or Swati Soam"
                  value={memberFormData.fullName}
                  onChange={e => setMemberFormData({ ...memberFormData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              {/* Designation selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation Preset
                  </label>
                  <select
                    value={memberFormData.designationPreset}
                    onChange={e =>
                      setMemberFormData({
                        ...memberFormData,
                        designationPreset: e.target.value as 'Founder' | 'Co-Founder' | 'Other'
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                  >
                    <option value="Founder">Founder</option>
                    <option value="Co-Founder">Co-Founder</option>
                    <option value="Other">Other / Custom</option>
                  </select>
                </div>

                {memberFormData.designationPreset === 'Other' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Custom Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Medical Director / Advisor"
                      value={memberFormData.customDesignation}
                      onChange={e =>
                        setMemberFormData({ ...memberFormData, customDesignation: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={memberFormData.displayOrder}
                      onChange={e =>
                        setMemberFormData({ ...memberFormData, displayOrder: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                    />
                  </div>
                )}
              </div>

              {/* Professional Descriptor */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Descriptor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Medical Experience | Public Healthcare | Holistic Healthcare"
                  value={memberFormData.professionalDescriptor}
                  onChange={e =>
                    setMemberFormData({ ...memberFormData, professionalDescriptor: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              {/* Biography */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Biography (Paragraphs supported)
                </label>
                <textarea
                  rows={5}
                  placeholder="Enter full professional biography..."
                  value={memberFormData.biography}
                  onChange={e => setMemberFormData({ ...memberFormData, biography: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
                />
              </div>

              {/* Profile Photograph Upload from Computer */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Profile Photograph (Firebase Storage)
                </label>

                <div className="flex items-center space-x-4">
                  {photoPreviewUrl ? (
                    <div className="relative">
                      <img
                        src={photoPreviewUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        title="Remove photo"
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] hover:bg-rose-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <label className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-[#0B5A91]" />
                      <span>{photoPreviewUrl ? 'Replace Photo' : 'Select Photo from Computer'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handlePhotoFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Supports JPEG, PNG, and WebP (Max 5MB). Uploaded safely to Firebase Storage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Published switch */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs">
                  <div className="font-semibold text-slate-800">Publish on Public About Us Page</div>
                  <div className="text-slate-500 text-[11px]">When disabled, profile remains visible only to admins.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={memberFormData.published}
                    onChange={e => setMemberFormData({ ...memberFormData, published: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2F80C9]"></div>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  disabled={isUploadingPhoto}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingPhoto}
                  className="px-5 py-2 rounded-xl bg-[#2F80C9] hover:bg-[#0B5A91] text-white text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-md disabled:opacity-75"
                >
                  {isUploadingPhoto ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{uploadStatusText || 'Saving Profile...'}</span>
                    </>
                  ) : (
                    <span>Save Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE MEMBER CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                Confirm Permanent Deletion
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently remove <strong className="text-slate-800">{deletingMember.fullName}</strong> ({deletingMember.designation})?
                This action will delete the profile from Firestore and clean up any uploaded photograph.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMember(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer flex items-center space-x-1.5"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Member</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
