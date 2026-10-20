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

  const splineData: Record<ChartTimeframe, { path: string; secondaryPath: string; activeX: number; activeY: number; activeVal: string; xLabelsAr: string[]; xLabelsEn: string[] }> = {
    DAILY: {
      path: 'M 10 140 Q 90 120, 160 90 T 310 110 T 460 50 T 610 80 T 750 30',
      secondaryPath: 'M 10 155 Q 90 140, 160 120 T 310 135 T 460 85 T 610 110 T 750 70',
      activeX: 460,
      activeY: 50,
      activeVal: '$4,850',
      xLabelsAr: ['12:00ص', '04:00ص', '08:00ص', '12:00م', '04:00م', '08:00م'],
      xLabelsEn: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
    },
    WEEKLY: {
      path: 'M 10 150 Q 100 130, 180 80 T 340 100 T 500 40 T 640 60 T 750 20',
      secondaryPath: 'M 10 165 Q 100 150, 180 110 T 340 125 T 500 75 T 640 90 T 750 55',
      activeX: 500,
      activeY: 40,
      activeVal: '$9,432',
      xLabelsAr: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      xLabelsEn: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    },
    MONTHLY: {
      path: 'M 10 160 Q 120 140, 220 95 T 390 70 T 540 35 T 670 45 T 750 15',
      secondaryPath: 'M 10 175 Q 120 160, 220 125 T 390 100 T 540 65 T 670 75 T 750 50',
      activeX: 540,
      activeY: 35,
      activeVal: '$28,600',
      xLabelsAr: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
      xLabelsEn: ['W1', 'W2', 'W3', 'W4'],
    },
    YEARLY: {
      path: 'M 10 170 Q 130 150, 240 110 T 420 80 T 570 25 T 690 30 T 750 10',
      secondaryPath: 'M 10 180 Q 130 165, 240 130 T 420 110 T 570 55 T 690 65 T 750 40',
      activeX: 570,
      activeY: 25,
      activeVal: '$112,400',
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
      
      {/* Balance Column (3 cols) */}
      <div className="lg:col-span-3 bg-white rounded-[24px] p-6 border border-black/5 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Liquid Invoiced Balance */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#5A5A5A]">{t('totalLiquidBalance')}</span>
              <span className="text-[#1A1A1A] font-semibold">+14.2%</span>
            </div>
            <div className="text-2xl font-bold text-[#1A1A1A] tabular-nums">
              ${totalInvoiced.toLocaleString()}
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={onSettleClick}
                className="pill-btn-dark !w-full !h-8 !text-xs"
              >
                {t('wireSettlementBtn')}
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-black/5" />

          {/* Commission Margin */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#5A5A5A]">{t('collectedMargins')}</span>
              <span className="text-[#1A1A1A] font-medium">20%</span>
            </div>
            <div className="text-xl font-bold text-[#1A1A1A] tabular-nums">
              ${totalCommission.toLocaleString()}
            </div>
          </div>

          <div className="h-[1px] bg-black/5" />

          {/* Active Escrow Pipeline */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#5A5A5A]">{t('activeDealPipeline')}</span>
              <span className="text-[#8C8C8C]">{deals.length}</span>
            </div>
            <div className="text-xl font-bold text-[#1A1A1A] tabular-nums">
              ${deals.reduce((s, d) => s + d.agreedClientBudget, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Spline Chart (6 cols) */}
      <div className="lg:col-span-6 bg-white rounded-[24px] p-6 border border-black/5 flex flex-col justify-between relative overflow-hidden">
        {/* Header: Title Left, Segmented Tabs Right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#1A1A1A]">
              {t('cashFlowOverviewTitle')}
            </h3>
            <span className="text-xs text-[#8C8C8C]">
              {t('cashFlowOverviewSub')}
            </span>
          </div>

          {/* Segmented Timeframe Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#EDEDED]">
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
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#262626] text-white'
                      : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {labels[tf]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-[#5A5A5A] mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F0F0F]" />
            <span>{language === 'ar' ? 'التدفق الفعلي' : 'Actual Flow'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A0A0A0]" />
            <span>{language === 'ar' ? 'المتوقع' : 'Projected'}</span>
          </div>
        </div>

        {/* Spline Chart SVG Area */}
        <div className="relative w-full h-[180px] my-auto">
          {/* SVG Canvas for Spline */}
          <svg className="w-full h-[150px] overflow-visible" viewBox="0 0 760 180" preserveAspectRatio="none">
            {/* Secondary line (Projected in #A0A0A0) */}
            <path
              d={currentChart.secondaryPath}
              stroke="#A0A0A0"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
            />

            {/* Primary line (Actual in #0F0F0F) */}
            <path
              d={currentChart.path}
              stroke="#0F0F0F"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Active Point Circle */}
            <circle
              cx={currentChart.activeX}
              cy={currentChart.activeY}
              r="5"
              fill="#FFFFFF"
              stroke="#0F0F0F"
              strokeWidth="3"
            />
          </svg>

          {/* Active Value Tooltip Pill */}
          <div 
            className="absolute -top-1 transform -translate-x-1/2 bg-[#262626] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md"
            style={{ left: `${(currentChart.activeX / 760) * 100}%` }}
          >
            {currentChart.activeVal}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between items-center text-[11px] text-[#5A5A5A] mt-2 px-2">
            {xLabels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stakeholders Card (3 cols) */}
      <div className="lg:col-span-3 bg-white rounded-[24px] p-6 border border-black/5 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">
            {language === 'ar' ? 'أطراف الوساطة المعتمدة' : 'Verified Stakeholders'}
          </h4>
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-[#EDEDED] flex items-center justify-between text-xs">
              <span className="text-[#5A5A5A]">{language === 'ar' ? 'شركات نشطة' : 'Active Companies'}</span>
              <strong className="text-[#1A1A1A]">{companies.length}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#EDEDED] flex items-center justify-between text-xs">
              <span className="text-[#5A5A5A]">{language === 'ar' ? 'طلاب معتمدون' : 'Verified Students'}</span>
              <strong className="text-[#1A1A1A]">{students.length}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#EDEDED] flex items-center justify-between text-xs">
              <span className="text-[#5A5A5A]">{language === 'ar' ? 'عقود جارية' : 'Ongoing Escrows'}</span>
              <strong className="text-[#1A1A1A]">{deals.length}</strong>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-black/5 text-[11px] text-[#8C8C8C]">
          {language === 'ar' ? 'إشراف مباشر بنسبة 100% من قبل الوسيط الحصري' : '100% supervised by Elena Rostova'}
        </div>
      </div>

    </div>
  );
}
