'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTaskCard from '@/components/shared/AnonymizedTaskCard';
import ApplyModal from '@/components/student/ApplyModal';
import ProposalModal from '@/components/student/ProposalModal';
import DealRoomModal from '@/components/admin/DealRoomModal';
import { CompanyTaskRequest, MatchmakingDeal } from '@/lib/types';
import { 
  formatAcademicLevel, 
  formatDealStatus, 
  formatApplicationStatus, 
  formatCategoryName, 
  formatProposalStatus 
} from '@/lib/privacy-shield';
import { 
  Star, 
  Clock, 
  Briefcase, 
  ShieldCheck, 
  ArrowRightLeft, 
  Plus, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type StudentTab = 'TASKS' | 'PROPOSALS' | 'APPLICATIONS_AND_DEALS';

export default function StudentPortalPage() {
  const { 
    currentStudentProfile, 
    tasks, 
    proposals, 
    applications, 
    deals,
    openSignInModal,
    language,
    t
  } = useStore();

  const [activeTab, setActiveTab] = useState<StudentTab>('TASKS');
  
  // Modals
  const [selectedTaskToApply, setSelectedTaskToApply] = useState<CompanyTaskRequest | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [activeDealRoom, setActiveDealRoom] = useState<MatchmakingDeal | null>(null);

  // Expansion states
  const [expandedProposalIds, setExpandedProposalIds] = useState<Record<string, boolean>>({});
  const [expandedDealIds, setExpandedDealIds] = useState<Record<string, boolean>>({});
  const [expandedApplicationIds, setExpandedApplicationIds] = useState<Record<string, boolean>>({});

  const toggleProposalExpand = (id: string) => {
    setExpandedProposalIds(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleDealExpand = (id: string) => {
    setExpandedDealIds(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleApplicationExpand = (id: string) => {
    setExpandedApplicationIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const student = currentStudentProfile;

  // Student specific data
  const myProposals = proposals.filter(p => p.studentProfileId === student?.id);
  const myApplications = applications.filter(a => a.studentProfileId === student?.id);
  const myDeals = deals.filter(d => d.studentProfileId === student?.id);
  const availableTasks = tasks.filter(t => t.isPubliclyVisible && t.status !== 'COMPLETED');

  const studentInitials = student?.fullName
    ? student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AC';

  const welcomeName = student?.fullName || (language === 'en' ? 'Alex Chen' : 'أليكس تشين');

  return (
    <div className="w-full space-y-6">
      
      {/* ───── Card 1: Top Welcome Card (White Glass) ───── */}
      <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-black/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-base sm:text-[17px] font-medium text-[#1A1A1A]">
              {language === 'en' ? `Student Portal · Welcome, ${welcomeName}` : `بوابة الطلاب · أهلاً بك، ${welcomeName}`}
            </h1>
            
            {/* Dark Pill Badge */}
            <span className="pill-badge-black">
              {language === 'en' ? 'Verified Academic Talent & Guaranteed Escrow Payouts' : 'كفاءة أكاديمية معتمدة ومستحقات مضمونة بالضمان'}
            </span>

            {/* Switch Role Button */}
            <button
              onClick={() => openSignInModal()}
              className="pill-btn-outline"
            >
              <ArrowRightLeft className="h-3 w-3 stroke-[1.5]" />
              <span>{t('switchRole')}</span>
            </button>

            {/* Identity Protected Pill */}
            <span className="pill-badge-gray">
              <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5] text-[#1A1A1A]" />
              <span>{t('identityProtectedBadge')}</span>
            </span>
          </div>
        </div>

        <p className="text-[13px] text-[#5A5A5A] mt-3 leading-relaxed max-w-4xl">
          {language === 'en' 
            ? 'All services and deliverables are submitted exclusively through the verified broker. Direct contact with client companies is strictly restricted to guarantee your academic confidentiality and formal bank payout.'
            : 'يتم تقديم جميع الخدمات والمخرجات حصرياً عبر الوسيط المعتمد. يُحظر التواصل المباشر مع الشركات لضمان سريتك الأكاديمية واستلام أتعابك البنكية الرسمية.'}
        </p>
      </div>

      {/* ───── Card 2: Dark Hero Card (#262626) ───── */}
      <div className="card-dark space-y-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left: Avatar & Student Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white text-[#1A1A1A] rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
              {studentInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  {student?.fullName || 'Alex Chen'}
                </h2>
                <span className="font-mono text-xs text-[#A8A8A8] bg-white/10 px-2.5 py-0.5 rounded-full">
                  {student?.anonymousCode || 'STU-9921'}
                </span>
              </div>
              <p className="text-xs text-[#A8A8A8] mt-1">
                {student?.university || 'Stanford University'} · {student ? formatAcademicLevel(student.academicLevel, language) : ''} · {student?.major || 'Computer Science'}
              </p>
            </div>
          </div>

          {/* Right: 3 White Stat Tiles */}
          <div className="flex items-center gap-3">
            <div className="stat-tile">
              <Star className="h-4 w-4 stroke-[1.5] text-[#5A5A5A] mb-1" />
              <div className="font-bold text-lg text-[#1A1A1A] leading-none">
                {student?.internalAdminRating.toFixed(2) || '4.95'}
                <span className="text-[10px] text-[#8C8C8C] font-normal"> /5.0</span>
              </div>
            </div>

            <div className="stat-tile">
              <Clock className="h-4 w-4 stroke-[1.5] text-[#5A5A5A] mb-1" />
              <div className="font-bold text-lg text-[#1A1A1A] leading-none">
                {student?.weeklyAvailability || 20}
                <span className="text-[10px] text-[#8C8C8C] font-normal block mt-0.5">{language === 'en' ? 'hrs/wk' : 'ساعة/أسبوع'}</span>
              </div>
            </div>

            <div className="stat-tile">
              <Briefcase className="h-4 w-4 stroke-[1.5] text-[#5A5A5A] mb-1" />
              <div className="font-bold text-lg text-[#1A1A1A] leading-none">
                {myDeals.length}
                <span className="text-[10px] text-[#8C8C8C] font-normal block mt-0.5">{t('activeUnit')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom row: Sub-tabs pill toggle & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab('TASKS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'TASKS'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'en' ? `Available Tasks (${availableTasks.length})` : `المهام المتاحة (${availableTasks.length})`}
            </button>

            <button
              onClick={() => setActiveTab('PROPOSALS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'PROPOSALS'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'en' ? `My Proposals (${myProposals.length})` : `مقترحاتي (${myProposals.length})`}
            </button>

            <button
              onClick={() => setActiveTab('APPLICATIONS_AND_DEALS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'APPLICATIONS_AND_DEALS'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'en' ? `Active Contracts & Payouts (${myDeals.length})` : `العقود النشطة والمستحقات (${myDeals.length})`}
            </button>
          </div>

          <button
            onClick={() => setIsProposalModalOpen(true)}
            className="pill-btn-white"
          >
            <Plus className="h-4 w-4 stroke-[2]" />
            <span>{t('addProposalBtn')}</span>
          </button>
        </div>

      </div>

      {/* ───── Main Tabs Content ───── */}
      {activeTab === 'TASKS' && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              {language === 'en' ? 'Open University Tasks (Escrow Protected)' : 'المهام الجامعية المفتوحة (المحمية بالضمان)'}
            </h3>
            <span className="pill-badge-gray text-xs">
              {availableTasks.length} {language === 'en' ? 'tasks' : 'مهمة'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {availableTasks.map((task) => (
              <AnonymizedTaskCard
                key={task.id}
                task={task}
                onApply={(t) => setSelectedTaskToApply(t)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'PROPOSALS' && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              {language === 'en' ? 'Proposals Submitted to Broker' : 'المقترحات المقدمة للوسيط'}
            </h3>
          </div>

          {myProposals.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 text-center text-sm text-[#8C8C8C] border border-black/5">
              {language === 'en' ? 'No proposals submitted yet.' : 'لم تقم بتقديم أي مقترحات خدمات بعد.'}
            </div>
          ) : (
            <div className="space-y-3">
              {myProposals.map((prop) => {
                const isExpanded = Boolean(expandedProposalIds[prop.id]);
                const displayTitle = language === 'en' ? (prop.titleEn || prop.title) : prop.title;
                const displayDesc = language === 'en' ? (prop.descriptionEn || prop.description) : prop.description;
                const displayDeliverables = language === 'en' ? (prop.deliverablesSummaryEn || prop.deliverablesSummary) : prop.deliverablesSummary;

                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-[22px] p-5 sm:p-6 border border-black/5"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="tag-micro">
                            {formatCategoryName(prop.category, language)}
                          </span>
                          <span className="text-[11px] font-medium text-[#5A5A5A] px-2.5 py-0.5 rounded-full bg-[#EDEDED]">
                            {formatProposalStatus(prop.approvalStatus, language)}
                          </span>
                        </div>
                        <h4 className="text-[16px] font-medium text-[#1A1A1A]">
                          {displayTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                          <span className="text-xl font-semibold text-[#1A1A1A]">${prop.proposedStudentFee}</span>
                          <span className="text-[10px] text-[#8C8C8C] block">{language === 'en' ? 'Net Payout' : 'صافي المستحقات'}</span>
                        </div>

                        <button
                          onClick={() => toggleProposalExpand(prop.id)}
                          className="pill-btn-outline !h-8 !px-3"
                        >
                          {isExpanded ? t('hideDetails') : t('showDetails')}
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 stroke-[1.5]" /> : <ChevronDown className="h-3.5 w-3.5 stroke-[1.5]" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-3.5 border-t border-black/5 space-y-3 text-xs">
                        <p className="text-[13px] text-[#5A5A5A] leading-relaxed">{displayDesc}</p>
                        <div className="bg-[#EDEDED]/50 p-3 rounded-xl text-[#1A1A1A]">
                          <strong>{t('deliverablesCriteria')}:</strong> {displayDeliverables}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'APPLICATIONS_AND_DEALS' && (
        <div className="space-y-6 pt-2">
          <div>
            <h3 className="text-lg font-medium text-[#1A1A1A] mb-4">
              {language === 'en' ? 'Active Contracts & Escrow Settlements' : 'العقود النشطة ومستحقات الضمان'}
            </h3>

            {myDeals.length === 0 ? (
              <div className="bg-white rounded-[24px] p-8 text-center text-sm text-[#8C8C8C] border border-black/5">
                {t('noActiveDealsStudent')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myDeals.map((deal) => {
                  const task = tasks.find(t => t.id === deal.taskRequestId);
                  const displayTitle = language === 'en' ? (task?.titleEn || task?.title || 'Contract Task') : (task?.title || 'مهمة العقد');

                  return (
                    <div
                      key={deal.id}
                      className="bg-white rounded-[24px] p-6 flex flex-col justify-between border border-black/5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="tag-micro">{deal.dealReference}</span>
                          <span className="text-[11px] font-medium text-[#5A5A5A] px-2.5 py-0.5 rounded-full bg-[#EDEDED]">
                            {formatDealStatus(deal.status, language)}
                          </span>
                        </div>
                        <h4 className="text-[16px] font-medium text-[#1A1A1A] mb-2">
                          {displayTitle}
                        </h4>
                      </div>

                      <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-base text-[#1A1A1A]">${deal.agreedStudentPayout}</span>
                          <span className="text-[10px] text-[#8C8C8C] block">{language === 'en' ? 'Guaranteed Payout' : 'مستحقات مضمونة'}</span>
                        </div>

                        <button
                          onClick={() => setActiveDealRoom(deal)}
                          className="pill-btn-dark !h-8 !px-4"
                        >
                          <span>{t('enterDealRoom')}</span>
                          <ExternalLink className="h-3 w-3 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <ApplyModal
        task={selectedTaskToApply}
        isOpen={Boolean(selectedTaskToApply)}
        onClose={() => setSelectedTaskToApply(null)}
      />

      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      />

      <DealRoomModal
        deal={activeDealRoom}
        isOpen={Boolean(activeDealRoom)}
        onClose={() => setActiveDealRoom(null)}
      />

    </div>
  );
}
