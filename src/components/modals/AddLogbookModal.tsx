import React, { useState } from 'react';
import { LogbookEntry, UserProfile } from '../../types';
import {
  FileText,
  Sparkles,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { aiService } from '../../services/aiService';

interface AddLogbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLogbook: (entry: LogbookEntry) => void;
  profile: UserProfile;
}

export const AddLogbookModal: React.FC<AddLogbookModalProps> = ({
  isOpen,
  onClose,
  onSubmitLogbook,
  profile,
}) => {
  const [date, setDate] = useState('2026-09-23');
  const [category, setCategory] = useState<LogbookEntry['category']>('Pengembangan Perangkat Lunak');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('17:00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [solution, setSolution] = useState('');
  const [outputUrl, setOutputUrl] = useState('');

  // AI Assistance states
  const [bulletDraft, setBulletDraft] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuccessNote, setAiSuccessNote] = useState(false);

  if (!isOpen) return null;

  const handleGenerateWithAI = async () => {
    if (!bulletDraft.trim()) return;
    setIsGeneratingAI(true);
    setAiSuccessNote(false);
    try {
      const result = await aiService.polishLogbook({
        bulletPoints: bulletDraft,
        category,
        role: profile.internshipRole || 'Peserta Magang',
        company: profile.companyName || 'Instansi Mitra',
      });

      setTitle(result.title);
      setDescription(result.description);
      setObstacles(result.obstacles);
      setSolution(result.solution);
      setAiSuccessNote(true);
    } catch (err) {
      console.error('Error generating logbook:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newEntry: LogbookEntry = {
      id: `log_${Date.now()}`,
      studentId: profile.id,
      date,
      category,
      startTime,
      endTime,
      title,
      description,
      obstacles: obstacles || 'Tidak ada hambatan berarti selama proses pengerjaan.',
      solution: solution || 'Tugas diselesaikan sesuai instruksi dan standar kerja.',
      outputUrl: outputUrl || undefined,
      status: 'pending',
    };

    onSubmitLogbook(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in-50">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tulis Jurnal Harian Magang (PKL)</h3>
            <p className="text-xs text-slate-500">
              Dokumentasikan aktivitas teknis harian Anda untuk ditinjau oleh mentor
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* AI Generator Helper Banner */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-xl border border-indigo-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Bantuan AI: Susun Narasi Logbook Formal Baku</span>
            </span>
            <span className="text-2xs font-semibold px-2 py-0.5 bg-indigo-200/60 text-indigo-800 rounded">
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Tulis poin-poin kasar atau coretan aktivitas Anda di bawah ini, lalu klik tombol AI untuk otomatis menyusun judul, deskripsi baku, kendala, dan solusinya:
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={bulletDraft}
              onChange={(e) => setBulletDraft(e.target.value)}
              placeholder="Contoh: bikin validasi formulir login, slicing halaman profil di figma, diskusi bareng kak dimas..."
              className="flex-1 text-xs px-3 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-hidden focus:border-indigo-500 shadow-2xs"
            />
            <button
              type="button"
              disabled={isGeneratingAI || !bulletDraft.trim()}
              onClick={handleGenerateWithAI}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyusun...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Jurnal Baku</span>
                </>
              )}
            </button>
          </div>

          {aiSuccessNote && (
            <p className="text-2xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Narasi formal berhasil digenerate! Anda dapat menyesuaikan kembali teks di bawah.</span>
            </p>
          )}
        </div>

        {/* Main Logbook Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Kegiatan:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Mulai:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Selesai:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kategori Aktivitas:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 font-medium"
            >
              <option value="Pengembangan Perangkat Lunak">Pengembangan Perangkat Lunak (Software Dev)</option>
              <option value="Desain UI/UX">Desain UI/UX & Prototyping</option>
              <option value="Riset & Analisis">Riset, Data & Analisis Bisnis</option>
              <option value="Pertemuan & Diskusi">Pertemuan, Standup & Diskusi Tim</option>
              <option value="Dokumentasi & Testing">Dokumentasi, QA & Testing</option>
              <option value="Operasional">Operasional & Pendukung Kantor</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Judul Ringkas Kegiatan:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Implementasi Komponen Formulir Autentikasi dan Validasi Data"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Uraian Rincian Pekerjaan:</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara rinci apa yang Anda kerjakan, tools yang digunakan, dan tahapan pelaksanaannya..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kendala / Masalah yang Dihadapi:</label>
              <textarea
                rows={2}
                value={obstacles}
                onChange={(e) => setObstacles(e.target.value)}
                placeholder="Contoh: Error saat build aset atau dependensi versi lama..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Solusi / Penanganan Kendala:</label>
              <textarea
                rows={2}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Contoh: Mengupdate konfigurasi package.json dan berkonsultasi dengan mentor..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tautan Bukti Hasil Kerja (GitHub PR / Figma / Drive - Opsional):
            </label>
            <input
              type="url"
              value={outputUrl}
              onChange={(e) => setOutputUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
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
              Simpan & Ajukan Jurnal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
