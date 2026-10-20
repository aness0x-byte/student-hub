'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';

type ChartTimeframe = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

interface Props {
  onSettleClick?: () => void;
}

export default function RefADashboardOverview({ onSettleClick }: Props) {
  const { language, t, ledger, deals, tasks, students, companies } = useStore();
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('WEEKLY');

  // Spline paths for each timeframe per Section 6.5
  const splineData: Record<ChartTimeframe, { path: string; activeX: number; activeY: number; activeVal: string; xLabelsAr: string[]; xLabelsEn: string[] }> = {
    DAILY: {
      path: 'M 10 140 Q 90 120, 160 90 T 310 110 T 460 50 T 610 80 T 750 30',
      activeX: 460,
      activeY: 50,
      activeVal: '€4,850',
      xLabelsAr: ['12:00ص', '04:00ص', '08:00ص', '12:00م', '04:00م', '08:00م'],
      xLabelsEn: ['12:00 AM', '04:00 AM', '08:00 AM', '12:00 PM', '04:00 PM', '08:00 PM'],
    },
    WEEKLY: {
      path: 'M 10 150 Q 100 130, 180 80 T 340 100 T 500 40 T 640 60 T 750 20',
      activeX: 500,
      activeY: 40,
      activeVal: '€9,432',
      xLabelsAr: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      xLabelsEn: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    },
    MONTHLY: {
      path: 'M 10 160 Q 120 140, 220 95 T 390 70 T 540 35 T 670 45 T 750 15',
      activeX: 540,
      activeY: 35,
      activeVal: '€28,600',
      xLabelsAr: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
      xLabelsEn: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    },
    YEARLY: {
      path: 'M 10 170 Q 130 150, 240 110 T 420 80 T 570 25 T 690 30 T 750 10',
      activeX: 570,
      activeY: 25,
      activeVal: '€112,400',
      xLabelsAr: ['الربع 1', 'الربع 2', 'الربع 3', 'الربع 4'],
      xLabelsEn: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
  };

  const currentChart = splineData[timeframe];
  const xLabels = language === 'ar' ? currentChart.xLabelsAr : currentChart.xLabelsEn;
  const totalCommission = ledger.reduce((sum, item) => sum + item.platformCommissionAmount, 0);
  const totalInvoiced = ledger.reduce((sum, item) => sum + item.grossClientAmount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      
      {/* 6.4 Balance column (1fr in 1fr · 2.4fr · 1fr) -> 3.5 cols */}
      <div className="lg:col-span-3 glass-card p-6 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Stat Group 1: Total Liquid Balance with Withdraw button */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[rgba(255,255,255,0.72)] font-normal">{t('totalLiquidBalance')}</span>
              <span className="text-[#34D17A] text-[11px] font-medium">+14.2%</span>
            </div>
            <div className="num-md text-white font-normal tabular-nums">
              €{totalInvoiced}
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={onSettleClick}
                className="btn-solid cursor-pointer"
              >
                {t('wireSettlementBtn')}
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-[rgba(255,255,255,0.10)]" />

          {/* Stat Group 2: Commission Margin */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[rgba(255,255,255,0.72)] font-normal">{t('collectedMargins')}</span>
              <span className="text-[#A77BF3] text-[11px] font-medium">20%</span>
            </div>
            <div className="num-md text-[#A77BF3] font-normal tabular-nums">
              €{totalCommission}
            </div>
          </div>

          <div className="h-[1px] bg-[rgba(255,255,255,0.10)]" />

          {/* Stat Group 3: Active Escrow Pipeline */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[rgba(255,255,255,0.72)] font-normal">{t('activeDealPipeline')}</span>
              <span className="text-[rgba(255,255,255,0.45)] text-[11px] font-medium">{deals.length}</span>
            </div>
            <div className="num-md text-[#3FD0B0] font-normal tabular-nums">
              €{deals.reduce((s, d) => s + d.agreedClientBudget, 0)}
            </div>
          </div>

        </div>
      </div>

      {/* 6.5 Revenue Overview Chart (2.4fr in grid) -> 6.5 cols */}
      <div className="lg:col-span-6 glass-card p-6 flex flex-col justify-between relative overflow-hidden">
        
        {/* Card Header: Title Left, Segmented Tabs Right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-normal text-white tracking-tight">
              {t('cashFlowOverviewTitle')}
            </h3>
            <span className="micro text-[rgba(255,255,255,0.45)]">
              {t('cashFlowOverviewSub')}
            </span>
          </div>

          {/* Segmented Tabs (Daily · Weekly · Monthly · Yearly) */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]">
            {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as ChartTimeframe[]).map((tf) => {
              const labels: Record<ChartTimeframe, string> = {
                DAILY: t('daily'),
                WEEKLY: t('weekly'),
                MONTHLY: t('monthly'),
                YEARLY: t('yearly'),
              };
              const isActive = timeframe === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-full text-xs font-normal transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#0B0B10] font-medium shadow-[0_2px_8px_rgba(255,255,255,0.3)]'
                      : 'text-[rgba(255,255,255,0.50)] hover:text-white'
                  }`}
                >
                  {labels[tf]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spline Chart SVG Area */}
        <div className="relative w-full h-[180px] my-auto">
          
          {/* Y-axis labels per Section 6.5 */}
          <div className={`absolute top-0 bottom-6 flex flex-col justify-between text-[10px] text-[rgba(255,255,255,0.35)] select-none ${language === 'ar' ? 'right-0' : 'left-0'}`}>
            <span>€6,000</span>
            <span>€4,000</span>
            <span>€2,000</span>
            <span>€0</span>
          </div>

          {/* SVG Canvas for Spline */}
          <svg className={`w-full h-[150px] overflow-visible ${language === 'ar' ? 'pl-12 pr-12' : 'pl-12 pr-12'}`} viewBox="0 0 760 180" preserveAspectRatio="none">
            {/* Smooth Spline Curve in #3FD0B0 */}
            <path
              d={currentChart.path}
              className="chart-line"
              style={{ transition: 'd 0.4s ease-in-out' }}
            />

            {/* Glowing Active Point */}
            <circle
              cx={currentChart.activeX}
              cy={currentChart.activeY}
              r="6"
              className="chart-point"
            />
            {/* Soft teal glow ring */}
            <circle
              cx={currentChart.activeX}
              cy={currentChart.activeY}
              r="12"
              fill="none"
              stroke="#3FD0B0"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </svg>

          {/* Value pill over active point */}
          <div
            className="absolute -top-1 pointer-events-none -translate-x-1/2 transform text-[11px] font-medium text-white px-2 py-0.5 rounded-full bg-[rgba(63,208,176,0.2)] border border-[#3FD0B0]/40 backdrop-blur-md"
            style={{ left: `${(currentChart.activeX / 760) * 100}%` }}
          >
            {currentChart.activeVal}
          </div>

          {/* X-axis labels */}
          <div className="flex items-center justify-between text-[10px] text-[rgba(255,255,255,0.35)] pt-2 border-t border-[rgba(255,255,255,0.06)] px-2">
            {xLabels.map((xl, i) => (
              <span key={i}>{xl}</span>
            ))}
          </div>

        </div>

        {/* Footer info note */}
        <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-[11px] text-[rgba(255,255,255,0.50)]">
          <span>{t('activePeak')} {currentChart.activeVal}</span>
          <span className="text-[#3FD0B0]">{t('liveUpdate')}</span>
        </div>

      </div>

      {/* 6.6 Skeleton / Stakeholders list column (1fr in grid) -> 3 cols */}
      <div className="lg:col-span-3 p-5 rounded-[24px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* Section 1 */}
          <div>
            <div className="flex items-center justify-between text-xs text-white mb-2 font-normal">
              <span>{t('enterpriseClients')}</span>
              <span className="micro text-[rgba(255,255,255,0.5)]">{companies.length}</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-[8px] bg-[rgba(255,255,255,0.06)] w-[85%]" />
              <div className="h-2 rounded-[8px] bg-[rgba(255,255,255,0.04)] w-[100%]" />
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <div className="flex items-center justify-between text-xs text-white mb-2 font-normal">
              <span>{t('verifiedTalents')}</span>
              <span className="micro text-[rgba(255,255,255,0.5)]">{students.length}</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-[8px] bg-[rgba(255,255,255,0.06)] w-[70%]" />
              <div className="h-2 rounded-[8px] bg-[rgba(255,255,255,0.04)] w-[95%]" />
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <div className="flex items-center justify-between text-xs text-white mb-2 font-normal">
              <span>{t('postedTasks')}</span>
              <span className="micro text-[rgba(255,255,255,0.5)]">{tasks.length}</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-[8px] bg-[rgba(255,255,255,0.06)] w-[90%]" />
              <div className="h-2 rounded-[8px] bg-[rgba(255,255,255,0.04)] w-[65%]" />
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <div className="flex items-center justify-between text-xs text-white mb-2 font-normal">
              <span>{t('bankingSettlements')}</span>
              <span className="micro text-[#34D17A]">100%</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-[8px] bg-[rgba(255,255,255,0.06)] w-[75%]" />
              <div className="h-2 rounded-[8px] bg-[rgba(255,255,255,0.04)] w-[100%]" />
            </div>
          </div>

        </div>

        <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] text-[10px] text-[rgba(255,255,255,0.40)]">
          {language === 'ar' ? 'مؤشرات النشاط الإداري والمالي المباشر' : 'Live operational and financial indicators'}
        </div>
      </div>

    </div>
  );
}
