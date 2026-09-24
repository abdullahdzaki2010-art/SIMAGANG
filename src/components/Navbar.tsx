import React from 'react';
import { UserRole, UserProfile } from '../types';
import {
  Briefcase,
  UserCheck,
  GraduationCap,
  Cloud,
  LogOut,
  LogIn,
} from 'lucide-react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  profile: UserProfile;
  firebaseUser: FirebaseUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  profile,
  firebaseUser,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Beranda' },
    { id: 'attendance', label: 'Presensi' },
    { id: 'logbook', label: 'Logbook' },
    { id: 'tasks', label: 'Tugas' },
    { id: 'vacancies', label: 'Lowongan' },
    { id: 'certificate', label: 'Laporan & Nilai' },
  ];

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn('Google Sign-In canceled or failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 text-left cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
            M
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">SiMagang</span>
            <span className="text-3xs font-medium text-indigo-600 flex items-center gap-1">
              <Cloud className="w-2.5 h-2.5" />
              <span>Firebase Cloud</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 font-semibold'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Role Switcher & Firebase Auth */}
        <div className="flex items-center gap-2.5">
          {/* Segmented Role Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setCurrentRole('student')}
              title="Mode Peserta Magang"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                currentRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Peserta</span>
            </button>
            <button
              onClick={() => setCurrentRole('mentor')}
              title="Mode Mentor Industri"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                currentRole === 'mentor'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mentor</span>
            </button>
            <button
              onClick={() => setCurrentRole('teacher')}
              title="Mode Guru/Dosen Pembimbing"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                currentRole === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dosen</span>
            </button>
          </div>

          {/* Firebase Auth Button or Profile */}
          {firebaseUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={firebaseUser.photoURL || profile.avatar}
                alt={firebaseUser.displayName || profile.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-400"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
                }}
              />
              <div className="hidden xl:block text-left text-xs leading-tight">
                <p className="font-semibold text-slate-800 truncate max-w-[110px]">
                  {firebaseUser.displayName || profile.name}
                </p>
                <span className="text-3xs text-emerald-600 font-medium">Akun Terhubung</span>
              </div>
              <button
                onClick={handleSignOut}
                title="Keluar dari akun Google"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Masuk Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-4 text-xs font-medium scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
