'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTalentCard from '@/components/shared/AnonymizedTalentCard';
import TaskWizardModal from '@/components/company/TaskWizardModal';
import DealRoomModal from '@/components/admin/DealRoomModal';
import { MatchmakingDeal } from '@/lib/types';
import { formatDealStatus, formatTaskStatus, formatCategoryName, formatAcademicLevel } from '@/lib/privacy-shield';

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
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [expandedDealIds, setExpandedDealIds] = useState<Record<string, boolean>>({});

  const toggleTaskExpand = (id: string) => {
    setExpandedTaskIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDealExpand = (id: string) => {
    setExpandedDealIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const company = currentCompanyProfile;

  // Filter company tasks and deals
  const myTasks = tasks.filter(t => t.companyProfileId === company?.id);
  const myDeals = deals.filter(d => {
    const task = tasks.find(t => t.id === d.taskRequestId);
    return task?.companyProfileId === company?.id;
  });

  const verifiedStudents = students.filter(s => s.verificationStatus === 'VERIFIED');

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 space-y-10">
      
      {/* Setup: For the Companies Banner */}
      <div className="glass-card p-6 border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)] shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-white">
              {t('companyWelcome')} {company?.contactPersonName || (language === 'en' ? 'Marcus Vance' : 'ماركوس فانس')}
            </h2>
            <span className="badge-glass-positive text-xs">{t('companyBadgeText')}</span>
            <button
              onClick={() => openSignInModal()}
              className="btn-glass-ghost px-2.5 py-0.5 text-xs font-semibold hover:border-white"
            >
              {t('switchRole')}
            </button>
          </div>
          <p className="text-sm text-[rgba(255,255,255,0.7)] mt-1.5 leading-relaxed">
            {t('companyNoticeText')}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="badge-glass-neutral text-xs">
            <span>{t('ndaActiveBadge')}</span>
          </span>
        </div>
      </div>

      {/* Company Profile Glass Card per Section 6.1 Outer Frame */}
      <div className="frame p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5B2BE0] to-white/20 text-white font-medium text-2xl shadow-[0_0_24px_rgba(91,43,224,0.4)]">
              <span>{company?.companyName ? company.companyName.substring(0, 2).toUpperCase() : 'CO'}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                  {company?.companyName}
                </h1>
                <span className="font-mono text-xs font-semibold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  {company?.anonymousCode}
                </span>
                <span className="badge-positive text-xs">
                  <span>{t('verifiedEnterprise')}</span>
                </span>
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.72)] mt-2 font-normal">
                {company?.industry} • {t('adminCompanyPerson')} {company?.contactPersonName} ({company?.contactPersonTitle})
              </p>
            </div>
          </div>

          {/* Quick Metrics with Section 3.2 typography */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`glass p-4 rounded-[20px] min-w-[130px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <span className="micro block mb-1">{t('reliabilityScore')}</span>
              <div className="text-2xl font-normal text-amber-300 tabular-nums">
                <span>{company?.reliabilityScore.toFixed(1)}</span>
                <span className="text-xs text-[rgba(255,255,255,0.4)]"> / 5.0</span>
              </div>
            </div>

            <div className={`glass p-4 rounded-[20px] min-w-[130px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <span className="micro block mb-1">{t('registeredRequests')}</span>
              <p className="text-2xl font-normal text-white tabular-nums">
                {myTasks.length} <span className="text-xs text-[rgba(255,255,255,0.5)]">{t('tasksUnit')}</span>
              </p>
            </div>

            <div className={`glass p-4 rounded-[20px] min-w-[130px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <span className="micro block mb-1">{t('activeDeals')}</span>
              <p className="text-2xl font-normal text-[#3FD0B0] tabular-nums">
                {myDeals.length} <span className="text-xs text-[rgba(255,255,255,0.5)]">{t('activeUnit')}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Tab Navigation & Action */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.08)] pt-6">
          <div className="flex items-center gap-2 p-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] overflow-x-auto">
            <button
              onClick={() => setActiveTab('MY_REQUESTS')}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'MY_REQUESTS'
                  ? 'bg-white text-[#07070C] font-semibold shadow-[0_0_16px_rgba(255,255,255,0.4)]'
                  : 'text-[rgba(255,255,255,0.7)] hover:text-white'
              }`}
            >
              {t('tabMyRequests')} ({myTasks.length})
            </button>

            <button
              onClick={() => setActiveTab('BROWSE_TALENT')}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'BROWSE_TALENT'
                  ? 'bg-white text-[#07070C] font-semibold shadow-[0_0_16px_rgba(255,255,255,0.4)]'
                  : 'text-[rgba(255,255,255,0.7)] hover:text-white'
              }`}
            >
              {t('tabBrowseTalents')} ({verifiedStudents.length})
            </button>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="btn-glass-gradient px-6 py-2.5 text-xs sm:text-sm font-medium cursor-pointer"
          >
            <span>{t('postNewTaskBtn')}</span>
          </button>
        </div>

      </div>

      {/* Main Tabs Content */}
      <div className="space-y-6">
        
        {/* 1. MY TASK REQUESTS & DEALS */}
        {activeTab === 'MY_REQUESTS' && (
          <div className="space-y-8">
            
            {/* Active Deals with Students */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-light text-white">{t('activeContractsSupervision')}</h3>
                <span className="text-sm text-[rgba(255,255,255,0.5)]">{t('supervisedByBrokerDesc')}</span>
              </div>

              <div className="space-y-4">
                {myDeals.length === 0 ? (
                  <div className="glass-card p-12 text-center text-sm text-[rgba(255,255,255,0.5)]">
                    {t('noActiveDealsCompany')}
                  </div>
                ) : (
                  myDeals.map((deal) => {
                    const task = tasks.find(t => t.id === deal.taskRequestId);
                    const student = students.find(s => s.id === deal.studentProfileId);
                    const isExpanded = Boolean(expandedDealIds[deal.id]);
                    const displayTitle = language === 'en'
                      ? (task?.titleEn || task?.title || 'Verified Task')
                      : (task?.title || 'مهمة معتمدة');
                    const displayNotes = language === 'en'
                      ? (deal.adminSummaryNotesEn || deal.adminSummaryNotes || t('defaultBrokerNotes'))
                      : (deal.adminSummaryNotes || t('defaultBrokerNotes'));

                    return (
                      <div
                        key={deal.id}
                        onClick={() => toggleDealExpand(deal.id)}
                        className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                          isExpanded ? 'border-[#5B2BE0]/50 shadow-[0_10px_35px_rgba(91,43,224,0.15)]' : ''
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

                            <p className="text-sm text-[rgba(255,255,255,0.7)]">
                              {t('executingTalent')} <strong className="text-white">{student?.fullName} ({student?.anonymousCode})</strong>
                            </p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                              <span className="text-xl font-bold text-white">€{deal.agreedClientBudget}</span>
                              <span className="block text-[11px] text-[rgba(255,255,255,0.45)]">{t('agreedBudget')}</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDealExpand(deal.id);
                              }}
                              className="text-xs font-bold text-[#A77BF3] hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                            >
                              {isExpanded ? t('hideDetails') : t('showDetails')}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Details Section */}
                        {isExpanded && (
                          <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-4 animate-in fade-in duration-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                                <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block">{t('talentDataLabel')}</span>
                                <p className="text-sm font-medium text-white">{student?.university}</p>
                                <p className="text-xs text-[rgba(255,255,255,0.7)]">{student?.major}</p>
                              </div>

                              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                                <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block">{t('brokerNotesLabel')}</span>
                                <p className="text-xs text-[rgba(255,255,255,0.9)] leading-relaxed">{displayNotes}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs text-[rgba(255,255,255,0.5)]">
                                {t('b2bWireNotice')}
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

            {/* Submitted Task Requests */}
            <div className="border-t border-[rgba(255,255,255,0.08)] pt-8">
              <h3 className="text-2xl font-light text-white mb-4">{t('taskRequestsLog')}</h3>
              <div className="space-y-3">
                {myTasks.map((task) => {
                  const isExpanded = Boolean(expandedTaskIds[task.id]);
                  const displayTitle = language === 'en' ? (task.titleEn || task.title) : task.title;
                  const displayProblem = language === 'en' ? (task.problemStatementEn || task.problemStatement) : task.problemStatement;
                  const displayDeliverables = language === 'en' ? (task.deliverablesCriteriaEn || task.deliverablesCriteria) : task.deliverablesCriteria;

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskExpand(task.id)}
                      className={`glass-card p-6 cursor-pointer hover:border-[rgba(255,255,255,0.2)] transition-all duration-300 ${
                        isExpanded ? 'border-[rgba(167,123,243,0.4)] shadow-[0_10px_35px_rgba(91,43,224,0.15)]' : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                              {task.referenceCode}
                            </span>
                            <span className="badge-glass-neutral text-xs">
                              {formatCategoryName(task.category, language)}
                            </span>
                            <span className="badge-glass-positive text-xs">
                              {formatTaskStatus(task.status, language)}
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-white leading-snug">
                            {displayTitle}
                          </h4>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                            <span className="text-2xl font-light text-white">
                              €{task.proposedBudget}
                            </span>
                            <p className="text-[11px] text-[rgba(255,255,255,0.45)]">{t('officialBankInvoice')}</p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTaskExpand(task.id);
                            }}
                            className="text-xs font-bold text-[#A77BF3] hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                          >
                            {isExpanded ? t('hideDetails') : t('showDetails')}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Details Section */}
                      {isExpanded && (
                        <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3.5 animate-in fade-in duration-200">
                          <div>
                            <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1">
                              {t('problemScopeLabel')}
                            </span>
                            <p className="text-sm text-[rgba(255,255,255,0.85)] leading-relaxed">
                              {displayProblem}
                            </p>
                          </div>

                          {displayDeliverables && (
                            <div>
                              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1">
                                {t('deliverablesCriteria')}
                              </span>
                              <p className="text-xs text-[rgba(255,255,255,0.8)] leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
                                {displayDeliverables}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1.5">
                                {t('requiredSkills')}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {task.requiredSkills.map((sk, idx) => (
                                  <span key={idx} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono text-white border border-white/10">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1 text-xs text-[rgba(255,255,255,0.7)]">
                              <p>{t('targetAcademicLevel')} <strong className="text-white">{formatAcademicLevel(task.targetAcademicLevel, language)}</strong></p>
                              <p>{t('deliveryDuration')} <strong className="text-white">{task.estimatedDurationDays} {t('daysUnit')}</strong></p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* 2. BROWSE VETTED TALENT */}
        {activeTab === 'BROWSE_TALENT' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-light text-white">{t('talentDirectoryTitle')}</h3>
                <p className="text-sm text-[rgba(255,255,255,0.6)] mt-1">
                  {t('talentDirectorySubtitle')}
                </p>
              </div>
              <span className="badge-glass-neutral text-sm">
                {verifiedStudents.length} {t('verifiedStudentsCount')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      </div>

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
