
import React, { useState } from 'react';
import { Visit } from '../types';

interface VisitFormModalProps {
  onClose: () => void;
  onSubmit: (visit: Omit<Visit, 'id' | 'date'>) => void;
}

const VisitFormModal: React.FC<VisitFormModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    nis: '',
    purpose: 'Membaca' as Visit['purpose']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center text-[#3b5998]">
          <h3 className="text-xl font-bold">Buku Tamu Siswa</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3b5998] font-medium" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">NIS</label>
            <input required type="text" value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3b5998] font-medium" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tujuan Kunjungan</label>
            <select value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value as Visit['purpose']})} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3b5998] font-medium">
              <option value="Membaca">Membaca</option>
              <option value="Meminjam">Meminjam Buku</option>
              <option value="Mengembalikan">Mengembalikan Buku</option>
              <option value="Diskusi">Diskusi/Kerja Kelompok</option>
            </select>
          </div>
          <button type="submit" className="w-full py-4 bg-[#3b5998] text-white rounded-2xl font-bold hover:bg-[#2d4373] transition-all shadow-lg shadow-blue-900/10">Catat Kehadiran</button>
        </form>
      </div>
    </div>
  );
};

export default VisitFormModal;
