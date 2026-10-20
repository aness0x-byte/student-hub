'use client';

import React, { useState } from 'react';
import { CompanyTaskRequest } from '@/lib/types';
import { formatAcademicLevel, formatCategoryName } from '@/lib/privacy-shield';
import { useStore } from '@/lib/store';

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

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`glass-card glass-card-hover p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
        isExpanded ? 'border-[rgba(167,123,243,0.4)] shadow-[0_12px_40px_rgba(91,43,224,0.2)]' : ''
      }`}
    >
      <div>
        {/* Top Header: Code, Category, Budget */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
              {task.referenceCode}
            </span>
            <span className="badge-glass-neutral text-xs">
              {formatCategoryName(task.category)}
            </span>
          </div>

          <span className="badge-positive font-bold text-sm shrink-0 tabular-nums">
            €{task.proposedBudget}
          </span>
        </div>

        {/* Task Title */}
        <h3 className="text-base sm:text-lg font-medium text-white hover:text-[#A77BF3] transition-colors leading-snug">
          {task.title}
        </h3>

        {/* Quick summary line when collapsed */}
        <div className="mt-3 flex items-center justify-between text-xs text-[rgba(255,255,255,0.6)]">
          <span>{t('durationLabel')} <strong className="text-white font-medium">{task.estimatedDurationDays} {t('daysUnit')}</strong></span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-xs font-semibold text-[#A77BF3] hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer"
          >
            {isExpanded ? t('hideDetails') : t('showDetails')}
          </button>
        </div>

        {/* Expandable Details Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3.5 animate-in fade-in duration-200">
            {/* Problem Statement */}
            <div>
              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1">
                {t('scopeAndProblem')}
              </span>
              <p className="text-sm text-[rgba(255,255,255,0.85)] leading-relaxed">
                {task.problemStatement}
              </p>
            </div>

            {/* Deliverables Criteria */}
            {task.deliverablesCriteria && (
              <div>
                <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1">
                  {t('deliverablesCriteria')}
                </span>
                <p className="text-xs text-[rgba(255,255,255,0.75)] leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/10">
                  {task.deliverablesCriteria}
                </p>
              </div>
            )}

            {/* Target Academic Level */}
            {task.targetAcademicLevel && (
              <div className="text-xs text-[rgba(255,255,255,0.7)] flex items-center gap-1.5">
                <span className="text-[rgba(255,255,255,0.5)]">{t('requiredAcademicLevel')}</span>
                <span className="font-semibold text-white">
                  {formatAcademicLevel(task.targetAcademicLevel)}
                </span>
              </div>
            )}

            {/* Required Skills */}
            <div>
              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1.5">
                {t('requiredSkills')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {task.requiredSkills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono text-[rgba(255,255,255,0.9)] border border-white/10"
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
      <div className="mt-5 pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <span className="text-xs text-[rgba(255,255,255,0.45)]">
          {t('underBrokerSupervision')}
        </span>

        {isAdmin ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSmartMatch?.(task);
            }}
            className="btn-glass-gradient px-4 py-2 text-xs font-semibold shadow-[0_0_16px_rgba(127,90,240,0.4)]"
          >
            <span>{t('smartMatch')}</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(task);
            }}
            className="btn-glass-primary px-4 py-2 text-xs font-semibold"
          >
            <span>{t('apply')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
