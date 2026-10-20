'use client';

import React, { useState } from 'react';
import { CompanyTaskRequest } from '@/lib/types';
import { useStore } from '@/lib/store';

interface Props {
  task: CompanyTaskRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyModal({ task, isOpen, onClose }: Props) {
  const { applyToTask } = useStore();
  const [pitch, setPitch] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !task) return null;

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
              تم إرسال عرضك التنفيذي بنجاح!
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.7)] max-w-sm mx-auto leading-relaxed">
              تم رفع عرضك للمهمة ذات الكود المرجعي <strong className="text-white font-mono">{task.referenceCode}</strong> مباشرة إلى الوسيط المعتمد لمراجعته وتنسيق الصفقة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  {task.referenceCode}
                </span>
                <span className="text-xs text-[rgba(255,255,255,0.6)]">
                  المكافأة الصافية المضمونة: <strong className="text-[#34D17A]">€{Math.round(task.proposedBudget * 0.8)}</strong> • مدة التسليم: {task.estimatedDurationDays} أيام
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                التقدم لتنفيذ المهمة: {task.title}
              </h2>
            </div>

            {/* Privacy Reminder */}
            <div className="glass-card p-4 text-xs text-[rgba(255,255,255,0.8)] flex items-start gap-3 border-[#3FD0B0]/20 bg-[#3FD0B0]/5">
              <span className="leading-relaxed">
                <strong>ضمانات الوساطة الحصرية:</strong> يُرفع عرضك مباشرة إلى الوسيط المعتمد. تبقى هويتك وبياناتك الشخصية محمية بالكامل، ومستحقاتك المالية مودعة ومضمونة سلفاً وتُصرف فور اعتماد المخرجات.
              </span>
            </div>

            {/* Pitch Textarea */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                منهجية التنفيذ وعرضك المباشر للوسيط *
              </label>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                required
                rows={4}
                placeholder="اشرح منهجية التنفيذ وسوابق خبرتك لتنفيذ متطلبات هذه المهمة باحترافية..."
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
            </div>

            {/* Portfolio / Attachment Link */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.8)] mb-1">
                رابط نموذج عمل أو ملف إثبات المهارة (اختياري)
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
              <p className="mt-1 text-xs text-[rgba(255,255,255,0.45)]">
                يقوم الوسيط المعتمد بالتحقق من جودة النماذج المرفقة لتعزيز أولوية الترشيح وتدشين الصفقة.
              </p>
            </div>

            {/* Submit Button */}
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
                <span>إرسال العرض للوسيط</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
