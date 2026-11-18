'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';

export type ChartTimeframe = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

interface Props {
  series1Name?: string;
  series2Name?: string;
  timeframe?: ChartTimeframe;
  onTimeframeChange?: (tf: ChartTimeframe) => void;
  showTimeframeTabs?: boolean;
  showLegend?: boolean;
  showFrame?: boolean;
  showBadge?: boolean;
}

export default function MonochromeLineChart({
  series1Name,
  series2Name,
  timeframe: externalTimeframe,
  onTimeframeChange,
  showTimeframeTabs = false,
  showLegend = false,
  showFrame = false,
  showBadge = false,
}: Props) {
  const { language, t } = useStore();
  const [internalTimeframe, setInternalTimeframe] = useState<ChartTimeframe>('WEEKLY');

  const timeframe = externalTimeframe ?? internalTimeframe;
  const setTimeframe = (tf: ChartTimeframe) => {
    if (onTimeframeChange) {
      onTimeframeChange(tf);
    } else {
      setInternalTimeframe(tf);
    }
  };

  const dataset: Record<
    ChartTimeframe,
    {
      primaryPath: string;
      secondaryPath: string;
      peakX: number;
      peakY: number;
      badgeText: string;
      activeDayIndex: number;
      daysEn: string[];
      daysAr: string[];
    }
  > = {
    WEEKLY: {
      primaryPath:
        'M 24 76 C 45 105, 75 124, 99 124 C 130 124, 165 80, 215 80 C 255 80, 290 96, 325 92 C 360 88, 375 22, 401 22 C 425 22, 455 52, 476 80',
      secondaryPath:
        'M 24 120 C 50 102, 75 90, 99 90 C 135 90, 145 52, 175 52 C 210 52, 230 64, 250 64 C 285 64, 305 132, 325 132 C 355 132, 380 104, 401 96 C 425 88, 455 82, 476 80',
      peakX: 401,
      peakY: 22,
      badgeText: '+24%',
      activeDayIndex: 5,
      daysEn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      daysAr: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
    },
    DAILY: {
      primaryPath:
        'M 24 95 C 60 110, 80 130, 100 130 C 140 130, 170 85, 220 85 C 270 85, 300 95, 330 90 C 365 85, 380 28, 401 28 C 430 28, 455 58, 476 85',
      secondaryPath:
        'M 24 130 C 55 115, 80 100, 100 100 C 135 100, 150 60, 180 60 C 215 60, 235 70, 260 70 C 290 70, 310 130, 330 130 C 360 130, 385 105, 401 98 C 430 90, 455 85, 476 85',
      peakX: 401,
      peakY: 28,
      badgeText: '+18%',
      activeDayIndex: 5,
      daysEn: ['12A', '4A', '8A', '12P', '4P', '8P', '11P'],
      daysAr: ['١٢ص', '٤ص', '٨ص', '١٢م', '٤م', '٨م', '١١م'],
    },
    MONTHLY: {
      primaryPath:
        'M 24 85 C 60 112, 80 120, 100 120 C 140 120, 180 75, 230 75 C 270 75, 310 92, 340 88 C 370 84, 385 20, 401 20 C 430 20, 455 50, 476 75',
      secondaryPath:
        'M 24 125 C 60 105, 80 92, 100 92 C 140 92, 160 50, 190 50 C 220 50, 240 65, 265 65 C 295 65, 320 135, 340 135 C 370 135, 390 100, 401 92 C 430 85, 455 78, 476 75',
      peakX: 401,
      peakY: 20,
      badgeText: '+32%',
      activeDayIndex: 5,
      daysEn: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
      daysAr: ['أ١', 'أ٢', 'أ٣', 'أ٤', 'أ٥', 'أ٦', 'أ٧'],
    },
    YEARLY: {
      primaryPath:
        'M 24 78 C 65 110, 85 122, 100 122 C 145 122, 185 70, 235 70 C 280 70, 315 90, 345 85 C 375 80, 390 18, 401 18 C 430 18, 455 48, 476 72',
      secondaryPath:
        'M 24 118 C 60 98, 85 88, 100 88 C 140 88, 165 48, 195 48 C 225 48, 250 60, 275 60 C 305 60, 325 130, 345 130 C 375 130, 395 95, 401 88 C 430 80, 455 75, 476 72',
      peakX: 401,
      peakY: 18,
      badgeText: '+45%',
      activeDayIndex: 5,
      daysEn: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3'],
      daysAr: ['ر١', 'ر٢', 'ر٣', 'ر٤', 'ر١', 'ر٢', 'ر٣'],
    },
  };

  const current = dataset[timeframe];
  const days = language === 'ar' ? current.daysEn : current.daysEn; // Both show Mon-Sun in reference
  const xCoords = [24, 99, 175, 250, 325, 401, 476];

  const s1Label = series1Name || (language === 'ar' ? 'التدفق الفعلي' : 'Sport');
  const s2Label = series2Name || (language === 'ar' ? 'المتوقع' : 'Study');

  return (
    <div className="w-full flex flex-col">
      {/* Top Header: Legend Left + Optional Timeframe Tabs Right */}
      {(showLegend || showTimeframeTabs) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {showLegend && (
            <div className="flex items-center gap-5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F0F0F] inline-block" />
                <span className="font-medium text-[#1A1A1A]">{s1Label}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C4C4C4] inline-block" />
                <span className="text-[#5A5A5A]">{s2Label}</span>
              </div>
            </div>
          )}

          {showTimeframeTabs && (
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
                        ? 'bg-[#262626] text-white font-semibold'
                        : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {labels[tf]}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SVG Canvas Area */}
      <div className="relative w-full aspect-[500/180] max-h-[220px]">
        <svg
          viewBox="0 -10 500 200"
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
        >
          {/* Faint Horizontal Grid Hairlines (≈ 6% black) */}
          <line
            x1="24"
            y1="68"
            x2="476"
            y2="68"
            stroke="rgba(0, 0, 0, 0.06)"
            strokeWidth="1"
          />
          <line
            x1="24"
            y1="114"
            x2="476"
            y2="114"
            stroke="rgba(0, 0, 0, 0.06)"
            strokeWidth="1"
          />

          {/* Optional U-Shaped Frame */}
          {showFrame && (
            <>
              <line
                x1="24"
                y1="76"
                x2="24"
                y2="160"
                stroke="#0F0F0F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="24"
                y1="160"
                x2="476"
                y2="160"
                stroke="#0F0F0F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="476"
                y1="80"
                x2="476"
                y2="160"
                stroke="#0F0F0F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Secondary Line (Smooth continuous gray line #A8A8A8) */}
          <path
            d={current.secondaryPath}
            stroke="#A8A8A8"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Primary Line (Thick smooth solid black line #0F0F0F) */}
          <path
            d={current.primaryPath}
            stroke="#0F0F0F"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Optional Value Badge */}
          {showBadge && (
            <g transform={`translate(${current.peakX}, ${current.peakY - 14})`}>
              <rect
                x="-21"
                y="-18"
                width="42"
                height="20"
                rx="5"
                fill="#0F0F0F"
              />
              <polygon
                points="-4,2 4,2 0,7"
                fill="#0F0F0F"
              />
              <text
                x="0"
                y="-4"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="auto"
                fontFamily="system-ui, sans-serif"
              >
                {current.badgeText}
              </text>
            </g>
          )}

          {/* X-Axis Tick Labels (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
          {days.map((day, idx) => {
            const x = xCoords[idx];
            return (
              <text
                key={idx}
                x={x}
                y="178"
                textAnchor="middle"
                fontSize="11"
                fontWeight="400"
                fill="#8C8C8C"
                fontFamily="system-ui, sans-serif"
              >
                {day}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
