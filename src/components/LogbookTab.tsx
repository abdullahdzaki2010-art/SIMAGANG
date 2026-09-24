import React, { useState } from 'react';
import { LogbookEntry, UserRole, UserProfile } from '../types';
import {
  FileText,
  Plus,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
} from 'lucide-react';

interface LogbookTabProps {
  currentRole: UserRole;
  profile: UserProfile;
  logbooks: LogbookEntry[];
  onOpenLogbookModal: () => void;
  onApproveLogbook: (id: string, feedback?: string) => void;
  onRequestRevision: (id: string, feedback: string) => void;
}

export const LogbookTab: React.FC<LogbookTabProps> = ({
  currentRole,
  profile,
  logbooks,
  onOpenLogbookModal,
  onApproveLogbook,
  onRequestRevision,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(logbooks[0]?.id || null);
  const [feedbackInput, setFeedbackInput] = useState<{ [key: string]: string }>({});

  const filteredLogbooks = logbooks.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFeedbackChange = (id: string, text: string) => {
    setFeedbackInput((prev) => ({ ...prev, [id]: text }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Logbook & Jurnal Kegiatan Magang (PKL)
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Dokumentasi Resmi Aktivitas Harian</span>
            <span aria-hidden="true">·</span>
            <span>Wajib Diisi Setiap Hari Kerja</span>
            <span aria-hidden="true">·</span>
            <span>Ditinjau Pembimbing Industri</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentRole === 'student' && (
            <button
              onClick={onOpenLogbookModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tulis Jurnal Baru (Didukung AI)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua ({logbooks.length})
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'approved'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Disetujui ({logbooks.filter((l) => l.status === 'approved').length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Menunggu Review ({logbooks.filter((l) => l.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveFilter('revision_requested')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'revision_requested'
                ? 'bg-rose-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Perlu Revisi ({logbooks.filter((l) => l.status === 'revision_requested').length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Format Baku Standar Kampus Merdeka & SMK Vokasi</span>
        </div>
      </div>

      {/* Logbook Entries Feed */}
      <div className="space-y-4">
        {filteredLogbooks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800 text-sm">Tidak Ada Jurnal Pada Kategori Ini</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Silakan tulis kegiatan harian Anda atau pilih filter status yang lain.
            </p>
            {currentRole === 'student' && (
              <button
                onClick={onOpenLogbookModal}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Tulis Jurnal Sekarang
              </button>
            )}
          </div>
        ) : (
          filteredLogbooks.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                {/* Entry Card Header */}
                <div
                  onClick={() => toggleExpand(entry.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{entry.date}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{entry.startTime} – {entry.endTime} WIB</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-indigo-700">{entry.category}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {entry.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-2xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                        entry.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : entry.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : entry.status === 'revision_requested'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {entry.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                      {entry.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                      {entry.status === 'revision_requested' && <RotateCcw className="w-3 h-3" />}
                      <span>
                        {entry.status === 'approved'
                          ? 'Disetujui Mentor'
                          : entry.status === 'pending'
                          ? 'Menunggu Review'
                          : entry.status === 'revision_requested'
                          ? 'Perlu Revisi'
                          : 'Draf'}
                      </span>
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                    {/* Activity Description */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1.5">Deskripsi Rincian Pekerjaan:</h4>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                        {entry.description}
                      </p>
                    </div>

                    {/* Obstacles & Solution Grid */}
                    {(entry.obstacles || entry.solution) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {entry.obstacles && (
                          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                            <h5 className="font-semibold text-amber-900 mb-1">Kendala / Hambatan:</h5>
                            <p className="text-amber-800 leading-relaxed">{entry.obstacles}</p>
                          </div>
                        )}
                        {entry.solution && (
                          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <h5 className="font-semibold text-emerald-900 mb-1">Solusi / Tindakan Nyata:</h5>
                            <p className="text-emerald-800 leading-relaxed">{entry.solution}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Deliverable link */}
                    {entry.outputUrl && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold">Bukti Luaran / Tautan Repositori:</span>
                        <a
                          href={entry.outputUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 underline"
                        >
                          <span>{entry.outputUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Mentor Feedback Box */}
                    {entry.mentorFeedback && (
                      <div className="p-3.5 bg-indigo-50/60 rounded-lg border border-indigo-100">
                        <div className="flex items-center justify-between text-indigo-900 font-semibold mb-1">
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Catatan & Masukan Pembimbing Industri (Mentor)</span>
                          </span>
                          {entry.reviewedAt && (
                            <span className="text-2xs font-normal text-indigo-700">{entry.reviewedAt}</span>
                          )}
                        </div>
                        <p className="text-indigo-900 leading-relaxed">{entry.mentorFeedback}</p>
                      </div>
                    )}

                    {/* Mentor Review Action Bar */}
                    {currentRole === 'mentor' && (
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <h4 className="font-semibold text-slate-800">Form Verifikasi Mentor:</h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Tuliskan catatan apresiasi atau poin koreksi untuk peserta..."
                            value={feedbackInput[entry.id] || ''}
                            onChange={(e) => handleFeedbackChange(entry.id, e.target.value)}
                            className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-indigo-500"
                          />
                          <button
                            onClick={() => {
                              onApproveLogbook(entry.id, feedbackInput[entry.id] || 'Jurnal disetujui tanpa catatan.');
                              setFeedbackInput((prev) => ({ ...prev, [entry.id]: '' }));
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Setujui Jurnal</span>
                          </button>
                          <button
                            onClick={() => {
                              const note = feedbackInput[entry.id] || 'Mohon lengkapi bagian kendala dan solusi pekerjaan.';
                              onRequestRevision(entry.id, note);
                              setFeedbackInput((prev) => ({ ...prev, [entry.id]: '' }));
                            }}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Minta Revisi</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
