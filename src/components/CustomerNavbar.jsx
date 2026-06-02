import React from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Search, UserCircle, LogOut } from 'lucide-react';

export default function CustomerNavbar() {
  const { navigate, user, logout } = useApp();

  return (
    <nav className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('customerHome')}>
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mr-3 shadow-md">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-[var(--color-navy)] tracking-tight">Satu Meja</span>
          </div>

          {/* Desktop Search (Mock) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--color-muted)]" />
              </div>
              <input
                type="text"
                className="app-input pl-11 rounded-full bg-[var(--color-background)] hover:bg-gray-100 focus:bg-white"
                placeholder="Cari restoran, lokasi, atau menu..."
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-[var(--color-navy)]">{user?.name || 'Guest'}</span>
              <span className="text-xs text-[var(--color-muted)]">Customer</span>
            </div>
            
            <button onClick={() => navigate('roleSelection')} className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] transition" title="Ganti Role">
              <UserCircle className="w-8 h-8" />
            </button>
            
            <button onClick={logout} className="text-[var(--color-muted)] hover:text-[var(--color-terracotta)] transition" title="Keluar">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
