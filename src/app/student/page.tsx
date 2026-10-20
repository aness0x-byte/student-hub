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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 space-y-10">
      
      {/* Setup: For the Students Banner */}
      <div className="glass-card p-6 border-[rgba(63,208,176,0.3)] bg-[rgba(63,208,176,0.06)] shadow-[0_0_30px_rgba(63,208,176,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-white">
              {t('studentWelcome')} {student?.fullName || (language === 'en' ? 'Alex Chen' : 'أليكس تشين')}
            </h2>
            <span className="badge-glass-positive text-xs">{t('studentBadgeText')}</span>
            <button
              onClick={() => openSignInModal()}
              className="btn-glass-ghost px-2.5 py-0.5 text-xs font-semibold hover:border-[#3FD0B0]"
            >
              {t('switchRole')}
            </button>
          </div>
          <p className="text-sm text-[rgba(255,255,255,0.7)] mt-1.5 leading-relaxed">
            {t('studentNoticeText')}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="badge-glass-neutral text-xs">
            <span>{t('identityProtectedBadge')}</span>
          </span>
        </div>
      </div>
      
      {/* Student Profile Glass Card per Section 6.1 Outer Frame */}
      <div className="frame p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#3FD0B0] to-[#5B2BE0] text-white font-bold text-2xl shadow-[0_0_24px_rgba(63,208,176,0.4)]">
              <span>{student?.fullName ? student.fullName.split(' ').map(n => n[0]).join('') : 'ST'}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {student?.fullName}
                </h1>
                <span className="font-mono text-xs font-semibold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  {student?.anonymousCode}
                </span>
                {student?.verificationStatus === 'VERIFIED' && (
                  <span className="badge-glass-positive text-xs">
                    <span>{t('verifiedStudent')}</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.65)] mt-2">
                {student?.university} • {student ? formatAcademicLevel(student.academicLevel, language) : ''} • {student?.major}
              </p>
            </div>
          </div>

          {/* Quick Metrics with Section 3.2 typography */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`glass p-4 rounded-[20px] min-w-[130px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <span className="micro block mb-1">{t('academicRating')}</span>
              <div className="text-2xl font-normal text-amber-300 tabular-nums">
                <span>{student?.internalAdminRating.toFixed(2)}</span>
                <span className="text-xs text-[rgba(255,255,255,0.4)]"> / 5.0</span>
              </div>
            </div>

            <div className={`glass p-4 rounded-[20px] min-w-[130px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <span className="micro block mb-1">{t('availabilityHours')}</span>
              <p className="text-2xl font-normal text-white tabular-nums">
                {student?.weeklyAvailability} <span className="text-xs text-[rgba(255,255,255,0.5)]">{t('hoursPerWeekUnit')}</span>
              </p>
            </div>

            <div className={`glass p-4 rounded-[20px] min-w-[130px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <span className="micro block mb-1">{t('activeContracts')}</span>
              <p className="text-2xl font-normal text-[#3FD0B0] tabular-nums">
                {myDeals.length} <span className="text-xs text-[rgba(255,255,255,0.5)]">{t('activeUnit')}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.08)] pt-6">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] overflow-x-auto">
            <button
              onClick={() => setActiveTab('TASKS')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'TASKS'
                  ? 'bg-[#3FD0B0] text-[#07070C] font-bold shadow-[0_0_16px_rgba(63,208,176,0.4)]'
                  : 'text-[rgba(255,255,255,0.7)] hover:text-white'
              }`}
            >
              {t('tabAvailableTasks')} ({availableTasks.length})
            </button>

            <button
              onClick={() => setActiveTab('PROPOSALS')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'PROPOSALS'
                  ? 'bg-white text-[#07070C] font-bold'
                  : 'text-[rgba(255,255,255,0.7)] hover:text-white'
              }`}
            >
              {t('tabMyProposals')} ({myProposals.length})
            </button>

            <button
              onClick={() => setActiveTab('APPLICATIONS_AND_DEALS')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'APPLICATIONS_AND_DEALS'
                  ? 'bg-white text-[#07070C] font-bold'
                  : 'text-[rgba(255,255,255,0.7)] hover:text-white'
              }`}
            >
              {t('tabMyDealsAndApps')} ({myDeals.length + myApplications.length})
            </button>
          </div>

          <button
            onClick={() => setIsProposalModalOpen(true)}
            className="btn-glass-gradient px-5 py-2.5 text-sm font-semibold shadow-[0_0_20px_rgba(127,90,240,0.4)]"
          >
            <span>{t('addProposalBtn')}</span>
          </button>
        </div>

      </div>

      {/* Main Tabs Content */}
      <div className="space-y-6">
        
        {/* 1. AVAILABLE TASKS */}
        {activeTab === 'TASKS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-light text-white">{t('companyTasksBoardTitle')}</h3>
                <p className="text-sm text-[rgba(255,255,255,0.6)] mt-1">
                  {t('companyTasksBoardSubtitle')}
                </p>
              </div>
              <span className="badge-glass-neutral text-sm">
                {availableTasks.length} {t('openTasksCount')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* 2. MY SERVICE PROPOSALS */}
        {activeTab === 'PROPOSALS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-light text-white">{t('myServicesTitle')}</h3>
                <p className="text-sm text-[rgba(255,255,255,0.6)] mt-1">
                  {t('myServicesSubtitle')}
                </p>
              </div>

              <button
                onClick={() => setIsProposalModalOpen(true)}
                className="btn-glass-primary px-5 py-2 text-sm font-semibold"
              >
                <span>{t('addNewServiceBtn')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myProposals.map((prop) => {
                const isExpanded = Boolean(expandedProposalIds[prop.id]);
                const displayTitle = language === 'en' ? (prop.titleEn || prop.title) : prop.title;
                const displayDesc = language === 'en' ? (prop.descriptionEn || prop.description) : prop.description;
                const displayDeliverables = language === 'en' ? (prop.deliverablesSummaryEn || prop.deliverablesSummary) : prop.deliverablesSummary;
                const displayFeedback = language === 'en' ? (prop.adminFeedbackEn || prop.adminFeedback) : prop.adminFeedback;

                return (
                  <div
                    key={prop.id}
                    onClick={() => toggleProposalExpand(prop.id)}
                    className={`glass-card p-6 cursor-pointer hover:border-[rgba(255,255,255,0.2)] transition-all duration-300 flex flex-col justify-between ${
                      isExpanded ? 'border-[#3FD0B0]/40 shadow-[0_10px_35px_rgba(63,208,176,0.15)]' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                            {formatCategoryName(prop.category, language)}
                          </span>
                          <h4 className="mt-2 text-lg font-bold text-white leading-snug">
                            {displayTitle}
                          </h4>
                        </div>

                        <div className={language === 'ar' ? 'text-left shrink-0' : 'text-right shrink-0'}>
                          <span className="text-2xl font-light text-[#34D17A]">
                            €{prop.proposedStudentFee}
                          </span>
                          <p className="text-xs text-[rgba(255,255,255,0.5)]">{t('netEarnings')}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-[rgba(255,255,255,0.6)]">
                        <span>{t('deliveryTurnaround')} <strong className="text-white">{prop.turnaroundDays} {t('daysUnit')}</strong></span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProposalExpand(prop.id);
                          }}
                          className="text-xs font-bold text-[#3FD0B0] hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer"
                        >
                          {isExpanded ? t('hideDetails') : t('showDetails')}
                        </button>
                      </div>

                      {/* Expandable Proposal Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3 animate-in fade-in duration-200">
                          <div>
                            <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1">
                              {t('serviceScopeLabel')}
                            </span>
                            <p className="text-sm text-[rgba(255,255,255,0.85)] leading-relaxed">
                              {displayDesc}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white/5 p-3.5 text-xs text-[rgba(255,255,255,0.85)] border border-white/10 space-y-1">
                            <strong className="text-white block">{t('deliverablesSummaryLabel')}</strong>
                            <p>{displayDeliverables}</p>
                          </div>

                          {displayFeedback && (
                            <div className="rounded-2xl bg-[#5B2BE0]/15 p-3 text-xs text-white border border-[#A77BF3]/30">
                              <span className="text-[#A77BF3] font-bold block mb-0.5">{t('brokerApprovalFeedback')}</span>
                              <p className="text-[rgba(255,255,255,0.85)]">{displayFeedback}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-[rgba(255,255,255,0.08)] text-sm">
                      <span className="text-xs text-[rgba(255,255,255,0.45)]">
                        {t('talentDirectoryBadge')}
                      </span>
                      <span className={prop.approvalStatus === 'APPROVED_LIVE' ? 'badge-glass-positive text-xs' : 'badge-glass-neutral text-xs'}>
                        {formatProposalStatus(prop.approvalStatus, language)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. ACTIVE DEALS & APPLICATIONS */}
        {activeTab === 'APPLICATIONS_AND_DEALS' && (
          <div className="space-y-8">
            
            {/* Brokered Deals Section */}
            <div>
              <h3 className="text-2xl font-light text-white mb-4">{t('activeDealsSupervised')}</h3>
              <div className="space-y-4">
                {myDeals.length === 0 ? (
                  <div className="glass-card p-12 text-center text-sm text-[rgba(255,255,255,0.5)]">
                    {t('noActiveDealsStudent')}
                  </div>
                ) : (
                  myDeals.map((deal) => {
                    const task = tasks.find(t => t.id === deal.taskRequestId);
                    const isExpanded = Boolean(expandedDealIds[deal.id]);
                    const displayTitle = language === 'en'
                      ? (task?.titleEn || task?.title || 'Verified Task')
                      : (task?.title || 'مهمة معتمدة');
                    const displayNotes = language === 'en'
                      ? (deal.adminSummaryNotesEn || deal.adminSummaryNotes || t('studentDefaultBrokerNotes'))
                      : (deal.adminSummaryNotes || t('studentDefaultBrokerNotes'));

                    return (
                      <div
                        key={deal.id}
                        onClick={() => toggleDealExpand(deal.id)}
                        className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                          isExpanded ? 'border-[#3FD0B0]/40 shadow-[0_10px_35px_rgba(63,208,176,0.15)]' : ''
                        }`}
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                                {deal.dealReference}
                              </span>
                              <span className="badge-glass-positive text-xs">
                                {formatDealStatus(deal.status, language)}
                              </span>
                            </div>

                            <h4 className="text-lg font-bold text-white leading-snug">
                              {displayTitle}
                            </h4>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                              <span className="text-xl font-bold text-[#34D17A]">€{deal.agreedStudentPayout}</span>
                              <span className="block text-[11px] text-[rgba(255,255,255,0.45)]">{t('guaranteedPayout')}</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDealExpand(deal.id);
                              }}
                              className="text-xs font-bold text-[#3FD0B0] hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                            >
                              {isExpanded ? t('hideDetails') : t('showDetails')}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Deal Details */}
                        {isExpanded && (
                          <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3.5 animate-in fade-in duration-200">
                            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block">{t('brokerNotesLabel')}</span>
                              <p className="text-sm text-[rgba(255,255,255,0.9)] leading-relaxed">
                                {displayNotes}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                              <span className="text-xs text-[rgba(255,255,255,0.6)]">
                                {t('payoutMethod')} <strong className="text-white">{t('directBankTransferDesc')}</strong>
                              </span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDealRoom(deal);
                                }}
                                className="btn-glass-gradient px-5 py-2.5 text-xs font-bold shrink-0 shadow-[0_0_20px_rgba(127,90,240,0.4)]"
                              >
                                <span>{t('enterDealRoom')}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Applications List */}
            <div className="border-t border-[rgba(255,255,255,0.08)] pt-8">
              <h3 className="text-xl font-light text-white mb-4">{t('submittedProposalsTitle')}</h3>
              <div className="space-y-3">
                {myApplications.map((app) => {
                  const task = tasks.find(t => t.id === app.taskRequestId);
                  const isExpanded = Boolean(expandedApplicationIds[app.id]);
                  const displayTaskTitle = language === 'en' ? (task?.titleEn || task?.title) : task?.title;
                  const displayPitch = language === 'en' ? (app.pitchStatementEn || app.pitchStatement) : app.pitchStatement;
                  const displayAdminNote = language === 'en' ? (app.adminNotesEn || app.adminNotes) : app.adminNotes;

                  return (
                    <div
                      key={app.id}
                      onClick={() => toggleApplicationExpand(app.id)}
                      className={`glass-card p-5 cursor-pointer hover:border-[rgba(255,255,255,0.2)] transition-all duration-300 ${
                        isExpanded ? 'border-[#3FD0B0]/40 shadow-[0_10px_35px_rgba(63,208,176,0.15)]' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                              {task?.referenceCode}
                            </span>
                            <h4 className="text-base font-semibold text-white">
                              {displayTaskTitle}
                            </h4>
                            <span className="badge-glass-neutral text-xs">
                              {formatApplicationStatus(app.status, language)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-lg font-light text-[#3FD0B0]">
                            €{task?.proposedBudget}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleApplicationExpand(app.id);
                            }}
                            className="text-xs font-bold text-[#3FD0B0] hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                          >
                            {isExpanded ? t('hideDetails') : t('showDetails')}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Application Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3 animate-in fade-in duration-200">
                          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1">
                            <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block">
                              {t('pitchDetailsLabel')}
                            </span>
                            <p className="text-sm text-[rgba(255,255,255,0.9)] leading-relaxed">
                              "{displayPitch}"
                            </p>
                          </div>

                          {app.relevantPortfolioUrls && app.relevantPortfolioUrls.length > 0 && (
                            <div className="text-xs text-[rgba(255,255,255,0.7)] flex items-center gap-2">
                              <span>{t('portfolioSamplesLabel')}</span>
                              <a href={app.relevantPortfolioUrls[0]} target="_blank" rel="noopener noreferrer" className="text-[#3FD0B0] underline font-mono">
                                {app.relevantPortfolioUrls[0]}
                              </a>
                            </div>
                          )}

                          {displayAdminNote && (
                            <div className="text-xs text-[rgba(255,255,255,0.6)] pt-1">
                              <span>{t('brokerNote')}</span>
                              <strong className="text-white">{displayAdminNote}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

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
