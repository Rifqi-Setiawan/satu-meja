import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, UtensilsCrossed, Store, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/* ─── Shared ─── */
const InputField = ({ label, type = 'text', value, onChange, placeholder, icon: Icon }) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          type={isPass ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-xl py-3 pr-4 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400 transition ${Icon ? 'pl-10' : 'pl-4'}`}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </div>
  );
};

const OrangeBtn = ({ children, onClick, disabled, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm ${className}`}
  >
    {children}
  </button>
);

/* ─── Welcome Page ─── */
export const WelcomePage = () => {
  const { navigate } = useApp();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 flex-1 flex flex-col items-center justify-center px-8 py-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Satu Meja</h1>
          <p className="text-orange-100 mt-3 text-sm leading-relaxed max-w-xs">
            Reservasi meja restoran dan kafe favoritmu dengan mudah
          </p>
        </div>
      </div>
      <div className="bg-white px-6 py-8 space-y-3">
        <OrangeBtn onClick={() => navigate('login')}>Masuk</OrangeBtn>
        <button
          onClick={() => navigate('register')}
          className="w-full border-2 border-orange-500 text-orange-500 font-bold py-3.5 rounded-xl transition hover:bg-orange-50 text-sm"
        >
          Daftar Sekarang
        </button>
        <p className="text-center text-xs text-gray-400 pt-2">
          Dengan masuk, kamu setuju dengan <span className="text-orange-500 font-semibold">Syarat & Ketentuan</span> kami
        </p>
      </div>
    </div>
  );
};

/* ─── Login Page ─── */
export const LoginPage = () => {
  const { navigate, login, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const found = login(email, password);
      setLoading(false);
      if (found) {
        navigate('roleSelect');
      } else {
        showToast('Email/username atau password salah', 'error');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 pt-12 pb-8">
        <button onClick={() => navigate('welcome')} className="text-white/80 mb-5 flex items-center gap-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-extrabold text-white">Selamat datang!</h2>
        <p className="text-orange-100 text-sm mt-1">Masuk untuk melanjutkan reservasi</p>
      </div>
      <div className="flex-1 px-6 py-8">
        <InputField label="Email / Username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email atau username" />
        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" />
        <p className="text-right text-xs text-orange-500 font-semibold -mt-2 mb-6 cursor-pointer">Lupa password?</p>
        <OrangeBtn onClick={handleLogin} disabled={loading || !email || !password}>
          {loading ? 'Memverifikasi...' : 'Masuk'}
        </OrangeBtn>
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 font-semibold mb-2">Demo credentials:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>👤 <b>customer@email.com</b> / password (Customer)</p>
            <p>🏪 <b>budi@email.com</b> / password (Resto 1)</p>
            <p>🏪 <b>siti@email.com</b> / password (Resto 2)</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{' '}
          <span className="text-orange-500 font-bold cursor-pointer" onClick={() => navigate('register')}>Daftar</span>
        </p>
      </div>
    </div>
  );
};

/* ─── Register Page ─── */
export const RegisterPage = () => {
  const { navigate, showToast } = useApp();
  const [form, setForm] = useState({ nama: '', username: '', phone: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleRegister = () => {
    if (form.password !== form.confirm) { showToast('Password tidak sama', 'error'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Akun berhasil dibuat! Silakan masuk.');
      navigate('login');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 pt-12 pb-8">
        <button onClick={() => navigate('welcome')} className="text-white/80 mb-5 flex items-center gap-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-extrabold text-white">Buat akun baru</h2>
        <p className="text-orange-100 text-sm mt-1">Daftar gratis, nikmati semua fitur</p>
      </div>
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <InputField label="Nama Lengkap" value={form.nama} onChange={set('nama')} placeholder="John Doe" />
        <InputField label="Username" value={form.username} onChange={set('username')} placeholder="johndoe" />
        <InputField label="No. HP" type="tel" value={form.phone} onChange={set('phone')} placeholder="08xx-xxxx-xxxx" />
        <InputField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="john@email.com" />
        <InputField label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 karakter" />
        <InputField label="Konfirmasi Password" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Ulangi password" />
        <OrangeBtn onClick={handleRegister} disabled={loading || !form.nama || !form.email || !form.password}>
          {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
        </OrangeBtn>
        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun?{' '}
          <span className="text-orange-500 font-bold cursor-pointer" onClick={() => navigate('login')}>Masuk</span>
        </p>
      </div>
    </div>
  );
};

/* ─── Role Selection ─── */
export const RoleSelectionPage = () => {
  const { user, setRole, navigate } = useApp();

  const choose = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'customer') navigate('customerHome');
    else navigate('adminDashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4">
        <span className="text-3xl">🍽️</span>
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Hai, {user?.name?.split(' ')[0]}!</h2>
      <p className="text-gray-500 text-sm mb-10 text-center">Masuk sebagai apa hari ini?</p>
      <div className="w-full max-w-sm space-y-4">
        <RoleCard
          icon={<User size={28} className="text-orange-500" />}
          title="Customer"
          desc="Cari restoran, reservasi meja, dan pesan makanan"
          onClick={() => choose('customer')}
        />
        <RoleCard
          icon={<Store size={28} className="text-orange-500" />}
          title="Restoran / Kafe"
          desc="Kelola reservasi, menu, dan laporan bisnis"
          onClick={() => choose('admin')}
          disabled={!user?.restaurantId}
          note={!user?.restaurantId ? 'Akun ini tidak terhubung ke restoran' : null}
        />
      </div>
    </div>
  );
};

const RoleCard = ({ icon, title, desc, onClick, disabled, note }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border-2 transition ${disabled ? 'border-gray-100 opacity-50 cursor-not-allowed' : 'border-transparent hover:border-orange-300 active:scale-98'}`}
  >
    <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">{icon}</div>
    <div>
      <p className="font-bold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      {note && <p className="text-xs text-red-400 mt-1">{note}</p>}
    </div>
  </button>
);
