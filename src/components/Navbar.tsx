'use client';

import React from 'react';
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

  return (
    <header className="w-full flex items-center justify-between pb-4 sm:pb-5 border-b border-black/5">
      {/* Left: Brand Logo & Wordmark */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1A1A] text-white transition-transform group-hover:scale-105">
          <Layers className="h-4 w-4 stroke-[1.8]" />
        </div>
        <span className="font-semibold text-xl tracking-tight text-[#1A1A1A]">
          {t('brandName')}
        </span>
      </Link>

      {/* Center: Clean 3-Segment Persona Switcher */}
      <nav className="flex items-center p-1 rounded-full bg-[#EDEDED]">
        <Link
          href="/admin"
          onClick={() => setCurrentRole('SUPER_ADMIN')}
          className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
            activeRole === 'SUPER_ADMIN'
              ? 'bg-[#262626] text-white'
              : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
          }`}
        >
          {t('roleBroker')}
        </Link>

        <Link
          href="/company"
          onClick={() => setCurrentRole('COMPANY')}
          className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
            activeRole === 'COMPANY'
              ? 'bg-[#262626] text-white'
              : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
          }`}
        >
          {t('roleCompanyShort')}
        </Link>

        <Link
          href="/student"
          onClick={() => setCurrentRole('STUDENT')}
          className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
            activeRole === 'STUDENT'
              ? 'bg-[#262626] text-white'
              : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
          }`}
        >
          {t('roleStudentShort')}
        </Link>
      </nav>

      {/* Right: Language Pill & Circle Controls */}
      <div className="flex items-center gap-2.5">
        {/* Language Switcher Pill */}
        <div className="flex items-center p-1 rounded-full bg-[#EDEDED] text-xs">
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              language === 'ar'
                ? 'bg-[#262626] text-white'
                : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
            }`}
            title="التبديل إلى العربية"
          >
            AR
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-[#262626] text-white'
                : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
            }`}
            title="Switch to English"
          >
            EN
          </button>
        </div>

        {/* Authentication Circle Button */}
        {isAuthenticated ? (
          <button
            onClick={() => logout()}
            className="icon-btn-circle"
            title={language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
          >
            <LogOut className="h-4 w-4 stroke-[1.5] text-[#1A1A1A]" />
          </button>
        ) : (
          <button
            onClick={() => openSignInModal()}
            className="icon-btn-circle"
            title={t('signIn')}
          >
            <LogIn className="h-4 w-4 stroke-[1.5] text-[#1A1A1A]" />
          </button>
        )}

        {/* Reset / Refresh Demo State Circle Button */}
        <button
          onClick={() => resetDemoData()}
          className="icon-btn-circle"
          title={t('resetDemo')}
        >
          <RefreshCw className="h-4 w-4 stroke-[1.5] text-[#1A1A1A]" />
        </button>
      </div>
    </header>
  );
}
