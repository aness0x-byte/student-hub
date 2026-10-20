'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { X, ArrowRight } from 'lucide-react';

export default function SignInModal() {
  const router = useRouter();
  const { 
    isSignInModalOpen, 
    closeSignInModal, 
    login, 
    language,
    t
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'CARDS' | 'CREDENTIALS'>('CARDS');
  const [redirectingTo, setRedirectingTo] = useState<{ role: UserRole; path: string; name: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSignInModalOpen) {
        closeSignInModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSignInModalOpen, closeSignInModal]);

  if (!isSignInModalOpen) return null;

  const handleAutoSignIn = (role: UserRole) => {
    let path = '/admin';
    let name = language === 'en' ? 'Elena Rostova (Exclusive Broker)' : 'إيلينا روستوفا (الوسيط والمدير العام)';

    if (role === 'STUDENT') {
      path = '/student';
      name = language === 'en' ? 'Alex Chen (Student Talent)' : 'أليكس تشين (طالب كفاءة جامعية)';
    } else if (role === 'COMPANY') {
      path = '/company';
      name = language === 'en' ? 'Marcus Vance (Tech Enterprise)' : 'ماركوس فانس (شركة تقنية)';
    }

    setRedirectingTo({ role, path, name });

    setTimeout(() => {
      login(role);
      closeSignInModal();
      setRedirectingTo(null);
      router.push(path);
    }, 500);
  };

  const detectedRole: UserRole = (() => {
    const lower = email.toLowerCase();
    if (lower.includes('admin') || lower.includes('elena') || lower.includes('broker')) {
      return 'SUPER_ADMIN';
    }
    if (lower.includes('student') || lower.includes('alex') || lower.includes('.edu') || lower.includes('polytechnique') || lower.includes('oxford')) {
      return 'STUDENT';
    }
    return 'COMPANY';
  })();

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAutoSignIn(detectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={closeSignInModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl rounded-[32px] bg-white border border-black/10 p-6 sm:p-8 z-10 space-y-6 text-[#1A1A1A] shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={closeSignInModal}
          className={`absolute top-6 ${language === 'ar' ? 'left-6' : 'right-6'} w-9 h-9 rounded-full bg-[#EDEDED] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E4E4E4] transition-colors`}
          title={t('close')}
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="pill-badge-black">
            {t('signInModalBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
            {t('signInModalTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
            {t('signInModalSub')}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#EDEDED]">
            <button
              onClick={() => setActiveTab('CARDS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
                activeTab === 'CARDS'
                  ? 'bg-[#262626] text-white'
                  : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {t('signInTabCards')}
            </button>
            <button
              onClick={() => setActiveTab('CREDENTIALS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
                activeTab === 'CREDENTIALS'
                  ? 'bg-[#262626] text-white'
                  : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {t('signInTabCredentials')}
            </button>
          </div>
        </div>

        {/* Tab 1: 1-Click Cards */}
        {activeTab === 'CARDS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Broker Persona */}
            <div 
              onClick={() => handleAutoSignIn('SUPER_ADMIN')}
              className="bg-[#F2F2F2] rounded-[22px] p-5 border border-black/5 hover:border-black/20 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#262626] text-white flex items-center justify-center font-bold text-xs mb-3">
                  SH
                </div>
                <h3 className="font-semibold text-sm text-[#1A1A1A]">
                  {language === 'en' ? 'Elena Rostova' : 'إيلينا روستوفا'}
                </h3>
                <span className="tag-micro !text-[9px] block text-[#8C8C8C] mt-0.5">
                  {t('roleBroker')}
                </span>
                <p className="text-xs text-[#5A5A5A] mt-2 leading-relaxed">
                  {t('signInAdminDesc')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-medium text-[#1A1A1A]">
                <span>{t('signInAdminBtn')}</span>
                <ArrowRight className="h-3 w-3 stroke-[2]" />
              </div>
            </div>

            {/* Company Persona */}
            <div 
              onClick={() => handleAutoSignIn('COMPANY')}
              className="bg-[#F2F2F2] rounded-[22px] p-5 border border-black/5 hover:border-black/20 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white text-[#1A1A1A] flex items-center justify-center font-bold text-xs mb-3 border border-black/10">
                  FI
                </div>
                <h3 className="font-semibold text-sm text-[#1A1A1A]">
                  {language === 'en' ? 'Marcus Vance' : 'ماركوس فانس'}
                </h3>
                <span className="tag-micro !text-[9px] block text-[#8C8C8C] mt-0.5">
                  {t('roleCompanyShort')}
                </span>
                <p className="text-xs text-[#5A5A5A] mt-2 leading-relaxed">
                  {t('signInCompanyDesc')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-medium text-[#1A1A1A]">
                <span>{t('signInCompanyBtn')}</span>
                <ArrowRight className="h-3 w-3 stroke-[2]" />
              </div>
            </div>

            {/* Student Persona */}
            <div 
              onClick={() => handleAutoSignIn('STUDENT')}
              className="bg-[#F2F2F2] rounded-[22px] p-5 border border-black/5 hover:border-black/20 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white text-[#1A1A1A] flex items-center justify-center font-bold text-xs mb-3 border border-black/10">
                  AC
                </div>
                <h3 className="font-semibold text-sm text-[#1A1A1A]">
                  {language === 'en' ? 'Alex Chen' : 'أليكس تشين'}
                </h3>
                <span className="tag-micro !text-[9px] block text-[#8C8C8C] mt-0.5">
                  {t('roleStudentShort')}
                </span>
                <p className="text-xs text-[#5A5A5A] mt-2 leading-relaxed">
                  {t('signInStudentDesc')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-medium text-[#1A1A1A]">
                <span>{t('signInStudentBtn')}</span>
                <ArrowRight className="h-3 w-3 stroke-[2]" />
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Manual Credentials */}
        {activeTab === 'CREDENTIALS' && (
          <form onSubmit={handleCredentialSubmit} className="max-w-md mx-auto space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-[#5A5A5A] block mb-1">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@university.edu"
                className="w-full rounded-full bg-[#EDEDED] text-xs px-4 py-2.5 text-[#1A1A1A] border-none focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#5A5A5A] block mb-1">
                {t('passwordLabel')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-full bg-[#EDEDED] text-xs px-4 py-2.5 text-[#1A1A1A] border-none focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="pill-btn-dark !w-full !h-10 !text-xs mt-2"
            >
              <span>{t('signInSubmitBtn')}</span>
            </button>
          </form>
        )}

        {/* Redirecting Overlay */}
        {redirectingTo && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-[32px] flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-[#1A1A1A]">
              {language === 'en' ? `Entering as ${redirectingTo.name}...` : `جارِ الدخول بصفتك ${redirectingTo.name}...`}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
