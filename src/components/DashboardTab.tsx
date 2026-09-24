import React from 'react';
import {
  UserProfile,
  AttendanceRecord,
  LogbookEntry,
  InternshipTask,
  UserRole,
} from '../types';
import {
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  MapPin,
  Building2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';
import heroBannerImg from '../assets/images/magang_hero_banner_1790223317860.jpg';

interface DashboardTabProps {
  currentRole: UserRole;
  profile: UserProfile;
  attendances: AttendanceRecord[];
  logbooks: LogbookEntry[];
  tasks: InternshipTask[];
  onOpenAttendanceModal: () => void;
  onOpenLogbookModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  currentRole,
  profile,
  attendances,
  logbooks,
  tasks,
  onOpenAttendanceModal,
  onOpenLogbookModal,
  setActiveTab,
}) => {
  const today = '2026-09-23'; // current simulation date matching metadata
  const todayAttendance = attendances.find((a) => a.date === today);

  const totalPresent = attendances.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = attendances.length > 0 ? Math.round((totalPresent / attendances.length) * 100) : 100;
  const approvedLogbooks = logbooks.filter((l) => l.status === 'approved').length;
  const pendingLogbooks = logbooks.filter((l) => l.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'done');

  // Internship duration calculation
  const totalDays = 90;
  const passedDays = 42;
  const progressPercent = Math.round((passedDays / totalDays) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={heroBannerImg}
            alt="Suasana Magang Kantor"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Graceful fallback if image has issue
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-300 mb-2">
            <span>Sistem Informasi Magang & Praktik Kerja Lapangan (PKL)</span>
            <span aria-hidden="true">·</span>
            <span>Tahun Akademik 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
            {currentRole === 'student' && `Selamat Datang, ${profile.name}!`}
            {currentRole === 'mentor' && `Panel Mentor: ${profile.name}`}
            {currentRole === 'teacher' && `Panel Monitoring Dosen: ${profile.name}`}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {currentRole === 'student' && (
              <>
                Sedang menjalani program magang sebagai{' '}
                <span className="text-white font-medium">{profile.internshipRole}</span> di{' '}
                <span className="text-white font-medium">{profile.companyName}</span>. Catat kehadiran dan perbarui jurnal harian Anda hari ini.
              </>
            )}
            {currentRole === 'mentor' && (
              <>
                Kelola bimbingan peserta magang industri di {profile.companyName}. Tinjau logbook harian, verifikasi kehadiran, dan pantau progres tugas proyek.
              </>
            )}
            {currentRole === 'teacher' && (
              <>
                Pantau kedisiplinan, akumulasi jam praktik, serta pencapaian capaian pembelajaran mahasiswa magang di instansi mitra.
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {currentRole === 'student' && (
              <>
                <button
                  onClick={onOpenAttendanceModal}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>{todayAttendance ? 'Perbarui Presensi Hari Ini' : 'Presensi Sekarang (Check-In)'}</span>
                </button>
                <button
                  onClick={onOpenLogbookModal}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Isi Logbook Jurnal</span>
                </button>
              </>
            )}

            {currentRole === 'mentor' && (
              <>
                <button
                  onClick={() => setActiveTab('logbook')}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Review {pendingLogbooks.length} Jurnal Pending</span>
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Kelola Tugas Magang</span>
                </button>
              </>
            )}

            {currentRole === 'teacher' && (
              <>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Lihat Lembar Penilaian & Sertifikat</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Kehadiran */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Tingkat Kehadiran</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {attendanceRate}%
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-700 font-medium">{totalPresent} Hari Hadir</span>
            <span aria-hidden="true">·</span>
            <span>{attendances.length} Total Catatan</span>
          </div>
        </div>

        {/* Metric 2: Jam Kerja */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Akumulasi Jam Kerja</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            336 / 720 <span className="text-xs font-normal text-slate-500">Jam</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Target penyelesaian PKL semester genap
          </div>
        </div>

        {/* Metric 3: Jurnal Kegiatan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Jurnal Terverifikasi</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {approvedLogbooks} <span className="text-xs font-normal text-slate-500">Disetujui</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-amber-700 font-medium">{pendingLogbooks.length} Menunggu</span>
            <span aria-hidden="true">·</span>
            <span>{logbooks.length} Total Jurnal</span>
          </div>
        </div>

        {/* Metric 4: Proyek & Tugas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Proyek Selesai</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {completedTasks} / {tasks.length}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {pendingTasks.length} tugas sedang aktif
          </div>
        </div>
      </div>

      {/* Main Content Split: Today Status + Active Tasks & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Internship Information & Today's Attendance Snapshot */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Placement Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {profile.internshipRole || 'Peserta Magang'}
                  </h2>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.companyName}</span>
                    <span aria-hidden="true">·</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jakarta Selatan</span>
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                Magang Aktif
              </span>
            </div>

            {/* Timeline Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="font-medium">Periode: 1 Juli 2026 – 30 September 2026</span>
                <span className="font-semibold tabular-nums text-indigo-700">
                  Hari Ke-{passedDays} dari {totalDays} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Supervisor Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-slate-500 mb-0.5">Pembimbing Lapangan (Mentor):</p>
                <p className="font-semibold text-slate-800">{profile.mentorName || 'Dimas Arya Prasetya, S.Kom'}</p>
                <p className="text-slate-500 text-2xs mt-0.5">PT Telkom Indonesia (Div. Digital)</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-slate-500 mb-0.5">Dosen / Guru Pembimbing:</p>
                <p className="font-semibold text-slate-800">{profile.teacherName || 'Dr. Ir. Budi Santoso, M.T.'}</p>
                <p className="text-slate-500 text-2xs mt-0.5">{profile.institution}</p>
              </div>
            </div>
          </div>

          {/* Today's Attendance Snapshot Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Status Presensi Hari Ini</h3>
                <p className="text-xs text-slate-500">Rabu, 23 September 2026</p>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Riwayat Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayAttendance ? (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Sudah Check-In</span>
                      <span className="text-2xs font-semibold uppercase px-2 py-0.5 bg-emerald-200/60 text-emerald-800 rounded">
                        {todayAttendance.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Jam Masuk: <span className="font-semibold tabular-nums">{todayAttendance.checkInTime} WIB</span>
                      {todayAttendance.checkOutTime && (
                        <> · Jam Pulang: <span className="font-semibold tabular-nums">{todayAttendance.checkOutTime} WIB</span></>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{todayAttendance.location}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenAttendanceModal}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  {todayAttendance.checkOutTime ? 'Ubah Data Presensi' : 'Check-Out (Absen Pulang)'}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Belum Melakukan Presensi</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Batas waktu toleransi kehadiran WFO/WFH adalah pukul 08:30 WIB.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenAttendanceModal}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Presensi Sekarang
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pending Tasks & Recent Mentor Feedback */}
        <div className="space-y-6">
          {/* Active Tasks Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Tugas Magang Berjalan</h3>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Buka Board
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setActiveTab('tasks')}
                  className="p-3 rounded-lg border border-slate-100 hover:border-indigo-200 bg-slate-50/60 hover:bg-indigo-50/30 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {task.title}
                    </p>
                    <span
                      className={`text-2xs font-semibold px-1.5 py-0.5 rounded capitalize shrink-0 ${
                        task.status === 'done'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'in_progress'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {task.status === 'done' ? 'Selesai' : task.status === 'in_progress' ? 'Dikerjakan' : 'To Do'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-2xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Deadline: {task.deadline}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{task.priority} Priority</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Internship Assistant Quick Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 shadow-2xs">
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Asisten Jurnal & Laporan PKL</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Bingung merangkai kata saat menyusun logbook harian? Gunakan fitur AI untuk mengubah poin kasar kegiatan Anda menjadi narasi laporan resmi baku secara instan.
            </p>
            <button
              onClick={onOpenLogbookModal}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Buka Generator Jurnal AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mentor Feedback Feed */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Catatan Terkini Mentor</h3>
            {logbooks.find((l) => l.mentorFeedback) ? (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <p className="italic text-slate-700">
                  "{logbooks.find((l) => l.mentorFeedback)?.mentorFeedback}"
                </p>
                <div className="mt-2 text-2xs text-slate-500 flex items-center justify-between">
                  <span>Oleh: Dimas Arya P. (Tech Lead)</span>
                  <span>{logbooks.find((l) => l.reviewedAt)?.reviewedAt}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Belum ada catatan evaluasi baru.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
