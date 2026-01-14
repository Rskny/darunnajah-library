
import React from 'react';
import { Icons } from '../constants';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Home },
    { id: 'visits', label: 'Buku Tamu', icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )},
    { id: 'books', label: 'Katalog Buku', icon: Icons.Books },
    { id: 'lending', label: 'Peminjaman', icon: Icons.Exchange },
    { id: 'members', label: 'Data Anggota', icon: Icons.Users },
    { id: 'reports', label: 'Laporan PDF', icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'history', label: 'Riwayat', icon: Icons.History },
    { id: 'backup', label: 'Backup Data', icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    )},
    { id: 'admins', label: 'Manajemen Admin', icon: Icons.Shield },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen hidden lg:flex shrink-0 print:hidden">
      <div className="p-10">
        <div className="flex items-center space-x-4 text-[#3b5998]">
          <div className="bg-[#3b5998] p-2.5 rounded-2xl shadow-lg shadow-blue-100">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight">Darunnajah</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 ${
              activeTab === item.id
                ? 'bg-[#3b5998] text-white shadow-xl shadow-blue-900/10 scale-[1.02]'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <item.icon />
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 mt-auto">
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Library Server</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Versi 2.5.0-Denim</p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
