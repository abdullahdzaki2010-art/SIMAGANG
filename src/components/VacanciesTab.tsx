import React, { useState } from 'react';
import {
  InternshipVacancy,
  VacancyApplication,
  UserProfile,
  UserRole,
} from '../types';
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Coins,
  Send,
  Building2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { aiService } from '../services/aiService';

interface VacanciesTabProps {
  currentRole: UserRole;
  profile: UserProfile;
  vacancies: InternshipVacancy[];
  applications: VacancyApplication[];
  onApplyVacancy: (application: VacancyApplication) => void;
}

export const VacanciesTab: React.FC<VacanciesTabProps> = ({
  currentRole,
  profile,
  vacancies,
  applications,
  onApplyVacancy,
}) => {
  const [viewMode, setViewMode] = useState<'browse' | 'my_applications'>('browse');
  const [selectedVacancy, setSelectedVacancy] = useState<InternshipVacancy | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Application form state
  const [applicantMajor, setApplicantMajor] = useState(profile.major);
  const [resumeSummary, setResumeSummary] = useState(
    'Memiliki pemahaman fundamental web development modern, terbiasa bekerja dengan tim, dan siap berkontribusi penuh waktu selama masa magang.'
  );
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/dzaki-pratama');
  const [coverLetter, setCoverLetter] = useState(
    'Saya sangat tertarik melamar posisi magang ini untuk menerapkan ilmu akademik serta memperluas wawasan praktik kerja di lingkungan industri profesional.'
  );
  const [aiReviewResult, setAiReviewResult] = useState<string | null>(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);

  const categories = [
    'Semua Kategori',
    'Teknologi & IT',
    'Desain & Kreatif',
    'Bisnis & Pemasaran',
    'Data & Keuangan',
    'Teknik & Mesin',
  ];

  const filteredVacancies = vacancies.filter((v) => {
    if (selectedCategory !== 'all' && selectedCategory !== 'Semua Kategori' && v.category !== selectedCategory) {
      return false;
    }
    if (selectedLevel !== 'all' && v.level !== selectedLevel && v.level !== 'Semua Jenjang') {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenApply = (vacancy: InternshipVacancy) => {
    setSelectedVacancy(vacancy);
    setIsApplyModalOpen(true);
    setAiReviewResult(null);
  };

  const handleAIReview = async () => {
    if (!selectedVacancy) return;
    setIsAnalyzingAI(true);
    try {
      const feedback = await aiService.reviewApplication(coverLetter, selectedVacancy.title);
      setAiReviewResult(feedback);
    } catch {
      setAiReviewResult('Pastikan Anda menjelaskan portofolio proyek yang relevan dan komitmen waktu magang.');
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy) return;

    const newApp: VacancyApplication = {
      id: `app_${Date.now()}`,
      vacancyId: selectedVacancy.id,
      studentId: profile.id,
      studentName: profile.name,
      studentMajor: applicantMajor,
      appliedDate: '2026-09-23',
      status: 'submitted',
      resumeSummary,
      portfolioUrl,
      coverLetter,
      feedbackNote: 'Lamaran berhasil diterima sistem rekrutmen mitra. Menunggu tinjauan HR/Mentor.',
    };

    onApplyVacancy(newApp);
    setIsApplyModalOpen(false);
    setViewMode('my_applications');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Lowongan Magang & Praktik Kerja Industri
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Mitra BUMN, Perusahaan Swasta, & Startup Terverifikasi</span>
            <span aria-hidden="true">·</span>
            <span>Uang Saku Bersertifikat</span>
          </div>
        </div>

        {/* Mode Segmented Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('browse')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'browse'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jelajahi Lowongan ({vacancies.length})
          </button>
          <button
            onClick={() => setViewMode('my_applications')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'my_applications'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lamaran Saya ({applications.length})
          </button>
        </div>
      </div>

      {viewMode === 'browse' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari posisi magang, nama perusahaan, atau kota (cth: Frontend, Telkom, Jakarta)..."
                  className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Jenjang Filter */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
                <span className="text-slate-400">Jenjang:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="all">Semua Jenjang</option>
                  <option value="SMK">Khusus SMK</option>
                  <option value="D3/D4">D3 / D4</option>
                  <option value="S1">S1 / Sarjana</option>
                </select>
              </div>
            </div>

            {/* Category Pills/Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
              {categories.map((cat) => {
                const isSelected =
                  (selectedCategory === 'all' && cat === 'Semua Kategori') || selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'Semua Kategori' ? 'all' : cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vacancies Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVacancies.map((vacancy) => {
              const hasApplied = applications.some((a) => a.vacancyId === vacancy.id);
              return (
                <div
                  key={vacancy.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header line with logo & company */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                          {vacancy.logo}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {vacancy.title}
                          </h3>
                          <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold">{vacancy.company}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-2xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                        {vacancy.workType}
                      </span>
                    </div>

                    {/* Unboxed Zero-Pill Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{vacancy.location}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Coins className="w-3 h-3" />
                        <span>{vacancy.stipend}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{vacancy.durationMonths} Bulan</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {vacancy.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xs text-slate-400">
                      Batas Pendaftaran: <span className="font-medium text-slate-700">{vacancy.deadline}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedVacancy(vacancy)}
                        className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
                      >
                        Detail Posisi
                      </button>
                      <button
                        onClick={() => handleOpenApply(vacancy)}
                        disabled={hasApplied}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                          hasApplied
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{hasApplied ? 'Sudah Dilamar' : 'Lamar Magang'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Applications Tab */
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-800 text-sm">Belum Ada Lamaran Magang</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Temukan posisi yang sesuai dengan minat Anda di tab 'Jelajahi Lowongan'.
              </p>
              <button
                onClick={() => setViewMode('browse')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Cari Lowongan Sekarang
              </button>
            </div>
          ) : (
            applications.map((app) => {
              const matchedVacancy = vacancies.find((v) => v.id === app.vacancyId);
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Tanggal Pengajuan: {app.appliedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-indigo-700">
                        {matchedVacancy?.company || 'Mitra Industri'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {matchedVacancy?.title || 'Posisi Magang'}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xl">
                      {app.feedbackNote || 'Lamaran Anda sedang ditinjau oleh tim rekrutmen & mentor.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-1.5 ${
                        app.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'interview'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="capitalize">
                        {app.status === 'accepted'
                          ? 'Diterima Magang'
                          : app.status === 'interview'
                          ? 'Tahap Wawancara'
                          : 'Proses Peninjauan'}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Vacancy Detail Modal */}
      {selectedVacancy && !isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedVacancy.logo}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedVacancy.title}</h3>
                  <p className="text-xs font-semibold text-slate-600">{selectedVacancy.company}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVacancy(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Deskripsi Pekerjaan:</h4>
                <p className="leading-relaxed">{selectedVacancy.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Tanggung Jawab:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {selectedVacancy.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Persyaratan Kualifikasi:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {selectedVacancy.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Benefit & Fasilitas:</h4>
                <ul className="list-disc pl-4 space-y-1 text-emerald-800">
                  {selectedVacancy.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{selectedVacancy.stipend}</span>
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Lanjut ke Formulir Lamaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {isApplyModalOpen && selectedVacancy && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <p className="text-2xs font-semibold text-indigo-700 uppercase">Formulir Pendaftaran Magang</p>
                <h3 className="text-base font-bold text-slate-900">{selectedVacancy.title}</h3>
                <p className="text-xs text-slate-500">{selectedVacancy.company}</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Pelamar:</label>
                <input
                  type="text"
                  disabled
                  value={profile.name}
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jurusan / Asal Institusi:</label>
                <input
                  type="text"
                  value={applicantMajor}
                  onChange={(e) => setApplicantMajor(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tautan Portofolio / GitHub / LinkedIn:</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan CV & Keahlian Utama:</label>
                <textarea
                  rows={2}
                  value={resumeSummary}
                  onChange={(e) => setResumeSummary(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Surat Motivasi / Catatan Lamaran:</label>
                  <button
                    type="button"
                    onClick={handleAIReview}
                    disabled={isAnalyzingAI}
                    className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isAnalyzingAI ? 'Menganalisis...' : 'Review Lamaran (AI)'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500"
                  required
                />
              </div>

              {/* AI Feedback Box */}
              {aiReviewResult && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Rekomendasi AI untuk Meningkatkan Peluang Diterima:</span>
                  </p>
                  <div className="text-2xs whitespace-pre-line leading-relaxed">{aiReviewResult}</div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Kirim Lamaran Magang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
