
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { Admin } from '../types';

interface HeaderProps {
  title: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  currentUser: Admin | null;
  onOpenSettings: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, searchQuery, onSearchChange, currentUser, onOpenSettings, onDeleteAccount, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3b5998] transition-colors">
            <Icons.Search />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari sesuatu..."
            className="pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm w-72 focus:ring-2 focus:ring-[#3b5998] transition-all focus:bg-white focus:shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-4 border-l border-slate-100 pl-6 relative" ref={menuRef}>
          <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{currentUser?.name || 'Admin'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{currentUser?.role || 'Guest'}</p>
            </div>
            <div className="w-11 h-11 rounded-[1.25rem] overflow-hidden bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-[#3b5998] hover:ring-2 hover:ring-[#3b5998] transition-all">
              {currentUser?.profileImage ? (
                <img src={currentUser.profileImage} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                currentUser?.name.charAt(0) || 'A'
              )}
            </div>
          </div>

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-5 py-2 border-b border-slate-50 mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akun Saya</p>
              </div>
              <button 
                onClick={() => { setIsMenuOpen(false); onOpenSettings(); }}
                className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-3 transition-colors"
              >
                <Icons.Shield />
                <span>Pengaturan Akun</span>
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); onDeleteAccount(); }}
                className="w-full text-left px-5 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-3 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hapus Akun</span>
              </button>
              <div className="border-t border-slate-50 mt-2 pt-2">
                <button 
                  onClick={() => { setIsMenuOpen(false); onLogout(); }}
                  className="w-full text-left px-5 py-3 text-sm font-bold text-slate-400 hover:text-slate-800 flex items-center space-x-3 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Keluar Sistem</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
