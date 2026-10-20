'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useStore();

  if (pathname === '/') return null;

  return (
    <footer className="mt-auto border-t border-[rgba(255,255,255,0.08)] bg-[#07070C]/80 backdrop-blur-xl text-[rgba(255,255,255,0.7)]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        
        {/* Anti-Circumvention Glass Banner */}
        <div className="mb-12 rounded-3xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2.5">
                <span>{t('footerProtocolTitle')}</span>
                <span className="rounded-full bg-[#3FD0B0]/20 text-[#3FD0B0] border border-[#3FD0B0]/30 px-2.5 py-0.5 text-xs font-semibold">
                  {t('footerProtectedBadge')}
                </span>
              </h4>
              <p className="text-sm text-[rgba(255,255,255,0.65)] mt-1 max-w-3xl leading-relaxed">
                {t('footerProtocolDesc')}
              </p>
            </div>
            
            <div className="flex items-center gap-5 text-sm font-medium text-white shrink-0">
              <span className="badge-glass-neutral text-xs">{t('footerDirectWire')}</span>
              <span className="badge-glass-neutral text-xs">{t('footerNoEscrowCustody')}</span>
            </div>
          </div>
        </div>

        {/* 4 Column Clean Glass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          <div>
            <span className="font-bold text-lg text-white tracking-tight">
              {t('brandName')}
            </span>
            <p className="mt-3 text-[rgba(255,255,255,0.55)] leading-relaxed text-sm">
              {t('footerAboutDesc')}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              {t('footerColStudents')}
            </h5>
            <ul className="space-y-2.5 text-[rgba(255,255,255,0.65)]">
              <li><Link href="/student" className="hover:text-white transition-colors">{t('footerLinkStudentSpace')}</Link></li>
              <li><Link href="/tasks-board" className="hover:text-white transition-colors">{t('footerLinkTasksBoard')}</Link></li>
              <li><span className="hover:text-white transition-colors">{t('footerLinkGuaranteedPayouts')}</span></li>
              <li><span className="hover:text-white transition-colors">{t('footerLinkAcademicRecord')}</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              {t('footerColCompanies')}
            </h5>
            <ul className="space-y-2.5 text-[rgba(255,255,255,0.65)]">
              <li><Link href="/company" className="hover:text-white transition-colors">{t('footerLinkPostTasks')}</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">{t('footerLinkTalentCatalog')}</Link></li>
              <li><span className="hover:text-white transition-colors">{t('footerLinkQualityAudited')}</span></li>
              <li><span className="hover:text-white transition-colors">{t('footerLinkOfficialInvoices')}</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              {t('footerColBrokerage')}
            </h5>
            <ul className="space-y-2.5 text-[rgba(255,255,255,0.65)]">
              <li><Link href="/admin" className="hover:text-white transition-colors">{t('footerLinkKanban')}</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">{t('footerLinkDealRooms')}</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">{t('footerLinkLedger')}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t('footerLinkMainPortal')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[rgba(255,255,255,0.08)] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[rgba(255,255,255,0.45)]">
          <p>{t('allRightsReserved')}</p>
          <p className="mt-2 sm:mt-0">{t('footerTagline')}</p>
        </div>
      </div>
    </footer>
  );
}
