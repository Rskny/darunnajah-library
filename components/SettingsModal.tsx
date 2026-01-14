
import React, { useState } from 'react';
import { Admin } from '../types';

interface SettingsModalProps {
  user: Admin;
  onClose: () => void;
  onUpdate: (data: Partial<Admin>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onUpdate }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'security'>('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSection === 'profile') {
      onUpdate({
        name: formData.name,
        username: formData.username,
        email: formData.email
      });
    } else {
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Konfirmasi password baru tidak cocok!");
        return;
      }
      alert("Password berhasil diperbarui!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in fade-in duration-300">
        <div className="w-full md:w-72 bg-slate-50 p-10 border-r border-slate-100">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Pengaturan</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Akun Admin</p>
          </div>
          <nav className="space-y-3">
            <button 
              onClick={() => setActiveSection('profile')}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm flex items-center space-x-3 transition-all ${activeSection === 'profile' ? 'bg-[#3b5998] text-white shadow-lg' : 'text-slate-400 hover:bg-white hover:text-slate-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>Profil Utama</span>
            </button>
            <button 
              onClick={() => setActiveSection('security')}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm flex items-center space-x-3 transition-all ${activeSection === 'security' ? 'bg-[#3b5998] text-white shadow-lg' : 'text-slate-400 hover:bg-white hover:text-slate-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span>Keamanan</span>
            </button>
          </nav>
          <div className="mt-20 md:mt-32 pt-10 border-t border-slate-200 text-center">
             <button onClick={onClose} className="text-xs font-black text-slate-300 uppercase tracking-widest hover:text-rose-500 transition-colors">Tutup Menu</button>
          </div>
        </div>

        <div className="flex-1 p-10 md:p-16 overflow-y-auto max-h-[85vh]">
          <div className="mb-12 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {activeSection === 'profile' ? 'Identitas Admin' : 'Sandi & Keamanan'}
              </h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Perbarui informasi kredensial Anda</p>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 font-black text-2xl">
              {user.name.charAt(0)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {activeSection === 'profile' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Username Petugas</label>
                    <input 
                      value={formData.username} 
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
                    <input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Instansi</label>
                  <input 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 transition-all" 
                  />
                  <p className="text-[10px] text-slate-400 italic ml-2">* Gunakan email instansi untuk verifikasi internal</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sandi Lama</label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 transition-all" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sandi Baru</label>
                    <input 
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      placeholder="Min. 8 Karakter"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Konfirmasi Sandi</label>
                    <input 
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Ulangi Sandi"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 transition-all" 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8 flex flex-col md:flex-row gap-4">
              <button type="submit" className="flex-1 py-5 bg-[#3b5998] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-900/10 hover:bg-black transition-all">Simpan Perubahan</button>
              <button type="button" onClick={onClose} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Batalkan</button>
            </div>
          </form>
          
          <div className="mt-12 p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start space-x-5">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-tight">Catatan Keamanan</h4>
              <p className="text-[10px] text-amber-700 font-bold leading-relaxed mt-1">Mengubah kredensial akan berdampak pada akses login berikutnya. Pastikan Anda mengingat username dan kata sandi baru Anda.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
