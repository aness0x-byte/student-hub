'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import KanbanBoard from '@/components/admin/KanbanBoard';
import CommissionLedgerTable from '@/components/admin/CommissionLedgerTable';
import SmartMatchModal from '@/components/admin/SmartMatchModal';
import DealRoomModal from '@/components/admin/DealRoomModal';
import StudentVettingModal from '@/components/admin/StudentVettingModal';
import MonochromeLineChart, { ChartTimeframe } from '@/components/shared/MonochromeLineChart';
import AntiCircumventionBanner from '@/components/shared/AntiCircumventionBanner';
import AnonymizedTalentCard from '@/components/shared/AnonymizedTalentCard';
import { CompanyTaskRequest, StudentProfile, MatchmakingDeal } from '@/lib/types';
import { 
  formatAcademicLevel, 
  formatCategoryName, 
  formatTaskStatus, 
  formatApplicationStatus 
} from '@/lib/privacy-shield';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

type AdminTab = 'KANBAN' | 'LEDGER' | 'COMPANY_REQUESTS' | 'STUDENT_APPLICATIONS' | 'STUDENTS_CRM';

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
    moderateTaskRequest
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('KANBAN');
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe>('WEEKLY');
  
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

  return (
    <div className="w-full space-y-6">
      
      {/* ───── Dark Hero Card (#262626) matching Figma Designs ───── */}
      <div className="card-dark space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Avatar & Platform Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white text-[#1A1A1A] rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
              SH
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                {language === 'ar' ? 'عمليات وساطة ستودنت هب' : 'StudentHub Brokerage Operations'}
              </h2>
            </div>
          </div>

        </div>

        {/* Bottom row: 5 Sub-tabs pill toggle */}
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
              {language === 'ar' ? `مسار الصفقات (${deals.length})` : `Deals Pipeline (${deals.length})`}
            </button>

            <button
              onClick={() => setActiveTab('LEDGER')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'LEDGER'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'ar' ? 'دفتر الحسابات' : 'Financial Ledger'}
            </button>

            <button
              onClick={() => setActiveTab('COMPANY_REQUESTS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'COMPANY_REQUESTS'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'ar' ? `طلبات الشركات (${tasks.length})` : `Company Requests (${tasks.length})`}
            </button>

            <button
              onClick={() => setActiveTab('STUDENT_APPLICATIONS')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'STUDENT_APPLICATIONS'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'ar' ? `التقديمات (${applications.length})` : `Applications (${applications.length})`}
            </button>

            <button
              onClick={() => setActiveTab('STUDENTS_CRM')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'STUDENTS_CRM'
                  ? 'bg-white text-[#1A1A1A] font-semibold'
                  : 'text-[#A8A8A8] hover:text-white'
              }`}
            >
              {language === 'ar' ? `إدارة الكفاءات (${students.length})` : `Talents CRM (${students.length})`}
            </button>
          </div>
        </div>

      </div>

      {/* ───── Full-Width Line Chart Card (#FFFFFF) matching Figma Designs ───── */}
      <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-black/5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base sm:text-[17px] font-semibold text-[#1A1A1A]">
            {language === 'ar' ? 'حركة التدفقات المالية والوساطة' : 'Financial Cash Flow & Brokerage Activity'}
          </h3>

          <div className="flex items-center p-1 rounded-full bg-[#EDEDED] text-xs">
            <button
              type="button"
              onClick={() => setChartTimeframe('DAILY')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                chartTimeframe === 'DAILY' ? 'bg-[#1A1A1A] text-white font-semibold' : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {language === 'ar' ? 'يومي' : 'Daily'}
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe('WEEKLY')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                chartTimeframe === 'WEEKLY' ? 'bg-[#1A1A1A] text-white font-semibold' : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {language === 'ar' ? 'أسبوعي' : 'Weekly'}
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe('MONTHLY')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                chartTimeframe === 'MONTHLY' ? 'bg-[#1A1A1A] text-white font-semibold' : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {language === 'ar' ? 'شهري' : 'Monthly'}
            </button>
            <button
              type="button"
              onClick={() => setChartTimeframe('YEARLY')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                chartTimeframe === 'YEARLY' ? 'bg-[#1A1A1A] text-white font-semibold' : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
              }`}
            >
              {language === 'ar' ? 'سنوي' : 'Yearly'}
            </button>
          </div>
        </div>

        <MonochromeLineChart 
          timeframe={chartTimeframe}
          showTimeframeTabs={false}
          showLegend={false}
          showFrame={false}
          showBadge={false}
        />
      </div>

      {/* ───── Main Tab Views ───── */}
      <div className="pt-2">

        {/* Tab 1: Kanban Pipeline */}
        {activeTab === 'KANBAN' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#1A1A1A]">
                  {language === 'ar' ? 'مسار متابعة الصفقات والوساطة النشطة' : 'Active Deals & Brokerage Pipeline'}
                </h3>
              </div>
            </div>

            <KanbanBoard onSelectDeal={(deal) => setSelectedDealForRoom(deal)} />

            {/* Anti-Circumvention Banner */}
            <AntiCircumventionBanner />
          </div>
        )}

        {/* Tab 2: Financial Ledger */}
        {activeTab === 'LEDGER' && (
          <div className="space-y-4">
            <CommissionLedgerTable />
          </div>
        )}

        {/* Tab 3: Company Requests */}
        {activeTab === 'COMPANY_REQUESTS' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#1A1A1A]">
                {language === 'ar' ? 'طلبات الخدمات والمشاريع الواردة من الشركات' : 'Incoming Enterprise Task Requests'}
              </h3>
              <p className="text-xs text-[#5A5A5A] mt-1 max-w-4xl leading-relaxed">
                {language === 'ar'
                  ? 'تتلقى المنصة طلبات ومواصفات المهام من الشركات، حيث يتولى الوسيط تدقيق النطاق، وتقدير الميزانية العادلة، وتشغيل خوارزمية المطابقة الذكية لاختيار أفضل الكفاءات.'
                  : 'Enterprise task requirements received by platform. The broker audits scope, sets benchmarks, and activates smart matching.'}
              </p>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const company = companies.find(c => c.id === task.companyProfileId);
                const isExpanded = Boolean(expandedTaskIds[task.id]);
                const displayTitle = language === 'ar' ? task.title : (task.titleEn || task.title);
                const displayProblem = language === 'ar' ? task.problemStatement : (task.problemStatementEn || task.problemStatement);
                const displayDeliverables = language === 'ar' ? task.deliverablesCriteria : (task.deliverablesCriteriaEn || task.deliverablesCriteria);

                return (
                  <div 
                    key={task.id} 
                    className="bg-white rounded-[22px] p-5 sm:p-6 border border-black/5 shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                            {task.referenceCode}
                          </span>
                          <span className="font-medium text-sm text-[#1A1A1A]">
                            {company?.companyName || 'FintechPulse Technologies'}
                          </span>
                          <span className="tag-micro">
                            {formatCategoryName(task.category, language)}
                          </span>
                          <span className="text-[11px] font-medium text-[#5A5A5A] px-2.5 py-0.5 rounded-full bg-[#EDEDED]">
                            {formatTaskStatus(task.status, language)}
                          </span>
                        </div>

                        <h4 className="text-[15px] sm:text-[16px] font-medium text-[#1A1A1A]">
                          {displayTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                          <span className="text-xl font-semibold text-[#1A1A1A]">${task.proposedBudget}</span>
                          <span className="text-[10px] text-[#8C8C8C] block">
                            {task.estimatedDurationDays} {language === 'ar' ? 'أيام' : 'days'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleTaskExpand(task.id)}
                          className="pill-btn-outline !h-8 !px-3"
                        >
                          {isExpanded ? (language === 'ar' ? 'إخفاء التفاصيل ↑' : 'Hide ↑') : (language === 'ar' ? 'عرض التفاصيل ↓' : 'Details ↓')}
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 stroke-[1.5]" /> : <ChevronDown className="h-3.5 w-3.5 stroke-[1.5]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTaskForMatch(task)}
                          className="pill-btn-dark !h-8 !px-3 text-xs gap-1.5"
                        >
                          <Sparkles className="h-3.5 w-3.5 stroke-[1.5]" />
                          <span>{language === 'ar' ? 'المطابقة الذكية' : 'Smart Match'}</span>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-3.5 border-t border-black/5 space-y-3 text-xs">
                        <div>
                          <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                            {language === 'ar' ? 'نطاق العمل والمشكلة:' : 'Scope & Problem Statement:'}
                          </span>
                          <p className="text-[13px] text-[#1A1A1A] leading-relaxed">
                            {displayProblem}
                          </p>
                        </div>

                        {displayDeliverables && (
                          <div>
                            <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                              {language === 'ar' ? 'معايير ومخرجات التسليم المطلوبة:' : 'Deliverables & Acceptance Criteria:'}
                            </span>
                            <p className="text-xs text-[#5A5A5A] leading-relaxed bg-[#EDEDED]/50 p-3 rounded-xl">
                              {displayDeliverables}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          {task.targetAcademicLevel && (
                            <div>
                              <span className="text-[#8C8C8C]">{language === 'ar' ? 'المستوى الأكاديمي المطلوب: ' : 'Required Level: '}</span>
                              <strong className="text-[#1A1A1A] font-medium">{formatAcademicLevel(task.targetAcademicLevel, language)}</strong>
                            </div>
                          )}

                          {task.requiredSkills && task.requiredSkills.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#8C8C8C]">{language === 'ar' ? 'المهارات المطلوبة:' : 'Skills:'}</span>
                              <div className="flex flex-wrap gap-1">
                                {task.requiredSkills.map((s, idx) => (
                                  <span key={idx} className="bg-[#EDEDED] text-[#1A1A1A] px-2 py-0.5 rounded-full text-[11px]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Student Applications */}
        {activeTab === 'STUDENT_APPLICATIONS' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#1A1A1A]">
                {language === 'ar' ? 'عروض وتقديمات الطلاب على المهام المطروحة' : 'Student Pitch Applications on Tasks'}
              </h3>
              <p className="text-xs text-[#5A5A5A] mt-1 max-w-4xl leading-relaxed">
                {language === 'ar'
                  ? 'مراجعة عروض الطلاب، وفحص سوابق الأعمال، واعتماد التعيين والربط التعاقدي.'
                  : 'Review student pitch statements, inspect portfolio links, and formalize matching.'}
              </p>
            </div>

            <div className="space-y-3">
              {applications.map((app) => {
                const task = tasks.find(t => t.id === app.taskRequestId);
                const student = students.find(s => s.id === app.studentProfileId);
                const isExpanded = Boolean(expandedAppIds[app.id]);
                const displayTaskTitle = language === 'ar' ? task?.title : (task?.titleEn || task?.title);

                return (
                  <div 
                    key={app.id} 
                    className="bg-white rounded-[22px] p-5 sm:p-6 border border-black/5 shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                            {student?.anonymousCode}
                          </span>
                          <span className="font-medium text-sm text-[#1A1A1A]">
                            {student?.fullName} ({student?.university})
                          </span>
                          <span className="tag-micro">
                            {task?.referenceCode}
                          </span>
                          <span className="text-[11px] font-medium text-[#5A5A5A] px-2.5 py-0.5 rounded-full bg-[#EDEDED]">
                            {formatApplicationStatus(app.status, language)}
                          </span>
                        </div>

                        <h4 className="text-[15px] font-medium text-[#1A1A1A]">
                          {displayTaskTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleAppExpand(app.id)}
                          className="pill-btn-outline !h-8 !px-3"
                        >
                          {isExpanded ? (language === 'ar' ? 'إخفاء التفاصيل ↑' : 'Hide ↑') : (language === 'ar' ? 'عرض التفاصيل ↓' : 'Details ↓')}
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 stroke-[1.5]" /> : <ChevronDown className="h-3.5 w-3.5 stroke-[1.5]" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-3.5 border-t border-black/5 space-y-3 text-xs">
                        <div>
                          <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                            {language === 'ar' ? 'نص العرض ومنهجية التنفيذ:' : 'Student Pitch Statement:'}
                          </span>
                          <p className="text-[13px] text-[#1A1A1A] leading-relaxed bg-[#EDEDED]/50 p-3 rounded-xl">
                            {language === 'ar' ? app.pitchStatement : (app.pitchStatementEn || app.pitchStatement)}
                          </p>
                        </div>

                        {app.relevantPortfolioUrls && app.relevantPortfolioUrls.length > 0 && (
                          <div>
                            <span className="text-[11px] font-medium text-[#8C8C8C] block mb-1">
                              {language === 'ar' ? 'روابط الأعمال السابقة:' : 'Portfolio URLs:'}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {app.relevantPortfolioUrls.map((url, idx) => (
                                <a 
                                  key={idx} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[#1A1A1A] hover:underline bg-[#EDEDED] px-2.5 py-1 rounded-full text-xs"
                                >
                                  <span>{url}</span>
                                  <ExternalLink className="h-3 w-3 stroke-[1.5]" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Talents Directory CRM */}
        {activeTab === 'STUDENTS_CRM' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#1A1A1A]">
                {language === 'ar' ? 'سجل الكفاءات الأكاديمية المعتمدة' : 'Verified Academic Talents Directory'}
              </h3>
              <p className="text-xs text-[#5A5A5A] mt-1 max-w-4xl leading-relaxed">
                {language === 'ar'
                  ? 'إدارة ومراجعة ملفات الطلاب، درجات التحقق الأكاديمي، وتقييمات المخرجات.'
                  : 'Manage student profiles, verify university credentials, and review internal quality ratings.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {students.map((student) => (
                <AnonymizedTalentCard
                  key={student.id}
                  student={student}
                  showAdminActions={true}
                  onVerify={(s) => setSelectedStudentForVetting(s)}
                />
              ))}
            </div>
          </div>
        )}

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
