import { 
  StudentProfile, 
  CompanyTaskRequest, 
  CompanyProfile, 
  AnonymizedStudentDTO, 
  AnonymizedTaskDTO,
  Language
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
 * Format academic levels into clean, human-readable labels
 */
export function formatAcademicLevel(level?: string, lang: Language = 'ar'): string {
  if (lang === 'en') {
    switch (level) {
      case 'LICENCE_1': return '1st Year Bachelor (L1)';
      case 'LICENCE_2': return '2nd Year Bachelor (L2)';
      case 'LICENCE_3': return 'Bachelor / Licence (L3)';
      case 'MASTER_1': return 'Master 1 (M1)';
      case 'MASTER_2': return 'Master 2 / Specialized (M2)';
      case 'ENGINEERING_CYCLE': return 'Engineering Degree Cycle';
      case 'PHD_DOCTORATE': return 'PhD & Research Fellow';
      default: return 'Verified Academic Talent';
    }
  }
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
 * Format deal stages into natural business terms
 */
export function formatDealStatus(status?: string, lang: Language = 'ar'): string {
  if (lang === 'en') {
    switch (status) {
      case 'SUBMITTED': return 'Received & Verified';
      case 'UNDER_ADMIN_REVIEW': return 'Under Admin Review';
      case 'SHORTLISTED': return 'Shortlisted';
      case 'MATCHED_CONNECTED': return 'Matched & Assigned';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DELIVERABLE_SUBMITTED': return 'Deliverable Submitted';
      case 'COMPLETED_COMMISSION_COLLECTED': return 'Completed & Settled';
      case 'DISPUTED': return 'In Dispute Resolution';
      case 'CANCELLED': return 'Cancelled';
      default: return status || 'Undefined Status';
    }
  }
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
 * Format task statuses into professional terms
 */
export function formatTaskStatus(status?: string, lang: Language = 'ar'): string {
  if (lang === 'en') {
    switch (status) {
      case 'DRAFT': return 'Draft';
      case 'PENDING_REVIEW': return 'Pending Broker Review';
      case 'APPROVED_ACTIVE': return 'Approved & Active';
      case 'MATCHING_IN_PROGRESS': return 'Matching in Progress';
      case 'ALLOCATED_IN_PROGRESS': return 'Assigned & In Progress';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status || 'Available';
    }
  }
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
 * Format application statuses into clear labels
 */
export function formatApplicationStatus(status?: string, lang: Language = 'ar'): string {
  if (lang === 'en') {
    switch (status) {
      case 'SUBMITTED': return 'Submitted to Broker';
      case 'REVIEWED_BY_ADMIN': return 'Reviewed by Broker';
      case 'SHORTLISTED': return 'Shortlisted Candidate';
      case 'CONVERTED_TO_DEAL': return 'Accepted & Deal Launched';
      case 'REJECTED': return 'Not Selected';
      default: return status || 'Under Review';
    }
  }
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
 * Format proposal statuses into clear labels
 */
export function formatProposalStatus(status?: string, lang: Language = 'ar'): string {
  if (lang === 'en') {
    switch (status) {
      case 'DRAFT': return 'Draft Proposal';
      case 'PENDING_APPROVAL': return 'Pending Broker Approval';
      case 'APPROVED_LIVE': return 'Approved & Live in Catalog';
      case 'REJECTED': return 'Revisions Required';
      case 'ARCHIVED': return 'Archived';
      default: return status || 'Under Review';
    }
  }
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
export function formatVerificationStatus(status?: string, lang: Language = 'ar'): string {
  if (lang === 'en') {
    switch (status) {
      case 'VERIFIED': return 'Officially Verified';
      case 'PENDING_REVIEW': return 'Under Document Review';
      case 'UNVERIFIED': return 'Unverified';
      case 'REJECTED': return 'Rejected';
      default: return 'Under Review';
    }
  }
  switch (status) {
    case 'VERIFIED': return 'موثق ومعتمد رسمياً';
    case 'PENDING_REVIEW': return 'قيد مراجعة الوثائق';
    case 'UNVERIFIED': return 'غير موثق';
    case 'REJECTED': return 'مرفوض';
    default: return 'قيد التدقيق';
  }
}

/**
 * Format service categories
 */
export function formatCategoryName(category?: string, lang: Language = 'ar'): string {
  if (!category) return lang === 'en' ? 'All Majors & Fields' : 'كافة المجالات والتخصصات';
  const cat = category.trim();
  if (lang === 'en') {
    switch (cat) {
      case 'Full-Stack Web Dev':
      case 'Web Development':
        return 'Full-Stack Web & Software Dev';
      case 'UI/UX & Mobile Design':
      case 'UI/UX Design':
        return 'UI/UX & Interface Design';
      case 'Mobile Development':
        return 'Mobile App Development';
      case 'Data & Automation':
        return 'Data Science & Automation';
      case 'Finance & Strategy':
        return 'Financial Modeling & Strategy';
      case 'Growth & Marketing':
        return 'Digital Marketing & Growth';
      case 'Content & Translation':
        return 'Translation & Technical Writing';
      case 'Engineering & Architecture':
        return 'Engineering & Architectural Design';
      case 'Research & Analysis':
        return 'Academic Research & Analysis';
      default:
        return cat;
    }
  }
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
 * Format user roles into clear labels
 */
export function formatRoleName(role?: string, lang: Language = 'ar'): string {
  if (lang === 'en') {
    switch (role) {
      case 'SUPER_ADMIN': return 'Chief Broker & General Manager';
      case 'COMPANY': return 'Enterprises & Startups';
      case 'STUDENT': return 'Student Academic Talent';
      default: return 'User';
    }
  }
  switch (role) {
    case 'SUPER_ADMIN': return 'الوسيط الحصري والمدير العام';
    case 'COMPANY': return 'جهة الأعمال والشركات';
    case 'STUDENT': return 'الكفاءة الجامعية المنفذة';
    default: return 'مستخدم';
  }
}


