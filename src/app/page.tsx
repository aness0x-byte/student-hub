'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { UserRole } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const { 
    language,
    t,
    isAuthenticated, 
    currentRole, 
    currentUser, 
    login, 
    logout 
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');

  // Detect role from email or active selection
  const detectRole = (inputEmail: string): UserRole => {
    const lower = inputEmail.toLowerCase();
    if (lower.includes('admin') || lower.includes('elena') || lower.includes('broker')) {
      return 'SUPER_ADMIN';
    }
    if (lower.includes('student') || lower.includes('alex') || lower.includes('.edu') || lower.includes('polytechnique')) {
      return 'STUDENT';
    }
    return 'COMPANY';
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const targetRole = detectRole(email) || selectedRole;
    let targetPath = '/admin';
    if (targetRole === 'STUDENT') targetPath = '/student';
    else if (targetRole === 'COMPANY') targetPath = '/company';

    setTimeout(() => {
      login(targetRole);
      setIsLoading(false);
      router.push(targetPath);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center px-4 py-12 sm:px-6 relative text-white overflow-hidden">
      
      {/* 6.10 Liquid Orb (Ref B Hero Art) positioned behind center/lower */}
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-75">
        <div className="orb" />
      </div>

      {/* Floating Glass Chips (Section 6.9 Ref B) - visible on desktop */}
      <div className="hidden lg:block absolute left-[8%] top-[45%] pointer-events-none z-10 animate-pulse" style={{ animationDuration: '6s' }}>
        <div className="chip w-[185px]">
          <div className="flex items-center justify-between mb-2">
            <span className="micro text-[rgba(255,255,255,0.5)]">{t('chipProtocolTitle')}</span>
            <div className="w-[22px] h-[22px] rounded-full bg-white text-[#0B0B10] flex items-center justify-center text-xs font-bold shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
              ↗
            </div>
          </div>
          <div className="text-sm font-semibold text-white leading-tight">
            {t('bankingProtection')}
          </div>
          <div className="micro mt-1 text-[rgba(255,255,255,0.4)]">
            {t('chipProtocolSub')}
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute right-[8%] top-[48%] pointer-events-none z-10 animate-pulse" style={{ animationDuration: '7s' }}>
        <div className="chip w-[185px]">
          <span className="micro text-[rgba(255,255,255,0.5)] block mb-1">{t('chipSuccessTitle')}</span>
          <div className="text-2xl font-normal text-white tracking-tight tabular-nums">
            99.4%
          </div>
          <div className="w-full bg-white/20 h-[3px] rounded-full mt-2.5 overflow-hidden">
            <div className="bg-[#3FD0B0] h-full rounded-full w-[94%]" />
          </div>
        </div>
      </div>

      {/* Main Friendly Header per Section 3.2 (display-xl inspired) */}
      <div className="text-center mb-8 max-w-xl space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-4 py-1 text-xs font-medium text-[#A77BF3] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <span>{t('landingBadge')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
          {t('landingTitle')}
        </h1>

        <p className="text-sm text-[rgba(255,255,255,0.72)] leading-relaxed font-normal max-w-md mx-auto">
          {t('landingSubtitle')}
        </p>
      </div>

      {/* Sign-in Card: Section 6.1 Outer Container Frame */}
      <div className="frame w-full max-w-[440px] p-8 sm:p-9 relative z-10">
        
        {/* Friendly Role Selection Tabs - Pill Controls per Section 4.1 */}
        <div className="flex items-center justify-center gap-1.5 p-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] mb-7">
          <button
            type="button"
            onClick={() => handleRoleSelect('SUPER_ADMIN')}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center cursor-pointer ${
              selectedRole === 'SUPER_ADMIN'
                ? 'bg-gradient-to-r from-[#5B2BE0] to-[#7F5AF0] text-white shadow-[0_0_16px_rgba(91,43,224,0.5)]'
                : 'text-[rgba(255,255,255,0.65)] hover:text-white'
            }`}
          >
            <span>{t('roleBroker')}</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleRoleSelect('COMPANY')}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center cursor-pointer ${
              selectedRole === 'COMPANY'
                ? 'bg-white text-[#07070C] font-semibold shadow-[0_0_16px_rgba(255,255,255,0.4)]'
                : 'text-[rgba(255,255,255,0.65)] hover:text-white'
            }`}
          >
            <span>{t('roleCompanyShort')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('STUDENT')}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center cursor-pointer ${
              selectedRole === 'STUDENT'
                ? 'bg-[#3FD0B0] text-[#07070C] font-semibold shadow-[0_0_16px_rgba(63,208,176,0.4)]'
                : 'text-[rgba(255,255,255,0.65)] hover:text-white'
            }`}
          >
            <span>{t('roleStudentShort')}</span>
          </button>
        </div>

        {/* Minimalist Form Matching Reference Structure */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* E-mail Field */}
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium text-white mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}
            >
              {t('emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSelectedRole(detectRole(e.target.value));
              }}
              placeholder={t('emailPlaceholder')}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] text-white font-normal text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-[#A77BF3] focus:ring-1 focus:ring-[#A77BF3] focus:bg-[rgba(255,255,255,0.08)] transition-all placeholder:text-[rgba(255,255,255,0.3)] text-left"
            />
          </div>

          {/* Password Field with "forgot?" */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-white"
              >
                {t('passwordLabel')}
              </label>
              <button
                type="button"
                onClick={() => alert(language === 'ar' ? `تلميح الدخول: يمكنك إدخال أي كلمة مرور تجريبية لحساب ${selectedRole === 'SUPER_ADMIN' ? 'الوسيط المعتمد' : selectedRole === 'COMPANY' ? 'الشركات والمؤسسات' : 'الكفاءات الجامعية'}. وسينقلك النظام مباشرة إلى مساحة عملك الخاصة.` : `Demo Hint: You can enter any password for ${selectedRole}. The platform will take you directly to your assigned workspace.`)}
                className="text-xs font-normal text-[rgba(255,255,255,0.50)] hover:text-[#A77BF3] transition-colors cursor-pointer select-none"
              >
                {t('forgotPassword')}
              </button>
            </div>
            <input
              id="password"
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] text-white font-normal text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-[#A77BF3] focus:ring-1 focus:ring-[#A77BF3] focus:bg-[rgba(255,255,255,0.08)] transition-all placeholder:text-[rgba(255,255,255,0.3)] text-left"
            />
          </div>

          {/* Target Workspace Preview - Pure Text */}
          <div className="pt-1 flex items-center justify-between text-xs text-[rgba(255,255,255,0.50)]">
            <span>{t('assignedWorkspace')}</span>
            <span>
              {selectedRole === 'SUPER_ADMIN' ? (
                <span className="text-[#A77BF3] font-medium">{language === 'ar' ? 'لوحة تحكم الوسيط المعتمد (/admin)' : 'Verified Broker Command Center (/admin)'}</span>
              ) : selectedRole === 'COMPANY' ? (
                <span className="text-white font-medium">{language === 'ar' ? 'بوابة قطاع الأعمال والشركات (/company)' : 'Company & Enterprise Portal (/company)'}</span>
              ) : (
                <span className="text-[#3FD0B0] font-medium">{language === 'ar' ? 'مساحة الكفاءات الجامعية (/student)' : 'Student Talents Workspace (/student)'}</span>
              )}
            </span>
          </div>

          {/* Friendly Sign in Button per Section 6.8 */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-glass-gradient w-full text-sm font-semibold rounded-full flex items-center justify-center cursor-pointer disabled:opacity-70"
            >
              {isLoading && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white ml-2" />}
              <span>{isLoading ? t('signingIn') : t('signIn')}</span>
            </button>
          </div>

        </form>

        {/* Active Session Notice if already logged in */}
        {isAuthenticated && (
          <div className="mt-7 pt-5 border-t border-[rgba(255,255,255,0.08)] text-center space-y-2">
            <p className="text-xs text-[rgba(255,255,255,0.72)] flex items-center justify-center">
              <span>{t('activeSessionNotice')} <strong className="text-white font-semibold">{currentUser.name}</strong></span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => router.push(currentRole === 'SUPER_ADMIN' ? '/admin' : currentRole === 'STUDENT' ? '/student' : '/company')}
                className="text-xs font-semibold text-[#3FD0B0] underline hover:opacity-80 cursor-pointer"
              >
                {t('goToWorkspace')}
              </button>
              <span className="text-[rgba(255,255,255,0.32)]">•</span>
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs font-medium text-rose-400 hover:underline cursor-pointer"
              >
                <span>{t('signOut')}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Strict Anti-Circumvention Footer Note */}
      <div className="mt-8 text-center text-xs text-[rgba(255,255,255,0.50)] max-w-lg leading-relaxed relative z-10">
        <span>{t('landingNotice')}</span>
      </div>

    </div>
  );
}
