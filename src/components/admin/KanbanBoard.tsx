'use client';

import React from 'react';
import { MatchmakingDeal, DealStatus } from '@/lib/types';
import { useStore } from '@/lib/store';

interface Props {
  onSelectDeal: (deal: MatchmakingDeal) => void;
}

export default function KanbanBoard({ onSelectDeal }: Props) {
  const { deals, tasks, students, companies, updateDealStatus, language, t } = useStore();

  const columns: { status: DealStatus; label: string; badgeClass: string }[] = [
    { status: 'SUBMITTED', label: t('kanbanStage1'), badgeClass: 'badge-glass-neutral' },
    { status: 'UNDER_ADMIN_REVIEW', label: t('kanbanStage2'), badgeClass: 'rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3 py-0.5 text-xs font-semibold' },
    { status: 'SHORTLISTED', label: t('kanbanStage3'), badgeClass: 'badge-glass-violet' },
    { status: 'MATCHED_CONNECTED', label: t('kanbanStage4'), badgeClass: 'badge-glass-positive' },
    { status: 'IN_PROGRESS', label: t('kanbanStage5'), badgeClass: 'rounded-full bg-blue-400/10 text-blue-300 border border-blue-400/20 px-3 py-0.5 text-xs font-semibold' },
    { status: 'COMPLETED_COMMISSION_COLLECTED', label: t('kanbanStage6'), badgeClass: 'badge-glass-positive' },
  ];

  const getNextStatus = (current: DealStatus): DealStatus | null => {
    switch (current) {
      case 'SUBMITTED': return 'UNDER_ADMIN_REVIEW';
      case 'UNDER_ADMIN_REVIEW': return 'SHORTLISTED';
      case 'SHORTLISTED': return 'MATCHED_CONNECTED';
      case 'MATCHED_CONNECTED': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'COMPLETED_COMMISSION_COLLECTED';
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-[1200px]">
        {columns.map((col) => {
          const colDeals = deals.filter(d => d.status === col.status);
          const colTotalBudget = colDeals.reduce((sum, d) => sum + d.agreedClientBudget, 0);

          return (
            <div 
              key={col.status}
              className="flex flex-col rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl p-4 min-h-[520px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3 mb-4">
                <div>
                  <span className={`${col.badgeClass}`}>
                    {col.label}
                  </span>
                  <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1.5 font-medium">
                    {language === 'ar' ? `€${colTotalBudget} ${t('kanbanTotalBudget')}` : `${t('kanbanTotalBudget')}: €${colTotalBudget}`}
                  </p>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white border border-white/15">
                  {colDeals.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colDeals.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[rgba(255,255,255,0.1)] py-12 text-center text-xs text-[rgba(255,255,255,0.4)]">
                    {t('kanbanNoDeals')}
                  </div>
                ) : (
                  colDeals.map((deal) => {
                    const task = tasks.find(t => t.id === deal.taskRequestId);
                    const student = students.find(s => s.id === deal.studentProfileId);
                    const company = companies.find(c => c.id === task?.companyProfileId);
                    const nextStatus = getNextStatus(deal.status);
                    const displayTitle = language === 'en'
                      ? (task?.titleEn || task?.title || t('kanbanDefaultTask'))
                      : (task?.title || t('kanbanDefaultTask'));

                    return (
                      <div
                        key={deal.id}
                        className="glass-card p-4 hover:border-[rgba(255,255,255,0.25)] transition-all cursor-pointer group shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                        onClick={() => onSelectDeal(deal)}
                      >
                        {/* Reference & Commission */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                            {deal.dealReference}
                          </span>
                          <span className="font-bold text-[#34D17A]">
                            +€{deal.platformGrossMargin} {t('kanbanBrokerMargin')}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="mt-2.5 text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#A77BF3] transition-colors">
                          {displayTitle}
                        </h4>

                        {/* Parties */}
                        <div className="mt-3 space-y-1.5 text-xs text-[rgba(255,255,255,0.7)]">
                          <div className="truncate">
                            <span className="text-[rgba(255,255,255,0.45)]">{t('kanbanClientLabel')} </span>
                            <span className="truncate">{company?.companyName}</span>
                          </div>
                          <div className="truncate">
                            <span className="text-[rgba(255,255,255,0.45)]">{t('kanbanTalentLabel')} </span>
                            <span className="truncate">{student?.fullName} ({student?.anonymousCode})</span>
                          </div>
                        </div>

                        {/* Footer & Advance */}
                        <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs">
                          <span className="font-light text-base text-white">
                            €{deal.agreedClientBudget}
                          </span>

                          {nextStatus && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateDealStatus(deal.id, nextStatus);
                              }}
                              className="btn-glass-ghost px-2.5 py-1 text-[11px] font-semibold border-white/15 hover:border-white"
                              title={t('kanbanAdvanceTitle')}
                            >
                              <span>{t('nextStage')}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
