import React from 'react';
import { useApp } from '../../context/AppContext';
import { Utensils } from 'lucide-react';

export default function WelcomePage() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Branding / Hero */}
      <div className="hidden md:flex md:w-1/2 bg-[var(--color-primary)] text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="z-10 text-center max-w-md">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Utensils className="w-12 h-12 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 text-white">Satu Meja</h1>
          <p className="text-[var(--color-primary-soft)] text-xl leading-relaxed">
            Platform reservasi meja restoran dan kafe favoritmu dengan mudah, cepat, dan praktis.
          </p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50 md:bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-md">
          {/* Mobile branding only visible on small screens */}
          <div className="md:hidden flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--color-navy)] mb-2">Satu Meja</h1>
            <p className="text-gray-500">Reservasi meja restoran favoritmu.</p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl md:shadow-none md:border md:border-gray-100 border-none">
            <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-8 text-center">Mulai Sekarang</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('login')}
                className="w-full bg-[var(--color-primary)] text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:brightness-95 transition hover:-translate-y-0.5 active:scale-95 text-lg"
              >
                Masuk ke Akun
              </button>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-[var(--color-muted)] text-sm">atau</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              <button
                onClick={() => navigate('register')}
                className="w-full bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold py-4 px-4 rounded-xl hover:bg-[var(--color-background)] transition hover:-translate-y-0.5 active:scale-95 text-lg"
              >
                Daftar Akun Baru
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
