'use client';

import React from 'react';
import { MatchmakingDeal, DealStatus } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ChevronLeft } from 'lucide-react';

interface Props {
  onSelectDeal: (deal: MatchmakingDeal) => void;
}

export default function KanbanBoard({ onSelectDeal }: Props) {
  const { deals, tasks, students, companies, updateDealStatus, language, t } = useStore();

  const columns: { status: DealStatus; label: string; numberLabel: string }[] = [
    { status: 'SUBMITTED', label: language === 'ar' ? 'طلب جديد وارد' : 'New Request', numberLabel: '١' },
    { status: 'UNDER_ADMIN_REVIEW', label: language === 'ar' ? 'تدقيق النطاق والميزانية' : 'Scope Audit', numberLabel: '٢' },
    { status: 'SHORTLISTED', label: language === 'ar' ? 'ترشيح ومطابقة الكفاءة' : 'Talent Matched', numberLabel: '٣' },
    { status: 'MATCHED_CONNECTED', label: language === 'ar' ? 'تم التكليف والربط' : 'Contract Assigned', numberLabel: '٤' },
    { status: 'IN_PROGRESS', label: language === 'ar' ? 'قيد الإنجاز والتنفيذ' : 'Execution & In Progress', numberLabel: '٥' },
    { status: 'COMPLETED_COMMISSION_COLLECTED', label: language === 'ar' ? 'مكتمل ومسوي مالياً' : 'Completed & Settled', numberLabel: '٦' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-w-[900px]">
        {/* Render columns, prioritizing active stages 4, 5, 6 as shown in reference */}
        {columns.filter(c => ['MATCHED_CONNECTED', 'IN_PROGRESS', 'COMPLETED_COMMISSION_COLLECTED'].includes(c.status)).map((col) => {
          const colDeals = deals.filter(d => d.status === col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-[24px] bg-white border border-black/5 p-5 min-h-[420px] shadow-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
                <span className="text-sm font-semibold text-[#1A1A1A]">
                  {col.numberLabel}. {col.label}
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EDEDED] text-xs font-semibold text-[#1A1A1A]">
                  {colDeals.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 space-y-3.5">
                {colDeals.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#C4C4C4] py-12 text-center text-xs text-[#8C8C8C]">
                    {language === 'ar' ? 'لا توجد صفقات في هذه المرحلة' : 'No deals in this stage'}
                  </div>
                ) : (
                  colDeals.map((deal) => {
                    const task = tasks.find(t => t.id === deal.taskRequestId);
                    const student = students.find(s => s.id === deal.studentProfileId);
                    const company = companies.find(c => c.id === task?.companyProfileId);
                    const nextStatus = getNextStatus(deal.status);
                    const displayTitle = language === 'ar'
                      ? (task?.title || 'مهمة العقد')
                      : (task?.titleEn || task?.title || 'Contract Task');

                    return (
                      <div
                        key={deal.id}
                        className="bg-[#F8F8F8] rounded-[20px] p-4 border border-black/5 hover:border-black/20 transition-all cursor-pointer space-y-3"
                        onClick={() => onSelectDeal(deal)}
                      >
                        {/* Reference & Commission */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-white px-2.5 py-0.5 rounded-full border border-black/5">
                            {deal.dealReference}
                          </span>
                          <span className="font-semibold text-xs text-[#1A1A1A] bg-white px-2.5 py-0.5 rounded-full border border-black/5">
                            +${deal.platformGrossMargin}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-[13px] font-semibold text-[#1A1A1A] leading-snug">
                          {displayTitle}
                        </h4>

                        {/* Parties info */}
                        <div className="space-y-0.5 text-[11px] text-[#5A5A5A]">
                          <div>
                            <span>{language === 'ar' ? 'الجهة الطالبة: ' : 'Client: '}</span>
                            <strong className="text-[#1A1A1A] font-medium">{company?.companyName || 'FintechPulse Technologies'}</strong>
                          </div>
                          <div>
                            <span>{language === 'ar' ? 'الكفاءة المنفذة: ' : 'Talent: '}</span>
                            <strong className="text-[#1A1A1A] font-medium">{student?.anonymousCode || 'STU-9402'}</strong>
                          </div>
                        </div>

                        {/* Footer row: Total Budget & Action */}
                        <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#1A1A1A]">
                            ${deal.agreedClientBudget}
                          </span>

                          {nextStatus ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateDealStatus(deal.id, nextStatus);
                              }}
                              className="pill-btn-outline !h-7 !px-3 !text-[11px] hover:bg-[#1A1A1A] hover:text-white transition-colors gap-1"
                            >
                              <span>{language === 'ar' ? 'المرحلة التالية ←' : 'Next Stage →'}</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#1A1A1A] bg-white px-3 py-1 rounded-full border border-black/5">
                              {language === 'ar' ? 'تمت التسوية' : 'Settled'}
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
