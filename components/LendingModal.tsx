
import React, { useState } from 'react';
import { Book } from '../types';
import { CLASS_CODES, MAJORS } from '../constants';

interface LendingModalProps {
  book: Book | null;
  onClose: () => void;
  onSubmit: (borrowerData: any, days: number, manualBookTitle?: string) => void;
}

const LendingModal: React.FC<LendingModalProps> = ({ book, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    class: CLASS_CODES[0],
    major: MAJORS[0],
    gender: 'Laki-laki',
    manualBookTitle: '' 
  });
  const [days, setDays] = useState(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && (book || formData.manualBookTitle)) {
      onSubmit(formData, days, formData.manualBookTitle);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">{book ? 'Pinjam Buku' : 'Peminjaman Bebas'}</h3>
            <p className="text-xs text-slate-400 font-medium">Lengkapi identitas peminjam & detail buku</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {book ? (
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Buku Terpilih</p>
               <h4 className="font-bold text-[#3b5998]">{book.title}</h4>
               <p className="text-xs text-slate-500 font-medium">{book.author} • Stok: {book.stock}</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Judul Buku <span className="text-rose-500">*</span></label>
              <input 
                required 
                type="text" 
                value={formData.manualBookTitle} 
                onChange={(e) => setFormData({...formData, manualBookTitle: e.target.value})} 
                className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-[#3b5998] font-bold text-slate-700" 
                placeholder="Ketik Judul Buku Secara Manual..." 
              />
            </div>
          )}

          <form id="lending-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nama Lengkap Siswa <span className="text-rose-500">*</span></label>
              <input 
                required 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-[#3b5998] font-medium" 
                placeholder="Nama Lengkap Siswa" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kelas</label>
                <select 
                  value={formData.class} 
                  onChange={(e) => setFormData({...formData, class: e.target.value})} 
                  className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-[#3b5998] font-bold text-slate-700"
                >
                  {CLASS_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jurusan</label>
                <select 
                  value={formData.major} 
                  onChange={(e) => setFormData({...formData, major: e.target.value})} 
                  className="w-full px-5 py-3.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-[#3b5998] font-bold text-slate-700"
                >
                  {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gender</label>
              <div className="flex space-x-3">
                {['Laki-laki', 'Perempuan'].map(g => (
                  <button 
                    key={g} 
                    type="button" 
                    onClick={() => setFormData({...formData, gender: g})} 
                    className={`flex-1 py-3.5 rounded-xl font-bold text-xs transition-all ${
                      formData.gender === g ? 'bg-[#3b5998] text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Durasi Pinjam</label>
              <div className="flex space-x-2">
                {[3, 7, 14].map(d => (
                  <button 
                    key={d} 
                    type="button" 
                    onClick={() => setDays(d)} 
                    className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${
                      days === d ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    {d} Hari
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#3b5998] text-white rounded-2xl font-bold shadow-xl shadow-blue-900/10 mt-6 hover:bg-[#2d4373] transition-all transform active:scale-95">
              Konfirmasi Peminjaman
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LendingModal;
