'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { X, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-[32px] bg-white border border-black/10 p-6 sm:p-8 text-[#1A1A1A] max-h-[92vh] overflow-y-auto shadow-2xl">
        
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
              {t('proposalSuccessTitle')}
            </h3>
            <p className="mt-2 text-xs text-[#5A5A5A] max-w-sm mx-auto leading-relaxed">
              {t('proposalSuccessSub')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-black/5 pb-4">
              <span className="pill-badge-black !text-[10px] !py-0.5">
                {t('proposalStudioBadge')}
              </span>
              <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">
                {t('proposalHeading')}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                {t('proposalTitleLabel')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder={t('proposalTitlePlaceholder')}
                className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                {t('proposalCategoryLabel')}
              </label>
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                required
                className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none cursor-pointer"
              >
                <option value="">{t('proposalCategoryPlaceholder')}</option>
                {academicMajors.map((major) => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>

            {selectedMajor === customTrigger && (
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                  {t('taskWizardCustomCategoryLabel')}
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                  placeholder={t('taskWizardCustomCategoryPlaceholder')}
                  className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                {t('proposalScopeLabel')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder={t('proposalScopePlaceholder')}
                className="w-full rounded-2xl bg-[#EDEDED] p-3.5 text-xs text-[#1A1A1A] border-none focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                {t('proposalDeliverablesLabel')}
              </label>
              <input
                type="text"
                value={deliverablesSummary}
                onChange={(e) => setDeliverablesSummary(e.target.value)}
                placeholder={t('proposalDeliverablesPlaceholder')}
                className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                  {t('proposalTurnaroundLabel')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={turnaroundDays}
                  onChange={(e) => setTurnaroundDays(e.target.value ? Number(e.target.value) : '')}
                  required
                  placeholder="e.g. 5"
                  className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                  {t('proposalFeeLabel')}
                </label>
                <input
                  type="number"
                  min={30}
                  step={10}
                  value={proposedStudentFee}
                  onChange={(e) => setProposedStudentFee(e.target.value ? Number(e.target.value) : '')}
                  required
                  placeholder="e.g. 400"
                  className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none font-semibold"
                />
              </div>
            </div>

            {Boolean(proposedStudentFee) && (
              <div className="p-3.5 rounded-2xl bg-[#EDEDED]/50 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#5A5A5A]">{language === 'en' ? 'Gross Client Price' : 'المبلغ الإجمالي على العميل'}</span>
                  <span className="font-semibold text-[#1A1A1A]">${Math.round(Number(proposedStudentFee) * 1.25)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#8C8C8C]">
                  <span>{language === 'en' ? 'Platform Broker Fee (20%)' : 'عمولة المنصة والوساطة (20%)'}</span>
                  <span>${Math.round(Number(proposedStudentFee) * 0.25)}</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={!title.trim() || !description.trim() || !effectiveCategory || !proposedStudentFee || !turnaroundDays}
                className="pill-btn-dark !w-full !h-10 !text-xs disabled:opacity-40"
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
