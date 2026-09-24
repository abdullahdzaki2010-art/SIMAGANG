import React, { useState } from 'react';
import { InternshipTask, TaskPriority } from '../../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTask: (task: InternshipTask) => void;
  mentorName: string;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmitTask,
  mentorName,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-10-05');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask: InternshipTask = {
      id: `tsk_${Date.now()}`,
      title,
      description,
      assignedTo: 'usr_mhs_001',
      assignedBy: mentorName,
      deadline,
      status: 'todo',
      priority,
      createdAt: '2026-09-23',
    };

    onSubmitTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in-50">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Beri Tugas Magang Baru</h3>
            <p className="text-xs text-slate-500">
              Tugaskan deliverable atau milestone proyek kepada peserta magang
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Judul Tugas / Proyek:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Slicing Halaman Dashboard Analytics & Integrasi API"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tingkat Prioritas:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
              >
                <option value="low">Rendah (Low)</option>
                <option value="medium">Sedang (Medium)</option>
                <option value="high">Tinggi (High / Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Batas Waktu (Deadline):</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Instruksi & Kriteria Penyelesaian:</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan petunjuk pengerjaan, spesifikasi teknis, tautan referensi, atau Acceptance Criteria..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 leading-relaxed"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Terbitkan Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
