'use client';

import React, { useState } from 'react';
import { CompanyTaskRequest } from '@/lib/types';
import { formatAcademicLevel, formatCategoryName } from '@/lib/privacy-shield';
import { useStore } from '@/lib/store';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface Props {
  task: CompanyTaskRequest;
  onApply?: (task: CompanyTaskRequest) => void;
  onSmartMatch?: (task: CompanyTaskRequest) => void;
  isAdmin?: boolean;
}

export default function AnonymizedTaskCard({ 
  task, 
  onApply, 
  onSmartMatch,
  isAdmin = false
}: Props) {
  const { language, t } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayTitle = language === 'en' ? (task.titleEn || task.title) : task.title;
  const displayProblem = language === 'en' ? (task.problemStatementEn || task.problemStatement) : task.problemStatement;
  const displayDeliverables = language === 'en' ? (task.deliverablesCriteriaEn || task.deliverablesCriteria) : task.deliverablesCriteria;

  return (
    <div 
      className={`bg-white rounded-[24px] p-6 flex flex-col justify-between border border-black/5 transition-all ${
        isExpanded ? 'border-black/20' : 'hover:border-black/15'
      }`}
    >
      <div>
        {/* Top Header: Code, Category, Budget */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
              {task.referenceCode}
            </span>
            <span className="tag-micro">
              {formatCategoryName(task.category, language)}
            </span>
          </div>

          <span className="font-semibold text-base text-[#1A1A1A] tabular-nums">
            ${task.proposedBudget}
          </span>
        </div>

        {/* Task Title */}
        <h3 className="text-[16px] sm:text-[17px] font-medium text-[#1A1A1A] leading-snug">
          {displayTitle}
        </h3>

        {/* Quick summary line when collapsed */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#5A5A5A]">
          <span>{t('durationLabel')} <strong className="text-[#1A1A1A] font-medium">{task.estimatedDurationDays} {t('daysUnit')}</strong></span>
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
            {/* Problem Statement */}
            <div>
              <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                {t('scopeAndProblem')}
              </span>
              <p className="text-[13px] text-[#1A1A1A] leading-relaxed">
                {displayProblem}
              </p>
            </div>

            {/* Deliverables Criteria */}
            {displayDeliverables && (
              <div>
                <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                  {t('deliverablesCriteria')}
                </span>
                <p className="text-xs text-[#5A5A5A] leading-relaxed bg-[#EDEDED]/50 p-2.5 rounded-xl">
                  {displayDeliverables}
                </p>
              </div>
            )}

            {/* Target Academic Level */}
            {task.targetAcademicLevel && (
              <div className="text-xs text-[#5A5A5A] flex items-center gap-1.5">
                <span className="text-[#8C8C8C]">{t('requiredAcademicLevel')}</span>
                <span className="font-medium text-[#1A1A1A]">
                  {formatAcademicLevel(task.targetAcademicLevel, language)}
                </span>
              </div>
            )}

            {/* Required Skills */}
            <div>
              <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1.5">
                {t('requiredSkills')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {task.requiredSkills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="rounded-full bg-[#EDEDED] px-2.5 py-0.5 text-xs text-[#1A1A1A]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#5A5A5A]">
          <ShieldCheck className="h-4 w-4 stroke-[1.5] text-[#1A1A1A]" />
          <span>{t('underBrokerSupervision')}</span>
        </div>

        {isAdmin ? (
          <button
            onClick={() => onSmartMatch?.(task)}
            className="pill-btn-dark !h-8 !px-4 !text-xs"
          >
            {t('smartMatch')}
          </button>
        ) : (
          onApply && (
            <button
              onClick={() => onApply(task)}
              className="pill-btn-dark !h-8 !px-4 !text-xs"
            >
              {t('apply')}
            </button>
          )
        )}
      </div>
    </div>
  );
}
