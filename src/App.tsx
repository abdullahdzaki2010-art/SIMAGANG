import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { AttendanceTab } from './components/AttendanceTab';
import { LogbookTab } from './components/LogbookTab';
import { TasksTab } from './components/TasksTab';
import { VacanciesTab } from './components/VacanciesTab';
import { CertificateTab } from './components/CertificateTab';

import { AttendanceModal } from './components/modals/AttendanceModal';
import { AddLogbookModal } from './components/modals/AddLogbookModal';
import { AddTaskModal } from './components/modals/AddTaskModal';

import { storageService } from './services/storageService';
import { auth } from './services/firebase';
import { firestoreSync } from './services/firestoreSync';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import {
  UserRole,
  UserProfile,
  AttendanceRecord,
  LogbookEntry,
  InternshipTask,
  InternshipVacancy,
  VacancyApplication,
  FinalEvaluation,
} from './types';

export default function App() {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const [profiles, setProfiles] = useState<Record<UserRole, UserProfile>>(() =>
    storageService.getProfiles()
  );
  const [attendances, setAttendances] = useState<AttendanceRecord[]>(() =>
    storageService.getAttendances()
  );
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>(() =>
    storageService.getLogbooks()
  );
  const [tasks, setTasks] = useState<InternshipTask[]>(() =>
    storageService.getTasks()
  );
  const [vacancies, setVacancies] = useState<InternshipVacancy[]>(() =>
    storageService.getVacancies()
  );
  const [applications, setApplications] = useState<VacancyApplication[]>(() =>
    storageService.getApplications()
  );
  const [evaluation, setEvaluation] = useState<FinalEvaluation>(() =>
    storageService.getEvaluation()
  );

  // Modal controls
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isLogbookModalOpen, setIsLogbookModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    const savedRole = storageService.getCurrentRole();
    setCurrentRoleState(savedRole);

    // Listen to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        showToast(`Tersambung ke Firebase: ${user.displayName || user.email}`);
        // Save user profile to Firestore
        firestoreSync.saveUserProfile({
          id: user.uid,
          name: user.displayName || 'Pengguna SiMagang',
          email: user.email || '',
          role: currentRole,
          avatar: user.photoURL || profiles[currentRole].avatar,
          institution: profiles[currentRole].institution,
          major: profiles[currentRole].major,
          studentId: profiles[currentRole].studentId,
          phone: '0812-3456-7890',
          companyName: profiles[currentRole].companyName,
          internshipRole: profiles[currentRole].internshipRole,
        }).catch(() => {
          // ignore or handle
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore real-time updates when user is authenticated
  useEffect(() => {
    if (!firebaseUser) return;

    const unsubscribeCloud = firestoreSync.subscribeCloudUpdates({
      onAttendances: (cloudAttendances) => {
        if (cloudAttendances.length > 0) {
          setAttendances(cloudAttendances);
          storageService.saveAttendances(cloudAttendances);
        }
      },
      onLogbooks: (cloudLogbooks) => {
        if (cloudLogbooks.length > 0) {
          setLogbooks(cloudLogbooks);
          storageService.saveLogbooks(cloudLogbooks);
        }
      },
      onTasks: (cloudTasks) => {
        if (cloudTasks.length > 0) {
          setTasks(cloudTasks);
          storageService.saveTasks(cloudTasks);
        }
      },
    });

    return () => unsubscribeCloud();
  }, [firebaseUser]);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRoleState(newRole);
    storageService.setCurrentRole(newRole);
    const roleLabel =
      newRole === 'student'
        ? 'Peserta Magang (Mahasiswa/SMK)'
        : newRole === 'mentor'
        ? 'Mentor Industri (Pembimbing Lapangan PT Telkom)'
        : 'Dosen / Guru Pembimbing Akademik';
    showToast(`Beralih ke mode: ${roleLabel}`);
  };

  // Handlers for Attendance
  const handleSubmitAttendance = (record: AttendanceRecord) => {
    storageService.addAttendance(record);
    setAttendances(storageService.getAttendances());
    firestoreSync.saveAttendance(record).catch(() => {});
    showToast('Presensi berhasil disimpan ke Cloud Firestore.');
  };

  const handleVerifyAttendance = (id: string) => {
    const updated = attendances.map((a) =>
      a.id === id ? { ...a, verifiedByMentor: true } : a
    );
    storageService.saveAttendances(updated);
    setAttendances(updated);
    const target = updated.find((a) => a.id === id);
    if (target) {
      firestoreSync.saveAttendance(target).catch(() => {});
    }
    showToast('Presensi siswa berhasil divalidasi dan tersinkron.');
  };

  // Handlers for Logbook
  const handleSubmitLogbook = (entry: LogbookEntry) => {
    storageService.addLogbook(entry);
    setLogbooks(storageService.getLogbooks());
    firestoreSync.saveLogbook(entry).catch(() => {});
    showToast('Jurnal harian berhasil dikirim ke Cloud Firestore.');
  };

  const handleApproveLogbook = (id: string, feedback?: string) => {
    const target = logbooks.find((l) => l.id === id);
    if (!target) return;
    const updated: LogbookEntry = {
      ...target,
      status: 'approved',
      mentorFeedback: feedback || 'Jurnal harian telah diverifikasi dan disetujui.',
      reviewedAt: '2026-09-23 17:45',
    };
    storageService.updateLogbook(updated);
    setLogbooks(storageService.getLogbooks());
    firestoreSync.saveLogbook(updated).catch(() => {});
    showToast('Jurnal harian disetujui & diperbarui di Firestore.');
  };

  const handleRequestRevision = (id: string, feedback: string) => {
    const target = logbooks.find((l) => l.id === id);
    if (!target) return;
    const updated: LogbookEntry = {
      ...target,
      status: 'revision_requested',
      mentorFeedback: feedback,
      reviewedAt: '2026-09-23 17:45',
    };
    storageService.updateLogbook(updated);
    setLogbooks(storageService.getLogbooks());
    firestoreSync.saveLogbook(updated).catch(() => {});
    showToast('Permintaan revisi jurnal terkirim ke cloud.');
  };

  // Handlers for Tasks
  const handleUpdateTask = (task: InternshipTask) => {
    storageService.updateTask(task);
    setTasks(storageService.getTasks());
    firestoreSync.saveTask(task).catch(() => {});
    showToast('Progres tugas berhasil disinkronkan ke Cloud Firestore.');
  };

  const handleAddTask = (task: InternshipTask) => {
    storageService.addTask(task);
    setTasks(storageService.getTasks());
    firestoreSync.saveTask(task).catch(() => {});
    showToast('Tugas proyek baru berhasil diterbitkan ke Firestore.');
  };

  // Handlers for Vacancy Application
  const handleApplyVacancy = (app: VacancyApplication) => {
    storageService.addApplication(app);
    setApplications(storageService.getApplications());
    firestoreSync.saveApplication(app).catch(() => {});
    showToast('Lamaran magang berhasil dikirim ke Firestore.');
  };

  // Handlers for Evaluation
  const handleUpdateEvaluation = (evalData: FinalEvaluation) => {
    storageService.saveEvaluation(evalData);
    setEvaluation(evalData);
    firestoreSync.saveEvaluation(evalData).catch(() => {});
    showToast('Nilai dan evaluasi magang tersimpan di Cloud.');
  };

  const currentProfile = profiles[currentRole];
  const todayRecord = attendances.find((a) => a.date === '2026-09-23');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract with Firebase Auth & Role Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        profile={currentProfile}
        firebaseUser={firebaseUser}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 no-print">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            currentRole={currentRole}
            profile={currentProfile}
            attendances={attendances}
            logbooks={logbooks}
            tasks={tasks}
            onOpenAttendanceModal={() => setIsAttendanceModalOpen(true)}
            onOpenLogbookModal={() => setIsLogbookModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab
            currentRole={currentRole}
            profile={currentProfile}
            attendances={attendances}
            onOpenAttendanceModal={() => setIsAttendanceModalOpen(true)}
            onVerifyAttendance={handleVerifyAttendance}
          />
        )}

        {activeTab === 'logbook' && (
          <LogbookTab
            currentRole={currentRole}
            profile={currentProfile}
            logbooks={logbooks}
            onOpenLogbookModal={() => setIsLogbookModalOpen(true)}
            onApproveLogbook={handleApproveLogbook}
            onRequestRevision={handleRequestRevision}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksTab
            currentRole={currentRole}
            profile={currentProfile}
            tasks={tasks}
            onOpenAddTaskModal={() => setIsAddTaskModalOpen(true)}
            onUpdateTask={handleUpdateTask}
          />
        )}

        {activeTab === 'vacancies' && (
          <VacanciesTab
            currentRole={currentRole}
            profile={currentProfile}
            vacancies={vacancies}
            applications={applications}
            onApplyVacancy={handleApplyVacancy}
          />
        )}

        {activeTab === 'certificate' && (
          <CertificateTab
            currentRole={currentRole}
            profile={currentProfile}
            evaluation={evaluation}
            onUpdateEvaluation={handleUpdateEvaluation}
          />
        )}
      </main>

      {/* Interactive Modals */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSubmitAttendance={handleSubmitAttendance}
        studentId={profiles.student.id}
        existingTodayRecord={todayRecord}
      />

      <AddLogbookModal
        isOpen={isLogbookModalOpen}
        onClose={() => setIsLogbookModalOpen(false)}
        onSubmitLogbook={handleSubmitLogbook}
        profile={profiles.student}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmitTask={handleAddTask}
        mentorName={profiles.mentor.name}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SiMagang</span>
            <span aria-hidden="true">·</span>
            <span>Cloud Firestore Sync & Google Authentication Ready</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Standar Kurikulum Vokasi SMK & Kampus Merdeka</span>
            <span aria-hidden="true">·</span>
            <span>Versi Akademik 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
