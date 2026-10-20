'use client';

import React, { useState } from 'react';
import { CompanyTaskRequest } from '@/lib/types';
import { useStore } from '@/lib/store';
import { X, Check, ShieldCheck } from 'lucide-react';

interface Props {
  task: CompanyTaskRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyModal({ task, isOpen, onClose }: Props) {
  const { applyToTask, language, t } = useStore();
  const [pitch, setPitch] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !task) return null;

  const displayTitle = language === 'en' ? (task.titleEn || task.title) : task.title;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) return;

    applyToTask(
      task.id, 
      pitch.trim(), 
      portfolioUrl.trim() ? [portfolioUrl.trim()] : []
    );

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setPitch('');
      setPortfolioUrl('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-[32px] bg-white border border-black/10 p-6 sm:p-8 text-[#1A1A1A] max-h-[92vh] overflow-y-auto shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-6 w-9 h-9 rounded-full bg-[#EDEDED] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E4E4E4] transition-colors`}
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#262626] text-white flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A]">
              {t('applySuccessTitle')}
            </h3>
            <p className="mt-2 text-xs text-[#5A5A5A] max-w-sm mx-auto leading-relaxed">
              {t('applySuccessSub')} (<strong className="text-[#1A1A1A] font-mono">{task.referenceCode}</strong>).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-black/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                  {task.referenceCode}
                </span>
                <span className="text-xs text-[#5A5A5A]">
                  {t('applyNetReward')} <strong className="text-[#1A1A1A]">${Math.round(task.proposedBudget * 0.8)}</strong> • {t('applyTurnaround')} {task.estimatedDurationDays} {t('daysUnit')}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">
                {t('applyTaskTitlePrefix')} {displayTitle}
              </h2>
            </div>

            {/* Privacy Reminder */}
            <div className="p-3.5 rounded-2xl bg-[#EDEDED]/60 text-xs text-[#5A5A5A] flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 stroke-[1.5] text-[#1A1A1A] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {t('applyGuaranteeNotice')}
              </span>
            </div>

            {/* Pitch Textarea */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                {t('applyPitchLabel')}
              </label>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                required
                rows={4}
                placeholder={t('applyPitchPlaceholder')}
                className="w-full rounded-2xl bg-[#EDEDED] p-3.5 text-xs text-[#1A1A1A] border-none focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Portfolio Link */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                {t('applyPortfolioLabel')}
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="pill-btn-dark !w-full !h-10 !text-xs"
              >
                <span>{t('applySubmitBtn')}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
