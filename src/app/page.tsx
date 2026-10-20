'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { ArrowRight, ShieldCheck, Briefcase, GraduationCap, Building2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { 
    language,
    t,
    isAuthenticated, 
    login
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('COMPANY');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const targetRole = email ? detectRole(email) : selectedRole;
    let targetPath = '/company';
    if (targetRole === 'STUDENT') targetPath = '/student';
    else if (targetRole === 'SUPER_ADMIN') targetPath = '/admin';

    setTimeout(() => {
      login(targetRole);
      setIsLoading(false);
      router.push(targetPath);
    }, 400);
  };

  const handleQuickEnter = (role: UserRole) => {
    login(role);
    if (role === 'SUPER_ADMIN') router.push('/admin');
    else if (role === 'STUDENT') router.push('/student');
    else router.push('/company');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 sm:py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="pill-badge-black">
          {t('landingBadge')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1A1A]">
          {t('landingTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
          {t('landingSubtitle')}
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-black/10 max-w-md w-full shadow-lg space-y-6">
        
        {/* Persona Quick Select Pills */}
        <div>
          <span className="text-[11px] font-medium text-[#8C8C8C] block mb-2 text-center uppercase tracking-wider">
            {language === 'en' ? 'Select Direct Portal' : 'اختر البوابة للدخول'}
          </span>
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-full bg-[#EDEDED]">
            <button
              type="button"
              onClick={() => handleQuickEnter('COMPANY')}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedRole === 'COMPANY'
                  ? 'bg-[#262626] text-white'
                  : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {t('roleCompanyShort')}
            </button>

            <button
              type="button"
              onClick={() => handleQuickEnter('STUDENT')}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedRole === 'STUDENT'
                  ? 'bg-[#262626] text-white'
                  : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {t('roleStudentShort')}
            </button>

            <button
              type="button"
              onClick={() => handleQuickEnter('SUPER_ADMIN')}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedRole === 'SUPER_ADMIN'
                  ? 'bg-[#262626] text-white'
                  : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {t('roleBroker')}
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
              {t('emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@enterprise.com"
              className="w-full rounded-full bg-[#EDEDED] text-xs px-4 py-2.5 text-[#1A1A1A] border-none focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">
              {t('passwordLabel')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-full bg-[#EDEDED] text-xs px-4 py-2.5 text-[#1A1A1A] border-none focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="pill-btn-dark !w-full !h-10 !text-xs mt-2"
          >
            <span>{isLoading ? '...' : t('signInSubmitBtn')}</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
          </button>
        </form>

        <div className="pt-2 border-t border-black/5 text-center">
          <p className="text-[11px] text-[#8C8C8C] leading-relaxed">
            {language === 'en' 
              ? 'Zero off-platform communication. Regulated by verified broker contracts.'
              : 'منع تام للتواصل الخارجي. عقود رسمية بإشراف الوسيط المعتمد.'}
          </p>
        </div>

      </div>

      {/* Tri-Party Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full pt-4">
        <div className="bg-white rounded-[24px] p-5 border border-black/5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#1A1A1A]">
            <Building2 className="h-4 w-4 stroke-[1.5]" />
          </div>
          <h3 className="font-semibold text-sm text-[#1A1A1A]">{t('tripartyTitle1')}</h3>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            {t('tripartyDesc1')}
          </p>
        </div>

        <div className="bg-[#262626] text-white rounded-[24px] p-5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <ShieldCheck className="h-4 w-4 stroke-[1.5]" />
          </div>
          <h3 className="font-semibold text-sm text-white">{t('tripartyTitle2')}</h3>
          <p className="text-xs text-[#DADADA] leading-relaxed">
            {t('tripartyDesc2')}
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-black/5 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#1A1A1A]">
            <GraduationCap className="h-4 w-4 stroke-[1.5]" />
          </div>
          <h3 className="font-semibold text-sm text-[#1A1A1A]">{t('tripartyTitle3')}</h3>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            {t('tripartyDesc3')}
          </p>
        </div>
      </div>

    </div>
  );
}
