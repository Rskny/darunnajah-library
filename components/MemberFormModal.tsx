
import React, { useState, useRef } from 'react';
import { Member } from '../types';
import { MAJORS } from '../constants';

interface MemberFormModalProps {
  onClose: () => void;
  onSubmit: (member: Omit<Member, 'id' | 'joinDate' | 'status'>) => void;
  onBulkSubmit: (members: Omit<Member, 'id' | 'joinDate' | 'status'>[]) => void;
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({ onClose, onSubmit, onBulkSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    nis: '',
    class: '',
    major: MAJORS[0],
    gender: 'Laki-laki'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.class && formData.major && formData.gender) {
      onSubmit(formData);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const members: Omit<Member, 'id' | 'joinDate' | 'status'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const [name, nis, className, major, gender] = line.split(',');
          members.push({
            name: name.trim(),
            nis: nis.trim(),
            class: className.trim(),
            major: major.trim(),
            gender: gender.trim()
          });
        }
      }
      onBulkSubmit(members);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Data Anggota</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tambah Siswa Baru</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col items-center text-center">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Opsi Cepat</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span>Impor Data (CSV)</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <p className="mt-3 text-[9px] text-slate-400 font-bold italic">Format: nama, nis, kelas, jurusan, gender</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="px-3 bg-white text-slate-400 font-black">Atau Input Manual</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-[#3b5998] font-bold" placeholder="Nama Siswa" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NIS</label>
                <input required type="text" value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-[#3b5998] font-bold" placeholder="12345" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kelas</label>
                <input required type="text" value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-[#3b5998] font-bold" placeholder="10 IPA 1" />
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">Simpan Anggota</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberFormModal;
