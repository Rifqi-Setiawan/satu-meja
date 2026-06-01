import React from 'react';
import { useApp } from '../../context/AppContext';
import { Store, UserCircle, Utensils } from 'lucide-react';

export default function RoleSelectionPage() {
  const { user, setRole, navigate } = useApp();

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      navigate('adminDashboard');
    } else {
      navigate('customerHome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Utensils className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Pilih Peran Anda</h2>
          <p className="text-gray-500 text-lg">
            Halo, <span className="font-semibold text-gray-800">{user?.name}</span>! Ingin masuk sebagai apa hari ini?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleSelectRole('customer')}
            className="w-full bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-orange-500 hover:shadow-lg transition group flex flex-col items-center gap-4 active:scale-95"
          >
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <UserCircle className="w-12 h-12 text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-2xl mb-2">Customer</h3>
              <p className="text-gray-500">Cari restoran favorit, lihat menu, dan buat reservasi meja dengan mudah.</p>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('admin')}
            className="w-full bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition group flex flex-col items-center gap-4 active:scale-95"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Store className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-2xl mb-2">Restoran Admin</h3>
              <p className="text-gray-500">Kelola reservasi masuk, perbarui menu, dan atur ketersediaan meja secara live.</p>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('welcome')} 
            className="text-gray-500 font-semibold hover:text-gray-800 hover:underline"
          >
            Batal dan Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
