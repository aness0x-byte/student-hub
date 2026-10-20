'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTalentCard from '@/components/shared/AnonymizedTalentCard';
import TaskWizardModal from '@/components/company/TaskWizardModal';
import DealRoomModal from '@/components/admin/DealRoomModal';
import { MatchmakingDeal } from '@/lib/types';
import { 
  Star, 
  ClipboardList, 
  Briefcase, 
  ShieldCheck, 
  ArrowRightLeft, 
  Plus
} from 'lucide-react';

type CompanyTab = 'MY_REQUESTS' | 'BROWSE_TALENT';

export default function CompanyPortalPage() {
  const { 
    currentCompanyProfile, 
    tasks, 
    students, 
    deals, 
    openSignInModal,
    language,
    t
  } = useStore();

  const [activeTab, setActiveTab] = useState<CompanyTab>('MY_REQUESTS');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeDealRoom, setActiveDealRoom] = useState<MatchmakingDeal | null>(null);

  const company = currentCompanyProfile;

  // Filter company tasks and deals
  const myTasks = tasks.filter(t => t.companyProfileId === company?.id);
  const myDeals = deals.filter(d => {
    const task = tasks.find(t => t.id === d.taskRequestId);
    return task?.companyProfileId === company?.id;
  });

  const verifiedStudents = students.filter(s => s.verificationStatus === 'VERIFIED');

  const companyInitials = 'FI';

  const welcomeName = company?.contactPersonName || (language === 'en' ? 'Marcus Vance' : 'ماركوس فانس');

  // Grounded active deals matching reference photo
  const referenceDeals = [
    {
      id: 'deal-fintech-1',
      tag: 'FINTECH SECURITY',
      title: language === 'en' 
        ? 'Distributed Transaction Ledger Security Audit' 
        : 'تدقيق أمان دفتر المعاملات الموزعة',
      description: language === 'en'
        ? 'Formal verification of smart transaction escrow contracts and bank API gateway authorization protocols.'
        : 'التحقق الرسمي من عقود الضمان الذكية وبروتوكولات ترخيص بوابة واجهة برمجة التطبيقات المصرفية.',
      auditor: language === 'en' ? 'Audited by Broker Elena' : 'مدقق بواسطة الوسيط إيلينا',
      budget: '$3,800',
      dueDate: language === 'en' ? 'Due Nov 18, 2026' : 'تاريخ التسليم: ١٨ نوفمبر ٢٠٢٦',
      rawDeal: myDeals[0] || null
    },
    {
      id: 'deal-fintech-2',
      tag: 'ALGORITHMIC DATA',
      title: language === 'en' 
        ? 'Cross-Border Real-Time Settlement Engine Pipeline' 
        : 'خط أنابيب محرك التسوية اللحظية عبر الحدود',
      description: language === 'en'
        ? 'High-throughput data normalization pipeline connecting SEPA, FedNow, and SWIFT authorization protocols.'
        : 'خط أنابيب تسوية عالي الإنتاجية يربط بين معايير التفويض لـ SEPA و FedNow و SWIFT.',
      auditor: language === 'en' ? 'Audited by Broker Elena' : 'مدقق بواسطة الوسيط إيلينا',
      budget: '$4,500',
      dueDate: language === 'en' ? 'Due Dec 05, 2026' : 'تاريخ التسليم: ٥ ديسمبر ٢٠٢٦',
      rawDeal: myDeals[1] || myDeals[0] || null
    }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* ───── Card 1: Top Welcome Card (White Glass) ───── */}
      <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-black/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="text-base sm:text-[17px] font-semibold text-[#1A1A1A]">
              {language === 'en' ? `Enterprise Portal · Welcome, ${welcomeName}` : `بوابة الشركات · أهلاً بك، ${welcomeName}`}
            </h1>
            
            {/* Dark Pill Badge */}
            <span className="bg-[#1A1A1A] text-white text-[11px] font-medium px-3.5 py-1 rounded-full">
              {language === 'en' ? 'Specialized Academic Services & Guaranteed Delivery' : 'خدمات أكاديمية متخصصة وتسليم مضمون'}
            </span>

            {/* Switch Role Button */}
            <button
              onClick={() => openSignInModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#262626] text-xs font-medium text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors"
            >
              <ArrowRightLeft className="h-3 w-3 stroke-[1.5]" />
              <span>{t('switchRole')}</span>
            </button>

            {/* Active NDA Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDEDED] text-xs font-medium text-[#1A1A1A]">
              <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5] text-[#1A1A1A]" />
              <span>{t('ndaActiveBadge')}</span>
            </span>
          </div>
        </div>

        <p className="text-[13px] text-[#5A5A5A] mt-3 leading-relaxed max-w-4xl">
          {language === 'en' 
            ? 'All coordination is managed exclusively by the verified broker (Elena). The broker audits task scopes, rigorously reviews student deliverables, and guarantees formal bank invoicing with zero off-platform disintermediation.'
            : 'تتم إدارة جميع عمليات التنسيق حصرياً بواسطة الوسيط المعتمد (إيلينا). يتولى الوسيط تدقيق نطاقات المهام، وفحص مخرجات الطلاب بصرامة، وضمان الفوترة المصرفية الرسمية دون أي تجاوز للمنصة.'}
        </p>
      </div>

      {/* ───── Card 2: Dark Hero Card (#262626) ───── */}
      <div className="card-dark space-y-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left: Avatar & Company Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white text-[#1A1A1A] rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
              {companyInitials}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                {company?.companyName || 'FintechPulse Technologies'}
              </h2>
              <p className="text-xs text-[#A8A8A8] mt-1">
                {company?.industry || 'Fintech & B2B Payments'} · {language === 'en' ? 'Contact:' : 'مسؤول التواصل:'} {company?.contactPersonName || 'Marcus Vance'} ({company?.contactPersonTitle || 'Co-Founder & VP Product'})
              </p>
            </div>
          </div>

          {/* Right: 3 White Stat Tiles */}
          <div className="flex items-center gap-3">
            <div className="stat-tile">
              <Star className="h-4 w-4 stroke-[1.5] text-[#1A1A1A] mb-1" />
              <div className="font-bold text-lg text-[#1A1A1A] leading-none">
                {company?.reliabilityScore.toFixed(1) || '4.9'}
                <span className="text-[10px] text-[#8C8C8C] font-normal"> /5.0</span>
              </div>
            </div>

            <div className="stat-tile">
              <ClipboardList className="h-4 w-4 stroke-[1.5] text-[#1A1A1A] mb-1" />
              <div className="font-bold text-lg text-[#1A1A1A] leading-none">
                {myTasks.length || 2}
                <span className="text-[10px] text-[#8C8C8C] font-normal block leading-none mt-1">{t('tasksUnit')}</span>
              </div>
            </div>

            <div className="stat-tile">
              <Briefcase className="h-4 w-4 stroke-[1.5] text-[#1A1A1A] mb-1" />
              <div className="font-bold text-lg text-[#1A1A1A] leading-none">
                0
                <span className="text-[10px] text-[#8C8C8C] font-normal block leading-none mt-1">{t('activeUnit')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom row: Sub-tabs pill toggle & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="inline-flex items-center p-1 rounded-full bg-[#1A1A1A] border border-white/10">
            <button
              onClick={() => setActiveTab('MY_REQUESTS')}
              className={`rounded-full px-5 py-2 text-xs transition-all ${
                activeTab === 'MY_REQUESTS'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white font-medium'
              }`}
            >
              {language === 'en' ? `Current Requests & Tasks (${myTasks.length || 2})` : `الطلبات والمهام الحالية (${myTasks.length || 2})`}
            </button>

            <button
              onClick={() => setActiveTab('BROWSE_TALENT')}
              className={`rounded-full px-5 py-2 text-xs transition-all ${
                activeTab === 'BROWSE_TALENT'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white font-medium'
              }`}
            >
              {language === 'en' ? `Browse Verified Talents (${verifiedStudents.length || 4})` : `تصفح الكفاءات المعتمدة (${verifiedStudents.length || 4})`}
            </button>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="pill-btn-white"
          >
            <Plus className="h-4 w-4 stroke-[2]" />
            <span>{t('postNewTaskBtn')}</span>
          </button>
        </div>

      </div>

      {/* ───── Section 3: Active Deals Under Broker Supervision ───── */}
      {activeTab === 'MY_REQUESTS' && (
        <div className="space-y-4 pt-2">
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              {language === 'en' ? 'Active Deals Under Broker Supervision' : 'مسار متابعة الصفقات والوساطة النشطة'}
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

      {/* ───── Browse Vetted Talents Tab ───── */}
      {activeTab === 'BROWSE_TALENT' && (
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-[#1A1A1A]">{t('talentDirectoryTitle')}</h3>
              <p className="text-xs text-[#5A5A5A] mt-1">
                {t('talentDirectorySubtitle')}
              </p>
            </div>
            <span className="pill-badge-gray text-xs">
              {verifiedStudents.length} {t('verifiedStudentsCount')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {verifiedStudents.map((student) => (
              <AnonymizedTalentCard
                key={student.id}
                student={student}
                onRequestMatch={(s) => {
                  alert(`${t('matchAlert')} ${s.anonymousCode}! ${t('matchAlertFollowup')}`);
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
