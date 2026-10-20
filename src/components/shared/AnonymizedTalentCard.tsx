'use client';

import React, { useState } from 'react';
import { StudentProfile } from '@/lib/types';
import { formatAcademicLevel } from '@/lib/privacy-shield';
import { useStore } from '@/lib/store';
import { Star, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

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
  const { language, t } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`bg-white rounded-[24px] p-6 flex flex-col justify-between border border-black/5 transition-all ${
        isExpanded ? 'border-black/20' : 'hover:border-black/15'
      }`}
    >
      <div>
        {/* Top Header: Code, Rating, Verification */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDEDED] text-[#1A1A1A] font-bold text-sm">
              {student.anonymousCode.split('-')[1]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-base text-[#1A1A1A]">
                  {t('academicTalent')} {student.anonymousCode}
                </span>
              </div>
              <p className="text-xs text-[#5A5A5A] mt-0.5">
                {student.university}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-[#EDEDED] px-2.5 py-1 text-xs font-semibold text-[#1A1A1A]">
            <Star className="h-3.5 w-3.5 stroke-[1.5] text-[#5A5A5A]" />
            <span>{student.internalAdminRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Academic Level & Major */}
        <div className="mt-2">
          <span className="tag-micro">
            {formatAcademicLevel(student.academicLevel, language)}
          </span>
          <p className="mt-1 text-sm font-medium text-[#1A1A1A] line-clamp-1">
            {student.major}
          </p>
        </div>

        {/* Availability and Toggle */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#5A5A5A]">
          <span>{t('availability')} <strong className="text-[#1A1A1A]">{student.weeklyAvailability} {t('hoursWeeklyUnit')}</strong></span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="pill-btn-outline !h-7 !px-3 !text-[11px]"
          >
            {isExpanded ? t('hideDetails') : t('showDetails')}
            {isExpanded ? <ChevronUp className="h-3 w-3 stroke-[1.5]" /> : <ChevronDown className="h-3 w-3 stroke-[1.5]" />}
          </button>
        </div>

        {/* Expandable Details Section */}
        {isExpanded && (
          <div className="mt-4 pt-3.5 border-t border-black/5 space-y-3">
            {/* Bio Summary */}
            <div>
              <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                {t('bioSummaryLabel')}
              </span>
              <p className="text-xs text-[#1A1A1A] leading-relaxed bg-[#EDEDED]/50 p-3 rounded-xl">
                {student.bioSummary}
              </p>
            </div>

            {/* Skills */}
            <div>
              <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1.5">
                {t('verifiedSkillsLabel')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="rounded-full bg-[#EDEDED] px-2.5 py-0.5 text-xs text-[#1A1A1A]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benchmark Rate if available */}
            {student.hourlyBenchmarkRate && (
              <div className="text-xs text-[#5A5A5A] flex items-center justify-between pt-1">
                <span>{t('hourlyRateLabel')}</span>
                <span className="font-semibold text-[#1A1A1A]">${student.hourlyBenchmarkRate} / {language === 'en' ? 'hr' : 'ساعة'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-black/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#5A5A5A]">
          <ShieldCheck className="h-4 w-4 stroke-[1.5] text-[#1A1A1A]" />
          <span>{t('verifiedBadge')}</span>
        </div>

        {onRequestMatch && (
          <button
            type="button"
            onClick={() => onRequestMatch(student)}
            className="pill-btn-dark !h-8 !px-4 !text-xs"
          >
            {t('requestMatch')}
          </button>
        )}

        {showAdminActions && onVerify && (
          <button
            type="button"
            onClick={() => onVerify(student)}
            className="pill-btn-dark !h-8 !px-4 !text-xs"
          >
            {t('vettingReview')}
          </button>
        )}
      </div>
    </div>
  );
}
