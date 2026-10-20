'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { AcademicLevel } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ACADEMIC_MAJORS = [
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

export default function TaskWizardModal({ isOpen, onClose }: Props) {
  const { submitTaskRequest, currentCompanyProfile } = useStore();

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

  const effectiveCategory = selectedMajor === 'تخصص / مجال آخر (كتابة يدوية)'
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
      deliverablesCriteria: deliverablesCriteria.trim() || 'مخرجات متكاملة ومحققة وفق المواصفات المحددة.',
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
          className="absolute left-6 top-6 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          إغلاق
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center">
            <h3 className="mt-4 text-2xl font-light text-white">
              تم استلام طلب المهمة والخدمة بنجاح!
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.7)] max-w-md mx-auto leading-relaxed">
              يقوم الوسيط المعتمد بتدقيق متطلباتك وتشغيل محرك المطابقة الذكي لاختيار أفضل الكفاءات الجامعية وتنسيق بدء التنفيذ فوراً.
            </p>
          </div>
        ) : (
          <div>
            
            {/* Header & Stepper */}
            <div className="border-b border-white/10 pb-5 mb-5">
              <div className="flex items-center gap-2">
                <span className="badge-glass-violet text-xs font-mono">
                  الخطوة {step} من 3
                </span>
                <span className="text-xs text-[rgba(255,255,255,0.6)] font-medium">
                  {currentCompanyProfile?.companyName}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                {step === 1 && 'تحديد نطاق الخدمة، المشكلة، والتخصص الأكاديمي المطلوب'}
                {step === 2 && 'المتطلبات، المهارات، والمستوى الأكاديمي المستهدف'}
                {step === 3 && 'الميزانية، مدة الإنجاز، وضمان الوساطة'}
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
                    عنوان المهمة أو الخدمة المطلوبة *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="اكتب عنوان الخدمة المطلوبة..."
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    تصنيف الخدمة / التخصص الجامعي المطلوب (مفتوح لكافة التخصصات) *
                  </label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/15 bg-[#07070C] px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none cursor-pointer"
                  >
                    <option value="">اختر التخصص أو المجال الأكاديمي المطلوب...</option>
                    {ACADEMIC_MAJORS.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMajor === 'تخصص / مجال آخر (كتابة يدوية)' && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-xs font-semibold text-[#A77BF3] mb-1">
                      اكتب التخصص أو المجال بدقة (تحكم كامل للمستخدم) *
                    </label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      required
                      placeholder="اكتب اسم التخصص أو المجال الأكاديمي المطلوب..."
                      className="w-full rounded-2xl border border-[#A77BF3]/50 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    شرح المشكلة والسياق المطلوب *
                  </label>
                  <textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    required
                    rows={4}
                    placeholder="اشرح الهدف والمتطلبات وما الذي ترغب في إنجازه بدقة..."
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    معايير ومخرجات التسليم المحددة
                  </label>
                  <input
                    type="text"
                    value={deliverablesCriteria}
                    onChange={(e) => setDeliverablesCriteria(e.target.value)}
                    placeholder="حدد معايير ومخرجات التسليم المطلوبة..."
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Requirements */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    المهارات أو المتطلبات المطلوبة (مفصولة بفواصل) *
                  </label>
                  <input
                    type="text"
                    value={skillsString}
                    onChange={(e) => setSkillsString(e.target.value)}
                    required
                    placeholder="اكتب المهارات أو الشروط المطلوبة مفصولة بفواصل..."
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                  <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">
                    يستخدم الوسيط هذه المهارات لاختيار أفضل الكفاءات الجامعية المتطابقة.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    المستوى الأكاديمي المستهدف
                  </label>
                  <select
                    value={targetAcademicLevel}
                    onChange={(e) => setTargetAcademicLevel(e.target.value as AcademicLevel)}
                    className="w-full rounded-2xl border border-white/15 bg-[#07070C] px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none cursor-pointer"
                  >
                    <option value="LICENCE_2">السنة الثانية جامعي (L2)</option>
                    <option value="LICENCE_3">بكالوريوس / ليسانس (L3)</option>
                    <option value="MASTER_1">ماستر 1 (M1)</option>
                    <option value="MASTER_2">ماستر 2 / ماجستير تخصصي (M2)</option>
                    <option value="ENGINEERING_CYCLE">سلك كبار المهندسين والماستر المهني</option>
                    <option value="PHD_DOCTORATE">دكتوراه وباحث أكاديمي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    مدة الإنجاز والتسليم المتوقعة (بالأيام) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={estimatedDurationDays}
                    onChange={(e) => setEstimatedDurationDays(e.target.value ? Number(e.target.value) : '')}
                    required
                    placeholder="اكتب عدد الأيام المتوقعة للإنجاز..."
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Budget & Terms */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                    الميزانية المقترحة للمشروع (€) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={50}
                      max={50000}
                      step={5}
                      value={proposedBudget}
                      onChange={(e) => setProposedBudget(e.target.value ? Number(e.target.value) : '')}
                      required
                      dir="ltr"
                      placeholder="اكتب الميزانية المقترحة..."
                      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#A77BF3]"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">
                    تُصرف 80% للمنفذ كصافي مستحقات مضمونة، وتُخصص 20% كرسوم وساطة وحماية وضمان جودة بموجب فاتورة بنكية رسمية معتمدة.
                  </p>
                </div>

                {/* Privacy & Concierge Confirmation */}
                <div className="glass-card p-4 space-y-2 border-[#34D17A]/30 bg-[#34D17A]/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span>ميثاق الوساطة والحماية الحصرية</span>
                  </div>
                  <ul className="text-xs text-[rgba(255,255,255,0.7)] space-y-1 list-disc pr-4">
                    <li>يتولى الوسيط المعتمد مراجعة مواصفات الخدمة وتدقيق مخرجاتها قبل التعاقد والتكليف.</li>
                    <li>حماية تامة لبيانات التواصل والسرية المهنية وفق بروتوكول درع الخصوصية الصارم.</li>
                    <li>ضمانات سداد مصرفية رسمية (SEPA / B2B Wire) تضمن حقوق الطرفين حتى التسليم النهائي.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-glass-ghost px-5 py-2.5 text-xs font-semibold"
                >
                  <span>السابق</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-glass-primary px-6 py-2.5 text-xs font-bold"
                >
                  <span>المتابعة</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-glass-primary px-6 py-2.5 text-xs font-bold"
                >
                  <span>إرسال طلب الخدمة للوسيط</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
