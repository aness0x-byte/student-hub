'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';

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

export default function ProposalModal({ isOpen, onClose }: Props) {
  const { submitServiceProposal, currentStudentProfile } = useStore();
  
  const [title, setTitle] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [deliverablesSummary, setDeliverablesSummary] = useState('');
  const [turnaroundDays, setTurnaroundDays] = useState<number | ''>('');
  const [proposedStudentFee, setProposedStudentFee] = useState<number | ''>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const effectiveCategory = selectedMajor === 'تخصص / مجال آخر (كتابة يدوية)'
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
          className="absolute left-6 top-6 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          إغلاق
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center">
            <h3 className="mt-4 text-2xl font-light text-white">
              تم إرسال مقترح الخدمة بنجاح!
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.7)] max-w-sm mx-auto leading-relaxed">
              تم تحويل مقترحك إلى الوسيط المعتمد لمراجعته وتدقيقه، وتثبيته في دليل الكفاءات لطرحه على الجهات المتعاقدة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="badge-glass-violet text-xs">
                  استوديو المقترحات والعروض
                </span>
                <span className="text-xs text-[rgba(255,255,255,0.6)] font-mono">
                  {currentStudentProfile?.anonymousCode}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                تقديم مقترح خدمة مصغرة للوسيط
              </h2>
            </div>

            <div className="glass-card p-4 text-xs text-[rgba(255,255,255,0.8)] border-[#3FD0B0]/20 bg-[#3FD0B0]/5">
              <span className="leading-relaxed">
                <strong>تدقيق الوسيط المعتمد:</strong> يتولى الوسيط مراجعة المقترحات بدقة لضمان ملاءمتها وتحديد أسعار عادلة تضمن مستحقاتك دون تأخير.
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                عنوان الخدمة المصغرة *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="اكتب عنوان الخدمة أو المهارة التي ترغب في تقديمها..."
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
            </div>

            {/* Category & Turnaround */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                  تصنيف الخدمة / التخصص الجامعي *
                </label>
                <select
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-[#07070C] px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none cursor-pointer"
                >
                  <option value="">اختر التخصص أو المجال الأكاديمي...</option>
                  {ACADEMIC_MAJORS.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                  مدة الإنجاز (بالأيام) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={turnaroundDays}
                  onChange={(e) => setTurnaroundDays(e.target.value ? Number(e.target.value) : '')}
                  required
                  placeholder="عدد الأيام..."
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                />
              </div>
            </div>

            {selectedMajor === 'تخصص / مجال آخر (كتابة يدوية)' && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-[#A77BF3] mb-1">
                  اكتب التخصص أو المجال بدقة *
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                  placeholder="اكتب التخصص الأكاديمي المطلوب..."
                  className="w-full rounded-2xl border border-[#A77BF3]/50 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                ما الذي ستقدمه بدقة؟ (الوصف والشرح المفصل) *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="اشرح نطاق عملك وتفاصيل المخرجات التي ستقدمها..."
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
            </div>

            {/* Deliverables summary */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                قائمة المخرجات النهائية المحددة *
              </label>
              <input
                type="text"
                value={deliverablesSummary}
                onChange={(e) => setDeliverablesSummary(e.target.value)}
                required
                placeholder="حدد المخرجات المتوقعة بدقة..."
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
            </div>

            {/* Desired Student Fee */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                المكافأة الصافية التي ترغب في الحصول عليها (€) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={20}
                  max={20000}
                  step={5}
                  value={proposedStudentFee}
                  onChange={(e) => setProposedStudentFee(e.target.value ? Number(e.target.value) : '')}
                  required
                  dir="ltr"
                  placeholder="المبلغ باليورو..."
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-[#34D17A] focus:outline-none focus:border-[#34D17A]"
                />
              </div>
              <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">
                تضيف المنصة 20% كرسوم وساطة وحماية وضمان تحصيل على إجمالي الفاتورة للشركة.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="btn-glass-ghost px-5 py-2 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-glass-primary px-6 py-2.5 text-xs font-bold"
              >
                <span>إرسال المقترح للوسيط</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
