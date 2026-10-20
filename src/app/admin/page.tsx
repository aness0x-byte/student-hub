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
  formatApplicationStatus, 
  formatDealStatus 
} from '@/lib/privacy-shield';

type AdminTab = 'KANBAN' | 'COMPANY_REQUESTS' | 'STUDENT_APPLICATIONS' | 'STUDENTS_CRM' | 'COMPANIES_CRM' | 'LEDGER';

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
    createMatchDeal,
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
  const activeDeals = deals.filter(d => d.status !== 'COMPLETED_COMMISSION_COLLECTED' && d.status !== 'CANCELLED');
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
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 space-y-10">
      
      {/* Header: Title & Middleman Identity */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
              {t('adminHeaderTitle')}
            </h1>
            <span className="badge-glass-violet px-3 py-1 font-bold text-xs flex items-center">
              <span>{t('adminAssignedDesk')}</span>
            </span>

            <button
              onClick={() => openSignInModal()}
              className="btn-glass-ghost px-3 py-1 text-xs font-semibold hover:border-[#A77BF3]"
              title={t('switchRole')}
            >
              <span>{t('switchRole')}</span>
            </button>
          </div>
          <p className="text-base text-[rgba(255,255,255,0.7)] mt-2 max-w-2xl leading-relaxed font-normal">
            {t('adminHeaderSubtitle')}
          </p>
        </div>

        {/* Quick Middleman Stat Badges */}
        <div className="flex items-center gap-3">
          <div className="badge-glass-neutral text-sm">
            <span>{t('antiCircumventionActive')}</span>
          </div>
          <div className="badge-glass-violet text-sm">
            <span>{t('fixedCommission')}</span>
          </div>
        </div>
      </div>

      {/* Section 5.2 Dashboard Grid (Ref A) - Frame Container */}
      <div className="frame p-6 sm:p-8 space-y-6">
        
        {/* Row 1: 3 equal KPI columns, min-height ~135px, Section 6.2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* KPI 1 */}
          <div className="kpi">
            <div className="kpi__badge">
              <span className="badge-glass-neutral">{language === 'ar' ? 'فواتير رسمية' : 'B2B Wires'}</span>
            </div>
            <div className="kpi__label">
              {t('totalInvoiced')}
            </div>
            <div className="kpi__value text-white">
              €{totalInvoiced}
            </div>
            <div className="micro mt-3 text-[rgba(255,255,255,0.40)]">
              {t('totalInvoicedSub')}
            </div>
          </div>

          {/* KPI 2 */}
          <div className="kpi">
            <div className="kpi__badge">
              <span className="badge-positive">{language === 'ar' ? '80% صافي المستحق' : '80% Net Payout'}</span>
            </div>
            <div className="kpi__label">
              {t('studentPayouts')}
            </div>
            <div className="kpi__value text-[#34D17A]">
              €{totalStudentPayouts}
            </div>
            <div className="micro mt-3 text-[rgba(255,255,255,0.40)]">
              {t('studentPayoutsSub')}
            </div>
          </div>

          {/* KPI 3 */}
          <div className="kpi">
            <div className="kpi__badge">
              <span className="badge-glass-violet">{language === 'ar' ? '20% عائد الوساطة' : '20% Margin'}</span>
            </div>
            <div className="kpi__label">
              {t('brokerCommission')}
            </div>
            <div className="kpi__value text-[#A77BF3]">
              €{totalCommission}
            </div>
            <div className="micro mt-3 text-[rgba(255,255,255,0.40)]">
              {t('brokerCommissionSub')}
            </div>
          </div>
        </div>

        {/* Row 2: 1fr · 2.4fr · 1fr (Balance Column · Revenue Overview · Stakeholders List) */}
        <RefADashboardOverview onSettleClick={() => setActiveTab('LEDGER')} />

      </div>

      {/* Middleman Tri-Party Visual Architecture Banner */}
      <div className="glass-card p-6 border-[rgba(255,255,255,0.12)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          
          {/* Node 1: Startups */}
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <h3 className="text-base font-bold text-white">١. الشركات وجهات الأعمال</h3>
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.65)] leading-relaxed">
                <strong>طلب الخدمات:</strong> تطلب خدمات متخصصة ومحددة النطاق بدقة وتسليم مضمون، مع سداد فواتير بنكية رسمية (B2B Wire) مباشرة للمنصة دون أعباء التعامل الفردي.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-[rgba(255,255,255,0.5)]">
              <span>طلبات الخدمات المسجلة</span>
              <strong className="text-white text-sm">{tasks.length}</strong>
            </div>
          </div>

          {/* Node 2: Elena The Middleman */}
          <div className="rounded-2xl bg-gradient-to-b from-[#5B2BE0]/30 to-[#7F5AF0]/10 border border-[#A77BF3]/40 p-5 shadow-[0_0_30px_rgba(91,43,224,0.25)] flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <h3 className="text-base font-bold text-white">٢. الوسيط الحصري المعتمد (إيلينا)</h3>
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.85)] leading-relaxed">
                <strong>إدارة المنظومة والرقابة:</strong> حماية الطرفين وحظر التحايل، تدقيق الوثائق الأكاديمية، تشغيل محرك المطابقة الذكي، فحص مخرجات العمل، وضمان التسوية البنكية.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#3FD0B0]">
              <span>بروتوكول حماية البيانات</span>
              <span className="badge-glass-positive text-xs">محمي بنسبة 100%</span>
            </div>
          </div>

          {/* Node 3: Students */}
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <h3 className="text-base font-bold text-white">٣. الكفاءات الجامعية المتميزة</h3>
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.65)] leading-relaxed">
                <strong>الخبرة والمقابل المالي:</strong> بناء سجل مهني معتمد ونيل مكافآت نقدية مضمونة، مع التنسيق الكامل والحماية عبر الوسيط واستلام المستحقات بحوالات بنكية مباشرة.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-[rgba(255,255,255,0.5)]">
              <span>الكفاءات الموثقة</span>
              <strong className="text-white text-sm">{students.length}</strong>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs (Glass Pills) - Pure Text */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('KANBAN')}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'KANBAN'
              ? 'bg-[#5B2BE0] text-white shadow-[0_0_20px_rgba(91,43,224,0.5)] font-semibold'
              : 'text-[rgba(255,255,255,0.65)] hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{t('tabActiveDeals')} ({deals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPANY_REQUESTS')}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'COMPANY_REQUESTS'
              ? 'bg-white text-[#07070C] shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold'
              : 'text-[rgba(255,255,255,0.65)] hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{t('tabCompanyRequests')} ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('STUDENT_APPLICATIONS')}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'STUDENT_APPLICATIONS'
              ? 'bg-[#3FD0B0] text-[#07070C] shadow-[0_0_20px_rgba(63,208,176,0.4)] font-bold'
              : 'text-[rgba(255,255,255,0.65)] hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{t('tabStudentApplications')} ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('STUDENTS_CRM')}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'STUDENTS_CRM'
              ? 'bg-white text-[#07070C] font-bold'
              : 'text-[rgba(255,255,255,0.65)] hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{t('tabTalentDirectory')} ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPANIES_CRM')}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'COMPANIES_CRM'
              ? 'bg-white text-[#07070C] font-bold'
              : 'text-[rgba(255,255,255,0.65)] hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{t('tabCompanyDirectory')} ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'LEDGER'
              ? 'bg-gradient-to-r from-[#A77BF3] to-[#6B4BE8] text-white font-bold shadow-[0_0_20px_rgba(167,123,243,0.5)]'
              : 'text-[rgba(255,255,255,0.65)] hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{t('tabCommissionLedger')} ({ledger.length})</span>
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="space-y-6">
        
        {/* 1. KANBAN PIPELINE */}
        {activeTab === 'KANBAN' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-light text-white">مسار متابعة الصفقات والوساطة النشطة</h3>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">
                  تدار وتوثق كافة الصفقات حصرياً عبر الوسيط المعتمد. يمكنك الضغط على أي صفقة للدخول إلى غرفة الوساطة المشفرة.
                </p>
              </div>
            </div>
            <KanbanBoard onSelectDeal={(deal) => setSelectedDealForRoom(deal)} />
          </div>
        )}

        {/* 2. INCOMING COMPANY SERVICE REQUESTS */}
        {activeTab === 'COMPANY_REQUESTS' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-light text-white">طلبات الخدمات والمشاريع الواردة من الشركات</h3>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">
                تتلقى المنصة طلبات ومواصفات المهام من الشركات، حيث يتولى الوسيط تدقيق النطاق، وتقدير الميزانية العادلة، وتشغيل خوارزمية المطابقة الذكية لاختيار أفضل الكفاءات.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => {
                const company = companies.find(c => c.id === task.companyProfileId);
                const isExpanded = Boolean(expandedTaskIds[task.id]);
                return (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTaskExpand(task.id)}
                    className={`glass-card p-6 cursor-pointer hover:border-[rgba(255,255,255,0.2)] transition-all duration-300 ${
                      isExpanded ? 'border-[#5B2BE0]/40 shadow-[0_10px_35px_rgba(91,43,224,0.15)]' : ''
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                            {task.referenceCode}
                          </span>
                          <span className="text-base font-bold text-white">
                            {company?.companyName}
                          </span>
                          <span className="text-sm text-[rgba(255,255,255,0.5)]">
                            ({company?.contactPersonName})
                          </span>
                          <span className="badge-glass-neutral text-xs">
                            {formatCategoryName(task.category)}
                          </span>
                          <span className="badge-glass-positive text-xs">
                            {formatTaskStatus(task.status)}
                          </span>
                        </div>

                        <h4 className="text-lg font-semibold text-white mt-1">
                          {task.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="text-left ml-2">
                          <span className="text-xl font-bold text-white">€{task.proposedBudget}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskExpand(task.id);
                          }}
                          className="text-xs font-bold text-[#A77BF3] hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                        >
                          {isExpanded ? 'إخفاء التفاصيل ↑' : 'عرض التفاصيل ↓'}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTaskForMatch(task);
                          }}
                          className="btn-glass-gradient px-4 py-2 text-xs font-semibold shadow-[0_0_20px_rgba(127,90,240,0.4)]"
                        >
                          <span>المطابقة الذكية</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3.5 animate-in fade-in duration-200">
                        <div>
                          <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.5)] block mb-1">
                            شرح المشكلة ونطاق العمل:
                          </span>
                          <p className="text-sm text-[rgba(255,255,255,0.85)] leading-relaxed">
                            {task.problemStatement}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[rgba(255,255,255,0.6)]">
                          <span>المهارات المطلوبة: <strong className="text-white">{task.requiredSkills.join('، ')}</strong></span>
                          <span>•</span>
                          <span>المدة: <strong className="text-white">{task.estimatedDurationDays} أيام</strong></span>
                          <span>•</span>
                          <span>مستحقات الطالب (80%): <strong className="text-[#34D17A]">€{Math.round(task.proposedBudget * 0.8)}</strong></span>
                          <span>•</span>
                          <span>عائد الوسيط (20%): <strong className="text-[#A77BF3]">€{Math.round(task.proposedBudget * 0.2)}</strong></span>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moderateTaskRequest(task.id, 'APPROVED_ACTIVE', !task.isPubliclyVisible);
                            }}
                            className="btn-glass-ghost px-4 py-1.5 text-xs font-medium"
                          >
                            {task.isPubliclyVisible ? 'إخفاء من دليل المهام العام' : 'نشر بدليل المهام العام'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. STUDENT APPLICATIONS FOR EXPERIENCE & MONEY */}
        {activeTab === 'STUDENT_APPLICATIONS' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-light text-white">عروض الكفاءات الطلابية للمهام المفتوحة</h3>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">
                يقدم الطلاب الجامعيون عروضهم المباشرة للوسيط المعتمد، حيث يتم فحص الجاهزية والخبرة وإبرام الصفقات المضمونة نيابة عنهم.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {applications.length === 0 ? (
                <div className="glass-card p-12 text-center text-sm text-[rgba(255,255,255,0.5)]">
                  لا توجد طلبات طلاب معلقة في قائمة الانتظار حالياً.
                </div>
              ) : (
                applications.map((app) => {
                  const student = students.find(s => s.id === app.studentProfileId);
                  const task = tasks.find(t => t.id === app.taskRequestId);
                  const isExpanded = Boolean(expandedAppIds[app.id]);
                  return (
                    <div 
                      key={app.id} 
                      onClick={() => toggleAppExpand(app.id)}
                      className={`glass-card p-6 cursor-pointer border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.25)] transition-all duration-300 ${
                        isExpanded ? 'border-[#3FD0B0]/40 shadow-[0_10px_35px_rgba(63,208,176,0.15)]' : ''
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                              {student?.anonymousCode}
                            </span>
                            <span className="text-base font-bold text-white">
                              {student?.fullName}
                            </span>
                            <span className="text-sm text-[rgba(255,255,255,0.6)]">
                              • {student?.university}
                            </span>
                            <span className="badge-glass-positive text-xs">
                              {formatApplicationStatus(app.status)}
                            </span>
                          </div>

                          <p className="text-base font-medium text-white">
                            <strong>التقديم للمهمة:</strong> {task?.referenceCode} - {task?.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAppExpand(app.id);
                            }}
                            className="text-xs font-bold text-[#3FD0B0] hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
                          >
                            {isExpanded ? 'إخفاء التفاصيل ↑' : 'عرض التفاصيل ↓'}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!task || !student) return;
                              const deal = createMatchDeal({
                                taskRequestId: task.id,
                                studentProfileId: student.id,
                                agreedBudget: task.proposedBudget,
                                studentPayout: Math.round(task.proposedBudget * 0.8),
                                adminNotes: `تم قبول عرض الطالب يدويًا: ${student.anonymousCode} (${student.fullName}).`,
                              });
                              alert(`تم إنشاء الصفقة ${deal.dealReference} بنجاح! تم إشعار الطرفين مع حماية تامة لمنع التحايل.`);
                              setActiveTab('KANBAN');
                            }}
                            className="btn-glass-gradient px-5 py-2.5 text-xs font-semibold shadow-[0_0_24px_rgba(127,90,240,0.4)]"
                          >
                            <span>اعتماد وتدشين الصفقة</span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable Application Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3 animate-in fade-in duration-200">
                          <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] p-4 text-sm text-[rgba(255,255,255,0.85)] leading-relaxed max-w-3xl">
                            <span className="text-[#A77BF3] font-semibold block mb-1">عرض الطالب المقدم للوسيط:</span>
                            "{app.pitchStatement}"
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-[rgba(255,255,255,0.6)] pt-1">
                            <span>ميزانية العميل: <strong className="text-white">€{task?.proposedBudget}</strong></span>
                            <span>مستحقات الطالب (80%): <strong className="text-[#34D17A]">€{task ? Math.round(task.proposedBudget * 0.8) : 0}</strong></span>
                            <span>عائد الوسيط (20%): <strong className="text-[#A77BF3]">€{task ? Math.round(task.proposedBudget * 0.2) : 0}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 4. STUDENT TALENT CRM */}
        {activeTab === 'STUDENTS_CRM' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-light text-white">قاعدة بيانات الكفاءات الطلابية</h3>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">
                  تدقيق الأوراق الجامعية وتحديث التقييمات الإدارية المعتمدة.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="ابحث بالاسم، المهارة، الجامعة..."
                    className="w-full rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#A77BF3]"
                  />
                </div>

                <select
                  value={studentLevelFilter}
                  onChange={(e) => setStudentLevelFilter(e.target.value)}
                  className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[#07070C] px-4 py-2 text-sm text-white focus:outline-none focus:border-[#A77BF3] cursor-pointer"
                >
                  <option value="ALL">جميع المستويات</option>
                  <option value="LICENCE_3">بكالوريوس / ليسانس (L3)</option>
                  <option value="MASTER_1">ماستر 1 (M1)</option>
                  <option value="MASTER_2">ماستر 2 (M2)</option>
                  <option value="ENGINEERING_CYCLE">سلك المهندسين</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[rgba(255,255,255,0.04)] text-xs uppercase tracking-wider text-[rgba(255,255,255,0.5)] border-b border-[rgba(255,255,255,0.08)]">
                    <tr>
                      <th className="py-3.5 px-6 font-semibold">الكفاءة الطلابية</th>
                      <th className="py-3.5 px-6 font-semibold">الجامعة والتخصص</th>
                      <th className="py-3.5 px-6 font-semibold">المستوى</th>
                      <th className="py-3.5 px-6 font-semibold">المهارات</th>
                      <th className="py-3.5 px-6 font-semibold">التقييم</th>
                      <th className="py-3.5 px-6 font-semibold">حالة التوثيق</th>
                      <th className="py-3.5 px-6 font-semibold text-left">الإجراءات</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.8)]">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white text-base">
                            {student.fullName}
                          </div>
                          <span className="font-mono text-xs text-[rgba(255,255,255,0.5)]">
                            {student.anonymousCode}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-medium text-white">
                            {student.university}
                          </div>
                          <div className="text-xs text-[rgba(255,255,255,0.5)] line-clamp-1">
                            {student.major}
                          </div>
                        </td>

                        <td className="py-4 px-6 font-medium text-[rgba(255,255,255,0.7)]">
                          {formatAcademicLevel(student.academicLevel)}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                            {student.skills.slice(0, 3).map((sk, i) => (
                              <span key={i} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono text-white">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-bold text-amber-300">
                            <span>{student.internalAdminRating.toFixed(1)} / 5</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          {student.verificationStatus === 'VERIFIED' ? (
                            <span className="badge-glass-positive text-xs">
                              <span>موثق أكاديمياً</span>
                            </span>
                          ) : (
                            <span className="badge-glass-neutral text-xs">
                              قيد المراجعة
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-left">
                          <button
                            onClick={() => setSelectedStudentForVetting(student)}
                            className="btn-glass-ghost px-4 py-1.5 text-xs font-medium"
                          >
                            مراجعة وتوثيق
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. COMPANY CRM */}
        {activeTab === 'COMPANIES_CRM' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-light text-white">حسابات الشركات المعتمدة</h3>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">
                ملفات الشركات الناشئة الموثقة وجهات الاتصال الرسمية الطالبة للخدمات.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companies.map((company) => {
                const companyTasks = tasks.filter(t => t.companyProfileId === company.id);
                return (
                  <div key={company.id} className="glass-card p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                            {company.anonymousCode}
                          </span>
                          <h4 className="mt-3 text-lg font-bold text-white">
                            {company.companyName}
                          </h4>
                          <p className="text-sm text-[rgba(255,255,255,0.6)] mt-0.5">
                            {company.industry} • فريق من {company.companySize}
                          </p>
                        </div>

                        <div className="text-sm font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                          <span>{company.reliabilityScore.toFixed(1)} / 5</span>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl bg-[rgba(255,255,255,0.04)] p-4 text-sm text-[rgba(255,255,255,0.8)] border border-[rgba(255,255,255,0.08)] space-y-1.5">
                        <p><strong>المسؤول:</strong> {company.contactPersonName} ({company.contactPersonTitle})</p>
                        <p><strong>الهاتف:</strong> <span dir="ltr">{company.contactPhone}</span></p>
                        <p><strong>الموقع الإلكتروني:</strong> <span className="text-[#3FD0B0] underline" dir="ltr">{company.corporateWebsite}</span></p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] flex justify-between items-center text-sm text-[rgba(255,255,255,0.6)]">
                      <span>الطلبات المقدمة: <strong className="text-white">{companyTasks.length}</strong></span>
                      <span className="badge-glass-positive text-xs">عميل نشط</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. COMMISSION LEDGER */}
        {activeTab === 'LEDGER' && (
          <CommissionLedgerTable />
        )}

      </div>

      {/* Modals */}
      <SmartMatchModal
        task={selectedTaskForMatch}
        isOpen={Boolean(selectedTaskForMatch)}
        onClose={() => setSelectedTaskForMatch(null)}
        onDealCreated={() => setActiveTab('KANBAN')}
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
