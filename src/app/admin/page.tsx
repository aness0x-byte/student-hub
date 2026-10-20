'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import KanbanBoard from '@/components/admin/KanbanBoard';
import CommissionLedgerTable from '@/components/admin/CommissionLedgerTable';
import SmartMatchModal from '@/components/admin/SmartMatchModal';
import DealRoomModal from '@/components/admin/DealRoomModal';
import StudentVettingModal from '@/components/admin/StudentVettingModal';
import RefADashboardOverview from '@/components/admin/RefADashboardOverview';
import { CompanyTaskRequest, StudentProfile, MatchmakingDeal } from '@/lib/types';
import { 
  formatAcademicLevel, 
  formatCategoryName, 
  formatTaskStatus, 
  formatApplicationStatus 
} from '@/lib/privacy-shield';
import { 
  ShieldCheck, 
  ArrowRightLeft, 
  Search, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  FileText,
  Users
} from 'lucide-react';

type AdminTab = 'KANBAN' | 'COMPANY_REQUESTS' | 'STUDENT_APPLICATIONS' | 'STUDENTS_CRM' | 'LEDGER';

export default function AdminDashboardPage() {
  const { 
    language,
    t,
    deals, 
    tasks, 
    students, 
    companies, 
    applications, 
    ledger,
    moderateTaskRequest,
    openSignInModal
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('KANBAN');
  
  // Modals
  const [selectedTaskForMatch, setSelectedTaskForMatch] = useState<CompanyTaskRequest | null>(null);
  const [selectedDealForRoom, setSelectedDealForRoom] = useState<MatchmakingDeal | null>(null);
  const [selectedStudentForVetting, setSelectedStudentForVetting] = useState<StudentProfile | null>(null);

  // Expansion states
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [expandedAppIds, setExpandedAppIds] = useState<Record<string, boolean>>({});

  const toggleTaskExpand = (id: string) => {
    setExpandedTaskIds(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleAppExpand = (id: string) => {
    setExpandedAppIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState('ALL');

  // Metrics
  const totalCommission = ledger.reduce((sum, item) => sum + item.platformCommissionAmount, 0);
  const totalInvoiced = ledger.reduce((sum, item) => sum + item.grossClientAmount, 0);
  const totalStudentPayouts = ledger.reduce((sum, item) => sum + item.studentPayoutAmount, 0);

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.anonymousCode.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.university.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(studentSearch.toLowerCase()));
    
    const matchesLevel = studentLevelFilter === 'ALL' || s.academicLevel === studentLevelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* ───── Card 1: Top Welcome Card (White Glass) ───── */}
      <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-black/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-base sm:text-[17px] font-medium text-[#1A1A1A]">
              {language === 'en' ? 'Admin Operations Room · Elena Rostova' : 'غرفة عمليات الإدارة · إيلينا روستوفا'}
            </h1>
            
            {/* Dark Pill Badge */}
            <span className="pill-badge-black">
              {language === 'en' ? 'Central Brokerage & Tri-Party Escrow Desk' : 'منصة الوساطة المركزية وإدارة الضمان الثلاثي'}
            </span>

            {/* Switch Role Button */}
            <button
              onClick={() => openSignInModal()}
              className="pill-btn-outline"
            >
              <ArrowRightLeft className="h-3 w-3 stroke-[1.5]" />
              <span>{t('switchRole')}</span>
            </button>

            {/* Anti-Circumvention Pill */}
            <span className="pill-badge-gray">
              <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5] text-[#1A1A1A]" />
              <span>{t('antiCircumventionActive')}</span>
            </span>
          </div>
        </div>

        <p className="text-[13px] text-[#5A5A5A] mt-3 leading-relaxed max-w-4xl">
          {language === 'en' 
            ? 'Supervising direct B2B transactions between verified enterprises and top university talents. Zero off-platform communication, fully audited code & deliverables, and formal bank transfers.'
            : 'إشراف كامل على المعاملات بين الشركات والطلاب النخبة مع منع أي تواصل خارجي وضمان تسليم المخرجات والفوترة الرسمية.'}
        </p>
      </div>

      {/* ───── Card 2: Dark Hero Card (#262626) ───── */}
      <div className="card-dark space-y-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left: Avatar & Platform Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white text-[#1A1A1A] rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
              SH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  {language === 'en' ? 'StudentHub Brokerage Operations' : 'عمليات وساطة ستودنت هب'}
                </h2>
                <span className="font-mono text-xs text-[#A8A8A8] bg-white/10 px-2.5 py-0.5 rounded-full">
                  HUB-ESCROW
                </span>
              </div>
              <p className="text-xs text-[#A8A8A8] mt-1">
                {language === 'en' 
                  ? 'Exclusive Mediation · 20% Fixed Commission · Verified Deliverables' 
                  : 'وساطة حصرية · عمولة ثابتة 20% · مخرجات معتمدة'}
              </p>
            </div>
          </div>

          {/* Right: 3 White Stat Tiles */}
          <div className="flex items-center gap-3">
            <div className="stat-tile">
              <span className="tag-micro !text-[9px] block mb-1 text-[#8C8C8C]">{language === 'en' ? 'Invoiced' : 'المفوتر'}</span>
              <div className="font-bold text-base text-[#1A1A1A] leading-none">
                ${totalInvoiced.toLocaleString()}
              </div>
            </div>

            <div className="stat-tile">
              <span className="tag-micro !text-[9px] block mb-1 text-[#8C8C8C]">{language === 'en' ? 'Commission' : 'العمولة'}</span>
              <div className="font-bold text-base text-[#1A1A1A] leading-none">
                ${totalCommission.toLocaleString()}
              </div>
            </div>

            <div className="stat-tile">
              <span className="tag-micro !text-[9px] block mb-1 text-[#8C8C8C]">{language === 'en' ? 'Escrows' : 'الضمان'}</span>
              <div className="font-bold text-base text-[#1A1A1A] leading-none">
                {deals.length}
                <span className="text-[10px] text-[#8C8C8C] font-normal block mt-0.5">{t('activeUnit')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom row: Sub-tabs pill toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab('KANBAN')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'KANBAN'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'en' ? `Pipeline Kanban (${deals.length})` : `مسار الصفقات (${deals.length})`}
            </button>

            <button
              onClick={() => setActiveTab('LEDGER')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'LEDGER'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'en' ? 'Financial Ledger' : 'دفتر الحسابات'}
            </button>

            <button
              onClick={() => setActiveTab('COMPANY_REQUESTS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'COMPANY_REQUESTS'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'en' ? `Company Requests (${tasks.length})` : `طلبات الشركات (${tasks.length})`}
            </button>

            <button
              onClick={() => setActiveTab('STUDENT_APPLICATIONS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'STUDENT_APPLICATIONS'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'en' ? `Applications (${applications.length})` : `التقديمات (${applications.length})`}
            </button>

            <button
              onClick={() => setActiveTab('STUDENTS_CRM')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'STUDENTS_CRM'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'en' ? `Talents CRM (${students.length})` : `إدارة الكفاءات (${students.length})`}
            </button>
          </div>
        </div>

      </div>

      {/* ───── Cashflow & Revenue Overview Chart ───── */}
      <RefADashboardOverview onSettleClick={() => setActiveTab('LEDGER')} />

      {/* ───── Main Tab Views ───── */}
      <div className="pt-2">
        {activeTab === 'KANBAN' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#1A1A1A]">{t('adminKanbanHeading')}</h3>
                <p className="text-xs text-[#5A5A5A] mt-0.5">
                  {t('adminKanbanSub')}
                </p>
              </div>
            </div>
            <KanbanBoard onSelectDeal={(deal) => setSelectedDealForRoom(deal)} />
          </div>
        )}

        {activeTab === 'LEDGER' && (
          <div className="space-y-4">
            <CommissionLedgerTable />
          </div>
        )}

        {activeTab === 'COMPANY_REQUESTS' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#1A1A1A]">{t('adminCompanyRequestsHeading')}</h3>
              <p className="text-xs text-[#5A5A5A] mt-0.5">
                {t('adminCompanyRequestsSub')}
              </p>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const company = companies.find(c => c.id === task.companyProfileId);
                const isExpanded = Boolean(expandedTaskIds[task.id]);
                const displayTitle = language === 'en' ? (task.titleEn || task.title) : task.title;
                const displayProblem = language === 'en' ? (task.problemStatementEn || task.problemStatement) : task.problemStatement;

                return (
                  <div 
                    key={task.id} 
                    className="bg-white rounded-[22px] p-5 sm:p-6 border border-black/5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                            {task.referenceCode}
                          </span>
                          <span className="font-medium text-sm text-[#1A1A1A]">
                            {company?.companyName}
                          </span>
                          <span className="tag-micro">
                            {formatCategoryName(task.category, language)}
                          </span>
                          <span className="text-[11px] font-medium text-[#5A5A5A] px-2.5 py-0.5 rounded-full bg-[#EDEDED]">
                            {formatTaskStatus(task.status, language)}
                          </span>
                        </div>

                        <h4 className="text-[16px] font-medium text-[#1A1A1A]">
                          {displayTitle}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <span className="text-xl font-semibold text-[#1A1A1A]">${task.proposedBudget}</span>

                        <button
                          type="button"
                          onClick={() => toggleTaskExpand(task.id)}
                          className="pill-btn-outline !h-8 !px-3"
                        >
                          {isExpanded ? t('hideDetails') : t('showDetails')}
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 stroke-[1.5]" /> : <ChevronDown className="h-3.5 w-3.5 stroke-[1.5]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTaskForMatch(task)}
                          className="pill-btn-dark !h-8 !px-4"
                        >
                          <Sparkles className="h-3 w-3 stroke-[1.8]" />
                          <span>{t('smartMatch')}</span>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-3.5 border-t border-black/5 space-y-3 text-xs">
                        <p className="text-[13px] text-[#5A5A5A] leading-relaxed">{displayProblem}</p>
                        <div className="flex flex-wrap items-center gap-4 text-[#5A5A5A]">
                          <span>{t('requiredSkills')}: <strong className="text-[#1A1A1A]">{task.requiredSkills.join(', ')}</strong></span>
                          <span>•</span>
                          <span>{t('adminStudentRewardLabel')} <strong className="text-[#1A1A1A]">${Math.round(task.proposedBudget * 0.8)}</strong></span>
                          <span>•</span>
                          <span>{t('adminBrokerReturnLabel')} <strong className="text-[#1A1A1A]">${Math.round(task.proposedBudget * 0.2)}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'STUDENT_APPLICATIONS' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#1A1A1A]">{t('adminStudentAppsHeading')}</h3>
              <p className="text-xs text-[#5A5A5A] mt-0.5">
                {t('adminStudentAppsSub')}
              </p>
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="bg-white rounded-[24px] p-8 text-center text-sm text-[#8C8C8C] border border-black/5">
                  {t('adminNoApps')}
                </div>
              ) : (
                applications.map((app) => {
                  const student = students.find(s => s.id === app.studentProfileId);
                  const task = tasks.find(t => t.id === app.taskRequestId);
                  const isExpanded = Boolean(expandedAppIds[app.id]);
                  const displayPitch = language === 'en' ? (app.pitchStatementEn || app.pitchStatement) : app.pitchStatement;

                  return (
                    <div 
                      key={app.id} 
                      className="bg-white rounded-[22px] p-5 sm:p-6 border border-black/5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                              {student?.anonymousCode}
                            </span>
                            <span className="tag-micro">
                              {student?.major}
                            </span>
                            <span className="text-[11px] font-medium text-[#5A5A5A] px-2.5 py-0.5 rounded-full bg-[#EDEDED]">
                              {formatApplicationStatus(app.status, language)}
                            </span>
                          </div>

                          <h4 className="text-[16px] font-medium text-[#1A1A1A]">
                            {language === 'en' ? `Application for: ${task?.titleEn || task?.title}` : `تقديم على: ${task?.title}`}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-base font-semibold text-[#1A1A1A]">
                            {task?.proposedBudget ? `$${task.proposedBudget}` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleAppExpand(app.id)}
                            className="pill-btn-outline !h-8 !px-3"
                          >
                            {isExpanded ? t('hideDetails') : t('showDetails')}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-3.5 border-t border-black/5 space-y-2 text-xs">
                          <p className="text-[13px] text-[#5A5A5A] leading-relaxed">{displayPitch}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'STUDENTS_CRM' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-[#1A1A1A]">{t('adminStudentCrmHeading')}</h3>
                <p className="text-xs text-[#5A5A5A] mt-0.5">
                  {t('adminStudentCrmSub')}
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder={language === 'en' ? 'Search talent...' : 'بحث عن طالب...'}
                  className="rounded-full bg-[#EDEDED] text-xs px-4 py-2 text-[#1A1A1A] border-none focus:outline-none w-48"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((s) => (
                <div key={s.id} className="bg-white rounded-[22px] p-5 border border-black/5 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                      {s.anonymousCode}
                    </span>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] mt-2">{s.fullName}</h4>
                    <p className="text-xs text-[#5A5A5A]">{s.university} · {s.major}</p>
                  </div>

                  <button
                    onClick={() => setSelectedStudentForVetting(s)}
                    className="pill-btn-dark !h-8 !px-4 !text-xs"
                  >
                    {t('verifyTalentBtn')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ───── Middleman Tri-Party Architecture Visual Cards ───── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="bg-white rounded-[24px] p-5 border border-black/5">
          <span className="tag-micro">{t('tripartyTitle1')}</span>
          <p className="text-xs text-[#5A5A5A] mt-2 leading-relaxed">
            <strong>{t('tripartyRole1')}</strong> {t('tripartyDesc1')}
          </p>
        </div>

        <div className="bg-[#262626] text-white rounded-[24px] p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8A8A8]">{t('tripartyTitle2')}</span>
          <p className="text-xs text-[#DADADA] mt-2 leading-relaxed">
            <strong>{t('tripartyRole2')}</strong> {t('tripartyDesc2')}
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-black/5">
          <span className="tag-micro">{t('tripartyTitle3')}</span>
          <p className="text-xs text-[#5A5A5A] mt-2 leading-relaxed">
            <strong>{t('tripartyRole3')}</strong> {t('tripartyDesc3')}
          </p>
        </div>
      </div>

      {/* Modals */}
      <SmartMatchModal
        task={selectedTaskForMatch}
        isOpen={Boolean(selectedTaskForMatch)}
        onClose={() => setSelectedTaskForMatch(null)}
      />

      <DealRoomModal
        deal={selectedDealForRoom}
        isOpen={Boolean(selectedDealForRoom)}
        onClose={() => setSelectedDealForRoom(null)}
      />

      <StudentVettingModal
        student={selectedStudentForVetting}
        isOpen={Boolean(selectedStudentForVetting)}
        onClose={() => setSelectedStudentForVetting(null)}
      />

    </div>
  );
}
