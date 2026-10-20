'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { AcademicLevel } from '@/lib/types';
import { formatAcademicLevel } from '@/lib/privacy-shield';

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
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[rgba(255,255,255,0.15)] bg-[#0C0C16]/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-6 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors`}
        >
          {t('close')}
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center">
            <h3 className="mt-4 text-2xl font-light text-white">
              {t('taskWizardSuccessTitle')}
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.7)] max-w-md mx-auto leading-relaxed">
              {t('taskWizardSuccessSub')}
            </p>
          </div>
        ) : (
          <div>
            
            {/* Header & Stepper */}
            <div className="border-b border-white/10 pb-5 mb-5">
              <div className="flex items-center gap-2">
                <span className="badge-glass-violet text-xs font-mono">
                  {language === 'en' ? `Step ${step} of 3` : `الخطوة ${step} من 3`}
                </span>
                <span className="text-xs text-[rgba(255,255,255,0.6)] font-medium">
                  {currentCompanyProfile?.companyName}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                {step === 1 && t('taskWizardStep1Title')}
                {step === 2 && t('taskWizardStep2Title')}
                {step === 3 && t('taskWizardStep3Title')}
              </h2>

              {/* Progress bar */}
              <div className="mt-3 flex gap-2">
                <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#5B2BE0]' : 'bg-white/10'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#5B2BE0]' : 'bg-white/10'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-[#5B2BE0]' : 'bg-white/10'}`} />
              </div>
            </div>

            {/* Step 1: Scope */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    {t('taskWizardTitleLabel')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder={t('taskWizardTitlePlaceholder')}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    {t('taskWizardCategoryLabel')}
                  </label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/15 bg-[#07070C] px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none cursor-pointer"
                  >
                    <option value="">{t('taskWizardCategoryPlaceholder')}</option>
                    {academicMajors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
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

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    {t('taskWizardProblemLabel')}
                  </label>
                  <textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    required
                    rows={4}
                    placeholder={t('taskWizardProblemPlaceholder')}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    {t('taskWizardDeliverablesLabel')}
                  </label>
                  <textarea
                    value={deliverablesCriteria}
                    onChange={(e) => setDeliverablesCriteria(e.target.value)}
                    rows={2}
                    placeholder={t('taskWizardDeliverablesPlaceholder')}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Requirements */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    {t('taskWizardSkillsLabel')}
                  </label>
                  <input
                    type="text"
                    value={skillsString}
                    onChange={(e) => setSkillsString(e.target.value)}
                    required
                    placeholder={t('taskWizardSkillsPlaceholder')}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    {t('taskWizardAcademicLevelLabel')}
                  </label>
                  <select
                    value={targetAcademicLevel}
                    onChange={(e) => setTargetAcademicLevel(e.target.value as AcademicLevel)}
                    className="w-full rounded-2xl border border-white/15 bg-[#07070C] px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none cursor-pointer"
                  >
                    <option value="LICENCE_3">{formatAcademicLevel('LICENCE_3', language)}</option>
                    <option value="MASTER_1">{formatAcademicLevel('MASTER_1', language)}</option>
                    <option value="MASTER_2">{formatAcademicLevel('MASTER_2', language)}</option>
                    <option value="ENGINEERING_CYCLE">{formatAcademicLevel('ENGINEERING_CYCLE', language)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    {t('taskWizardDurationLabel')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={estimatedDurationDays}
                    onChange={(e) => setEstimatedDurationDays(e.target.value ? Number(e.target.value) : '')}
                    required
                    placeholder={t('taskWizardDurationPlaceholder')}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Budget & Terms */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    {t('taskWizardBudgetLabel')}
                  </label>
                  <input
                    type="number"
                    min={50}
                    step={10}
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value ? Number(e.target.value) : '')}
                    required
                    placeholder={t('taskWizardBudgetPlaceholder')}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>

                {/* Live Split Calculation */}
                {Number(proposedBudget) > 0 && (
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#34D17A]">
                      <span>{t('taskWizardPayout80')}</span>
                      <strong className="font-mono text-sm">€{Math.round(Number(proposedBudget) * 0.8)}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#A77BF3]">
                      <span>{t('taskWizardMargin20')}</span>
                      <strong className="font-mono text-sm">€{Math.round(Number(proposedBudget) * 0.2)}</strong>
                    </div>
                  </div>
                )}

                <div className="glass-card p-4 text-xs text-[rgba(255,255,255,0.75)] space-y-1.5 border-[#3FD0B0]/20 bg-[#3FD0B0]/5">
                  <p className="font-semibold text-white">{t('landingNotice')}</p>
                  <p>{t('taskWizardEscrowNotice')}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn-glass-ghost px-5 py-2 text-xs font-semibold"
                  >
                    {t('taskWizardPrev')}
                  </button>
                  <button
                    type="submit"
                    className="btn-glass-primary px-6 py-2.5 text-xs font-bold"
                  >
                    <span>{t('taskWizardSubmit')}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Stepper Navigation (Steps 1 & 2) */}
            {step < 3 && (
              <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn-glass-ghost px-5 py-2 text-xs font-semibold"
                  >
                    {t('taskWizardPrev')}
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-glass-primary px-6 py-2.5 text-xs font-bold"
                >
                  <span>{t('taskWizardNext')}</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
