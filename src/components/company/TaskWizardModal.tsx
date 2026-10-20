'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { AcademicLevel } from '@/lib/types';
import { formatAcademicLevel } from '@/lib/privacy-shield';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

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

export default function TaskWizardModal({ isOpen, onClose }: Props) {
  const { submitTaskRequest, currentCompanyProfile, language, t } = useStore();

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form Fields - clean, controlled by user with zero prefilled suggestions
  const [title, setTitle] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [deliverablesCriteria, setDeliverablesCriteria] = useState('');
  const [skillsString, setSkillsString] = useState('');
  const [targetAcademicLevel, setTargetAcademicLevel] = useState<AcademicLevel>('MASTER_1');
  const [estimatedDurationDays, setEstimatedDurationDays] = useState<number | ''>('');
  const [proposedBudget, setProposedBudget] = useState<number | ''>('');

  if (!isOpen) return null;

  const academicMajors = language === 'en' ? ACADEMIC_MAJORS_EN : ACADEMIC_MAJORS_AR;
  const customTrigger = language === 'en'
    ? 'Other Major / Custom Field (Manual Entry)'
    : 'تخصص / مجال آخر (كتابة يدوية)';

  const effectiveCategory = selectedMajor === customTrigger
    ? customCategory.trim()
    : selectedMajor;

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim() || !problemStatement.trim() || !effectiveCategory) return;
    }
    if (step === 2) {
      if (!skillsString.trim() || !estimatedDurationDays) return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompanyProfile || !effectiveCategory || !proposedBudget) return;

    const parsedSkills = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    submitTaskRequest({
      companyProfileId: currentCompanyProfile.id,
      title: title.trim(),
      category: effectiveCategory,
      problemStatement: problemStatement.trim(),
      deliverablesCriteria: deliverablesCriteria.trim() || (language === 'en' ? 'Quality deliverables adhering to specifications.' : 'مخرجات متكاملة ومحققة وفق المواصفات المحددة.'),
      requiredSkills: parsedSkills,
      targetAcademicLevel,
      estimatedDurationDays: Number(estimatedDurationDays) || 7,
      proposedBudget: Number(proposedBudget),
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setStep(1);
      setTitle('');
      setSelectedMajor('');
      setCustomCategory('');
      setProblemStatement('');
      setDeliverablesCriteria('');
      setSkillsString('');
      setEstimatedDurationDays('');
      setProposedBudget('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white border border-black/10 p-6 sm:p-8 text-[#1A1A1A] max-h-[92vh] overflow-y-auto shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-6 w-9 h-9 rounded-full bg-[#EDEDED] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E4E4E4] transition-colors`}
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#262626] text-white flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A]">
              {t('taskWizardSuccessTitle')}
            </h3>
            <p className="mt-2 text-xs text-[#5A5A5A] max-w-md mx-auto leading-relaxed">
              {t('taskWizardSuccessSub')}
            </p>
          </div>
        ) : (
          <div>
            
            {/* Header & Stepper */}
            <div className="border-b border-black/5 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="pill-badge-black !text-[10px] !py-0.5">
                  {language === 'en' ? `Step ${step} of 3` : `الخطوة ${step} من 3`}
                </span>
                <span className="text-xs text-[#5A5A5A]">
                  {currentCompanyProfile?.companyName}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">
                {step === 1 && t('taskWizardStep1Title')}
                {step === 2 && t('taskWizardStep2Title')}
                {step === 3 && t('taskWizardStep3Title')}
              </h2>

              {/* Progress bar */}
              <div className="mt-3 flex gap-2">
                <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#262626]' : 'bg-[#EDEDED]'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#262626]' : 'bg-[#EDEDED]'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-[#262626]' : 'bg-[#EDEDED]'}`} />
              </div>
            </div>

            {/* Step 1: Scope */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                    {t('taskWizardTitleLabel')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder={t('taskWizardTitlePlaceholder')}
                    className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                    {t('taskWizardCategoryLabel')}
                  </label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    required
                    className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none cursor-pointer"
                  >
                    <option value="">{t('taskWizardCategoryPlaceholder')}</option>
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
                    {t('taskWizardProblemLabel')}
                  </label>
                  <textarea
                    rows={3}
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    required
                    placeholder={t('taskWizardProblemPlaceholder')}
                    className="w-full rounded-2xl bg-[#EDEDED] p-4 text-xs text-[#1A1A1A] border-none focus:outline-none leading-relaxed resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!title.trim() || !problemStatement.trim() || !effectiveCategory}
                    className="pill-btn-dark !h-9 !px-6 disabled:opacity-40"
                  >
                    <span>{t('taskWizardNext')}</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Skills & Duration */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                    {t('taskWizardSkillsLabel')}
                  </label>
                  <input
                    type="text"
                    value={skillsString}
                    onChange={(e) => setSkillsString(e.target.value)}
                    required
                    placeholder={t('taskWizardSkillsPlaceholder')}
                    className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                    {t('taskWizardDeliverablesLabel')}
                  </label>
                  <textarea
                    rows={3}
                    value={deliverablesCriteria}
                    onChange={(e) => setDeliverablesCriteria(e.target.value)}
                    placeholder={t('taskWizardDeliverablesPlaceholder')}
                    className="w-full rounded-2xl bg-[#EDEDED] p-4 text-xs text-[#1A1A1A] border-none focus:outline-none leading-relaxed resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                      {t('taskWizardAcademicLevelLabel')}
                    </label>
                    <select
                      value={targetAcademicLevel}
                      onChange={(e) => setTargetAcademicLevel(e.target.value as AcademicLevel)}
                      className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none cursor-pointer"
                    >
                      <option value="LICENCE_3">{formatAcademicLevel('LICENCE_3', language)}</option>
                      <option value="MASTER_1">{formatAcademicLevel('MASTER_1', language)}</option>
                      <option value="MASTER_2">{formatAcademicLevel('MASTER_2', language)}</option>
                      <option value="ENGINEERING_CYCLE">{formatAcademicLevel('ENGINEERING_CYCLE', language)}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                      {t('taskWizardDurationLabel')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={estimatedDurationDays}
                      onChange={(e) => setEstimatedDurationDays(e.target.value ? Number(e.target.value) : '')}
                      required
                      placeholder="e.g. 10"
                      className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="pill-btn-outline !h-9 !px-5"
                  >
                    <span>{t('taskWizardPrev')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!skillsString.trim() || !estimatedDurationDays}
                    className="pill-btn-dark !h-9 !px-6 disabled:opacity-40"
                  >
                    <span>{t('taskWizardNext')}</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Budget & Review */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                    {t('taskWizardBudgetLabel')}
                  </label>
                  <input
                    type="number"
                    min={50}
                    step={10}
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value ? Number(e.target.value) : '')}
                    required
                    placeholder="e.g. 750"
                    className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none text-base font-semibold"
                  />
                </div>

                {/* Broker Fee & Student Payout Breakdown */}
                {Boolean(proposedBudget) && (
                  <div className="p-4 rounded-2xl bg-[#EDEDED]/50 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-[#5A5A5A]">{t('taskWizardPayout80')}</span>
                      <span className="font-semibold text-[#1A1A1A]">${Math.round(Number(proposedBudget) * 0.8)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-[#5A5A5A]">{t('taskWizardMargin20')}</span>
                      <span className="font-semibold text-[#1A1A1A]">${Math.round(Number(proposedBudget) * 0.2)}</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-[#5A5A5A]">{t('taskWizardEscrowNotice')}</span>
                      <span className="font-bold text-[#1A1A1A]">${proposedBudget}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="pill-btn-outline !h-9 !px-5"
                  >
                    <span>{t('taskWizardPrev')}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!proposedBudget}
                    className="pill-btn-dark !h-9 !px-6 disabled:opacity-40"
                  >
                    <span>{t('taskWizardSubmit')}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
