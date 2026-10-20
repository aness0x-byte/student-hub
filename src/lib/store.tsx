'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Language,
  StudentProfile, 
  CompanyProfile, 
  StudentServiceProposal, 
  CompanyTaskRequest, 
  TaskApplication, 
  MatchmakingDeal, 
  DealFacilitationLog, 
  CommissionLedgerEntry, 
  DealStatus, 
  ProposalApprovalStatus, 
  TaskRequestStatus, 
  VerificationStatus,
  CommissionPaymentStatus
} from './types';
import { TRANSLATIONS, getTranslation } from './translations';
import { 
  INITIAL_USERS, 
  INITIAL_STUDENTS, 
  INITIAL_COMPANIES, 
  INITIAL_STUDENT_PROPOSALS, 
  INITIAL_COMPANY_TASKS, 
  INITIAL_APPLICATIONS, 
  INITIAL_DEALS, 
  INITIAL_FACILITATION_LOGS, 
  INITIAL_COMMISSION_LEDGER 
} from './mock-data';

interface StoreContextType {
  // Language & Internationalization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['ar']) => string;

  // Role & Current User Context
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentStudentProfile?: StudentProfile;
  currentCompanyProfile?: CompanyProfile;

  // Sign-In Modalisation Context
  isSignInModalOpen: boolean;
  openSignInModal: (defaultRole?: UserRole) => void;
  closeSignInModal: () => void;
  selectedModalRole?: UserRole;

  // Collections
  users: User[];
  students: StudentProfile[];
  companies: CompanyProfile[];
  proposals: StudentServiceProposal[];
  tasks: CompanyTaskRequest[];
  applications: TaskApplication[];
  deals: MatchmakingDeal[];
  facilitationLogs: DealFacilitationLog[];
  ledger: CommissionLedgerEntry[];

  // Student Actions
  submitServiceProposal: (proposal: Omit<StudentServiceProposal, 'id' | 'createdAt' | 'approvalStatus' | 'isLiveInCatalog'>) => void;
  applyToTask: (taskRequestId: string, pitchStatement: string, portfolioUrls: string[]) => void;
  updateStudentProfile: (studentId: string, updates: Partial<StudentProfile>) => void;

  // Company Actions
  submitTaskRequest: (task: Omit<CompanyTaskRequest, 'id' | 'referenceCode' | 'createdAt' | 'status' | 'isPubliclyVisible'>) => void;

