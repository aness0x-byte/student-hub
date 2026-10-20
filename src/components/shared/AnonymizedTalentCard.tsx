'use client';

import React, { useState } from 'react';
import { StudentProfile } from '@/lib/types';
import { formatAcademicLevel } from '@/lib/privacy-shield';
import { useStore } from '@/lib/store';

interface Props {
  student: StudentProfile;
  onRequestMatch?: (student: StudentProfile) => void;
  showAdminActions?: boolean;
  onVerify?: (student: StudentProfile) => void;
}

export default function AnonymizedTalentCard({ 
  student, 
  onRequestMatch,
  showAdminActions,
  onVerify
}: Props) {
  const { t } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`glass-card glass-card-hover p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
        isExpanded ? 'border-[rgba(63,208,176,0.4)] shadow-[0_12px_40px_rgba(63,208,176,0.15)]' : ''
      }`}
    >
      <div>
        {/* Top Header: Code, Rating, Verification */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5B2BE0] to-[#A77BF3] text-white font-mono font-bold text-sm shadow-[0_0_16px_rgba(109,91,208,0.4)]">
              {student.anonymousCode.split('-')[1]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">
                  {t('academicTalent')} {student.anonymousCode}
                </span>
                {student.verificationStatus === 'VERIFIED' && (
                  <span className="text-xs text-[#3FD0B0] font-semibold">
                    {t('verifiedBadge')}
                  </span>
                )}
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.6)] font-medium mt-0.5">
                {student.university}
              </p>
            </div>
          </div>

          <div className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-400/20 shrink-0">
            <span>{student.internalAdminRating.toFixed(1)} / 5</span>
          </div>
        </div>

        {/* Academic Level & Major */}
        <div className="mt-2">
          <span className="inline-flex items-center text-xs font-medium text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
            <span>{formatAcademicLevel(student.academicLevel)}</span>
          </span>
          <p className="mt-2 text-sm font-semibold text-[rgba(255,255,255,0.9)] line-clamp-1">
            {student.major}
          </p>
        </div>

        {/* Availability and Toggle Button */}
        <div className="mt-3 flex items-center justify-between text-xs text-[rgba(255,255,255,0.6)]">
          <span>{t('availability')} <strong className="text-white">{student.weeklyAvailability} {t('hoursWeeklyUnit')}</strong></span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-xs font-bold text-[#3FD0B0] hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer"
          >
            {isExpanded ? t('hideDetails') : t('showDetails')}
          </button>
        </div>

        {/* Expandable Details Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3.5 animate-in fade-in duration-200">
            {/* Bio Summary */}
            <div>
              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1">
                {t('bioSummaryLabel')}
              </span>
              <p className="text-xs text-[rgba(255,255,255,0.85)] leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
                {student.bioSummary}
              </p>
            </div>

            {/* Skills */}
            <div>
              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1.5">
                {t('verifiedSkillsLabel')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono text-[rgba(255,255,255,0.9)] border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benchmark Rate if available */}
            {student.hourlyBenchmarkRate && (
              <div className="text-xs text-[rgba(255,255,255,0.65)] flex items-center justify-between pt-1">
                <span>{t('hourlyRateLabel')}</span>
                <span className="font-bold text-[#34D17A]">€{student.hourlyBenchmarkRate} / {t('daysUnit') === 'days' ? 'hr' : 'ساعة'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="mt-5 pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <span className="text-xs text-[rgba(255,255,255,0.45)]">
          {t('privacyShieldBadge')}
        </span>

        {showAdminActions ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVerify?.(student);
            }}
            className="btn-glass-ghost px-4 py-2 text-xs font-semibold"
          >
            {t('verifyTalentBtn')}
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestMatch?.(student);
            }}
            className="btn-glass-gradient px-4 py-2 text-xs font-semibold shadow-[0_0_16px_rgba(127,90,240,0.4)]"
          >
            <span>{t('requestMatch')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
