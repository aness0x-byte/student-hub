'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface Props {
  title?: string;
  subtitle?: string;
  onActionClick?: () => void;
  actionText?: string;
}

export default function MonochromeRingChart({
  title,
  subtitle,
  onActionClick,
  actionText,
}: Props) {
  const { language, companies } = useStore();

  const chartTitle = title || (language === 'ar' ? 'توزيع الضمانات' : 'Escrow Split');
  const chartSubtitle = subtitle || (language === 'ar' ? 'نسب التوزيع والعمولة' : 'Distribution & margin ratio');
  const actionLabel = actionText || (language === 'ar' ? 'تفاصيل العمولات والتسوية' : 'Settlement Ledger');

  return (
    <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-black/5 flex flex-col justify-between shadow-sm h-full">
      <div>
        {/* Card Title & Trend Icon */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-[17px] font-semibold text-[#1A1A1A]">
              {chartTitle}
            </h4>
            <p className="text-[10px] text-[#8C8C8C] mt-0.5">
              {chartSubtitle}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#EDEDED] text-[#1A1A1A] flex items-center justify-center">
            <TrendingUp className="h-4 w-4 stroke-[1.5]" />
          </div>
        </div>

        {/* Rings & Legend Layout */}
        <div className="flex items-center justify-between gap-3 my-4">
          {/* Vertical Legend */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#262626] shrink-0" />
              <div>
                <span className="text-[#1A1A1A] font-medium block leading-tight">
                  {language === 'ar' ? 'الشركات' : 'Clients'}
                </span>
                <span className="text-[10px] text-[#8C8C8C]">{companies.length} {language === 'ar' ? 'نشطة' : 'active'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B6B6B] shrink-0" />
              <div>
                <span className="text-[#1A1A1A] font-medium block leading-tight">
                  {language === 'ar' ? 'الوسيط' : 'Broker'}
                </span>
                <span className="text-[10px] text-[#8C8C8C]">20% fee</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BDBDBD] shrink-0" />
              <div>
                <span className="text-[#1A1A1A] font-medium block leading-tight">
                  {language === 'ar' ? 'الطلاب' : 'Talents'}
                </span>
                <span className="text-[10px] text-[#8C8C8C]">80% net</span>
              </div>
            </div>
          </div>

          {/* Three Concentric Rings */}
          <div className="relative w-[130px] h-[130px] shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              {/* Outer Ring Track & Arc (Clients #262626) */}
              <circle
                cx="70"
                cy="70"
                r="56"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="70"
                cy="70"
                r="56"
                stroke="#262626"
                strokeWidth="7"
                strokeDasharray="290 351"
                strokeLinecap="round"
                fill="none"
              />

              {/* Middle Ring Track & Arc (Broker #6B6B6B) */}
              <circle
                cx="70"
                cy="70"
                r="45"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="70"
                cy="70"
                r="45"
                stroke="#6B6B6B"
                strokeWidth="7"
                strokeDasharray="180 282"
                strokeLinecap="round"
                fill="none"
              />

              {/* Inner Ring Track & Arc (Talents #BDBDBD) */}
              <circle
                cx="70"
                cy="70"
                r="34"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="70"
                cy="70"
                r="34"
                stroke="#BDBDBD"
                strokeWidth="7"
                strokeDasharray="160 213"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-[#1A1A1A] leading-none">
                98%
              </span>
              <span className="text-[8px] font-semibold text-[#8C8C8C] tracking-wider uppercase mt-0.5">
                {language === 'ar' ? 'تسوية' : 'SETTLED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Row: Outline Pill Action Button */}
      <div className="pt-3 border-t border-black/5 flex items-center justify-between">
        <button
          type="button"
          onClick={onActionClick}
          className="pill-btn-outline !h-8 !px-3 !w-full justify-between !text-[11px]"
        >
          <span>{actionLabel}</span>
          <ArrowUpRight className="h-3 w-3 stroke-[2]" />
        </button>
      </div>
    </div>
  );
}
