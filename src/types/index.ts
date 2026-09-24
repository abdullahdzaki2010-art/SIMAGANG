export type UserRole = 'student' | 'mentor' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  institution: string; // e.g., "Universitas Indonesia" or "SMK Negeri 1 Jakarta"
  major: string; // e.g., "Teknik Informatika" / "Rekayasa Perangkat Lunak"
  studentId: string; // NISN or NIM
  phone: string;
  companyName?: string;
  internshipRole?: string;
  startDate?: string;
  endDate?: string;
  totalHoursTarget?: number;
  mentorName?: string;
  teacherName?: string;
}

export type AttendanceType = 'WFO' | 'WFH' | 'Izin' | 'Sakit';
export type AttendanceStatus = 'present' | 'late' | 'excused' | 'absent';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm
  checkOutTime?: string; // HH:mm
  type: AttendanceType;
  status: AttendanceStatus;
  location: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  notes?: string;
  verifiedByMentor: boolean;
}

export type LogbookStatus = 'draft' | 'pending' | 'approved' | 'revision_requested';

export interface LogbookEntry {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: 'Pengembangan Perangkat Lunak' | 'Riset & Analisis' | 'Desain UI/UX' | 'Pertemuan & Diskusi' | 'Dokumentasi & Testing' | 'Operasional';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  description: string;
  obstacles?: string;
  solution?: string;
  outputUrl?: string;
  status: LogbookStatus;
  mentorFeedback?: string;
  reviewedAt?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface InternshipTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  submissionNotes?: string;
  submissionLink?: string;
  mentorScore?: number; // 0-100
  mentorComment?: string;
  createdAt: string;
}

export interface InternshipVacancy {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workType: 'WFO' | 'WFH' | 'Hybrid';
  level: 'SMK' | 'D3/D4' | 'S1' | 'Semua Jenjang';
  stipend: string;
  durationMonths: number;
  deadline: string;
  category: 'Teknologi & IT' | 'Desain & Kreatif' | 'Bisnis & Pemasaran' | 'Data & Keuangan' | 'Teknik & Mesin';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  slotsAvailable: number;
  applicantsCount: number;
}

export type ApplicationStatus = 'submitted' | 'under_review' | 'interview' | 'accepted' | 'rejected';

export interface VacancyApplication {
  id: string;
  vacancyId: string;
  studentId: string;
  studentName: string;
  studentMajor: string;
  appliedDate: string;
  status: ApplicationStatus;
  resumeSummary: string;
  portfolioUrl?: string;
  coverLetter: string;
  feedbackNote?: string;
}

export interface EvaluationAspect {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage, sum = 100
  score: number; // 0 - 100
}

export interface FinalEvaluation {
  studentId: string;
  mentorName: string;
  teacherName: string;
  completionDate: string;
  aspects: EvaluationAspect[];
  generalFeedback: string;
  recommendation: 'Sangat Direkomendasikan' | 'Direkomendasikan' | 'Cukup' | 'Perlu Perbaikan';
  finalGradeLetter: 'A' | 'A-' | 'B+' | 'B' | 'C';
  certificateNumber: string;
}
