import {
  UserProfile,
  AttendanceRecord,
  LogbookEntry,
  InternshipTask,
  InternshipVacancy,
  VacancyApplication,
  FinalEvaluation,
  UserRole,
} from '../types';
import {
  initialProfiles,
  initialVacancies,
  initialAttendances,
  initialLogbooks,
  initialTasks,
  initialApplications,
  initialEvaluation,
} from '../data/initialData';

const KEYS = {
  CURRENT_ROLE: 'simagang_current_role',
  PROFILES: 'simagang_profiles',
  VACANCIES: 'simagang_vacancies',
  ATTENDANCES: 'simagang_attendances',
  LOGBOOKS: 'simagang_logbooks',
  TASKS: 'simagang_tasks',
  APPLICATIONS: 'simagang_applications',
  EVALUATION: 'simagang_evaluation',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save to localStorage for key ${key}:`, err);
  }
}

export const storageService = {
  getCurrentRole(): UserRole {
    return getItem<UserRole>(KEYS.CURRENT_ROLE, 'student');
  },
  setCurrentRole(role: UserRole): void {
    setItem(KEYS.CURRENT_ROLE, role);
  },

  getProfiles(): Record<UserRole, UserProfile> {
    return getItem(KEYS.PROFILES, initialProfiles);
  },
  saveProfile(role: UserRole, profile: UserProfile): void {
    const profiles = this.getProfiles();
    profiles[role] = profile;
    setItem(KEYS.PROFILES, profiles);
  },

  getVacancies(): InternshipVacancy[] {
    return getItem(KEYS.VACANCIES, initialVacancies);
  },
  saveVacancies(vacancies: InternshipVacancy[]): void {
    setItem(KEYS.VACANCIES, vacancies);
  },

  getAttendances(): AttendanceRecord[] {
    return getItem(KEYS.ATTENDANCES, initialAttendances);
  },
  saveAttendances(attendances: AttendanceRecord[]): void {
    setItem(KEYS.ATTENDANCES, attendances);
  },
  addAttendance(record: AttendanceRecord): void {
    const list = this.getAttendances();
    // remove any existing record for the exact same date & student
    const filtered = list.filter(a => !(a.date === record.date && a.studentId === record.studentId));
    setItem(KEYS.ATTENDANCES, [record, ...filtered]);
  },

  getLogbooks(): LogbookEntry[] {
    return getItem(KEYS.LOGBOOKS, initialLogbooks);
  },
  saveLogbooks(logbooks: LogbookEntry[]): void {
    setItem(KEYS.LOGBOOKS, logbooks);
  },
  addLogbook(entry: LogbookEntry): void {
    const list = this.getLogbooks();
    setItem(KEYS.LOGBOOKS, [entry, ...list]);
  },
  updateLogbook(updated: LogbookEntry): void {
    const list = this.getLogbooks().map(item => item.id === updated.id ? updated : item);
    setItem(KEYS.LOGBOOKS, list);
  },

  getTasks(): InternshipTask[] {
    return getItem(KEYS.TASKS, initialTasks);
  },
  saveTasks(tasks: InternshipTask[]): void {
    setItem(KEYS.TASKS, tasks);
  },
  addTask(task: InternshipTask): void {
    const list = this.getTasks();
    setItem(KEYS.TASKS, [task, ...list]);
  },
  updateTask(updated: InternshipTask): void {
    const list = this.getTasks().map(item => item.id === updated.id ? updated : item);
    setItem(KEYS.TASKS, list);
  },

  getApplications(): VacancyApplication[] {
    return getItem(KEYS.APPLICATIONS, initialApplications);
  },
  saveApplications(apps: VacancyApplication[]): void {
    setItem(KEYS.APPLICATIONS, apps);
  },
  addApplication(app: VacancyApplication): void {
    const list = this.getApplications();
    setItem(KEYS.APPLICATIONS, [app, ...list]);
  },
  updateApplicationStatus(appId: string, status: VacancyApplication['status'], feedbackNote?: string): void {
    const list = this.getApplications().map(app => {
      if (app.id === appId) {
        return { ...app, status, feedbackNote: feedbackNote || app.feedbackNote };
      }
      return app;
    });
    setItem(KEYS.APPLICATIONS, list);
  },

  getEvaluation(): FinalEvaluation {
    return getItem(KEYS.EVALUATION, initialEvaluation);
  },
  saveEvaluation(evaluation: FinalEvaluation): void {
    setItem(KEYS.EVALUATION, evaluation);
  },

  resetToDefaults(): void {
    localStorage.removeItem(KEYS.CURRENT_ROLE);
    localStorage.removeItem(KEYS.PROFILES);
    localStorage.removeItem(KEYS.VACANCIES);
    localStorage.removeItem(KEYS.ATTENDANCES);
    localStorage.removeItem(KEYS.LOGBOOKS);
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.APPLICATIONS);
    localStorage.removeItem(KEYS.EVALUATION);
  },
};
