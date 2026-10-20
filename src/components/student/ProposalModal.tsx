'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ACADEMIC_MAJORS_AR = [
  'إدارة الأعمال، الاقتصاد والمالية',
  'الهندسة، التقنية والحوسبة',
  'الطب، التمريض والعلوم الصحية',
  'الصيدلة وعلوم الأدوية',
  'القانون، العلوم السياسية والشريعة',
  'اللغات، الترجمة والأدب',
  'التصميم، الفنون المعمارية والجرافيك',
  'العلوم الطبيعية، الرياضيات والإحصاء',
  'الإعلام، الصحافة والعلاقات العامة',
  'العلوم الإنسانية، الاجتماعية وعلم النفس',
  'التربية والتعليم وتطوير المناهج',
  'العلوم الزراعية، البيئة والتغذية',
  'تخصص / مجال آخر (كتابة يدوية)',
];

const ACADEMIC_MAJORS_EN = [
  'Business Administration, Economics & Finance',
  'Engineering, Technology & Computing',
  'Medicine, Nursing & Health Sciences',
  'Pharmacy & Pharmaceutical Sciences',
  'Law, Political Science & Legal Studies',
  'Languages, Translation & Literature',
  'Design, Architecture & Graphic Arts',
  'Natural Sciences, Mathematics & Statistics',
  'Media, Journalism & Public Relations',
  'Humanities, Social Sciences & Psychology',
  'Education & Curriculum Development',
  'Agricultural, Environmental & Nutritional Sciences',
  'Other Major / Custom Field (Manual Entry)',
];

export default function ProposalModal({ isOpen, onClose }: Props) {
  const { submitServiceProposal, currentStudentProfile, language, t } = useStore();
  
  const [title, setTitle] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [deliverablesSummary, setDeliverablesSummary] = useState('');
  const [turnaroundDays, setTurnaroundDays] = useState<number | ''>('');
  const [proposedStudentFee, setProposedStudentFee] = useState<number | ''>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const academicMajors = language === 'en' ? ACADEMIC_MAJORS_EN : ACADEMIC_MAJORS_AR;
  const customTrigger = language === 'en'
    ? 'Other Major / Custom Field (Manual Entry)'
    : 'تخصص / مجال آخر (كتابة يدوية)';

  const effectiveCategory = selectedMajor === customTrigger
    ? customCategory.trim()
    : selectedMajor;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !effectiveCategory || !currentStudentProfile || !proposedStudentFee || !turnaroundDays) return;

    submitServiceProposal({
      studentProfileId: currentStudentProfile.id,
      title: title.trim(),
      category: effectiveCategory,
      description: description.trim(),
      deliverablesSummary: deliverablesSummary.trim(),
      turnaroundDays: Number(turnaroundDays),
      proposedStudentFee: Number(proposedStudentFee),
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setTitle('');
      setSelectedMajor('');
      setCustomCategory('');
      setDescription('');
      setDeliverablesSummary('');
      setTurnaroundDays('');
      setProposedStudentFee('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-[rgba(255,255,255,0.15)] bg-[#0C0C16]/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-6 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors`}
        >
          {t('close')}
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center">
            <h3 className="mt-4 text-2xl font-light text-white">
              {t('proposalSuccessTitle')}
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.7)] max-w-sm mx-auto leading-relaxed">
              {t('proposalSuccessSub')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="badge-glass-violet text-xs">
                  {t('proposalStudioBadge')}
                </span>
                <span className="text-xs text-[rgba(255,255,255,0.6)] font-mono">
                  {currentStudentProfile?.anonymousCode}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                {t('proposalHeading')}
              </h2>
            </div>

            <div className="glass-card p-4 text-xs text-[rgba(255,255,255,0.8)] border-[#3FD0B0]/20 bg-[#3FD0B0]/5">
              <span className="leading-relaxed">
                {t('proposalBrokerNotice')}
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                {t('proposalTitleLabel')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder={t('proposalTitlePlaceholder')}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
            </div>

            {/* Category & Turnaround */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                  {t('proposalCategoryLabel')}
                </label>
                <select
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-[#07070C] px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none cursor-pointer"
                >
                  <option value="">{t('proposalCategoryPlaceholder')}</option>
                  {academicMajors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                  {t('proposalTurnaroundLabel')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={turnaroundDays}
                  onChange={(e) => setTurnaroundDays(e.target.value ? Number(e.target.value) : '')}
                  required
                  placeholder={t('proposalTurnaroundPlaceholder')}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                />
              </div>
            </div>

            {selectedMajor === customTrigger && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-[#A77BF3] mb-1">
                  {t('taskWizardCustomCategoryLabel')}
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                  placeholder={t('taskWizardCustomCategoryPlaceholder')}
                  className="w-full rounded-2xl border border-[#A77BF3]/50 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                />
              </div>
            )}

            {/* Scope */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                {t('proposalScopeLabel')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder={t('proposalScopePlaceholder')}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
            </div>

            {/* Deliverables */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                {t('proposalDeliverablesLabel')}
              </label>
              <textarea
                value={deliverablesSummary}
                onChange={(e) => setDeliverablesSummary(e.target.value)}
                required
                rows={2}
                placeholder={t('proposalDeliverablesPlaceholder')}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
            </div>

            {/* Proposed Fee */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                {t('proposalFeeLabel')}
              </label>
              <input
                type="number"
                min={20}
                step={5}
                value={proposedStudentFee}
                onChange={(e) => setProposedStudentFee(e.target.value ? Number(e.target.value) : '')}
                required
                placeholder={t('proposalFeePlaceholder')}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
              <p className="mt-1 text-xs text-[rgba(255,255,255,0.45)]">
                {t('proposalBrokerFeeNotice')}
              </p>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="btn-glass-ghost px-5 py-2 text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="btn-glass-primary px-6 py-2.5 text-xs font-bold"
              >
                <span>{t('proposalSubmitBtn')}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
