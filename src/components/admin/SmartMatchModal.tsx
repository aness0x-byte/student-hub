'use client';

import React, { useState } from 'react';
import { CompanyTaskRequest, StudentProfile } from '@/lib/types';
import { useStore } from '@/lib/store';
import { getTopMatchingStudents, MatchScoreResult } from '@/lib/matching-engine';
import { formatAcademicLevel } from '@/lib/privacy-shield';

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
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl border border-[rgba(255,255,255,0.15)] bg-[#0C0C16]/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[92vh] overflow-y-auto text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-6 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors`}
        >
          <span>{t('close')}</span>
        </button>

        {isSuccess ? (
          <div className="py-12 text-center">
            <h3 className="mt-4 text-2xl font-light text-white">
              {t('smartMatchSuccessTitle')}
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.7)]">
              {t('smartMatchDealRef')} <strong className="text-[#34D17A] font-mono text-base">{createdDealRef}</strong>
            </p>
            <p className="mt-2 text-xs text-[rgba(255,255,255,0.45)] max-w-md mx-auto leading-relaxed">
              {t('smartMatchSuccessSub')}
            </p>
          </div>
        ) : selectedStudent ? (
          /* Deal Confirmation Form */
          <form onSubmit={handleConfirmDeal} className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="badge-glass-violet text-xs">
                  {t('smartMatchSettingsTitle')}
                </span>
                <span className="text-xs text-[rgba(255,255,255,0.5)] font-mono">
                  {t('smartMatchTaskLabel')} {task.referenceCode}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                {t('smartMatchAssignTalent')} {selectedStudent.fullName} ({selectedStudent.anonymousCode})
              </h2>
            </div>

            {/* Financial Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-4">
                <label className="block text-xs font-semibold text-[rgba(255,255,255,0.7)] mb-1">
                  {t('smartMatchGrossAmount')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={agreedBudget}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAgreedBudget(val);
                      setStudentPayout(Math.round(val * 0.8));
                    }}
                    required
                    dir="ltr"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#A77BF3]"
                  />
                </div>
              </div>

              <div className="glass-card p-4 border-[#34D17A]/30">
                <label className="block text-xs font-semibold text-[#34D17A] mb-1">
                  {t('smartMatchTalentPayout')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={studentPayout}
                    onChange={(e) => setStudentPayout(Number(e.target.value))}
                    required
                    dir="ltr"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-[#34D17A] focus:outline-none focus:border-[#34D17A]"
                  />
                </div>
              </div>

              <div className="glass-card p-4 border-[#A77BF3]/40 bg-[#5B2BE0]/15">
                <label className="block text-xs font-semibold text-[#A77BF3] mb-1">
                  {t('smartMatchBrokerRevenue')}
                </label>
                <p className="mt-1 text-lg font-bold text-white">
                  €{agreedBudget - studentPayout}
                  <span className="text-xs text-[rgba(255,255,255,0.6)] font-normal mx-2">
                    ({agreedBudget > 0 ? (((agreedBudget - studentPayout) / agreedBudget) * 100).toFixed(0) : 0}%)
                  </span>
                </p>
              </div>
            </div>

            {/* Admin notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[rgba(255,255,255,0.7)]">
                {t('smartMatchBrokerDirectives')}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder={t('smartMatchDirectivesPlaceholder')}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="btn-glass-ghost px-5 py-2.5 text-xs font-semibold"
              >
                {t('smartMatchBackToTalents')}
              </button>
              <button
                type="submit"
                className="btn-glass-primary px-6 py-2.5 text-xs font-bold"
              >
                <span>{language === 'en' ? 'Confirm Match & Launch Deal Room' : 'تأكيد المطابقة وتدشين غرفة الصفقة'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Top 5 Matches Leaderboard */
          <div>
            {/* Header */}
            <div className="border-b border-white/10 pb-5 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="badge-glass-violet text-xs">
                  <span>{language === 'en' ? 'Algorithmic Smart Match Assistant' : 'مساعد المطابقة الذكي الخوارزمي'}</span>
                </span>
                <span className="text-xs text-[rgba(255,255,255,0.5)] font-mono">
                  {task.referenceCode}
                </span>
              </div>
              
              <h2 className="mt-3 text-2xl font-light text-white">
                {language === 'en' ? `Top 5 Matching Talents for: ${displayTaskTitle}` : `أفضل 5 كفاءات جامعية مطابقة لـ: ${displayTaskTitle}`}
              </h2>
              
              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[rgba(255,255,255,0.6)] font-medium">
                <span>{language === 'en' ? 'Client:' : 'جهة الأعمال:'} <strong className="text-white">{company?.companyName || (language === 'en' ? 'Verified Enterprise' : 'شركة ومؤسسة معتمدة')}</strong></span>
                <span>•</span>
                <span>{language === 'en' ? 'Budget:' : 'الميزانية:'} <strong className="text-[#34D17A]">€{task.proposedBudget}</strong></span>
                <span>•</span>
                <span>{t('requiredSkills')}: <strong className="text-[#A77BF3]">{task.requiredSkills.join(', ')}</strong></span>
              </div>
            </div>

            {/* Candidate List */}
            <div className="space-y-3.5">
              {topMatches.map((match, idx) => (
                <div
                  key={match.student.id}
                  className="glass-card p-4 hover:border-white/25 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Rank & Student Info */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white font-mono font-bold text-sm border border-white/15">
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-base">
                            {match.student.fullName}
                          </span>
                          <span className="text-xs font-mono text-[#A77BF3] font-bold">
                            ({match.student.anonymousCode})
                          </span>
                          <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                            {match.student.internalAdminRating.toFixed(1)} / 5.0
                          </span>
                        </div>

                        <p className="text-xs text-[rgba(255,255,255,0.65)] mt-1">
                          {match.student.university} • {formatAcademicLevel(match.student.academicLevel, language)}
                        </p>

                        <p className="text-xs text-[#3FD0B0] mt-1.5 font-medium">
                          {language === 'en' ? 'Match Recommendation: ' : 'توصية الخوارزمية: '}{match.recommendationReason}
                        </p>
                      </div>
                    </div>

                    {/* Score & Select Button */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[rgba(255,255,255,0.6)]">{language === 'en' ? 'Fit Score:' : 'نسبة التوافق:'}</span>
                        <span className="badge-glass-positive text-xs font-bold">
                          {match.overallScore}%
                        </span>
                      </div>

                      <button
                        onClick={() => handleInitiateDeal(match.student)}
                        className="btn-glass-gradient px-4 py-2 text-xs font-bold shadow-[0_0_16px_rgba(127,90,240,0.4)]"
                      >
                        <span>{language === 'en' ? 'Assign & Setup Deal' : 'اعتماد وتعيين الوساطة'}</span>
                      </button>
                    </div>

                  </div>

                  {/* Score breakdown metrics bar */}
                  <div className="mt-3.5 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[rgba(255,255,255,0.6)]">
                    <div>
                      <span>{language === 'en' ? 'Skill Match: ' : 'تطابق المهارات: '}</span>
                      <strong className="text-white font-mono">{match.breakdown.skillMatchScore}%</strong>
                    </div>
                    <div>
                      <span>{language === 'en' ? 'Academic Level: ' : 'المستوى الأكاديمي: '}</span>
                      <strong className="text-white font-mono">{match.breakdown.academicFitScore}%</strong>
                    </div>
                    <div>
                      <span>{language === 'en' ? 'Admin Rating: ' : 'تقييم الإدارة: '}</span>
                      <strong className="text-white font-mono">{match.breakdown.ratingScore}%</strong>
                    </div>
                    <div>
                      <span>{language === 'en' ? 'Availability: ' : 'ساعات التفرغ: '}</span>
                      <strong className="text-white font-mono">{match.student.weeklyAvailability} {t('hoursPerWeekUnit')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="btn-glass-ghost px-5 py-2 text-xs font-semibold"
              >
                {language === 'en' ? 'Close Assistant' : 'إغلاق المساعد'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
