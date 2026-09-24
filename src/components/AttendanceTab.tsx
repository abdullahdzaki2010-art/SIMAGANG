import React, { useState } from 'react';
import { AttendanceRecord, UserRole, UserProfile } from '../types';
import {
  Clock,
  MapPin,
  Camera,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  ShieldCheck,
  Calendar,
  Check,
} from 'lucide-react';

interface AttendanceTabProps {
  currentRole: UserRole;
  profile: UserProfile;
  attendances: AttendanceRecord[];
  onOpenAttendanceModal: () => void;
  onVerifyAttendance: (id: string) => void;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  currentRole,
  profile,
  attendances,
  onOpenAttendanceModal,
  onVerifyAttendance,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredList = attendances.filter((att) => {
    if (filterType !== 'all' && att.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        att.date.toLowerCase().includes(q) ||
        att.location.toLowerCase().includes(q) ||
        (att.notes && att.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Jam Masuk', 'Jam Pulang', 'Tipe', 'Status', 'Lokasi', 'Catatan', 'Terverifikasi'];
    const rows = attendances.map(a => [
      a.date,
      a.checkInTime,
      a.checkOutTime || '-',
      a.type,
      a.status,
      `"${a.location}"`,
      `"${a.notes || ''}"`,
      a.verifiedByMentor ? 'Ya' : 'Belum'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Presensi_Magang_${profile.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalHadir = attendances.filter(a => a.status === 'present').length;
  const totalLate = attendances.filter(a => a.status === 'late').length;
  const totalWFO = attendances.filter(a => a.type === 'WFO').length;
  const totalWFH = attendances.filter(a => a.type === 'WFH').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Presensi & Kehadiran Magang
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Standar Jam Kerja: 08:00 – 17:00 WIB</span>
            <span aria-hidden="true">·</span>
            <span>Toleransi Keterlambatan 30 Menit</span>
            <span aria-hidden="true">·</span>
            <span>Geofencing Radius Kantor 100m</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          {currentRole === 'student' && (
            <button
              onClick={onOpenAttendanceModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Isi Presensi Hari Ini</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Total Kehadiran Tepat Waktu</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalHadir} <span className="text-xs font-normal text-slate-500">Hari</span></p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Keterlambatan Tercatat</p>
          <p className="text-2xl font-bold text-amber-600 tabular-nums">{totalLate} <span className="text-xs font-normal text-slate-500">Hari</span></p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Presensi di Kantor (WFO)</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalWFO} <span className="text-xs font-normal text-slate-500">Hari</span></p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Presensi Rumah (WFH)</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalWFH} <span className="text-xs font-normal text-slate-500">Hari</span></p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <span className="text-slate-400 px-1 flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter:</span>
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua ({attendances.length})
          </button>
          <button
            onClick={() => setFilterType('WFO')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === 'WFO'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            WFO ({totalWFO})
          </button>
          <button
            onClick={() => setFilterType('WFH')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === 'WFH'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            WFH ({totalWFH})
          </button>
          <button
            onClick={() => setFilterType('Izin')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === 'Izin'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Izin / Sakit
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari tanggal atau lokasi presensi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white w-full sm:w-64 transition-all"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Jam Masuk</th>
                <th className="py-3 px-4">Jam Pulang</th>
                <th className="py-3 px-4">Tipe & Status</th>
                <th className="py-3 px-4">Lokasi Presensi</th>
                <th className="py-3 px-4">Catatan Harian</th>
                <th className="py-3 px-4">Validasi Mentor</th>
                {currentRole === 'mentor' && (
                  <th className="py-3 px-4 text-right">Aksi Mentor</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={currentRole === 'mentor' ? 8 : 7} className="py-12 text-center text-slate-400">
                    Tidak ada catatan presensi yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.date}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 tabular-nums font-medium text-slate-900 whitespace-nowrap">
                      <span className="text-emerald-700">{record.checkInTime} WIB</span>
                    </td>

                    <td className="py-3 px-4 tabular-nums font-medium text-slate-900 whitespace-nowrap">
                      {record.checkOutTime ? (
                        <span className="text-slate-700">{record.checkOutTime} WIB</span>
                      ) : (
                        <span className="text-amber-600 italic">Belum Check-Out</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{record.type}</span>
                        <span aria-hidden="true" className="text-slate-300">/</span>
                        <span
                          className={`capitalize font-medium ${
                            record.status === 'present'
                              ? 'text-emerald-700'
                              : record.status === 'late'
                              ? 'text-amber-700'
                              : 'text-slate-600'
                          }`}
                        >
                          {record.status === 'present' ? 'Tepat Waktu' : record.status === 'late' ? 'Terlambat' : 'Izin'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-1 text-slate-700 truncate" title={record.location}>
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{record.location}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-500" title={record.notes}>
                      {record.notes || '-'}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {record.verifiedByMentor ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Terverifikasi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Menunggu</span>
                        </span>
                      )}
                    </td>

                    {currentRole === 'mentor' && (
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {!record.verifiedByMentor ? (
                          <button
                            onClick={() => onVerifyAttendance(record.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-2xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Verifikasi</span>
                          </button>
                        ) : (
                          <span className="text-2xs text-slate-400">Sudah Sah</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
