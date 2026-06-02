import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Mail, Lock, Utensils } from 'lucide-react';

export default function LoginPage() {
  const { login, navigate, showToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast('Mohon isi semua field', 'error');
      return;
    }

    const user = login(identifier, password);
    if (user) {
      showToast('Berhasil masuk!', 'success');
      navigate('roleSelection');
    } else {
      showToast('Username/Email atau password salah', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 md:bg-white">
      {/* Left Branding for Desktop */}
      <div className="hidden md:flex md:w-1/2 bg-[var(--color-primary)] flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Utensils className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-white">Satu Meja</h1>
          <p className="text-[var(--color-primary-soft)] text-lg">Pesan meja cepat tanpa ribet.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex flex-col min-h-screen md:min-h-0">
        <div className="p-4 md:p-8 flex items-center border-b border-gray-100 md:border-none">
          <button onClick={() => navigate('welcome')} className="p-2 hover:bg-gray-100 rounded-full transition flex items-center text-gray-600 font-semibold">
            <ArrowLeft className="w-6 h-6 md:mr-2" />
            <span className="hidden md:inline">Kembali</span>
          </button>
        </div>

        <div className="p-6 md:p-12 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          <h2 className="text-3xl font-extrabold text-[var(--color-navy)] mb-2">Selamat Datang!</h2>
          <p className="text-gray-500 mb-8 text-lg">Masuk untuk melanjutkan reservasi meja favoritmu.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email atau Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 transition-colors text-base"
                  placeholder="Contoh: budi@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 transition-colors text-base"
                  placeholder="••••••••"
                />
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-sm text-[var(--color-terracotta)] font-bold hover:underline">Lupa Password?</a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white font-bold py-4 px-4 rounded-xl hover:brightness-95 transition shadow-lg active:scale-95 mt-8 text-lg"
            >
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Belum punya akun?{' '}
            <button onClick={() => navigate('register')} className="text-[var(--color-primary)] font-bold hover:underline">
              Daftar di sini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
