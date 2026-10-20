'use client';

import React, { useState } from 'react';
import { StudentProfile, VerificationStatus } from '@/lib/types';
import { useStore } from '@/lib/store';
import { formatAcademicLevel } from '@/lib/privacy-shield';

interface Props {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentVettingModal({ student, isOpen, onClose }: Props) {
  const { verifyStudent } = useStore();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-[rgba(255,255,255,0.15)] bg-[#0C0C16]/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white max-h-[92vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute left-6 top-6 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          إغلاق
        </button>

        {isSaved ? (
          <div className="py-10 text-center">
            <h3 className="mt-4 text-2xl font-light text-white">
              تم تحديث توثيق الطالب بنجاح!
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.65)]">
              تم حفظ قرار الاعتماد والتقييم الإداري وملاحظات الوسيط.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="badge-glass-violet text-xs">
                  <span>مركز فحص وتوثيق الكفاءات الأكاديمية</span>
                </span>
                <span className="text-xs font-mono font-bold text-white/50">
                  {student.anonymousCode}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                مراجعة واعتماد: {student.fullName}
              </h2>
              <p className="text-xs text-[rgba(255,255,255,0.6)] mt-1">
                {student.university} • {formatAcademicLevel(student.academicLevel)}
              </p>
            </div>

            {/* Document Verification Proof */}
            <div className="glass-card p-4 space-y-2.5">
              <span className="text-xs font-semibold text-[rgba(255,255,255,0.6)]">
                الإثبات الأكاديمي المرفوع
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white font-semibold">
                  <span>بطاقة الطالب الجامعية / شهادة القيد الرسمية</span>
                </div>
                <span className="badge-glass-neutral text-xs cursor-pointer hover:border-white">
                  <span>معاينة المستند</span>
                </span>
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.5)] pt-1 border-t border-white/10" dir="ltr">
                {student.universityEmail} • {student.phone}
              </p>
            </div>

            {/* Verification Status */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.7)] mb-2">
                قرار الاعتماد والتوثيق
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('VERIFIED')}
                  className={`rounded-2xl py-2.5 px-3 text-xs font-bold transition-all text-center cursor-pointer ${
                    status === 'VERIFIED'
                      ? 'bg-[#34D17A]/20 text-[#34D17A] border border-[#34D17A]/60 shadow-[0_0_16px_rgba(52,209,122,0.2)]'
                      : 'glass-card text-[rgba(255,255,255,0.6)] hover:text-white'
                  }`}
                >
                  <span>معتمد وموثق</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('PENDING_REVIEW')}
                  className={`rounded-2xl py-2.5 px-3 text-xs font-bold transition-all text-center cursor-pointer ${
                    status === 'PENDING_REVIEW'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                      : 'glass-card text-[rgba(255,255,255,0.6)] hover:text-white'
                  }`}
                >
                  <span>قيد المراجعة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('REJECTED')}
                  className={`rounded-2xl py-2.5 px-3 text-xs font-bold transition-all text-center cursor-pointer ${
                    status === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_16px_rgba(244,63,94,0.2)]'
                      : 'glass-card text-[rgba(255,255,255,0.6)] hover:text-white'
                  }`}
                >
                  <span>مرفوض</span>
                </button>
              </div>
            </div>

            {/* Internal Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[rgba(255,255,255,0.7)]">
                  التقييم الداخلي للوسيط (من 3.0 إلى 5.0)
                </label>
                <span className="font-bold text-amber-300 text-xs bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  <span>{rating.toFixed(1)} / 5.0</span>
                </span>
              </div>
              <input
                type="range"
                min="3.0"
                max="5.0"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full accent-[#A77BF3] cursor-pointer"
              />
            </div>

            {/* Admin Private Notes */}
            <div>
              <label className="block text-xs font-semibold text-[rgba(255,255,255,0.7)] mb-1.5">
                ملاحظات الوسيط السرية وسجل المقابلة
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="اكتب نقاط القوة، النماذج وسوابق الأعمال، تقييم الكفاءة والالتزام..."
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
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
                <span>حفظ التوثيق</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
