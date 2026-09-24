import React, { useState, useEffect } from 'react';
import { AttendanceRecord, AttendanceType } from '../../types';
import {
  Clock,
  Camera,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAttendance: (record: AttendanceRecord) => void;
  studentId: string;
  existingTodayRecord?: AttendanceRecord;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  onSubmitAttendance,
  studentId,
  existingTodayRecord,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [type, setType] = useState<AttendanceType>(existingTodayRecord?.type || 'WFO');
  const [notes, setNotes] = useState(existingTodayRecord?.notes || '');
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(!!existingTodayRecord?.photoUrl);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(
    existingTodayRecord?.latitude && existingTodayRecord?.longitude
      ? { lat: existingTodayRecord.latitude, lng: existingTodayRecord.longitude }
      : { lat: -6.2297, lng: 106.8166 }
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleSimulateGPS = () => {
    setIsGeoLoading(true);
    setTimeout(() => {
      setGeoCoords({
        lat: -6.2297 + (Math.random() - 0.5) * 0.0005,
        lng: 106.8166 + (Math.random() - 0.5) * 0.0005,
      });
      setIsGeoLoading(false);
    }, 600);
  };

  const handleCapturePhoto = () => {
    setIsPhotoCaptured(true);
  };

  const handleSubmit = (isCheckOut: boolean) => {
    const today = '2026-09-23';
    const checkTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: AttendanceRecord = {
      id: existingTodayRecord?.id || `att_${Date.now()}`,
      studentId,
      date: today,
      checkInTime: existingTodayRecord?.checkInTime || checkTime,
      checkOutTime: isCheckOut ? checkTime : existingTodayRecord?.checkOutTime,
      type,
      status: 'present',
      location:
        type === 'WFO'
          ? 'Telkom Landmark Tower Lt. 18, Jakarta Selatan'
          : type === 'WFH'
          ? 'Kediaman Mahasiswa (Work From Home)'
          : 'Pengajuan Izin Mandiri',
      latitude: geoCoords?.lat || -6.2297,
      longitude: geoCoords?.lng || 106.8166,
      photoUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      notes: notes || 'Hadir dan siap beraktivitas sesuai penugasan mentor.',
      verifiedByMentor: false,
    };

    onSubmitAttendance(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in-50">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Presensi Kehadiran Online</h3>
            <p className="text-xs text-slate-500">Rabu, 23 September 2026</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Live Clock Display */}
        <div className="bg-slate-900 text-white p-4 rounded-xl text-center space-y-1">
          <p className="text-2xs text-slate-400 uppercase tracking-wider font-medium">
            Waktu Server Presensi
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-indigo-400 tabular-nums">
            {currentTime || '08:15:20 WIB'}
          </p>
          <p className="text-2xs text-slate-400">Toleransi kehadiran WFO/WFH maksimal 08:30 WIB</p>
        </div>

        {/* Mode Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Pilih Mode Kehadiran:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['WFO', 'WFH', 'Izin'] as AttendanceType[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setType(mode)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  type === mode
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {mode === 'WFO' ? '🏢 WFO (Kantor)' : mode === 'WFH' ? '🏠 WFH (Rumah)' : '📋 Izin / Sakit'}
              </button>
            ))}
          </div>
        </div>

        {/* GPS Geofencing Check */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verifikasi Lokasi & Geofence:</span>
            </span>
            <button
              onClick={handleSimulateGPS}
              disabled={isGeoLoading}
              className="text-2xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isGeoLoading ? 'animate-spin' : ''}`} />
              <span>Deteksi Ulang</span>
            </button>
          </div>
          <div className="text-slate-600 text-2xs space-y-0.5">
            <p className="font-mono">
              Koordinat: {geoCoords?.lat.toFixed(4)}, {geoCoords?.lng.toFixed(4)}
            </p>
            <p className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Berada dalam radius kantor mitra (Jarak 14 meter dari gedung Telkom)</span>
            </p>
          </div>
        </div>

        {/* Camera Selfie Snapshot */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Foto Bukti Kehadiran (Selfie):
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {isPhotoCaptured ? (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  alt="Selfie"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              <p className="text-slate-600">
                {isPhotoCaptured
                  ? 'Foto presensi berhasil diambil dan siap diverifikasi.'
                  : 'Wajib mengunggah atau mengambil foto wajah dengan pakaian rapi.'}
              </p>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-2xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3 h-3" />
                <span>{isPhotoCaptured ? 'Ambil Ulang Foto' : 'Ambil Foto Presensi'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan Aktivitas / Rencana Hari Ini:
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Hadir tepat waktu, standup mingguan tim frontend..."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </button>
          {existingTodayRecord && !existingTodayRecord.checkOutTime ? (
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Presensi Pulang (Check-Out)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Kirim Presensi Masuk (Check-In)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
