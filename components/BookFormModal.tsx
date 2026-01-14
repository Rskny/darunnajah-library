
import React, { useState, useRef } from 'react';
import { Book } from '../types';
import { CATEGORIES, CLASS_CODES, MAJORS, SOURCES } from '../constants';

interface BookFormModalProps {
  onClose: () => void;
  onSubmit: (book: Omit<Book, 'id' | 'available'>) => void;
  onBulkSubmit: (books: Omit<Book, 'id' | 'available'>[]) => void;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ onClose, onSubmit, onBulkSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    publisher: '',
    isbn: '',
    category: CATEGORIES[0],
    classCode: '',
    major: '',
    stock: 1,
    source: 'Pembelian' as Book['source'],
    inputDate: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const books: Omit<Book, 'id' | 'available'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const [title, author, year, publisher, isbn, category, stock, source] = line.split(',');
          books.push({
            title: title?.trim() || 'Judul Kosong',
            author: author?.trim() || 'Penulis Kosong',
            year: year?.trim() || '2024',
            publisher: publisher?.trim() || 'Penerbit Kosong',
            isbn: isbn?.trim() || '',
            category: category?.trim() || CATEGORIES[0],
            stock: parseInt(stock?.trim()) || 1,
            source: (source?.trim() as Book['source']) || 'Pembelian',
            inputDate: new Date().toISOString().split('T')[0]
          });
        }
      }
      onBulkSubmit(books);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Manajemen Koleksi</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tambah Buku Baru atau Impor Massal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-10 p-8 bg-[#3b5998]/5 rounded-3xl border border-[#3b5998]/10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#3b5998] text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2">Impor Massal via CSV</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-6">Unggah daftar buku dalam format CSV <br/> untuk menghemat waktu pengisian</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-[#3b5998] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all"
            >
              Pilih File CSV
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <p className="mt-4 text-[9px] text-slate-300 font-bold italic">Format: judul, pengarang, tahun, penerbit, isbn, kategori, stok, asal</p>
          </div>

          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="px-5 bg-white text-slate-300 font-black">Input Manual Per Judul</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nama Buku <span className="text-rose-500">*</span></label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all" placeholder="Judul Buku" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Pengarang <span className="text-rose-500">*</span></label>
                <input required type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all" placeholder="Nama Penulis" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tahun Terbit <span className="text-rose-500">*</span></label>
                <input required type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all" placeholder="2024" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Penerbit <span className="text-rose-500">*</span></label>
                <input required type="text" value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all" placeholder="Nama Penerbit" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Kategori <span className="text-rose-500">*</span></label>
                <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Stok <span className="text-rose-500">*</span></label>
                <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 1})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all" min="1" />
              </div>
            </div>

            <div className="pt-8 flex flex-col md:flex-row gap-4">
              <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">Simpan Buku</button>
              <button type="button" onClick={onClose} className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Batalkan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;
