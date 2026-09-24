import React, { useState } from 'react';
import { InternshipTask, UserRole, UserProfile } from '../types';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Award,
  AlertTriangle,
  Send,
  MessageSquare,
} from 'lucide-react';

interface TasksTabProps {
  currentRole: UserRole;
  profile: UserProfile;
  tasks: InternshipTask[];
  onOpenAddTaskModal: () => void;
  onUpdateTask: (task: InternshipTask) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  currentRole,
  profile,
  tasks,
  onOpenAddTaskModal,
  onUpdateTask,
}) => {
  const [selectedTask, setSelectedTask] = useState<InternshipTask | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [mentorScore, setMentorScore] = useState<number>(90);
  const [mentorComment, setMentorComment] = useState('');

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  const handleOpenDetail = (task: InternshipTask) => {
    setSelectedTask(task);
    setSubmissionNotes(task.submissionNotes || '');
    setSubmissionLink(task.submissionLink || '');
    setMentorScore(task.mentorScore || 90);
    setMentorComment(task.mentorComment || '');
  };

  const handleSaveStudentSubmission = () => {
    if (!selectedTask) return;
    const updated: InternshipTask = {
      ...selectedTask,
      submissionNotes,
      submissionLink,
      status: 'done',
    };
    onUpdateTask(updated);
    setSelectedTask(null);
  };

  const handleSaveMentorGrading = () => {
    if (!selectedTask) return;
    const updated: InternshipTask = {
      ...selectedTask,
      mentorScore,
      mentorComment,
    };
    onUpdateTask(updated);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Tugas & Proyek Magang
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Manajemen Deliverable Kerja Praktik</span>
            <span aria-hidden="true">·</span>
            <span>Ditugaskan Langsung oleh Pembimbing Lapangan</span>
          </div>
        </div>

        {currentRole === 'mentor' && (
          <button
            onClick={onOpenAddTaskModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Tugas Proyek Baru</span>
          </button>
        )}
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: To Do */}
        <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Belum Dikerjakan</span>
            </h3>
            <span className="text-xs font-semibold tabular-nums text-slate-500 px-2 py-0.5 bg-white rounded border border-slate-200">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {todoTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">Tidak ada tugas baru.</p>
            ) : (
              todoTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleOpenDetail(task)}
                  className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-2xs font-semibold px-2 py-0.5 rounded capitalize ${
                        task.priority === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="text-2xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{task.deadline}</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{task.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
                    <span>Mentor: {task.assignedBy}</span>
                    <span className="text-indigo-600 font-semibold">Klik Detail →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Sedang Dikerjakan</span>
            </h3>
            <span className="text-xs font-semibold tabular-nums text-indigo-700 px-2 py-0.5 bg-white rounded border border-indigo-200">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {inProgressTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">Tidak ada tugas berjalan.</p>
            ) : (
              inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleOpenDetail(task)}
                  className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-2xs font-semibold px-2 py-0.5 rounded capitalize ${
                        task.priority === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="text-2xs font-medium text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Batas: {task.deadline}</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{task.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs">
                    <span className="text-slate-400">Progres Aktif</span>
                    <span className="text-indigo-600 font-semibold">Kirim Hasil Tugas →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Done */}
        <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Selesai & Dinilai</span>
            </h3>
            <span className="text-xs font-semibold tabular-nums text-emerald-700 px-2 py-0.5 bg-white rounded border border-emerald-200">
              {doneTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {doneTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">Belum ada tugas selesai.</p>
            ) : (
              doneTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleOpenDetail(task)}
                  className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      Selesai
                    </span>
                    {task.mentorScore && (
                      <span className="text-xs font-bold tabular-nums text-emerald-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Nilai: {task.mentorScore}/100</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{task.title}</h4>
                  {task.mentorComment && (
                    <p className="text-xs italic text-emerald-800 bg-emerald-50/60 p-2 rounded border border-emerald-100">
                      "{task.mentorComment}"
                    </p>
                  )}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
                    <span>Terverifikasi Mentor</span>
                    <span className="text-slate-600 font-medium">Buka Berkas →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in-50">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold uppercase text-indigo-700">{selectedTask.priority} Priority</span>
                  <span aria-hidden="true">·</span>
                  <span>Batas: {selectedTask.deadline}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{selectedTask.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Instruksi Pengerjaan:</h4>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-100 whitespace-pre-line leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              {/* Status Switcher for Student */}
              {currentRole === 'student' && selectedTask.status !== 'done' && (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                  <h4 className="font-semibold text-indigo-900">Form Pengumpulan Tugas Mahasiswa:</h4>
                  <div>
                    <label className="block text-2xs font-semibold text-slate-700 mb-1">
                      Catatan Penjelasan Hasil Kerja:
                    </label>
                    <textarea
                      rows={3}
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      placeholder="Jelaskan apa saja yang telah dikerjakan, file yang dimodifikasi, dan hasil akhir..."
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-semibold text-slate-700 mb-1">
                      Tautan Bukti Hasil (Github / Figma / Google Drive):
                    </label>
                    <input
                      type="url"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={handleSaveStudentSubmission}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim & Tandai Selesai</span>
                  </button>
                </div>
              )}

              {/* Already Submitted View */}
              {selectedTask.submissionNotes && (
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 space-y-1.5">
                  <h4 className="font-semibold text-emerald-900">Hasil Pengumpulan Mahasiswa:</h4>
                  <p className="text-emerald-800">{selectedTask.submissionNotes}</p>
                  {selectedTask.submissionLink && (
                    <a
                      href={selectedTask.submissionLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
                    >
                      <span>Buka Tautan Tugas</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Mentor Grading Section */}
              {currentRole === 'mentor' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-semibold text-slate-900">Penilaian Mentor Industri:</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-28">
                      <label className="block text-2xs font-semibold text-slate-700 mb-1">Nilai (0-100):</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={mentorScore}
                        onChange={(e) => setMentorScore(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold tabular-nums"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-2xs font-semibold text-slate-700 mb-1">Ulasan / Feedback Singkat:</label>
                      <input
                        type="text"
                        value={mentorComment}
                        onChange={(e) => setMentorComment(e.target.value)}
                        placeholder="Contoh: Kode rapi, penanganan error sangat baik..."
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveMentorGrading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Simpan Nilai & Evaluasi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
