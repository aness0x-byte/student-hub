'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { 
  RefreshCw, 
  LogIn, 
  Layers, 
  LogOut 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    language,
    setLanguage,
    t,
    isAuthenticated,
    logout,
    currentRole, 
    setCurrentRole, 
    currentUser, 
    deals, 
    resetDemoData,
    openSignInModal
  } = useStore();

  const activeRole: UserRole = pathname.startsWith('/admin')
    ? 'SUPER_ADMIN'
    : pathname.startsWith('/company')
    ? 'COMPANY'
    : pathname.startsWith('/student')
    ? 'STUDENT'
    : currentRole;

  const displayUserName = activeRole === 'SUPER_ADMIN'
    ? (language === 'ar' ? 'إيلينا روستوفا' : 'Elena Rostova')
    : activeRole === 'COMPANY'
    ? (language === 'ar' ? 'ماركوس فانس' : 'Marcus Vance')
    : activeRole === 'STUDENT'
    ? (language === 'ar' ? 'أليكس تشين' : 'Alex Chen')
    : currentUser.name;

  return (
    <header className="sticky top-0 z-50 px-4 py-3 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-6 rounded-full bg-[rgba(10,10,16,0.65)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#5B2BE0] to-[#A77BF3] text-white shadow-[0_0_16px_rgba(109,91,208,0.5)] transition-transform group-hover:scale-105">
                <Layers className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  {t('brandName')}
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(109,91,208,0.25)] text-[#A77BF3] border border-[rgba(109,91,208,0.3)]">
                    {t('brandTagline')}
                  </span>
                </span>
              </div>
            </Link>

            {/* Role Navigation Switcher: Clean Pure Text Tabs */}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-1.5 mx-3 p-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
                <Link
                  href="/admin"
                  onClick={() => setCurrentRole('SUPER_ADMIN')}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    activeRole === 'SUPER_ADMIN'
                      ? 'bg-[#5B2BE0] text-white shadow-[0_0_12px_rgba(91,43,224,0.5)]'
                      : 'text-[rgba(255,255,255,0.65)] hover:text-white'
                  }`}
                  title={t('roleBroker')}
                >
                  <span>{t('roleBroker')}</span>
                </Link>

                <Link
                  href="/company"
                  onClick={() => setCurrentRole('COMPANY')}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    activeRole === 'COMPANY'
                      ? 'bg-white text-[#07070C] shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                      : 'text-[rgba(255,255,255,0.65)] hover:text-white'
                  }`}
                  title={t('roleCompany')}
                >
                  <span>{t('roleCompanyShort')}</span>
                </Link>

                <Link
                  href="/student"
                  onClick={() => setCurrentRole('STUDENT')}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    activeRole === 'STUDENT'
                      ? 'bg-[#3FD0B0] text-[#07070C] shadow-[0_0_12px_rgba(63,208,176,0.4)]'
                      : 'text-[rgba(255,255,255,0.65)] hover:text-white'
                  }`}
                  title={t('roleStudent')}
                >
                  <span>{t('roleStudentShort')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Right: Language Switcher, Authentication & User Controls */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher Pill (Arabic / English) */}
            <div className="flex items-center p-0.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                  language === 'ar'
                    ? 'bg-[#5B2BE0] text-white font-semibold shadow-[0_0_10px_rgba(91,43,224,0.5)]'
                    : 'text-[rgba(255,255,255,0.6)] hover:text-white'
                }`}
                title="التبديل إلى اللغة العربية"
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#5B2BE0] text-white font-semibold shadow-[0_0_10px_rgba(91,43,224,0.5)]'
                    : 'text-[rgba(255,255,255,0.6)] hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => openSignInModal()}
                  className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#A77BF3] to-[#6B4BE8] text-white shadow-[0_0_20px_rgba(167,123,243,0.5)] hover:scale-105 transition-all cursor-pointer"
                  title={t('signIn')}
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t('signIn')}</span>
                </button>

                <Link href="/" className="hidden sm:inline-block">
                  <span className="text-xs font-semibold text-[rgba(255,255,255,0.7)] hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 transition-colors">
                    {t('portal')}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
                  <span className="flex h-2 w-2 rounded-full bg-[#3FD0B0] animate-pulse" />
                  <span className="text-white font-semibold truncate max-w-[140px]">{displayUserName}</span>
                </div>

                <button
                  onClick={() => logout()}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-white/5 border border-white/10 text-[rgba(255,255,255,0.6)] hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title={t('signOut')}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}

            <button
              onClick={() => {
                if (confirm(t('resetConfirm'))) {
                  resetDemoData();
                }
              }}
              className="hidden lg:flex items-center justify-center h-8 w-8 rounded-full text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title={t('resetDemo')}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
