'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer className="mt-auto border-t border-[rgba(255,255,255,0.08)] bg-[#07070C]/80 backdrop-blur-xl text-[rgba(255,255,255,0.7)]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        
        {/* Anti-Circumvention Glass Banner */}
        <div className="mb-12 rounded-3xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2.5">
                <span>بروتوكول الوساطة المزدوجة والحماية من التحايل</span>
                <span className="rounded-full bg-[#3FD0B0]/20 text-[#3FD0B0] border border-[#3FD0B0]/30 px-2.5 py-0.5 text-xs font-semibold">
                  محمي بنسبة 100%
                </span>
              </h4>
              <p className="text-sm text-[rgba(255,255,255,0.65)] mt-1 max-w-3xl leading-relaxed">
                تتواصل الشركات والطلاب حصرياً عبر الوسيط المعتمد. يحصل الطلاب على مستحقات مضمونة وخبرة جامعية معتمدة، وتتلقى الشركات برمجيات مفحوصة وفواتير بنكية مباشرة دون أي مخاطر.
              </p>
            </div>
            
            <div className="flex items-center gap-5 text-sm font-medium text-white shrink-0">
              <span className="badge-glass-neutral text-xs">تسوية بنكية مباشرة</span>
              <span className="badge-glass-neutral text-xs">بدون احتجاز أموال</span>
            </div>
          </div>
        </div>

        {/* 4 Column Clean Glass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          <div>
            <span className="font-bold text-lg text-white tracking-tight">
              ستودنت هب
            </span>
            <p className="mt-3 text-[rgba(255,255,255,0.55)] leading-relaxed text-sm">
              منصة الخدمات والمهام المصغرة المدارة التي تربط الكفاءات الجامعية بالشركات التقنية عبر نموذج وساطة حصري ومحمي.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">الكفاءات الجامعية</h5>
            <ul className="space-y-2.5 text-[rgba(255,255,255,0.65)]">
              <li><Link href="/student" className="hover:text-white transition-colors">مساحة الكفاءات والخدمات</Link></li>
              <li><Link href="/tasks-board" className="hover:text-white transition-colors">لوحة المشاريع والمهام</Link></li>
              <li><span className="hover:text-white transition-colors">مستحقات بنكية مضمونة سلفاً</span></li>
              <li><span className="hover:text-white transition-colors">سجل إنجاز موثق أكاديمياً</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">قطاع الأعمال والشركات</h5>
            <ul className="space-y-2.5 text-[rgba(255,255,255,0.65)]">
              <li><Link href="/company" className="hover:text-white transition-colors">طرح متطلبات وتكليف مهام</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">دليل الكفاءات الأكاديمية</Link></li>
              <li><span className="hover:text-white transition-colors">مخرجات مفحوصة ومعتمدة الجودة</span></li>
              <li><span className="hover:text-white transition-colors">فواتير رسمية مصرفية (B2B Wire)</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">إدارة الوساطة المعتمدة</h5>
            <ul className="space-y-2.5 text-[rgba(255,255,255,0.65)]">
              <li><Link href="/admin" className="hover:text-white transition-colors">لوحة كانبان الوساطة</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">غرف إدارة وتنسيق الصفقات</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">سجل التسويات والعمولات</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">بوابة الدخول الرئيسية</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[rgba(255,255,255,0.08)] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[rgba(255,255,255,0.45)]">
          <p>© 2026 ستودنت هب. منصة الوساطة الجامعية المصغرة.</p>
          <p className="mt-2 sm:mt-0">نموذج الوسيط المعتمد • تسوية خارج المنصة • حماية من التحايل</p>
        </div>
      </div>
    </footer>
  );
}
