import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from './firebase';
import {
  AttendanceRecord,
  LogbookEntry,
  InternshipTask,
  VacancyApplication,
  FinalEvaluation,
  UserProfile,
} from '../types';

export const firestoreSync = {
  async saveUserProfile(profile: UserProfile): Promise<void> {
    const path = `users/${profile.id}`;
    try {
      await setDoc(doc(db, 'users', profile.id), profile, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveAttendance(record: AttendanceRecord): Promise<void> {
    const path = `attendances/${record.id}`;
    try {
      await setDoc(doc(db, 'attendances', record.id), record, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveLogbook(entry: LogbookEntry): Promise<void> {
    const path = `logbooks/${entry.id}`;
    try {
      await setDoc(doc(db, 'logbooks', entry.id), entry, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveTask(task: InternshipTask): Promise<void> {
    const path = `tasks/${task.id}`;
    try {
      await setDoc(doc(db, 'tasks', task.id), task, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveApplication(app: VacancyApplication): Promise<void> {
    const path = `applications/${app.id}`;
    try {
      await setDoc(doc(db, 'applications', app.id), app, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveEvaluation(evaluation: FinalEvaluation): Promise<void> {
    const path = `evaluations/${evaluation.studentId}`;
    try {
      await setDoc(doc(db, 'evaluations', evaluation.studentId), evaluation, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Mengatur real-time listeners untuk sinkronisasi cloud Firestore
   */
  subscribeCloudUpdates(callbacks: {
    onAttendances?: (data: AttendanceRecord[]) => void;
    onLogbooks?: (data: LogbookEntry[]) => void;
    onTasks?: (data: InternshipTask[]) => void;
    onApplications?: (data: VacancyApplication[]) => void;
  }): () => void {
    const unsubscribes: (() => void)[] = [];

    // Only subscribe if authenticated to prevent permission errors
    if (!auth.currentUser) {
      return () => {};
    }

    try {
      if (callbacks.onAttendances) {
        const unsub = onSnapshot(
          collection(db, 'attendances'),
          (snapshot) => {
            if (!snapshot.empty) {
              const items = snapshot.docs.map((d) => d.data() as AttendanceRecord);
              callbacks.onAttendances?.(items);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'attendances');
          }
        );
        unsubscribes.push(unsub);
      }

      if (callbacks.onLogbooks) {
        const unsub = onSnapshot(
          collection(db, 'logbooks'),
          (snapshot) => {
            if (!snapshot.empty) {
              const items = snapshot.docs.map((d) => d.data() as LogbookEntry);
              callbacks.onLogbooks?.(items);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'logbooks');
          }
        );
        unsubscribes.push(unsub);
      }

      if (callbacks.onTasks) {
        const unsub = onSnapshot(
          collection(db, 'tasks'),
          (snapshot) => {
            if (!snapshot.empty) {
              const items = snapshot.docs.map((d) => d.data() as InternshipTask);
              callbacks.onTasks?.(items);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'tasks');
          }
        );
        unsubscribes.push(unsub);
      }
    } catch (e) {
      console.warn('Subscription setup warning:', e);
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  },
};
