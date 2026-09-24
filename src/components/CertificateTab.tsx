import React, { useState } from 'react';
import {
  UserProfile,
  FinalEvaluation,
  UserRole,
} from '../types';
import {
  Award,
  Printer,
  FileCheck2,
  CheckCircle,
  QrCode,
  ShieldCheck,
  Edit3,
  Save,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateTabProps {
  currentRole: UserRole;
  profile: UserProfile;
  evaluation: FinalEvaluation;
  onUpdateEvaluation: (evaluation: FinalEvaluation) => void;
}

export const CertificateTab: React.FC<CertificateTabProps> = ({
  currentRole,
  profile,
  evaluation,
  onUpdateEvaluation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'certificate' | 'transcript' | 'report'>('certificate');
  const [isEditing, setIsEditing] = useState(false);
  const [editableAspects, setEditableAspects] = useState(evaluation.aspects);
  const [generalFeedback, setGeneralFeedback] = useState(evaluation.generalFeedback);

  const calculateFinalScore = () => {
    let sum = 0;
    editableAspects.forEach((asp) => {
      sum += (asp.score * asp.weight) / 100;
    });
    return Math.round(sum * 10) / 10;
  };

  const finalScore = calculateFinalScore();

  const handleTriggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleSaveEvaluation = () => {
    const updated: FinalEvaluation = {
      ...evaluation,
      aspects: editableAspects,
      generalFeedback,
    };
    onUpdateEvaluation(updated);
    setIsEditing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 no-print">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Sertifikat & Penilaian Akhir Magang
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Nomor Seri: {evaluation.certificateNumber}</span>
            <span aria-hidden="true">·</span>
            <span>Nilai Akhir: {finalScore} ({evaluation.finalGradeLetter})</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">{evaluation.recommendation}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('certificate')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'certificate'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              e-Sertifikat
            </button>
            <button
              onClick={() => setActiveSubTab('transcript')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'transcript'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transkrip Nilai
            </button>
            <button
              onClick={() => setActiveSubTab('report')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === 'report'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Laporan Akhir
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: E-Sertifikat Magang */}
      {activeSubTab === 'certificate' && (
        <div className="space-y-4">
          <div className="flex justify-end no-print">
            <button
              onClick={handleTriggerConfetti}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              🎉 Rayakan Kelulusan Magang
            </button>
          </div>

          {/* Certificate Canvas / Container */}
          <div className="bg-gradient-to-br from-amber-50/50 via-white to-slate-50 p-6 sm:p-12 rounded-2xl border-4 border-double border-amber-600/40 shadow-lg text-center relative overflow-hidden max-w-4xl mx-auto">
            {/* Background Decorative Guilloche pattern */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-700/60" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-700/60" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-700/60" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-700/60" />

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Header Title */}
              <div>
                <div className="w-14 h-14 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Award className="w-8 h-8" />
                </div>
                <h1 className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
                  PT TELKOM INDONESIA (PERSERO) TBK
                </h1>
                <p className="text-2xs text-slate-500 tracking-wider uppercase mt-0.5">
                  DIVISI DIGITAL INNOVATION & ECOSYSTEM
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mt-3">
                  SERTIFIKAT KELULUSAN MAGANG
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Nomor Sertifikat: {evaluation.certificateNumber}
                </p>
              </div>

              {/* Recipient Details */}
              <div className="space-y-2 py-4 border-y border-amber-200/60">
                <p className="text-xs text-slate-600 italic">Diberikan secara terhormat kepada:</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {profile.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {profile.major} · {profile.institution}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Nomor Induk Mahasiswa / Siswa: {profile.studentId}
                </p>
              </div>

              {/* Statement */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl mx-auto">
                Telah menyelesaikan seluruh program Praktik Kerja Lapangan (PKL) / Magang Industri sebagai{' '}
                <span className="font-bold text-slate-900">{profile.internshipRole}</span> selama 3 (tiga) bulan penuh, terhitung sejak tanggal{' '}
                <span className="font-semibold text-slate-900">1 Juli 2026</span> sampai dengan{' '}
                <span className="font-semibold text-slate-900">30 September 2026</span> dengan predikat kompetensi:
              </p>

              <div className="inline-block px-6 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-base font-bold tracking-wide shadow-2xs">
                SANGAT BAIK (NILAI: {finalScore} / {evaluation.finalGradeLetter})
              </div>

              {/* Signatures & Verification */}
              <div className="grid grid-cols-3 gap-4 pt-6 items-end text-xs">
                <div className="space-y-1">
                  <p className="text-2xs text-slate-500">Jakarta, 30 September 2026</p>
                  <div className="h-12 flex items-center justify-center font-serif italic text-base text-slate-700">
                    Dimas Arya P.
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <p className="font-bold text-slate-900 text-2xs">{evaluation.mentorName}</p>
                    <p className="text-3xs text-slate-500">Pembimbing Industri (Tech Lead)</p>
                  </div>
                </div>

                {/* QR Code Validation Center */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-16 h-16 bg-white border border-slate-300 p-1 rounded-md shadow-2xs flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <span className="text-3xs text-slate-400 font-mono">Verifikasi Resmi Kemdikbud / Mitra</span>
                </div>

                <div className="space-y-1">
                  <p className="text-2xs text-slate-500">Mengetahui Pembimbing,</p>
                  <div className="h-12 flex items-center justify-center font-serif italic text-base text-slate-700">
                    Dr. Budi Santoso
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <p className="font-bold text-slate-900 text-2xs">{evaluation.teacherName}</p>
                    <p className="text-3xs text-slate-500">Dosen Pembimbing Akademik</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Transkrip Nilai & Rubrik Penilaian */}
      {activeSubTab === 'transcript' && (
        <div className="space-y-5 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Transkrip Rubrik Penilaian Kompetensi</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standar Penilaian Capaian Pembelajaran Magang Industri
                </p>
              </div>

              {(currentRole === 'mentor' || currentRole === 'teacher') && (
                <div>
                  {isEditing ? (
                    <button
                      onClick={handleSaveEvaluation}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Nilai</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah Nilai / Catatan</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Rubric Aspects Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 font-semibold text-slate-800 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Aspek Penilaian Kompetensi</th>
                    <th className="py-3 px-4 w-24 text-center">Bobot</th>
                    <th className="py-3 px-4 w-28 text-center">Nilai (0-100)</th>
                    <th className="py-3 px-4 w-28 text-right">Nilai Tertimbang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {editableAspects.map((asp, idx) => {
                    const weighted = Math.round(((asp.score * asp.weight) / 100) * 10) / 10;
                    return (
                      <tr key={asp.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{asp.name}</p>
                          <p className="text-2xs text-slate-500 mt-0.5">{asp.description}</p>
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600">
                          {asp.weight}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={asp.score}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setEditableAspects((prev) =>
                                  prev.map((a) => (a.id === asp.id ? { ...a, score: val } : a))
                                );
                              }}
                              className="w-16 text-center text-xs p-1 border border-slate-300 rounded font-bold"
                            />
                          ) : (
                            <span className="font-bold tabular-nums text-slate-900">{asp.score}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-indigo-700">
                          {weighted}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50/80 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={2} className="py-3.5 px-4 text-slate-900">Total Akumulasi Nilai Akhir:</td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">100%</td>
                    <td className="py-3.5 px-4 text-center text-emerald-700 font-extrabold text-sm">
                      {finalScore}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-700 font-extrabold text-sm">
                      {evaluation.finalGradeLetter} (Sangat Baik)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mentor Evaluative Feedback Note */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs">Ulasan Kualitatif Pembimbing Lapangan:</h4>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={generalFeedback}
                  onChange={(e) => setGeneralFeedback(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              ) : (
                <p className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                  "{generalFeedback}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Lembar Laporan Akhir Magang (Format Cetak Siap Sidang PKL) */}
      {activeSubTab === 'report' && (
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-800 text-xs leading-relaxed">
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <h2 className="text-base font-bold uppercase tracking-wide">
              LEMBAR PENGESAHAN LAPORAN PRAKTIK KERJA LAPANGAN (PKL)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              TAHUN AKADEMIK 2026 / PERIODE SEMESTER GENAP
            </p>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Judul Kegiatan:</span>
              <span className="col-span-2 font-bold text-slate-900">
                PENGEMBANGAN FITUR PORTAL DAN OPTIMASI PERFORMA WEB PADA PT TELKOM INDONESIA
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Nama Peserta Magang:</span>
              <span className="col-span-2 font-bold text-slate-900">{profile.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">NIM / NISN:</span>
              <span className="col-span-2 font-mono text-slate-900">{profile.studentId}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Jurusan / Program Studi:</span>
              <span className="col-span-2 text-slate-900">{profile.major}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Instansi Pendidikan:</span>
              <span className="col-span-2 text-slate-900">{profile.institution}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-slate-600">Perusahaan Mitra:</span>
              <span className="col-span-2 text-slate-900">{profile.companyName}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Ringkasan Eksekutif Hasil Kegiatan:</h3>
            <p className="text-justify">
              Praktik Kerja Lapangan (PKL) ini dilaksanakan selama 3 bulan di divisi Digital Innovation PT Telkom Indonesia. Selama masa penugasan, mahasiswa berhasil mengimplementasikan arsitektur frontend berbasis React, merancang sistem validasi data interaktif, dan memangkas waktu load time antarmuka pengguna hingga 35%. Seluruh target jam kerja sebesar 720 jam telah terpenuhi dengan tingkat kehadiran 97.8%.
            </p>
          </div>

          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="text-slate-500 mb-12">Menyetujui, Pembimbing Lapangan</p>
              <p className="font-bold text-slate-900 underline">{evaluation.mentorName}</p>
              <p className="text-2xs text-slate-500">Senior Engineering Lead PT Telkom</p>
            </div>
            <div>
              <p className="text-slate-500 mb-12">Mengetahui, Dosen Pembimbing</p>
              <p className="font-bold text-slate-900 underline">{evaluation.teacherName}</p>
              <p className="text-2xs text-slate-500">Koordinator Program Magang Kampus</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
