
import React, { useState } from 'react';
import { Transaction } from '../types';
import { Icons } from '../constants';

interface TransactionTableProps {
  transactions: Transaction[];
  onReturn: (id: string) => void;
  onExtend: (id: string, newDate: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onReturn, onExtend }) => {
  const [extendingId, setExtendingId] = useState<string | null>(null);
  const [newDueDate, setNewDueDate] = useState('');

  if (transactions.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-slate-300">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Icons.Exchange />
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-xs">Belum ada aktivitas transaksi</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-4">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <th className="px-8 py-2">Informasi Buku</th>
            <th className="px-8 py-2">Identitas Siswa</th>
            <th className="px-8 py-2">Jadwal Kembali</th>
            <th className="px-8 py-2 text-center">Status</th>
            <th className="px-8 py-2 text-right">Aksi Manajemen</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dueDate = new Date(t.dueDate);
            const isOverdue = t.status === 'borrowed' && dueDate < today;
            
            return (
              <tr key={t.id} className="bg-white group transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 rounded-[2.5rem]">
                <td className="px-8 py-8 rounded-l-[2.5rem] border-y border-l border-slate-50">
                  <p className="font-black text-slate-900 text-lg leading-tight mb-1">{t.bookTitle}</p>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">KODE: {t.id}</p>
                </td>
                <td className="px-8 py-8 border-y border-slate-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-sm font-black text-[#3b5998] border border-slate-200">
                      {t.studentName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-base font-black text-slate-800 block">{t.studentName}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Siswa Darunnajah</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8 border-y border-slate-50">
                  <p className={`text-sm font-black ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                    {new Date(t.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dipinjam: {t.borrowDate}</p>
                </td>
                <td className="px-8 py-8 border-y border-slate-50 text-center">
                  <span className={`px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest inline-block ${
                    t.status === 'returned' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : isOverdue 
                        ? 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse' 
                        : 'bg-blue-50 text-[#3b5998] border border-blue-100'
                  }`}>
                    {t.status === 'returned' ? 'Telah Kembali' : isOverdue ? 'Terlambat' : 'Dipinjam'}
                  </span>
                </td>
                <td className="px-8 py-8 rounded-r-[2.5rem] border-y border-r border-slate-50 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    {extendingId === t.id ? (
                      <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 animate-in slide-in-from-right-4">
                        <input 
                          type="date" 
                          className="text-xs bg-transparent border-none focus:ring-0 p-1 font-black text-slate-700"
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setNewDueDate(e.target.value)}
                        />
                        <button 
                          onClick={() => { if (newDueDate) { onExtend(t.id, newDueDate); setExtendingId(null); } }}
                          className="bg-[#3b5998] text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-black transition-all"
                        >
                          Simpan
                        </button>
                        <button onClick={() => setExtendingId(null)} className="text-slate-400 p-2">✕</button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        {t.status === 'borrowed' && (
                          <>
                            <button 
                              onClick={() => setExtendingId(t.id)}
                              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                              Perpanjang
                            </button>
                            <button 
                              onClick={() => { if(confirm('Proses pengembalian buku?')) onReturn(t.id) }}
                              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
                            >
                              Kembalikan
                            </button>
                          </>
                        )}
                        {t.status === 'returned' && (
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diterima</p>
                            <p className="text-xs font-bold text-slate-300 italic">{t.returnDate}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
