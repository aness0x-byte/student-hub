export type UserRole = 'STUDENT' | 'COMPANY' | 'SUPER_ADMIN';

export type Language = 'ar' | 'en';

export type VerificationStatus = 'UNVERIFIED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';

export type AcademicLevel = 
  | 'LICENCE_1'
  | 'LICENCE_2'
  | 'LICENCE_3'
  | 'MASTER_1'
  | 'MASTER_2'
  | 'ENGINEERING_CYCLE'
  | 'PHD_DOCTORATE'
  | 'OTHER';

export type ProposalApprovalStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED_LIVE'
  | 'REJECTED'
  | 'ARCHIVED';

export type TaskRequestStatus = 
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED_ACTIVE'
  | 'MATCHING_IN_PROGRESS'
  | 'ALLOCATED_IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ApplicationStatus = 
  | 'SUBMITTED'
  | 'REVIEWED_BY_ADMIN'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'CONVERTED_TO_DEAL';

export type DealStatus = 
  | 'SUBMITTED'
  | 'UNDER_ADMIN_REVIEW'
  | 'SHORTLISTED'
  | 'MATCHED_CONNECTED'
  | 'IN_PROGRESS'
  | 'DELIVERABLE_SUBMITTED'
  | 'COMPLETED_COMMISSION_COLLECTED'
  | 'DISPUTED'
  | 'CANCELLED';

export type CommissionPaymentStatus = 
  | 'PENDING_INVOICE'
  | 'INVOICED'
  | 'CLIENT_PAID'
  | 'STUDENT_DISBURSED'
  | 'FULLY_SETTLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  anonymousCode: string; // e.g. "STU-9402"
  fullName: string;      // Private to Admin & matched deal
  phone: string;         // Private to Admin
  universityEmail: string; // Private
  university: string;
  facultyOrSchool: string;
  major: string;
  academicLevel: AcademicLevel;
  graduationYear: number;
  studentIdDocUrl: string;
  verificationStatus: VerificationStatus;
  bioSummary: string;
  skills: string[];
  portfolioLinks: { title: string; url: string }[];
  weeklyAvailability: number; // hours per week
  internalAdminRating: number; // 1.0 - 5.0
  adminNotes?: string;
  hourlyBenchmarkRate?: number;
  createdAt: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  anonymousCode: string; // e.g. "CMP-1284"
  companyName: string;   // Private to Admin until matched
  contactPersonName: string;
  contactPersonTitle: string;
  contactPhone: string;
  corporateWebsite: string;
  industry: string;
  companySize: string; // "1-10", "11-50", "51-200"
  verificationStatus: VerificationStatus;
  adminNotes?: string;
  reliabilityScore: number; // 1.0 - 5.0
  createdAt: string;
}

export interface StudentServiceProposal {
  id: string;
  studentProfileId: string;
  title: string;
  category: string;
  description: string;
  deliverablesSummary: string;
  turnaroundDays: number;
  proposedStudentFee: number;
  approvalStatus: ProposalApprovalStatus;
  isLiveInCatalog: boolean;
  adminFeedback?: string;
  createdAt: string;
}

export interface CompanyTaskRequest {
  id: string;
  companyProfileId: string;
  referenceCode: string; // e.g. "TSK-7840"
  title: string;
  category: string;
  problemStatement: string;
  deliverablesCriteria: string;
  requiredSkills: string[];
  targetAcademicLevel?: AcademicLevel;
  estimatedDurationDays: number;
  proposedBudget: number;
  status: TaskRequestStatus;
  isPubliclyVisible: boolean;
  adminCuratedNotes?: string;
  createdAt: string;
}

export interface TaskApplication {
  id: string;
  taskRequestId: string;
  studentProfileId: string;
  pitchStatement: string;
  relevantPortfolioUrls: string[];
  availabilityConfirmed: boolean;
  status: ApplicationStatus;
  adminReviewScore?: number;
  adminNotes?: string;
  createdAt: string;
}

export interface DealFacilitationLog {
  id: string;
  dealId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  messageContent: string;
  isInternalNote: boolean; // if true, visible only to Admin
  fileAttachment?: string;
  createdAt: string;
}

export interface CommissionLedgerEntry {
  id: string;
  dealId: string;
  dealReference: string;
  clientName: string;
  studentName: string;
  invoiceReferenceNumber: string;
  grossClientAmount: number;
  studentPayoutAmount: number;
  platformCommissionAmount: number;
  commissionPercentage: number;
  invoiceSentDate?: string;
  invoiceDueDate?: string;
  paymentReceivedDate?: string;
  studentDisbursedDate?: string;
  disbursementReference?: string;
  status: CommissionPaymentStatus;
  settlementNotes?: string;
  createdAt: string;
}

export interface MatchmakingDeal {
  id: string;
  dealReference: string; // e.g. "DL-2026-0042"
  taskRequestId: string;
  studentProfileId: string;
  brokeredByAdminId: string;
  status: DealStatus;
  agreedClientBudget: number;
  agreedStudentPayout: number;
  platformGrossMargin: number; // agreedClientBudget - agreedStudentPayout
  kickoffDate?: string;
  agreedDeadlineDate?: string;
  actualDeliveredDate?: string;
  adminSummaryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Anonymized DTOs for Privacy Shield
export interface AnonymizedStudentDTO {
  id: string;
  anonymousCode: string;
  university: string;
  major: string;
  academicLevel: AcademicLevel;
  skills: string[];
  weeklyAvailability: number;
  internalAdminRating: number;
  bioSummary: string;
  portfolioLinks: { title: string; url: string }[];
  verificationStatus: VerificationStatus;
}

export interface AnonymizedTaskDTO {
  id: string;
  referenceCode: string;
  title: string;
  category: string;
  problemStatement: string;
  deliverablesCriteria: string;
  requiredSkills: string[];
  targetAcademicLevel?: AcademicLevel;
  estimatedDurationDays: number;
  proposedBudget: number;
  industry: string;
  companySize: string;
  status: TaskRequestStatus;
  createdAt: string;
}
