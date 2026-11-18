'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTalentCard from '@/components/shared/AnonymizedTalentCard';
import TaskWizardModal from '@/components/company/TaskWizardModal';
import DealRoomModal from '@/components/admin/DealRoomModal';
import { MatchmakingDeal } from '@/lib/types';
import { ShieldCheck, Plus } from 'lucide-react';

type CompanyTab = 'MY_REQUESTS' | 'BROWSE_TALENT';

export default function CompanyPortalPage() {
  const {
    tasks,
    students,
    deals,
    language,
    t
  } = useStore();

  const [activeTab, setActiveTab] = useState<CompanyTab>('MY_REQUESTS');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeDealRoom, setActiveDealRoom] = useState<MatchmakingDeal | null>(null);

  const verifiedStudents = students.filter(s => s.verificationStatus === 'VERIFIED');

  const companyInitials = 'FI';
  const companyName = 'FintechPulse Technologies';
  const companySubtitle = language === 'ar'
    ? 'Fintech & B2B Payments • مسؤول التواصل: Marcus Vance (Co-Founder & VP Product)'
    : 'Fintech & B2B Payments • Contact: Marcus Vance (Co-Founder & VP Product)';

  // Grounded active deals matching reference Figma designs
  const referenceDeals = [
    {
      id: 'deal-fintech-1',
      tag: 'FINTECH SECURITY',
      title: language === 'ar'
        ? 'تدقيق أمان دفتر المعاملات الموزعة'
        : 'Distributed Transaction Ledger Security Audit',
      description: language === 'ar'
        ? 'التحقق الرسمي من عقود الضمان الذكية وبروتوكولات ترخيص بوابة واجهة برمجة التطبيقات المصرفية.'
        : 'Formal verification of smart transaction escrow contracts and bank API gateway authorization protocols.',
      auditor: language === 'ar' ? 'مدقق بواسطة الوسيط إيلينا' : 'Audited by Broker Elena',
      budget: '$3,800',
      dueDate: language === 'ar' ? 'تاريخ التسليم: ۱۸ نوفمبر ۲۰۲۶' : 'Due Nov 18, 2026',
      rawDeal: deals[0] || null
    },
    {
      id: 'deal-fintech-2',
      tag: 'ALGORITHMIC DATA',
      title: language === 'ar'
        ? 'خط أنابيب محرك التسوية اللحظية عبر الحدود'
        : 'Cross-Border Real-Time Settlement Engine Pipeline',
      description: language === 'ar'
        ? 'خط أنابيب تسوية عالي الإنتاجية يربط بين معايير التفويض لـ SEPA و FedNow و SWIFT.'
        : 'High-throughput data normalization pipeline connecting SEPA, FedNow, and SWIFT authorization protocols.',
      auditor: language === 'ar' ? 'مدقق بواسطة الوسيط إيلينا' : 'Audited by Broker Elena',
      budget: '$4,500',
      dueDate: language === 'ar' ? 'تاريخ التسليم: ٠٥ ديسمبر ۲۰۲۶' : 'Due Dec 05, 2026',
      rawDeal: deals[1] || deals[0] || null
    }
  ];

  return (
    <div className="w-full space-y-6">

      {/* ───── Dark Hero Card (#262626) matching Figma Designs ───── */}
      <div className="card-dark space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Avatar & Company Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white text-[#1A1A1A] rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
              {companyInitials}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                {companyName}
              </h2>
              <p className="text-xs text-[#A8A8A8] mt-0.5">
                {companySubtitle}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom row: Sub-tabs pill toggle & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab('MY_REQUESTS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${activeTab === 'MY_REQUESTS'
                ? 'bg-white text-[#1A1A1A] font-semibold'
                : 'text-[#A8A8A8] hover:text-white'
                }`}
            >
              {language === 'ar' ? 'الطلبات والمهام الحالية (2)' : 'Current Requests & Tasks (2)'}
            </button>

            <button
              onClick={() => setActiveTab('BROWSE_TALENT')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${activeTab === 'BROWSE_TALENT'
                ? 'bg-white text-[#1A1A1A] font-semibold'
                : 'text-[#A8A8A8] hover:text-white'
                }`}
            >
              {language === 'ar' ? 'تصفح الكفاءات المعتمدة (4)' : 'Browse Verified Talents (4)'}
            </button>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="pill-btn-white !text-xs !py-2 !px-4"
          >
            <Plus className="h-4 w-4 stroke-[2]" />
            <span>{language === 'ar' ? 'طلب خدمة أو مشروع جديد' : 'Request New Service or Project'}</span>
          </button>
        </div>

      </div>

      {/* ───── Tab 1: Current Requests & Active Mediation Track ───── */}
      {activeTab === 'MY_REQUESTS' && (
        <div className="space-y-4 pt-2">

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              {language === 'ar' ? 'مسار متابعة الصفقات والوساطة النشطة' : 'Active Mediation & Deals Pipeline'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {referenceDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-[24px] p-6 sm:p-7 flex flex-col justify-between border border-black/5 transition-all hover:border-black/15 shadow-sm"
              >
                <div>
                  {/* Upper Micro Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-mono tracking-wider text-[#8C8C8C] uppercase font-semibold">
                      {deal.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-[17px] font-semibold text-[#1A1A1A] leading-snug mb-2">
                    {deal.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[13px] text-[#5A5A5A] leading-relaxed mb-6">
                    {deal.description}
                  </p>
                </div>

                {/* Card Footer Row */}
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-[#5A5A5A]">
                  <div
                    onClick={() => deal.rawDeal && setActiveDealRoom(deal.rawDeal)}
                    className="flex items-center gap-1.5 font-normal cursor-pointer hover:text-black transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 stroke-[1.5] text-[#1A1A1A]" />
                    <span>{deal.auditor}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#1A1A1A]">
                      Budget: {deal.budget}
                    </span>
                    <span className="text-[#8C8C8C]">
                      {deal.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ───── Tab 2: Browse Vetted Talents ───── */}
      {activeTab === 'BROWSE_TALENT' && (
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              {language === 'ar' ? 'دليل الكفاءات الجامعية المعتمدة (بهوية محمية)' : 'Verified Academic Talents Directory (Protected ID)'}
            </h3>
            <p className="text-xs text-[#5A5A5A] mt-1">
              {language === 'ar'
                ? 'تصفح ملفات الكفاءات الطلابية المعتمدة أكاديمياً، اطلب مطابقة ليتولى الوسيط المعتمد تدشين المهمة وإتمام التعاقد.'
                : 'Browse verified student talent profiles. Request a curated match to have the broker initiate and oversee the contract.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {verifiedStudents.map((student) => (
              <AnonymizedTalentCard
                key={student.id}
                student={student}
                onRequestMatch={(s) => {
                  alert(language === 'ar'
                    ? `تم إرسال طلب مطابقة الكفاءة (${s.anonymousCode}) للوسيط المعتمد!`
                    : `Match request for (${s.anonymousCode}) submitted to broker!`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

      <DealRoomModal
        deal={activeDealRoom}
        isOpen={Boolean(activeDealRoom)}
        onClose={() => setActiveDealRoom(null)}
      />

    </div>
  );
}
