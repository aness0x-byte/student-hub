'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { UserRole } from '@/lib/types';

export default function SignInModal() {
  const router = useRouter();
  const { 
    isSignInModalOpen, 
    closeSignInModal, 
    login, 
    selectedModalRole 
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'CARDS' | 'CREDENTIALS'>('CARDS');
  const [redirectingTo, setRedirectingTo] = useState<{ role: UserRole; path: string; name: string } | null>(null);

  // Close on Escape key
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

  // Perform automatic sign in and redirect
  const handleAutoSignIn = (role: UserRole) => {
    let path = '/admin';
    let name = 'إيلينا روستوفا (الوسيط والمدير العام)';

    if (role === 'STUDENT') {
      path = '/student';
      name = 'أليكس تشين (طالب كفاءة جامعية)';
    } else if (role === 'COMPANY') {
      path = '/company';
      name = 'ماركوس فانس (شركة تقنية)';
    }

    setRedirectingTo({ role, path, name });

    setTimeout(() => {
      login(role);
      closeSignInModal();
      setRedirectingTo(null);
      router.push(path);
    }, 700);
  };

  // Smart email detection
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
      {/* Frosted Backdrop */}
      <div 
        className="fixed inset-0 bg-[#07070C]/80 backdrop-blur-xl transition-opacity animate-in fade-in"
        onClick={closeSignInModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-[rgba(255,255,255,0.14)] bg-[#0A0A10]/95 backdrop-blur-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] z-10 space-y-6 animate-in zoom-in-95 duration-200 text-white">
        
        {/* Close Button */}
        <button
          onClick={closeSignInModal}
          className="absolute top-6 left-6 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 border border-white/10 text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-white/10 transition-colors"
          title="إغلاق"
        >
          إغلاق
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-4 py-1 text-xs font-semibold text-[#A77BF3]">
            <span>بوابة تسجيل الدخول والتوجيه المباشر</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            تسجيل الدخول إلى مساحة العمل
          </h2>

          <p className="text-sm text-[rgba(255,255,255,0.7)]">
            اختر صفتك في المنصة وسيتم توجيهك مباشرة وبأمان إلى مساحة العمل المخصصة لك.
          </p>

          {/* Mode Tabs */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] mt-2">
            <button
              onClick={() => setActiveTab('CARDS')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'CARDS'
                  ? 'bg-white text-[#07070C] shadow-sm'
                  : 'text-[rgba(255,255,255,0.7)] hover:text-white'
              }`}
            >
              الدخول السريع بنقرة واحدة
            </button>
            <button
              onClick={() => setActiveTab('CREDENTIALS')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'CREDENTIALS'
                  ? 'bg-white text-[#07070C] shadow-sm'
                  : 'text-[rgba(255,255,255,0.7)] hover:text-white'
              }`}
            >
              البريد الإلكتروني وكلمة المرور
            </button>
          </div>
        </div>

        {/* Redirecting Overlay */}
        {redirectingTo && (
          <div className="rounded-2xl border border-[#A77BF3]/40 bg-[#5B2BE0]/20 p-6 text-center space-y-3 animate-in fade-in">
            <div className="flex items-center justify-center gap-3">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#A77BF3]" />
              <span className="text-lg font-bold text-white">
                جاري تسجيل الدخول بصفتك {redirectingTo.name}...
              </span>
            </div>
            <p className="text-sm text-[rgba(255,255,255,0.8)]">
              يتم تحويلك تلقائياً إلى مساحة العمل المخصصة: <strong className="text-[#3FD0B0] font-mono">{redirectingTo.path}</strong>
            </p>
            <div className="w-full max-w-md mx-auto h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#3FD0B0] to-[#A77BF3] animate-pulse w-full" />
            </div>
          </div>
        )}

        {/* TAB 1: 1-CLICK PERSONA CARDS */}
        {activeTab === 'CARDS' && !redirectingTo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            
            {/* USER 1: ADMIN & MIDDLEMAN */}
            <div 
              onClick={() => handleAutoSignIn('SUPER_ADMIN')}
              className="glass-card p-6 border-[rgba(167,123,243,0.35)] hover:border-[rgba(167,123,243,0.7)] hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(91,43,224,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-[#5B2BE0]/20 text-[#A77BF3] border border-[#5B2BE0]/40">
                    AD
                  </span>
                  <span className="badge-glass-violet text-[11px] font-bold">
                    الوسيط الحصري
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  إيلينا روستوفا
                </h3>
                <p className="text-xs font-semibold text-[#A77BF3] mt-0.5">
                  إدارة المنصة والوساطة المعتمدة
                </p>

                <p className="text-sm text-[rgba(255,255,255,0.7)] mt-3 leading-relaxed">
                  تنسيق متطلبات الشركات وعروض الكفاءات الجامعية، مع ضمان عائد الوساطة 20% وحماية كاملة لبيانات الاتصال لمنع التحايل.
                </p>

                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs text-[#3FD0B0]">
                  <span>المساحة المخصصة:</span>
                  <span className="font-mono font-bold">/admin</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full h-11 btn-glass-gradient text-sm font-bold shadow-[0_0_20px_rgba(127,90,240,0.4)] flex items-center justify-center cursor-pointer"
                >
                  <span>الدخول بصفتك الوسيط المعتمد (إيلينا)</span>
                </button>
              </div>
            </div>

            {/* USER 2: COMPANY / STARTUP */}
            <div 
              onClick={() => handleAutoSignIn('COMPANY')}
              className="glass-card p-6 border-white/15 hover:border-white/35 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-white/10 text-white border border-white/20">
                    CO
                  </span>
                  <span className="badge-glass-neutral text-[11px] font-bold">
                    طلب الخدمات والمهام
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  ماركوس فانس
                </h3>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.7)] mt-0.5">
                  المدير التقني • فينتك بالس
                </p>

                <p className="text-sm text-[rgba(255,255,255,0.7)] mt-3 leading-relaxed">
                  طلب خدمات وحلول برمجية وتصميمية متقدمة، مع فحص الوسيط لجودة المخرجات وتسوية الفواتير البنكية رسمياً دون مخاطر تشغيلية.
                </p>

                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs text-[#3FD0B0]">
                  <span>المساحة المخصصة:</span>
                  <span className="font-mono font-bold">/company</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full h-11 btn-glass-ghost text-sm font-bold border-white/20 hover:border-white flex items-center justify-center cursor-pointer"
                >
                  <span>الدخول كجهة أعمال (ماركوس)</span>
                </button>
              </div>
            </div>

            {/* USER 3: STUDENT TALENT */}
            <div 
              onClick={() => handleAutoSignIn('STUDENT')}
              className="glass-card p-6 border-[rgba(63,208,176,0.3)] hover:border-[rgba(63,208,176,0.6)] hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(63,208,176,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-[#3FD0B0]/20 text-[#3FD0B0] border border-[#3FD0B0]/40">
                    ST
                  </span>
                  <span className="badge-glass-positive text-[11px] font-bold">
                    الخبرة الأكاديمية والعائد المالي
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  أليكس تشين
                </h3>
                <p className="text-xs font-semibold text-[#3FD0B0] mt-0.5">
                  ماجستير أنظمة موزعة • المدرسة المتعددة التكنولوجية
                </p>

                <p className="text-sm text-[rgba(255,255,255,0.7)] mt-3 leading-relaxed">
                  تقديم العروض للوسيط المعتمد مباشرة، واكتساب سجل خبرة عملي معتمد مع استلام مستحقات مالية نقدية مضمونة.
                </p>

                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs text-[#3FD0B0]">
                  <span>المساحة المخصصة:</span>
                  <span className="font-mono font-bold">/student</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full h-11 btn-glass-primary text-sm font-bold flex items-center justify-center cursor-pointer"
                >
                  <span>الدخول ككفاءة جامعية (أليكس)</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SMART EMAIL INPUT WITH AUTO-DETECTION */}
        {activeTab === 'CREDENTIALS' && !redirectingTo && (
          <form onSubmit={handleCredentialSubmit} className="max-w-xl mx-auto space-y-5 pt-2">
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                عنوان البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
                dir="ltr"
                className="w-full rounded-2xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#A77BF3]"
              />

              {/* Dynamic Role Detection Pill */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[rgba(255,255,255,0.6)]">التحقق والتعرف التلقائي:</span>
                <span className={`px-3 py-1 rounded-full font-semibold border ${
                  detectedRole === 'SUPER_ADMIN' 
                    ? 'bg-[#5B2BE0]/30 text-[#A77BF3] border-[#5B2BE0]/50'
                    : detectedRole === 'STUDENT'
                    ? 'bg-[#3FD0B0]/20 text-[#3FD0B0] border-[#3FD0B0]/40'
                    : 'bg-white/10 text-white border-white/20'
                }`}>
                  ← التوجيه المباشر إلى: {detectedRole === 'SUPER_ADMIN' ? 'لوحة تحكم الوسيط (/admin)' : detectedRole === 'STUDENT' ? 'مساحة الكفاءات الجامعية (/student)' : 'بوابة جهات الأعمال والشركات (/company)'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
                placeholder="اكتب كلمة المرور..."
                className="w-full rounded-2xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#A77BF3]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 btn-glass-gradient text-base font-semibold shadow-[0_0_24px_rgba(127,90,240,0.5)]"
            >
              <span>تسجيل الدخول والتوجيه للمساحة المخصصة</span>
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs text-[rgba(255,255,255,0.5)]">
          <span>محمي ببروتوكول خصوصية الوساطة الكاملة</span>
          <span>تسوية بنكية مباشرة • بدون احتجاز أموال</span>
        </div>

      </div>
    </div>
  );
}
