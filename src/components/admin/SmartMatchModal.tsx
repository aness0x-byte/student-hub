'use client';

import React, { useState } from 'react';
import { CompanyTaskRequest, StudentProfile } from '@/lib/types';
import { useStore } from '@/lib/store';
import { getTopMatchingStudents, MatchScoreResult } from '@/lib/matching-engine';
import { formatAcademicLevel } from '@/lib/privacy-shield';
import { X, Check, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  task: CompanyTaskRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onDealCreated?: (dealReference: string) => void;
}

export default function SmartMatchModal({ task, isOpen, onClose, onDealCreated }: Props) {
  const { students, createMatchDeal, companies, language, t } = useStore();
  
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [agreedBudget, setAgreedBudget] = useState<number>(task?.proposedBudget || 350);
  const [studentPayout, setStudentPayout] = useState<number>(
    task ? Math.round(task.proposedBudget * 0.8) : 280
  );
  const [adminNotes, setAdminNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdDealRef, setCreatedDealRef] = useState('');

  if (!isOpen || !task) return null;

  const topMatches: MatchScoreResult[] = getTopMatchingStudents(task, students, 5);
  const company = companies.find(c => c.id === task.companyProfileId);
  const displayTaskTitle = language === 'en' ? (task.titleEn || task.title) : task.title;

  const handleInitiateDeal = (student: StudentProfile) => {
    setSelectedStudent(student);
    setAgreedBudget(task.proposedBudget);
    setStudentPayout(Math.round(task.proposedBudget * 0.8));
  };

  const handleConfirmDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const defaultNotes = language === 'ar'
      ? `تمت مطابقة الكفاءة ${selectedStudent.anonymousCode} بنجاح عبر نظام المطابقة الذكي.`
      : `Matched talent ${selectedStudent.anonymousCode} successfully via smart algorithm engine.`;

    const deal = createMatchDeal({
      taskRequestId: task.id,
      studentProfileId: selectedStudent.id,
      agreedBudget: Number(agreedBudget),
      studentPayout: Number(studentPayout),
      adminNotes: adminNotes || defaultNotes,
    });

    setCreatedDealRef(deal.dealReference);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setSelectedStudent(null);
      onDealCreated?.(deal.dealReference);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-[32px] bg-white border border-black/10 p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-[#1A1A1A] shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-6 w-9 h-9 rounded-full bg-[#EDEDED] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E4E4E4] transition-colors`}
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#262626] text-white flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A]">
              {t('smartMatchSuccessTitle')}
            </h3>
            <p className="mt-2 text-xs text-[#5A5A5A]">
              {t('smartMatchDealRef')} <strong className="text-[#1A1A1A] font-mono text-sm">{createdDealRef}</strong>
            </p>
            <p className="mt-2 text-xs text-[#8C8C8C] max-w-md mx-auto leading-relaxed">
              {t('smartMatchSuccessSub')}
            </p>
          </div>
        ) : selectedStudent ? (
          /* Deal Confirmation Form */
          <form onSubmit={handleConfirmDeal} className="space-y-5">
            <div className="border-b border-black/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="pill-badge-black !text-[10px] !py-0.5">
                  {t('smartMatchSettingsTitle')}
                </span>
                <span className="text-xs text-[#8C8C8C] font-mono">
                  {t('smartMatchTaskLabel')} {task.referenceCode}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">
                {language === 'en' ? 'Confirm Match Deal with' : 'تأكيد إبرام الصفقة مع'} {selectedStudent.anonymousCode}
              </h2>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                  {t('smartMatchGrossAmount')}
                </label>
                <input
                  type="number"
                  value={agreedBudget}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAgreedBudget(val);
                    setStudentPayout(Math.round(val * 0.8));
                  }}
                  className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                  {t('smartMatchTalentPayout')}
                </label>
                <input
                  type="number"
                  value={studentPayout}
                  onChange={(e) => setStudentPayout(Number(e.target.value))}
                  className="w-full rounded-full bg-[#EDEDED] px-4 py-2.5 text-xs text-[#1A1A1A] border-none focus:outline-none font-semibold"
                />
              </div>
            </div>

            {/* Broker Cut Calculation */}
            <div className="p-3.5 rounded-2xl bg-[#EDEDED]/50 flex items-center justify-between text-xs">
              <span className="text-[#5A5A5A]">{t('smartMatchBrokerRevenue')}</span>
              <strong className="text-sm font-semibold text-[#1A1A1A]">
                +${agreedBudget - studentPayout} (20%)
              </strong>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
                {t('smartMatchBrokerDirectives')}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={t('smartMatchDirectivesPlaceholder')}
                rows={3}
                className="w-full rounded-2xl bg-[#EDEDED] p-3 text-xs text-[#1A1A1A] border-none focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="pill-btn-outline !h-9 !px-5"
              >
                <span>{t('smartMatchBackToTalents')}</span>
              </button>

              <button
                type="submit"
                className="pill-btn-dark !h-9 !px-6"
              >
                <span>{t('smartMatchConfirmDeal')}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Student Leaderboard */
          <div className="space-y-5">
            <div className="border-b border-black/5 pb-4">
              <span className="pill-badge-black !text-[10px] !py-0.5">
                {t('smartMatchSettingsTitle')}
              </span>
              <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">
                {language === 'en' ? 'Candidate Recommendations Leaderboard' : 'لوحة ترتيب الكفاءات المرشحة للمهمة'}
              </h2>
              <p className="text-xs text-[#5A5A5A] mt-1">
                {company?.companyName} • {displayTaskTitle} (${task.proposedBudget})
              </p>
            </div>

            <div className="space-y-3">
              {topMatches.map(({ student, overallScore, breakdown }) => (
                <div
                  key={student.id}
                  className="bg-[#F2F2F2] rounded-[22px] p-4 sm:p-5 border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-white px-2.5 py-0.5 rounded-full">
                        {student.anonymousCode}
                      </span>
                      <span className="tag-micro">
                        {student.major}
                      </span>
                      <span className="text-xs text-[#5A5A5A]">
                        {student.university}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#5A5A5A]">
                      <span>{language === 'en' ? 'Fit Score' : 'نسبة التطابق'}: <strong className="text-[#1A1A1A]">{overallScore}%</strong></span>
                      <span>•</span>
                      <span>{formatAcademicLevel(student.academicLevel, language)}</span>
                      <span>•</span>
                      <span>★ {student.internalAdminRating.toFixed(1)}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {breakdown.matchedSkills.map((sk: string) => (
                        <span key={sk} className="text-[10px] bg-white text-[#1A1A1A] px-2 py-0.5 rounded-full font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleInitiateDeal(student)}
                    className="pill-btn-dark !h-8 !px-4 !text-xs shrink-0"
                  >
                    <span>{t('smartMatchAssignTalent')}</span>
                    <ArrowRight className="h-3 w-3 stroke-[2]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
