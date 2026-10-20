'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import MonochromeLineChart, { ChartTimeframe } from '@/components/shared/MonochromeLineChart';
import MonochromeRingChart from '@/components/shared/MonochromeRingChart';

interface Props {
  onSettleClick?: () => void;
}

export default function RefADashboardOverview({ onSettleClick }: Props) {
  const { language, t, ledger, deals, companies } = useStore();
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('WEEKLY');

  const totalCommission = ledger.reduce((sum, item) => sum + item.platformCommissionAmount, 0);
  const totalInvoiced = ledger.reduce((sum, item) => sum + item.grossClientAmount, 0);
  const totalEscrow = deals.reduce((s, d) => s + d.agreedClientBudget, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      
      {/* ───── Column 1: Financial KPIs Card (3 cols) ───── */}
      <div className="lg:col-span-3 bg-white rounded-[26px] p-6 sm:p-7 border border-black/5 flex flex-col justify-between shadow-sm">
        <div className="space-y-5">
          {/* Liquid Invoiced Balance */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#5A5A5A]">{t('totalLiquidBalance')}</span>
              <span className="text-[#1A1A1A] font-semibold text-xs">+14.2%</span>
            </div>
            <div className="text-2xl sm:text-[28px] font-bold text-[#1A1A1A] tabular-nums tracking-tight">
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
              ${totalEscrow.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-black/5 text-[11px] text-[#8C8C8C]">
          {language === 'ar' ? 'تسوية بنكية مباشرة SEPA/B2B' : 'Direct B2B bank wire escrow'}
        </div>
      </div>

      {/* ───── Column 2: Exact Reference Line Chart Card (6 cols) ───── */}
      <div className="lg:col-span-6 bg-white rounded-[26px] p-6 sm:p-7 border border-black/5 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="text-base sm:text-[17px] font-semibold text-[#1A1A1A]">
                {t('cashFlowOverviewTitle')}
              </h3>
              <p className="text-xs text-[#8C8C8C] mt-0.5">
                {t('cashFlowOverviewSub')}
              </p>
            </div>
          </div>

          {/* Dedicated Monochrome Chart Component Matching Reference */}
          <div className="mt-3">
            <MonochromeLineChart
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              series1Name={language === 'ar' ? 'التدفق الفعلي' : 'Sport'}
              series2Name={language === 'ar' ? 'المتوقع' : 'Study'}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-[#8C8C8C]">
          <span>{language === 'ar' ? 'معدل الانحراف المعياري: ±2.1%' : 'Standard deviation: ±2.1%'}</span>
          <span className="font-semibold text-[#1A1A1A]">{language === 'ar' ? 'الذروة: السبت (+24%)' : 'Peak: Saturday (+24%)'}</span>
        </div>
      </div>

      {/* ───── Column 3: Ring Chart Card Matching Section 7.6 (3 cols) ───── */}
      <div className="lg:col-span-3">
        <MonochromeRingChart
          onActionClick={onSettleClick}
        />
      </div>

    </div>
  );
}
