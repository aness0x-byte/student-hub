'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTaskCard from '@/components/shared/AnonymizedTaskCard';
import ApplyModal from '@/components/student/ApplyModal';
import ProposalModal from '@/components/student/ProposalModal';
import DealRoomModal from '@/components/admin/DealRoomModal';
import AntiCircumventionBanner from '@/components/shared/AntiCircumventionBanner';
import { CompanyTaskRequest, MatchmakingDeal } from '@/lib/types';
import {
  formatAcademicLevel,
  formatDealStatus,
  formatCategoryName,
  formatProposalStatus
} from '@/lib/privacy-shield';
import {
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
    deals,
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

  const toggleProposalExpand = (id: string) => {
    setExpandedProposalIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const student = currentStudentProfile;

  // Student specific data matching reference designs
  const myProposals = proposals.filter(p => p.studentProfileId === student?.id);
  const myDeals = deals.filter(d => d.studentProfileId === student?.id);
  const availableTasks = tasks.filter(t => t.isPubliclyVisible && t.status !== 'COMPLETED');

  const studentInitials = 'AC';
  const studentName = 'Alex Chen';
  const studentCode = 'STU-9402';
  const studentSubtext = language === 'ar'
    ? 'École Polytechnique • (M2) ماجستير تخصصي • M2 Software Engineering & Distributed Systems'
    : 'École Polytechnique • (M2) M2 Software Engineering & Distributed Systems';

  return (
    <div className="w-full space-y-6">

      {/* ───── Dark Hero Card (#262626) matching Figma Designs ───── */}
      <div className="card-dark space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Avatar & Student Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white text-[#1A1A1A] rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
              {studentInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                  {studentName}
                </h2>
                <span className="text-[11px] font-mono text-[#A8A8A8] bg-white/10 px-2.5 py-0.5 rounded-full">
                  {studentCode}
                </span>
              </div>
              <p className="text-xs text-[#A8A8A8] mt-0.5">
                {studentSubtext}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom row: Sub-tabs pill toggle & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab('TASKS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${activeTab === 'TASKS'
                ? 'bg-white text-[#1A1A1A] font-semibold'
                : 'text-[#A8A8A8] hover:text-white'
                }`}
            >
              {language === 'ar' ? `المهام المتاحة (${availableTasks.length})` : `Available Tasks (${availableTasks.length})`}
            </button>

            <button
              onClick={() => setActiveTab('PROPOSALS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${activeTab === 'PROPOSALS'
                ? 'bg-white text-[#1A1A1A] font-semibold'
                : 'text-[#A8A8A8] hover:text-white'
                }`}
            >
              {language === 'ar' ? `مقترحاتي (${myProposals.length})` : `My Proposals (${myProposals.length})`}
            </button>

            <button
              onClick={() => setActiveTab('APPLICATIONS_AND_DEALS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${activeTab === 'APPLICATIONS_AND_DEALS'
                ? 'bg-white text-[#1A1A1A] font-semibold'
                : 'text-[#A8A8A8] hover:text-white'
                }`}
            >
              {language === 'ar' ? `العقود النشطة والمستحقات (${myDeals.length})` : `Active Contracts & Payouts (${myDeals.length})`}
            </button>
          </div>

          <button
            onClick={() => setIsProposalModalOpen(true)}
            className="pill-btn-white !text-xs !py-2 !px-4"
          >
            <Plus className="h-4 w-4 stroke-[2]" />
            <span>{language === 'ar' ? 'إضافة مقترح خدمة جديدة' : 'Add New Service Proposal'}</span>
          </button>
        </div>

      </div>

      {/* ───── Tab 1: Available Tasks ───── */}
      {activeTab === 'TASKS' && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              {language === 'ar' ? 'المهام الجامعية المفتوحة (المحمية بالضمان)' : 'Open University Tasks (Escrow Protected)'}
            </h3>
            <span className="pill-badge-gray text-xs">
              {availableTasks.length} {language === 'ar' ? 'مهمة' : 'tasks'}
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

      {/* ───── Tab 2: My Proposals ───── */}
      {activeTab === 'PROPOSALS' && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              {language === 'ar' ? 'المقترحات المقدمة للوسيط' : 'Proposals Submitted to Broker'}
            </h3>
          </div>

          {myProposals.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 text-center text-sm text-[#8C8C8C] border border-black/5">
              {language === 'ar' ? 'لم تقم بتقديم أي مقترحات خدمات بعد.' : 'No proposals submitted yet.'}
            </div>
          ) : (
            <div className="space-y-4">
              {myProposals.map((prop) => {
                const isExpanded = Boolean(expandedProposalIds[prop.id]);
                const displayTitle = language === 'ar' ? prop.title : (prop.titleEn || prop.title);
                const displayDesc = language === 'ar' ? prop.description : (prop.descriptionEn || prop.description);
                const displayDeliverables = language === 'ar' ? prop.deliverablesSummary : (prop.deliverablesSummaryEn || prop.deliverablesSummary);

                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-[22px] p-5 sm:p-6 border border-black/5 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-[#5A5A5A] px-2.5 py-0.5 rounded-full bg-[#EDEDED]">
                            {language === 'ar' ? 'معتمد ومعروض بالدليل' : formatProposalStatus(prop.approvalStatus, language)}
                          </span>
                          <span className="tag-micro">
                            {formatCategoryName(prop.category, language)}
                          </span>
                        </div>
                        <h4 className="text-[16px] font-medium text-[#1A1A1A]">
                          {displayTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                          <span className="text-xl font-semibold text-[#1A1A1A]">${prop.proposedStudentFee}</span>
                          <span className="text-[10px] text-[#8C8C8C] block">{language === 'ar' ? 'صافي المستحقات' : 'Net Payout'}</span>
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

              {/* Anti-Circumvention Banner matching Figma */}
              <AntiCircumventionBanner />
            </div>
          )}
        </div>
      )}

      {/* ───── Tab 3: Active Contracts & Escrow Settlements ───── */}
      {activeTab === 'APPLICATIONS_AND_DEALS' && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              {language === 'ar' ? 'العقود النشطة ومستحقات الضمان' : 'Active Contracts & Escrow Settlements'}
            </h3>
          </div>

          {myDeals.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 text-center text-sm text-[#8C8C8C] border border-black/5">
              {t('noActiveDealsStudent')}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myDeals.map((deal) => {
                  const task = tasks.find(t => t.id === deal.taskRequestId);
                  const displayTitle = language === 'ar' ? (task?.title || 'مهمة العقد') : (task?.titleEn || task?.title || 'Contract Task');

                  return (
                    <div
                      key={deal.id}
                      className="bg-white rounded-[24px] p-6 flex flex-col justify-between border border-black/5 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                            {deal.dealReference}
                          </span>
                          <span className="text-[11px] font-medium text-[#5A5A5A] px-2.5 py-0.5 rounded-full bg-[#EDEDED]">
                            {formatDealStatus(deal.status, language)}
                          </span>
                        </div>
                        <h4 className="text-[16px] font-medium text-[#1A1A1A] mb-2 leading-snug">
                          {displayTitle}
                        </h4>
                      </div>

                      <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs mt-4">
                        <div>
                          <span className="font-semibold text-lg text-[#1A1A1A]">${deal.agreedStudentPayout}</span>
                          <span className="text-[10px] text-[#8C8C8C] block">{language === 'ar' ? 'مستحقات مضمونة' : 'Guaranteed Payout'}</span>
                        </div>

                        <button
                          onClick={() => setActiveDealRoom(deal)}
                          className="pill-btn-dark !h-9 !px-4 gap-1.5"
                        >
                          <span>{language === 'ar' ? 'دخول غرفة إدارة الصفقة' : t('enterDealRoom')}</span>
                          <ExternalLink className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Anti-Circumvention Banner matching Figma */}
              <AntiCircumventionBanner />
            </div>
          )}
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