  // Admin Actions
  verifyStudent: (studentId: string, status: VerificationStatus, rating: number, notes: string) => void;
  moderateServiceProposal: (proposalId: string, status: ProposalApprovalStatus, feedback?: string) => void;
  moderateTaskRequest: (taskId: string, status: TaskRequestStatus, isPublic: boolean, notes?: string) => void;
  createMatchDeal: (params: {
    taskRequestId: string;
    studentProfileId: string;
    agreedBudget: number;
    studentPayout: number;
    adminNotes?: string;
  }) => MatchmakingDeal;
  updateDealStatus: (dealId: string, newStatus: DealStatus, notes?: string) => void;
  sendFacilitationMessage: (dealId: string, content: string, isInternalNote: boolean, attachment?: string) => void;
  updateLedgerEntry: (dealId: string, updates: Partial<CommissionLedgerEntry>) => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = 'STUDENT_HUB_DATA_V2';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Language State
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('STUDENT_HUB_LANG') as Language | null;
      if (savedLang === 'ar' || savedLang === 'en') {
        setLanguageState(savedLang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = savedLang;
          document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
    try {
      localStorage.setItem('STUDENT_HUB_LANG', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof typeof TRANSLATIONS['ar']): string => {
    return getTranslation(language, key);
  };

  // Active Role, User and Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [selectedModalRole, setSelectedModalRole] = useState<UserRole | undefined>(undefined);

  const openSignInModal = (defaultRole?: UserRole) => {
    setSelectedModalRole(defaultRole);
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handleSetCurrentRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'SUPER_ADMIN') setCurrentUser(INITIAL_USERS[0]);
    else if (role === 'STUDENT') setCurrentUser(INITIAL_USERS[1]);
    else if (role === 'COMPANY') setCurrentUser(INITIAL_USERS[5]);
  };

  const login = (role: UserRole) => {
    handleSetCurrentRole(role);
    setIsAuthenticated(true);
    setIsSignInModalOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Main collections
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [companies, setCompanies] = useState<CompanyProfile[]>(INITIAL_COMPANIES);
  const [proposals, setProposals] = useState<StudentServiceProposal[]>(INITIAL_STUDENT_PROPOSALS);
  const [tasks, setTasks] = useState<CompanyTaskRequest[]>(INITIAL_COMPANY_TASKS);
  const [applications, setApplications] = useState<TaskApplication[]>(INITIAL_APPLICATIONS);
  const [deals, setDeals] = useState<MatchmakingDeal[]>(INITIAL_DEALS);
  const [facilitationLogs, setFacilitationLogs] = useState<DealFacilitationLog[]>(INITIAL_FACILITATION_LOGS);
  const [ledger, setLedger] = useState<CommissionLedgerEntry[]>(INITIAL_COMMISSION_LEDGER);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.companies) setCompanies(parsed.companies);
        if (parsed.proposals) setProposals(parsed.proposals);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.applications) setApplications(parsed.applications);
        if (parsed.deals) setDeals(parsed.deals);
        if (parsed.facilitationLogs) setFacilitationLogs(parsed.facilitationLogs);
        if (parsed.ledger) setLedger(parsed.ledger);
        if (parsed.currentRole) setCurrentRole(parsed.currentRole);
        if (typeof parsed.isAuthenticated === 'boolean') setIsAuthenticated(parsed.isAuthenticated);
      }
    } catch (e) {
      console.warn('Could not load stored data, using defaults:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToPersist = {
        students,
        companies,
        proposals,
        tasks,
        applications,
        deals,
        facilitationLogs,
        ledger,
        currentRole,
        isAuthenticated,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.warn('Could not persist data:', e);
    }
  }, [students, companies, proposals, tasks, applications, deals, facilitationLogs, ledger, currentRole, isAuthenticated, isLoaded]);

  // Sync active user when currentRole changes
  useEffect(() => {
    if (currentRole === 'SUPER_ADMIN') {
      setCurrentUser(INITIAL_USERS[0]);
    } else if (currentRole === 'STUDENT') {
      setCurrentUser(INITIAL_USERS[1]); // Alex Chen
    } else if (currentRole === 'COMPANY') {
      setCurrentUser(INITIAL_USERS[5]); // Marcus Vance
    }
  }, [currentRole]);

  // Derived profiles
  const currentStudentProfile = students.find(s => s.userId === currentUser.id) || students[0];
  const currentCompanyProfile = companies.find(c => c.userId === currentUser.id) || companies[0];

  // Actions
  const submitServiceProposal = (data: Omit<StudentServiceProposal, 'id' | 'createdAt' | 'approvalStatus' | 'isLiveInCatalog'>) => {
    const newProposal: StudentServiceProposal = {
      ...data,
      id: `prop-${Date.now()}`,
      approvalStatus: 'PENDING_APPROVAL',
      isLiveInCatalog: false,
      createdAt: new Date().toISOString(),
    };
    setProposals(prev => [newProposal, ...prev]);
  };

  const applyToTask = (taskRequestId: string, pitchStatement: string, portfolioUrls: string[]) => {
    if (!currentStudentProfile) return;
    const newApp: TaskApplication = {
      id: `app-${Date.now()}`,
      taskRequestId,
      studentProfileId: currentStudentProfile.id,
      pitchStatement,
      relevantPortfolioUrls: portfolioUrls,
      availabilityConfirmed: true,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };
    setApplications(prev => [newApp, ...prev]);
  };

  const updateStudentProfile = (studentId: string, updates: Partial<StudentProfile>) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updates } : s));
  };

  const submitTaskRequest = (data: Omit<CompanyTaskRequest, 'id' | 'referenceCode' | 'createdAt' | 'status' | 'isPubliclyVisible'>) => {
    const randomCode = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTask: CompanyTaskRequest = {
      ...data,
      id: `tsk-${Date.now()}`,
      referenceCode: randomCode,
      status: 'PENDING_REVIEW',
      isPubliclyVisible: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const verifyStudent = (studentId: string, status: VerificationStatus, rating: number, notes: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? {
      ...s,
      verificationStatus: status,
      internalAdminRating: rating,
      adminNotes: notes,
    } : s));
  };

  const moderateServiceProposal = (proposalId: string, status: ProposalApprovalStatus, feedback?: string) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? {
      ...p,
      approvalStatus: status,
      isLiveInCatalog: status === 'APPROVED_LIVE',
      adminFeedback: feedback || p.adminFeedback,
    } : p));
  };

  const moderateTaskRequest = (taskId: string, status: TaskRequestStatus, isPublic: boolean, notes?: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      status,
      isPubliclyVisible: isPublic,
      adminCuratedNotes: notes || t.adminCuratedNotes,
    } : t));
  };

  const createMatchDeal = (params: {
    taskRequestId: string;
    studentProfileId: string;
    agreedBudget: number;
    studentPayout: number;
    adminNotes?: string;
  }): MatchmakingDeal => {
    const dealRef = `DL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const margin = params.agreedBudget - params.studentPayout;
    
    const newDeal: MatchmakingDeal = {
      id: `deal-${Date.now()}`,
      dealReference: dealRef,
      taskRequestId: params.taskRequestId,
      studentProfileId: params.studentProfileId,
      brokeredByAdminId: currentUser.id,
      status: 'MATCHED_CONNECTED',
      agreedClientBudget: params.agreedBudget,
      agreedStudentPayout: params.studentPayout,
      platformGrossMargin: margin,
      kickoffDate: new Date().toISOString(),
      agreedDeadlineDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      adminSummaryNotes: params.adminNotes || 'Deal initiated via Admin Command Center.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update task request status
    setTasks(prev => prev.map(t => t.id === params.taskRequestId ? {
      ...t,
      status: 'ALLOCATED_IN_PROGRESS'
    } : t));

    // Create corresponding ledger entry
    const matchingStudent = students.find(s => s.id === params.studentProfileId);
    const matchingTask = tasks.find(t => t.id === params.taskRequestId);
    const matchingCompany = companies.find(c => c.id === matchingTask?.companyProfileId);

    const commissionPercent = params.agreedBudget > 0 
      ? Number(((margin / params.agreedBudget) * 100).toFixed(1))
      : 20;

    const newLedgerEntry: CommissionLedgerEntry = {
      id: `led-${Date.now()}`,
      dealId: newDeal.id,
      dealReference: dealRef,
      clientName: matchingCompany ? `${matchingCompany.companyName} (${matchingCompany.contactPersonName})` : 'Client',
      studentName: matchingStudent ? `${matchingStudent.fullName} (${matchingStudent.anonymousCode})` : 'Student',
      invoiceReferenceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      grossClientAmount: params.agreedBudget,
      studentPayoutAmount: params.studentPayout,
      platformCommissionAmount: margin,
      commissionPercentage: commissionPercent,
      invoiceSentDate: new Date().toISOString(),
      invoiceDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'INVOICED',
      settlementNotes: 'Brokered contract initiated. Invoice sent to client.',
      createdAt: new Date().toISOString(),
    };

    // Initial welcome message in facilitation log
    const welcomeLog: DealFacilitationLog = {
      id: `msg-${Date.now()}`,
      dealId: newDeal.id,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (Admin Broker)`,
      senderRole: 'SUPER_ADMIN',
      messageContent: `Welcome to Deal #${dealRef}! I have approved this match and will facilitate the handoff, scope milestones, and deliverables.`,
      isInternalNote: false,
      createdAt: new Date().toISOString(),
    };

    setDeals(prev => [newDeal, ...prev]);
    setLedger(prev => [newLedgerEntry, ...prev]);
    setFacilitationLogs(prev => [...prev, welcomeLog]);

    return newDeal;
  };

  const updateDealStatus = (dealId: string, newStatus: DealStatus, notes?: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return {
        ...d,
        status: newStatus,
        adminSummaryNotes: notes || d.adminSummaryNotes,
        actualDeliveredDate: newStatus === 'COMPLETED_COMMISSION_COLLECTED' ? new Date().toISOString() : d.actualDeliveredDate,
        updatedAt: new Date().toISOString(),
      };
    }));

    // If completed, update task and ledger
    if (newStatus === 'COMPLETED_COMMISSION_COLLECTED') {
      const deal = deals.find(d => d.id === dealId);
      if (deal) {
        setTasks(prev => prev.map(t => t.id === deal.taskRequestId ? { ...t, status: 'COMPLETED' } : t));
        setLedger(prev => prev.map(l => l.dealId === dealId ? {
          ...l,
          status: 'FULLY_SETTLED',
          studentDisbursedDate: new Date().toISOString(),
          disbursementReference: `SETTLED-${Date.now().toString().slice(-6)}`,
          settlementNotes: 'Deal marked as completed. Client payment verified and student payout disbursed.',
        } : l));
      }
    }
  };

  const sendFacilitationMessage = (dealId: string, content: string, isInternalNote: boolean, attachment?: string) => {
    const newMsg: DealFacilitationLog = {
      id: `msg-${Date.now()}`,
      dealId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentRole,
      messageContent: content,
      isInternalNote,
      fileAttachment: attachment,
      createdAt: new Date().toISOString(),
    };
    setFacilitationLogs(prev => [...prev, newMsg]);
  };

  const updateLedgerEntry = (dealId: string, updates: Partial<CommissionLedgerEntry>) => {
    setLedger(prev => prev.map(l => l.dealId === dealId ? { ...l, ...updates } : l));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(INITIAL_USERS);
    setStudents(INITIAL_STUDENTS);
    setCompanies(INITIAL_COMPANIES);
    setProposals(INITIAL_STUDENT_PROPOSALS);
    setTasks(INITIAL_COMPANY_TASKS);
    setApplications(INITIAL_APPLICATIONS);
    setDeals(INITIAL_DEALS);
    setFacilitationLogs(INITIAL_FACILITATION_LOGS);
    setLedger(INITIAL_COMMISSION_LEDGER);
    setCurrentRole('SUPER_ADMIN');
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <StoreContext.Provider value={{
      language,
      setLanguage,
      t,
      isAuthenticated,
      login,
      logout,
      currentRole,
      setCurrentRole: handleSetCurrentRole,
      currentUser,
      setCurrentUser,
      currentStudentProfile,
      currentCompanyProfile,
      isSignInModalOpen,
      openSignInModal,
      closeSignInModal,
      selectedModalRole,
      users,
      students,
      companies,
      proposals,
      tasks,
      applications,
      deals,
      facilitationLogs,
      ledger,
      submitServiceProposal,
      applyToTask,
      updateStudentProfile,
      submitTaskRequest,
      verifyStudent,
      moderateServiceProposal,
      moderateTaskRequest,
      createMatchDeal,
      updateDealStatus,
      sendFacilitationMessage,
      updateLedgerEntry,
      resetDemoData,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
