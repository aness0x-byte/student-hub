'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useStore();

  if (pathname === '/') return null;

  return (
    <footer className="mt-8 border-t border-black/5 pt-8 text-[#5A5A5A]">
      <div className="w-full space-y-8">
        
        {/* Anti-Circumvention Banner */}
        <div className="bg-white rounded-[24px] border border-black/5 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 stroke-[1.5] text-[#1A1A1A]" />
                <span>{t('footerProtocolTitle')}</span>
                <span className="pill-badge-black !text-[10px] !py-0.5">
                  {t('footerProtectedBadge')}
                </span>
              </h4>
              <p className="text-xs text-[#5A5A5A] mt-1 max-w-2xl leading-relaxed">
                {t('footerProtocolDesc')}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A] shrink-0">
              <span className="pill-badge-gray !text-[11px]">{t('footerDirectWire')}</span>
              <span className="pill-badge-gray !text-[11px]">{t('footerNoEscrowCustody')}</span>
            </div>
          </div>
        </div>

        {/* 4 Column Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div>
            <span className="font-semibold text-base text-[#1A1A1A] tracking-tight">
              {t('brandName')}
            </span>
            <p className="mt-2 text-[#8C8C8C] leading-relaxed">
              {t('footerAboutDesc')}
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">
              {t('footerColStudents')}
            </h5>
            <ul className="space-y-2 text-[#5A5A5A]">
              <li><Link href="/student" className="hover:text-[#1A1A1A] transition-colors">{t('footerLinkStudentSpace')}</Link></li>
              <li><Link href="/tasks-board" className="hover:text-[#1A1A1A] transition-colors">{t('footerLinkTasksBoard')}</Link></li>
              <li><span className="text-[#8C8C8C]">{t('footerLinkGuaranteedPayouts')}</span></li>
              <li><span className="text-[#8C8C8C]">{t('footerLinkAcademicRecord')}</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">
              {t('footerColCompanies')}
            </h5>
            <ul className="space-y-2 text-[#5A5A5A]">
              <li><Link href="/company" className="hover:text-[#1A1A1A] transition-colors">{t('footerLinkPostTasks')}</Link></li>
              <li><Link href="/catalog" className="hover:text-[#1A1A1A] transition-colors">{t('footerLinkTalentCatalog')}</Link></li>
              <li><span className="text-[#8C8C8C]">{t('footerLinkQualityAudited')}</span></li>
              <li><span className="text-[#8C8C8C]">{t('footerLinkOfficialInvoices')}</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">
              {t('footerColBrokerage')}
            </h5>
            <ul className="space-y-2 text-[#5A5A5A]">
              <li><Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">{t('footerLinkKanban')}</Link></li>
              <li><Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">{t('footerLinkDealRooms')}</Link></li>
              <li><Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">{t('footerLinkLedger')}</Link></li>
              <li><Link href="/" className="hover:text-[#1A1A1A] transition-colors">{t('footerLinkMainPortal')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C8C8C]">
          <p>{t('allRightsReserved')}</p>
          <p className="mt-1 sm:mt-0">{t('footerTagline')}</p>
        </div>
      </div>
    </footer>
  );
}
