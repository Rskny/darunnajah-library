
import React, { useState, useMemo, useEffect } from 'react';
import { Book, Transaction, Statistics, Member, Admin, Visit } from './types';
import { Icons } from './constants';
import { API } from './api';
import BookCard from './components/BookCard';
import TransactionTable from './components/TransactionTable';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import LendingModal from './components/LendingModal';
import BookFormModal from './components/BookFormModal';
import MemberFormModal from './components/MemberFormModal';
import VisitFormModal from './components/VisitFormModal';
import AdminFormModal from './components/AdminFormModal';
import SettingsModal from './components/SettingsModal';

type AuthView = 'login' | 'register' | 'forgot';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'books' | 'lending' | 'history' | 'members' | 'admins' | 'visits' | 'backup' | 'reports'>('dashboard');
  
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals States
  const [isLendingModalOpen, setIsLendingModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchData = async () => {
    try {
      const [b, m, t, v, a] = await Promise.all([
        API.books.getAll(),
        API.members.getAll(),
        API.transactions.getAll(),
        API.visits.getAll(),
        API.auth.getAdmins()
      ]);
      setBooks(b);
      setMembers(m);
      setTransactions(t);
      setVisits(v);
      setAdmins(a);
    } catch (err) {
      console.error("Gagal memuat DB", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
      setIsLoading(false);
    };
    init();
  }, []);

  const stats: Statistics = useMemo(() => ({
    totalBooks: books.reduce((acc, b) => acc + (b.stock || 0), 0),
    activeLoans: transactions.filter(t => t.status === 'borrowed').length,
    overdueCount: transactions.filter(t => t.status === 'borrowed' && new Date(t.dueDate) < new Date()).length,
    totalMembers: members.length,
    weeklyVisits: visits.length,
  }), [books, transactions, members, visits]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginForm = (e.target as any);
    const username = loginForm.username.value;
    const user = await API.auth.login(username);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      await API.auth.updateAdmin(user.id, { lastLogin: new Date().toLocaleString('id-ID') });
      fetchData();
    } else {
      alert("Username tidak ditemukan! Gunakan 'abdullah'.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const newAdmin: Omit<Admin, 'id'> = {
      name: form.name.value,
      username: form.username.value,
      email: form.email.value,
      role: 'Librarian',
      lastLogin: '-'
    };
    try {
      await API.auth.addAdmin(newAdmin);
      alert("Permintaan akses dikirim! Silakan tunggu konfirmasi.");
      setAuthView('login');
      fetchData();
    } catch (err) {
      alert("Gagal mendaftar.");
    }
  };

  const handleUpdateProfile = async (data: Partial<Admin>) => {
    if (!currentUser) return;
    try {
      await API.auth.updateAdmin(currentUser.id, data);
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      fetchData();
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      alert("Gagal memperbarui profil.");
    }
  };

  const handleReturnBook = async (id: string) => {
    try {
      const returnDateString = new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const trans = transactions.find(t => t.id === id);
      
      await API.transactions.update(id, { 
        status: 'returned', 
        returnDate: returnDateString 
      });
      
      if (trans && trans.bookId !== 'MANUAL') {
        const book = books.find(b => b.id === trans.bookId);
        if (book) {
          await API.books.update(book.id, { 
            stock: (book.stock || 0) + 1, 
            available: true 
          });
        }
      }
      
      await fetchData();
      setActiveTab('history');
    } catch (error) {
      console.error("Gagal mengembalikan buku:", error);
      alert("Terjadi kesalahan saat mengembalikan buku.");
    }
  };

  const handleExtendLoan = async (id: string, newDate: string) => {
    await API.transactions.update(id, { dueDate: newDate });
    await fetchData();
    alert("Batas waktu peminjaman berhasil diperpanjang.");
  };

  const handleBackup = async () => {
    const data = await API.backup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_darunnajah_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Backup berhasil diunduh!');
  };

  const handleProcessLending = async (borrowerData: any, days: number, manualTitle?: string) => {
    const transId = Math.random().toString(36).substr(2, 6).toUpperCase();
    const newTrans: Omit<Transaction, 'id'> = {
      bookId: selectedBook?.id || 'MANUAL',
      bookTitle: selectedBook?.title || manualTitle || 'Buku Tidak Terdaftar',
      studentName: borrowerData.name,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'borrowed'
    };
    
    await API.transactions.add(newTrans as Transaction);
    
    if (selectedBook) {
      await API.books.update(selectedBook.id, { 
        stock: Math.max(0, (selectedBook.stock || 0) - 1),
        available: (selectedBook.stock - 1) > 0 
      });
    }
    
    await fetchData();
    setIsLendingModalOpen(false);
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white font-black animate-pulse uppercase tracking-[0.5em] text-xl">Darunnajah...</div>;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-slate-950 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3b5998] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px] opacity-10 animate-pulse delay-700"></div>

        <div className="w-full max-w-lg relative z-10 text-center animate-in fade-in zoom-in duration-700">
          <div className="mb-8">
            <div className="w-20 h-20 bg-[#3b5998] p-4 rounded-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Darunnajah</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] mt-2">Library Portal</p>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-2xl border border-white/10">
            {authView === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Admin Username</label>
                  <input name="username" required placeholder="Contoh: abdullah" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-blue-500/20 text-white font-bold transition-all placeholder:text-slate-600" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Password</label>
                  <input name="password" type="password" required placeholder="••••••••" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:ring-4 focus:ring-blue-500/20 text-white font-bold transition-all placeholder:text-slate-600" />
                </div>
                <button className="w-full py-6 bg-[#3b5998] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Masuk Sekarang</button>
                <div className="flex justify-between px-2 pt-2">
                  <button type="button" onClick={() => setAuthView('register')} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Daftar Admin</button>
                  <button type="button" onClick={() => setAuthView('forgot')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Lupa Password?</button>
                </div>
              </form>
            )}

            {authView === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5 text-left animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Nama Lengkap</label>
                  <input name="name" required placeholder="Nama Anda" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Pilih Username</label>
                  <input name="username" required placeholder="username_unik" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Email Instansi</label>
                  <input name="email" type="email" required placeholder="admin@darunnajah.com" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold" />
                </div>
                <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl mt-4">Kirim Permintaan Akses</button>
                <button type="button" onClick={() => setAuthView('login')} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-2">Sudah Punya Akun? Login</button>
              </form>
            )}

            {authView === 'forgot' && (
              <div className="text-center space-y-8 py-4 animate-in slide-in-from-top-4 duration-300">
                <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20">
                  <h3 className="text-xl font-black text-white mb-2">Verifikasi User</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase leading-relaxed">Untuk mereset password, silakan hubungi <br/> <span className="text-blue-400">Pusat Data Darunnajah (BAPEDA)</span> <br/> melalui WhatsApp Center.</p>
                </div>
                <button onClick={() => setAuthView('login')} className="w-full py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest">Kembali ke Login</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar activeTab={activeTab} onTabChange={(tab) => {
        if (tab === 'backup') handleBackup();
        else setActiveTab(tab);
      }} />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header 
          title={activeTab.toUpperCase()} 
          searchQuery={searchQuery} onSearchChange={setSearchQuery} currentUser={currentUser} 
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onDeleteAccount={() => { if(confirm('Hapus akun Anda secara permanen?')) setIsLoggedIn(false); }}
          onLogout={() => setIsLoggedIn(false)}
        />
        
        <div className="p-8 lg:p-12 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ikhtisar Darunnajah</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Sistem Informasi Perpustakaan v2.5</p>
                </div>
              </div>
              <StatsOverview stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
                   <h3 className="text-xl font-black text-slate-900 mb-8">Kunjungan Terakhir</h3>
                   <div className="space-y-4">
                     {visits.slice(0, 5).map(v => (
                       <div key={v.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div>
                           <p className="font-black text-slate-800 text-sm">{v.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{v.purpose}</p>
                         </div>
                         <span className="text-[10px] font-black text-slate-300">{new Date(v.date).toLocaleTimeString('id-ID')}</span>
                       </div>
                     ))}
                     {visits.length === 0 && <p className="text-center py-10 text-slate-300 italic font-bold">Belum ada kunjungan hari ini</p>}
                   </div>
                 </div>
                 <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white">
                   <h3 className="text-xl font-black mb-8">Pinjaman Mendesak</h3>
                   <div className="space-y-4">
                     {transactions.filter(t => t.status === 'borrowed').slice(0, 5).map(t => (
                        <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                          <div>
                            <p className="font-black text-sm">{t.bookTitle}</p>
                            <p className="text-[10px] text-rose-400 font-bold uppercase">Due: {t.dueDate}</p>
                          </div>
                          <span className="text-[10px] font-black text-slate-500">{t.studentName.split(' ')[0]}</span>
                        </div>
                     ))}
                     {transactions.filter(t => t.status === 'borrowed').length === 0 && <p className="text-center py-10 text-white/20 italic font-bold">Tidak ada pinjaman jatuh tempo</p>}
                   </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-end bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Buku Tamu</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Daftar Kehadiran Siswa</p>
                  </div>
                  <button onClick={() => setIsVisitModalOpen(true)} className="bg-[#3b5998] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Input Kehadiran</button>
               </div>
               <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="h-16 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                       <th className="px-8">Nama Siswa</th>
                       <th className="px-8 text-center">Tujuan</th>
                       <th className="px-8 text-right">Waktu Presensi</th>
                     </tr>
                   </thead>
                   <tbody>
                     {visits.map(v => (
                       <tr key={v.id} className="h-20 border-b hover:bg-slate-50 transition-colors">
                         <td className="px-8">
                           <p className="font-black text-slate-800">{v.name}</p>
                           <p className="text-xs font-bold text-slate-400">NIS: {v.nis}</p>
                         </td>
                         <td className="px-8 text-center">
                           <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase">{v.purpose}</span>
                         </td>
                         <td className="px-8 text-right text-xs font-bold text-slate-400">{new Date(v.date).toLocaleString('id-ID')}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="space-y-10">
               <div className="flex justify-between items-end bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Katalog Pustaka</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Total Koleksi: {books.length} Judul</p>
                  </div>
                  <button onClick={() => setIsBookModalOpen(true)} className="bg-[#3b5998] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Kelola Buku</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())).map(b => (
                   <BookCard key={b.id} book={b} onLend={() => { setSelectedBook(b); setIsLendingModalOpen(true); }} />
                 ))}
               </div>
            </div>
          )}

          {(activeTab === 'lending' || activeTab === 'history') && (
            <div className="space-y-8">
               <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                    {activeTab === 'lending' ? 'Sirkulasi Aktif' : 'Arsip Riwayat Pengembalian'}
                  </h3>
                  {activeTab === 'lending' && (
                    <button 
                      onClick={() => { setSelectedBook(null); setIsLendingModalOpen(true); }}
                      className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center space-x-3"
                    >
                      <Icons.Plus />
                      <span>Pinjam Manual</span>
                    </button>
                  )}
               </div>
               <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8">
                 <TransactionTable 
                    transactions={activeTab === 'lending' 
                      ? transactions.filter(t => t.status === 'borrowed') 
                      : transactions.filter(t => t.status === 'returned')
                    } 
                    onReturn={handleReturnBook} 
                    onExtend={handleExtendLoan} 
                 />
               </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Data Siswa</h3>
                  <button onClick={() => setIsMemberModalOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Registrasi Siswa</button>
               </div>
               <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="h-16 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-8">Nama</th>
                       <th className="px-8">NIS</th>
                       <th className="px-8">Kelas</th>
                       <th className="px-8">Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {members.map(m => (
                       <tr key={m.id} className="h-20 border-b hover:bg-slate-50">
                         <td className="px-8 font-black text-slate-800">{m.name}</td>
                         <td className="px-8 font-mono text-xs text-slate-400">{m.nis}</td>
                         <td className="px-8 text-sm font-bold text-slate-600">{m.class}</td>
                         <td className="px-8">
                           <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase">Aktif</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'admins' && (
             <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Akses Petugas</h3>
                  <button onClick={() => setIsAdminModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">+ Admin</button>
                </div>
                <div className="p-10">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="h-16 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-4">Petugas</th>
                        <th className="px-4">Role</th>
                        <th className="px-4">Terakhir Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map(a => (
                        <tr key={a.id} className="h-20 border-b hover:bg-slate-50 transition-colors">
                          <td className="px-4 font-black text-slate-800">{a.name}</td>
                          <td className="px-4"><span className="px-3 py-1 bg-blue-100 text-[#3b5998] rounded-lg text-[9px] font-black uppercase">{a.role}</span></td>
                          <td className="px-4 text-xs text-slate-400 font-bold">{a.lastLogin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {isSettingsModalOpen && currentUser && (
        <SettingsModal 
          user={currentUser} 
          onClose={() => setIsSettingsModalOpen(false)} 
          onUpdate={handleUpdateProfile} 
        />
      )}
      {isMemberModalOpen && <MemberFormModal onClose={() => setIsMemberModalOpen(false)} onSubmit={async (data) => {
          await API.members.add({ ...data, joinDate: new Date().toISOString().split('T')[0], status: 'active' } as Member);
          fetchData();
          setIsMemberModalOpen(false);
      }} onBulkSubmit={async (bulkData) => {
          const date = new Date().toISOString().split('T')[0];
          for (const item of bulkData) {
            await API.members.add({ ...item, joinDate: date, status: 'active' } as Member);
          }
          fetchData();
          setIsMemberModalOpen(false);
          alert(`${bulkData.length} Siswa diimpor!`);
      }} />}
      {isBookModalOpen && <BookFormModal onClose={() => setIsBookModalOpen(false)} 
        onSubmit={async (data) => {
          await API.books.add({ ...data, available: true } as Book);
          fetchData();
          setIsBookModalOpen(false);
        }}
        onBulkSubmit={async (bulkData) => {
          for (const item of bulkData) {
            await API.books.add({ ...item, available: true } as Book);
          }
          fetchData();
          setIsBookModalOpen(false);
          alert(`${bulkData.length} Koleksi buku baru diimpor!`);
        }}
      />}
      {isVisitModalOpen && <VisitFormModal onClose={() => setIsVisitModalOpen(false)} onSubmit={async (data) => {
          await API.visits.add({...data, date: new Date().toISOString()} as Omit<Visit, 'id'>);
          fetchData();
          setIsVisitModalOpen(false);
      }} />}
      {isLendingModalOpen && <LendingModal book={selectedBook} onClose={() => setIsLendingModalOpen(false)} onSubmit={handleProcessLending} />}
      {isAdminModalOpen && <AdminFormModal onClose={() => setIsAdminModalOpen(false)} onSubmit={async (data) => {
          await API.auth.addAdmin({ ...data, lastLogin: 'Baru' } as Admin);
          fetchData();
          setIsAdminModalOpen(false);
      }} />}
    </div>
  );
};

export default App;
