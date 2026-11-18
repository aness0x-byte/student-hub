'use client';

import React, { useState } from 'react';
import { CompanyTaskRequest } from '@/lib/types';
import { formatAcademicLevel, formatCategoryName } from '@/lib/privacy-shield';
import { useStore } from '@/lib/store';
import { X, Check, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';

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
  const [showDetails, setShowDetails] = useState(true);

  if (!isOpen || !task) return null;

  const displayTitle = language === 'ar' ? task.title : (task.titleEn || task.title);
  const displayProblem = language === 'ar' ? task.problemStatement : (task.problemStatementEn || task.problemStatement);
  const displayDeliverables = language === 'ar' ? task.deliverablesCriteria : (task.deliverablesCriteriaEn || task.deliverablesCriteria);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-[32px] bg-white border border-black/10 p-6 sm:p-8 text-[#1A1A1A] max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-6 w-9 h-9 rounded-full bg-[#EDEDED] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E4E4E4] transition-colors z-10`}
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>

        {isSubmitted ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto mb-4">
              <Check className="h-7 w-7 stroke-[2]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A]">
              {language === 'ar' ? 'تم إرسال العرض للوسيط بنجاح!' : t('applySuccessTitle')}
            </h3>
            <p className="mt-2 text-xs text-[#5A5A5A] max-w-sm mx-auto leading-relaxed">
              {language === 'ar'
                ? `تم تسجيل عرضك على المهمة (${task.referenceCode}). سيتولى الوسيط مراجعة العرض وتنسيق التكليف.`
                : `${t('applySuccessSub')} (${task.referenceCode}).`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">

            {/* Left Column (in LTR) / Right Column (in RTL): Task Brief & Requirements */}
            <div className="space-y-4 md:order-2">
              <div className="flex items-center justify-between">
                <span className="tag-micro">
                  {formatCategoryName(task.category, language)}
                </span>
                <span className="text-xs text-[#5A5A5A]">
                  {language === 'ar' ? 'مدة الإنجاز:' : 'Duration:'} <strong className="text-[#1A1A1A] font-semibold">{task.estimatedDurationDays} {language === 'ar' ? 'أيام' : 'days'}</strong>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-[17px] font-semibold text-[#1A1A1A] leading-snug">
                  {displayTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="pill-btn-outline !h-7 !px-2.5 !text-[11px] flex-shrink-0"
                >
                  {showDetails ? (language === 'ar' ? 'إخفاء التفاصيل ↑' : 'Hide details ↑') : (language === 'ar' ? 'عرض التفاصيل ↓' : 'Show details ↓')}
                </button>
              </div>

              {showDetails && (
                <div className="space-y-3.5 pt-2 text-xs">
                  <div>
                    <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                      {language === 'ar' ? 'نطاق العمل والمشكلة:' : 'Scope & Problem:'}
                    </span>
                    <p className="text-[13px] text-[#1A1A1A] leading-relaxed">
                      {displayProblem}
                    </p>
                  </div>

                  {displayDeliverables && (
                    <div>
                      <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                        {language === 'ar' ? 'معايير ومخرجات التسليم:' : 'Deliverables Criteria:'}
                      </span>
                      <p className="text-xs text-[#5A5A5A] leading-relaxed bg-[#EDEDED]/60 p-3 rounded-2xl">
                        {displayDeliverables}
                      </p>
                    </div>
                  )}

                  {task.targetAcademicLevel && (
                    <div className="text-xs text-[#5A5A5A]">
                      <span className="text-[#8C8C8C]">{language === 'ar' ? 'المستوى الأكاديمي المطلوب: ' : 'Required Academic Level: '}</span>
                      <strong className="text-[#1A1A1A] font-medium">{formatAcademicLevel(task.targetAcademicLevel, language)}</strong>
                    </div>
                  )}

                  {task.requiredSkills && task.requiredSkills.length > 0 && (
                    <div>
                      <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1.5">
                        {language === 'ar' ? 'المهارات المطلوبة:' : 'Required Skills:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {task.requiredSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-[#EDEDED] px-3 py-1 text-xs text-[#1A1A1A] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column (in LTR) / Left Column (in RTL): Broker Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:order-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Exclusive Broker Guarantee Box */}
                <div className="p-4 rounded-2xl bg-[#EDEDED]/70 text-xs text-[#5A5A5A] flex items-start gap-2.5 border border-black/5">
                  <ShieldCheck className="h-4 w-4 stroke-[1.8] text-[#1A1A1A] shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-[12px]">
                    {language === 'ar'
                      ? 'ضمانات الوساطة الحصرية: ترفع عرضك مباشرة إلى الوسيط المعتمد. تبقى هويتك وبياناتك الشخصية محمية بالكامل، ومستحقاتك المالية مودعة ومضمونة سلفاً وتُصرف فور اعتماد المخرجات.'
                      : 'Exclusive Broker Guarantee: Your pitch is delivered directly to the broker. Your academic identity is fully protected, and payout funds are held in verified escrow.'}
                  </span>
                </div>

                {/* Pitch Textarea */}
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">
                    {language === 'ar' ? 'منهجية التنفيذ وعرضك المباشر للوسيط *' : 'Execution Methodology & Pitch to Broker *'}
                  </label>
                  <textarea
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    required
                    rows={5}
                    placeholder={language === 'ar' ? 'اشرح منهجية التنفيذ وسوابق خبرتك لتنفيذ متطلبات هذه المهمة باحترافية...' : 'Outline your approach and experience...'}
                    className="w-full rounded-2xl bg-[#F8F8F8] border border-black/10 px-4 py-3 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A8A8A8] focus:border-black focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Portfolio URL Input */}
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">
                    {language === 'ar' ? 'رابط نموذج عمل أو ملف إثبات المهارة (اختياري)' : 'Portfolio / Work Sample Link (Optional)'}
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded-full bg-[#F8F8F8] border border-black/10 px-4 py-2.5 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A8A8A8] focus:border-black focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full pill-btn-dark !py-3 !text-sm font-medium tracking-wide justify-center"
                >
                  {language === 'ar' ? 'إرسال العرض للوسيط' : 'Submit Pitch to Broker'}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
