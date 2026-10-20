import { 
  StudentProfile, 
  CompanyTaskRequest, 
  CompanyProfile, 
  AnonymizedStudentDTO, 
  AnonymizedTaskDTO 
} from './types';

/**
 * Server-side / Client Projection Mask for Student Profiles.
 * Strictly redacts: fullName, phone, universityEmail, studentIdDocUrl, adminNotes.
 */
export function toAnonymizedStudentDTO(profile: StudentProfile): AnonymizedStudentDTO {
  return {
    id: profile.id,
    anonymousCode: profile.anonymousCode,
    university: profile.university,
    major: profile.major,
    academicLevel: profile.academicLevel,
    skills: [...profile.skills],
    weeklyAvailability: profile.weeklyAvailability,
    internalAdminRating: profile.internalAdminRating,
    bioSummary: profile.bioSummary,
    // Mask personal portfolio URLs if they leak personal identities in public mode
    portfolioLinks: profile.portfolioLinks.map(link => ({
      title: link.title,
      url: link.url.includes('github') ? link.url : '#'
    })),
    verificationStatus: profile.verificationStatus,
  };
}

/**
 * Server-side / Client Projection Mask for Company Tasks.
 * Strictly redacts: companyName, contactPersonName, contactPhone, corporateWebsite.
 */
export function toAnonymizedTaskDTO(
  task: CompanyTaskRequest, 
  company?: CompanyProfile
): AnonymizedTaskDTO {
  return {
    id: task.id,
    referenceCode: task.referenceCode,
    title: task.title,
    category: task.category,
    problemStatement: task.problemStatement,
    deliverablesCriteria: task.deliverablesCriteria,
    requiredSkills: [...task.requiredSkills],
    targetAcademicLevel: task.targetAcademicLevel,
    estimatedDurationDays: task.estimatedDurationDays,
    proposedBudget: task.proposedBudget,
    industry: company ? company.industry : 'Verified Tech Venture',
    companySize: company ? company.companySize : 'Early-Stage Startup',
    status: task.status,
    createdAt: task.createdAt,
  };
}

/**
 * Format academic levels into clean, human-readable Arabic labels
 */
export function formatAcademicLevel(level?: string): string {
  switch (level) {
    case 'LICENCE_1': return 'السنة الأولى جامعي (L1)';
    case 'LICENCE_2': return 'السنة الثانية جامعي (L2)';
    case 'LICENCE_3': return 'بكالوريوس / ليسانس (L3)';
    case 'MASTER_1': return 'ماجستير سنة أولى (M1)';
    case 'MASTER_2': return 'ماجستير تخصصي (M2)';
    case 'ENGINEERING_CYCLE': return 'سلك كبار المهندسين';
    case 'PHD_DOCTORATE': return 'دكتوراه وباحث أكاديمي';
    default: return 'كفاءة جامعية معتمدة';
  }
}

/**
 * Format deal stages into natural Arabic business terms
 */
export function formatDealStatus(status?: string): string {
  switch (status) {
    case 'SUBMITTED': return 'تم الاستلام';
    case 'UNDER_ADMIN_REVIEW': return 'قيد المراجعة والتدقيق';
    case 'SHORTLISTED': return 'ضمن القائمة المختصرة';
    case 'MATCHED_CONNECTED': return 'تم التكليف والربط';
    case 'IN_PROGRESS': return 'قيد التنفيذ والمتابعة';
    case 'DELIVERABLE_SUBMITTED': return 'تم تسليم المخرجات';
    case 'COMPLETED_COMMISSION_COLLECTED': return 'مكتملة ومسواة مالياً';
    case 'DISPUTED': return 'قيد فض النزاع';
    case 'CANCELLED': return 'ملغاة';
    default: return status || 'حالة غير محددة';
  }
}

/**
 * Format task statuses into professional Arabic
 */
export function formatTaskStatus(status?: string): string {
  switch (status) {
    case 'DRAFT': return 'مسودة';
    case 'PENDING_REVIEW': return 'بانتظار مراجعة الوسيط';
    case 'APPROVED_ACTIVE': return 'معتمد ومتاح للتقديم';
    case 'MATCHING_IN_PROGRESS': return 'جاري اختيار الكفاءات';
    case 'ALLOCATED_IN_PROGRESS': return 'تم التكليف وقيد التنفيذ';
    case 'COMPLETED': return 'مكتمل ومغلق';
    case 'CANCELLED': return 'ملغي';
    default: return status || 'متاح';
  }
}

/**
 * Format application statuses into clear Arabic
 */
export function formatApplicationStatus(status?: string): string {
  switch (status) {
    case 'SUBMITTED': return 'تم إرسال العرض للوسيط';
    case 'REVIEWED_BY_ADMIN': return 'تمت مراجعة العرض';
    case 'SHORTLISTED': return 'مرشح ضمن القائمة الأولى';
    case 'CONVERTED_TO_DEAL': return 'تم قبول العرض وبدء الصفقة';
    case 'REJECTED': return 'غير معتمد لهذه المهمة';
    default: return status || 'قيد المراجعة';
  }
}

/**
 * Format proposal statuses into clear Arabic
 */
export function formatProposalStatus(status?: string): string {
  switch (status) {
    case 'DRAFT': return 'مسودة مقترح';
    case 'PENDING_APPROVAL': return 'بانتظار اعتماد الوسيط';
    case 'APPROVED_LIVE': return 'معتمد ومعروض بالدليل';
    case 'REJECTED': return 'بحاجة لتعديل المخرجات';
    case 'ARCHIVED': return 'مؤرشف';
    default: return status || 'قيد التدقيق';
  }
}

/**
 * Format student and company verification statuses
 */
export function formatVerificationStatus(status?: string): string {
  switch (status) {
    case 'VERIFIED': return 'موثق ومعتمد رسمياً';
    case 'PENDING_REVIEW': return 'قيد مراجعة الوثائق';
    case 'UNVERIFIED': return 'غير موثق';
    case 'REJECTED': return 'مرفوض';
    default: return 'قيد التدقيق';
  }
}

/**
 * Format service categories into Arabic
 */
export function formatCategoryName(category?: string): string {
  if (!category) return 'كافة المجالات والتخصصات';
  const cat = category.trim();
  switch (cat) {
    case 'Full-Stack Web Dev':
    case 'Web Development':
      return 'تطوير الويب والبرمجيات المتكاملة';
    case 'UI/UX & Mobile Design':
    case 'UI/UX Design':
      return 'تصميم واجهات وتجربة المستخدم';
    case 'Mobile Development':
      return 'تطوير تطبيقات الجوال والأجهزة الذكية';
    case 'Data & Automation':
      return 'علم البيانات والأتمتة الذكية';
    case 'Finance & Strategy':
      return 'النمذجة المالية واستراتيجيات الأعمال';
    case 'Growth & Marketing':
      return 'التسويق الرقمي واستراتيجيات النمو';
    case 'Content & Translation':
      return 'الترجمة الاحترافية وصناعة المحتوى التخصصي';
    case 'Engineering & Architecture':
      return 'الهندسة المعمارية والتصميم الإنشائي';
    case 'Research & Analysis':
      return 'البحث الأكاديمي والتحليل النوعي';
    default:
      return cat;
  }
}

/**
 * Format user roles into clear Arabic
 */
export function formatRoleName(role?: string): string {
  switch (role) {
    case 'SUPER_ADMIN': return 'الوسيط الحصري والمدير العام';
    case 'COMPANY': return 'جهة الأعمال والشركات';
    case 'STUDENT': return 'الكفاءة الجامعية المنفذة';
    default: return 'مستخدم';
  }
}


