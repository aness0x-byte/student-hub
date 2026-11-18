'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { ShieldCheck } from 'lucide-react';

export default function AntiCircumventionBanner() {
  const { language } = useStore();

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-black/5 mt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="bg-[#1A1A1A] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              {language === 'ar' ? 'محمي بنسبة 100%' : '100% Protected'}
            </span>
            <span className="text-[13px] font-medium text-[#1A1A1A] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 stroke-[1.8] text-[#1A1A1A]" />
              {language === 'ar' ? 'بروتوكول الوساطة المزدوجة والحماية من التحايل' : 'Dual-Mediation & Anti-Circumvention Protocol'}
            </span>
          </div>
          <p className="text-[12px] text-[#5A5A5A] leading-relaxed">
            {language === 'ar'
              ? 'تتواصل الشركات والطلاب حصرياً عبر الوسيط المعتمد. يحصل الطلاب على مستحقات مضمونة وخبرة جامعية معتمدة، وتتلقى الشركات برمجيات مفحوصة وفواتير بنكية مباشرة دون أي مخاطر.'
              : 'Companies and talents coordinate exclusively through the verified broker. Talents receive guaranteed payouts and verified university experience; companies receive audited deliverables and formal bank invoicing.'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="bg-[#EDEDED] text-[#1A1A1A] text-xs font-medium px-3.5 py-1.5 rounded-full">
            {language === 'ar' ? 'بدون احتجاز أموال' : 'No Fund Freezes'}
          </span>
          <span className="bg-[#EDEDED] text-[#1A1A1A] text-xs font-medium px-3.5 py-1.5 rounded-full">
            {language === 'ar' ? 'تسوية بنكية مباشرة' : 'Direct Bank Settlement'}
          </span>
        </div>
      </div>
    </div>
  );
}
