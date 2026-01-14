
import React from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onLend: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onLend }) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
      {/* Visual Indicator on side */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${book.available ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
      
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className="px-2.5 py-1 bg-slate-100 text-[9px] font-bold text-slate-500 rounded-lg uppercase tracking-widest">{book.category}</span>
          <span className={`w-3 h-3 rounded-full ${book.available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></span>
        </div>
        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 group-hover:text-[#3b5998] transition-colors">{book.title}</h3>
        <p className="text-sm font-semibold text-slate-400">{book.author}</p>
      </div>

      <div className="space-y-2 mb-6 flex-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 p-3 rounded-2xl">
            <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Tahun</p>
            <p className="text-xs font-bold text-slate-700">{book.year}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl">
            <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Jumlah</p>
            <p className="text-xs font-bold text-slate-700">{book.stock} Eks</p>
          </div>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-2xl">
          <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Penerbit</p>
          <p className="text-xs font-bold text-slate-700 truncate">{book.publisher}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
           {book.classCode && <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{book.classCode}</span>}
           {book.major && <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{book.major}</span>}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-300 font-bold uppercase">Asal: {book.source}</span>
          <span className="text-[8px] text-slate-300 font-mono">Input: {book.inputDate}</span>
        </div>
        <button 
          onClick={onLend}
          disabled={!book.available}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            book.available 
              ? 'bg-[#3b5998] text-white hover:bg-[#2d4373] active:scale-95 shadow-md shadow-blue-100' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {book.available ? 'Pinjam' : 'Kosong'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
