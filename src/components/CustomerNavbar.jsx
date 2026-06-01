import React from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Search, UserCircle, LogOut } from 'lucide-react';

export default function CustomerNavbar() {
  const { navigate, user, logout } = useApp();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('customerHome')}>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-gray-900 tracking-tight">Satu Meja</span>
          </div>

          {/* Desktop Search (Mock) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full focus:ring-orange-500 focus:border-orange-500 bg-gray-50 hover:bg-gray-100 transition"
                placeholder="Cari restoran, lokasi, atau menu..."
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-900">{user?.name || 'Guest'}</span>
              <span className="text-xs text-gray-500">Customer</span>
            </div>
            
            <button onClick={() => navigate('roleSelection')} className="text-gray-600 hover:text-orange-500 transition" title="Ganti Role">
              <UserCircle className="w-8 h-8" />
            </button>
            
            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition" title="Keluar">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
