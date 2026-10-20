import { StudentProfile, CompanyTaskRequest } from './types';

export interface MatchScoreResult {
  student: StudentProfile;
  overallScore: number; // 0 - 100 percentage
  breakdown: {
    skillMatchScore: number;    // 0 - 100
    matchedSkills: string[];
    academicFitScore: number;   // 0 - 100
    ratingScore: number;        // 0 - 100
    availabilityScore: number;  // 0 - 100
  };
  recommendationReason: string;
}

const ACADEMIC_LEVEL_ORDER: Record<string, number> = {
  LICENCE_1: 1,
  LICENCE_2: 2,
  LICENCE_3: 3,
  MASTER_1: 4,
  MASTER_2: 5,
  ENGINEERING_CYCLE: 5,
  PHD_DOCTORATE: 6,
  OTHER: 2,
};

/**
 * Algorithmic Smart Matching Assistant.
 * Scores all verified students against a given company task and returns the top 5 ranked candidates.
 */
export function getTopMatchingStudents(
  task: CompanyTaskRequest,
  students: StudentProfile[],
  limit: number = 5
): MatchScoreResult[] {
  const verifiedStudents = students.filter(
    s => s.verificationStatus === 'VERIFIED'
  );

  const results: MatchScoreResult[] = verifiedStudents.map(student => {
    // 1. Skill Overlap (Weight: 45%)
    const taskSkillsLower = task.requiredSkills.map(s => s.toLowerCase().trim());
    const studentSkillsLower = student.skills.map(s => s.toLowerCase().trim());

    const matchedSkills = student.skills.filter(s => 
      taskSkillsLower.some(ts => ts.includes(s.toLowerCase()) || s.toLowerCase().includes(ts))
    );

    let skillMatchScore = 0;
    if (taskSkillsLower.length > 0) {
      skillMatchScore = Math.min(
        100,
        Math.round((matchedSkills.length / taskSkillsLower.length) * 100)
      );
    } else {
      skillMatchScore = 70; // baseline if no specific skills specified
    }

    // 2. Academic Level Fit (Weight: 20%)
    const targetLevelRank = task.targetAcademicLevel 
      ? ACADEMIC_LEVEL_ORDER[task.targetAcademicLevel] || 3 
      : 3;
    const studentLevelRank = ACADEMIC_LEVEL_ORDER[student.academicLevel] || 3;

    let academicFitScore = 80;
    if (studentLevelRank >= targetLevelRank) {
      academicFitScore = 100;
    } else if (studentLevelRank === targetLevelRank - 1) {
      academicFitScore = 75;
    } else {
      academicFitScore = 50;
    }

    // 3. Admin Quality Rating (Weight: 20%)
    // Rating is between 1.0 and 5.0 -> scaled to 100
    const ratingScore = Math.round((student.internalAdminRating / 5.0) * 100);

    // 4. Availability Fit (Weight: 15%)
    // If student has >= 10h/week, score is high
    let availabilityScore = 70;
    if (student.weeklyAvailability >= 15) {
      availabilityScore = 100;
    } else if (student.weeklyAvailability >= 10) {
      availabilityScore = 85;
    } else {
      availabilityScore = 60;
    }

    // Weighted Overall Score
    const overallScore = Math.round(
      skillMatchScore * 0.45 +
      academicFitScore * 0.20 +
      ratingScore * 0.20 +
      availabilityScore * 0.15
    );

    // Generate human-friendly recommendation rationale
    let recommendationReason = '';
    if (matchedSkills.length >= 3) {
      recommendationReason = `تطابق مهارات ممتاز (${matchedSkills.slice(0, 3).join('، ')}) مع تقييم وسيط مرتفع ${student.internalAdminRating} من 5.`;
    } else if (matchedSkills.length > 0) {
      recommendationReason = `يتطابق في متطلبات (${matchedSkills.join('، ')}) وخلفية قوية في ${student.major}.`;
    } else {
      recommendationReason = `كفاءة عامة متميزة في ${student.major} مع تفرغ أسبوعي مناسب للمهمة.`;
    }

    return {
      student,
      overallScore,
      breakdown: {
        skillMatchScore,
        matchedSkills,
        academicFitScore,
        ratingScore,
        availabilityScore,
      },
      recommendationReason,
    };
  });

  // Sort descending by overall score and return top results
  return results
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);
}
