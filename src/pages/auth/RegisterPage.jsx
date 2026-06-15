import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, User, Phone, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const { navigate, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((v) => !v)) {
      showToast('Mohon isi semua field', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Password tidak cocok', 'error');
      return;
    }
    
    // In a real app we'd save to DB here. For mock, just pretend it's success.
    showToast('Pendaftaran berhasil! Silakan masuk.', 'success');
    navigate('login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 md:bg-white">
      {/* Left Branding for Desktop */}
      <div className="hidden md:flex md:w-1/2 bg-[var(--color-primary)] flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl overflow-hidden">
            <img src="/merah.png" alt="Cari Meja Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-white">Cari Meja</h1>
          <p className="text-[var(--color-primary-soft)] text-lg">Bergabung dan nikmati kemudahan reservasi di ujung jari Anda.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex flex-col min-h-screen md:min-h-0">
        <div className="p-4 md:p-8 flex items-center border-b border-gray-100 md:border-none sticky top-0 bg-gray-50 md:bg-white z-10">
          <button onClick={() => navigate('welcome')} className="p-2 hover:bg-gray-100 rounded-full transition flex items-center text-gray-600 font-semibold">
            <ArrowLeft className="w-6 h-6 md:mr-2" />
            <span className="hidden md:inline">Kembali</span>
          </button>
        </div>

        <div className="p-6 md:p-12 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          <h2 className="text-3xl font-extrabold text-[var(--color-navy)] mb-2">Buat Akun Baru</h2>
          <p className="text-gray-500 mb-8 text-lg">Lengkapi data diri Anda di bawah ini.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50"
                    placeholder="budisantoso"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">No HP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50"
                    placeholder="081234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50"
                    placeholder="budi@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white font-bold py-4 px-4 rounded-xl hover:brightness-95 transition shadow-lg active:scale-95 mt-6 text-lg"
            >
              Daftar Sekarang
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600 pb-10 md:pb-0">
            Sudah punya akun?{' '}
            <button onClick={() => navigate('login')} className="text-[var(--color-primary)] font-bold hover:underline">
              Masuk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
