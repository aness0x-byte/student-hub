'use client';

import React from 'react';
import { MatchmakingDeal, DealStatus } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';

interface Props {
  onSelectDeal: (deal: MatchmakingDeal) => void;
}

export default function KanbanBoard({ onSelectDeal }: Props) {
  const { deals, tasks, students, companies, updateDealStatus, language, t } = useStore();

  const columns: { status: DealStatus; label: string }[] = [
    { status: 'SUBMITTED', label: t('kanbanStage1') },
    { status: 'UNDER_ADMIN_REVIEW', label: t('kanbanStage2') },
    { status: 'SHORTLISTED', label: t('kanbanStage3') },
    { status: 'MATCHED_CONNECTED', label: t('kanbanStage4') },
    { status: 'IN_PROGRESS', label: t('kanbanStage5') },
    { status: 'COMPLETED_COMMISSION_COLLECTED', label: t('kanbanStage6') },
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
    <div className="overflow-x-auto pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-[1100px]">
        {columns.map((col) => {
          const colDeals = deals.filter(d => d.status === col.status);
          const colTotalBudget = colDeals.reduce((sum, d) => sum + d.agreedClientBudget, 0);

          return (
            <div 
              key={col.status}
              className="flex flex-col rounded-[24px] bg-white border border-black/5 p-4 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-3.5">
                <div>
                  <span className="text-xs font-semibold text-[#1A1A1A] block">
                    {col.label}
                  </span>
                  <p className="text-[11px] text-[#8C8C8C] mt-0.5">
                    ${colTotalBudget} {t('kanbanTotalBudget')}
                  </p>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EDEDED] text-xs font-semibold text-[#1A1A1A]">
                  {colDeals.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colDeals.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#C4C4C4] py-10 text-center text-xs text-[#8C8C8C]">
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
                        className="bg-[#F2F2F2] rounded-[18px] p-3.5 border border-black/5 hover:border-black/20 transition-all cursor-pointer group"
                        onClick={() => onSelectDeal(deal)}
                      >
                        {/* Reference & Commission */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] font-semibold text-[#1A1A1A] bg-white px-2 py-0.5 rounded-full">
                            {deal.dealReference}
                          </span>
                          <span className="font-semibold text-xs text-[#1A1A1A]">
                            +${deal.platformGrossMargin}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="mt-2 text-xs font-medium text-[#1A1A1A] line-clamp-2 leading-snug">
                          {displayTitle}
                        </h4>

                        {/* Parties */}
                        <div className="mt-2.5 space-y-1 text-[11px] text-[#5A5A5A]">
                          <div className="truncate">
                            <span className="text-[#8C8C8C]">{t('kanbanClientLabel')} </span>
                            <span className="text-[#1A1A1A] font-medium">{company?.companyName}</span>
                          </div>
                          <div className="truncate">
                            <span className="text-[#8C8C8C]">{t('kanbanTalentLabel')} </span>
                            <span className="text-[#1A1A1A] font-medium">{student?.anonymousCode}</span>
                          </div>
                        </div>

                        {/* Budget & Advance action */}
                        <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[#1A1A1A]">
                            ${deal.agreedClientBudget}
                          </span>

                          {nextStatus ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateDealStatus(deal.id, nextStatus);
                              }}
                              className="text-[10px] font-semibold text-[#1A1A1A] bg-white hover:bg-black hover:text-white px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>{t('nextStage')}</span>
                              <ChevronRight className="h-3 w-3 stroke-[2]" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#5A5A5A] font-medium">
                              {language === 'en' ? 'Deal Settled' : 'تمت التسوية'}
                            </span>
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
