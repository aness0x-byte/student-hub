'use client';

import React, { useState } from 'react';
import { StudentProfile, VerificationStatus } from '@/lib/types';
import { useStore } from '@/lib/store';
import { formatAcademicLevel } from '@/lib/privacy-shield';
import { X, Check } from 'lucide-react';

interface Props {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentVettingModal({ student, isOpen, onClose }: Props) {
  const { verifyStudent, language, t } = useStore();

  const [status, setStatus] = useState<VerificationStatus>(
    student?.verificationStatus || 'VERIFIED'
  );
  const [rating, setRating] = useState<number>(student?.internalAdminRating || 5.0);
  const [notes, setNotes] = useState<string>(student?.adminNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !student) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    verifyStudent(student.id, status, Number(rating), notes);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-[32px] bg-white border border-black/10 p-6 sm:p-8 text-[#1A1A1A] max-h-[92vh] overflow-y-auto shadow-2xl">
        
        <button
          onClick={onClose}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-6 w-9 h-9 rounded-full bg-[#EDEDED] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E4E4E4] transition-colors`}
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>

        {isSaved ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#262626] text-white flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A]">
              {t('vettingSavedTitle')}
            </h3>
            <p className="mt-2 text-xs text-[#5A5A5A]">
              {t('vettingSavedSub')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="border-b border-black/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="pill-badge-black !text-[10px] !py-0.5">
                  {t('vettingCenter')}
                </span>
                <span className="text-xs font-mono font-semibold text-[#8C8C8C]">
                  {student.anonymousCode}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">
                {t('vettingReview')} {student.fullName}
              </h2>
              <p className="text-xs text-[#5A5A5A] mt-0.5">
                {student.university} • {formatAcademicLevel(student.academicLevel, language)}
              </p>
            </div>

            {/* Document Verification Proof */}
            <div className="p-4 rounded-2xl bg-[#EDEDED]/50 space-y-2">
              <span className="text-xs font-medium text-[#5A5A5A]">
                {t('vettingUploadedProof')}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#1A1A1A]">{t('vettingCardDoc')}</span>
                <span className="pill-badge-gray !text-[10px] cursor-pointer hover:bg-black hover:text-white transition-colors">
                  {t('vettingPreviewDoc')}
                </span>
              </div>
              <p className="text-[11px] text-[#8C8C8C] pt-1 border-t border-black/5" dir="ltr">
                {student.universityEmail} • {student.phone}
              </p>
            </div>

            {/* Verification Status */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-2">
                {t('vettingDecision')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('VERIFIED')}
                  className={`py-2 px-3 rounded-full text-xs font-medium transition-all ${
                    status === 'VERIFIED'
                      ? 'bg-[#262626] text-white'
                      : 'bg-[#EDEDED] text-[#5A5A5A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {t('vettingStatusVerified')}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('PENDING_REVIEW')}
                  className={`py-2 px-3 rounded-full text-xs font-medium transition-all ${
                    status === 'PENDING_REVIEW'
                      ? 'bg-[#262626] text-white'
                      : 'bg-[#EDEDED] text-[#5A5A5A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {t('vettingStatusPending')}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('REJECTED')}
                  className={`py-2 px-3 rounded-full text-xs font-medium transition-all ${
                    status === 'REJECTED'
                      ? 'bg-[#262626] text-white'
                      : 'bg-[#EDEDED] text-[#5A5A5A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {t('vettingStatusRejected')}
                </button>
              </div>
            </div>

            {/* Academic Quality Rating */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#5A5A5A]">
                  {t('vettingInternalRating')}
                </label>
                <span className="text-sm font-bold text-[#1A1A1A]">★ {rating} / 5.0</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Audit Notes */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                {t('vettingSecretNotes')}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('vettingNotesPlaceholder')}
                className="w-full rounded-2xl bg-[#EDEDED] p-3 text-xs text-[#1A1A1A] border-none focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                className="pill-btn-dark !w-full !h-10 !text-xs"
              >
                <span>{t('save')}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
