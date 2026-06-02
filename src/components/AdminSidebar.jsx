import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, UtensilsCrossed, LayoutGrid, TicketPercent, CalendarCheck, FileText, BarChart3, LogOut, LayoutDashboard, X } from 'lucide-react';

export default function AdminSidebar({ onClose }) {
  const { navigate, user, getRestaurant, currentPage, logout } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);

  const menuItems = [
    { title: 'Dasbor', icon: LayoutDashboard, route: 'adminDashboard' },
    { title: 'Data Restoran', icon: Store, route: 'adminDataRestoran' },
    { title: 'Kelola Menu', icon: UtensilsCrossed, route: 'adminKelolaMenu' },
    { title: 'Tempat Duduk', icon: LayoutGrid, route: 'adminTempatDuduk' },
    { title: 'Promo', icon: TicketPercent, route: 'adminPromo' },
    { title: 'Reservasi', icon: CalendarCheck, route: 'adminDataReservasi' },
    { title: 'Pesanan Aktif', icon: FileText, route: 'adminDataPesanan' },
    { title: 'Laporan', icon: BarChart3, route: 'adminLaporan' },
  ];

  const handleNavigation = (route) => {
    navigate(route);
    if (onClose) onClose();
  };

  return (
    <div className="w-64 bg-[var(--color-navy)] h-screen text-white flex flex-col z-50 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[var(--color-navy)]/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
            {restaurant?.name.charAt(0) || 'R'}
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-white truncate max-w-[120px]">{restaurant?.name}</h2>
            <p className="text-xs text-[var(--color-primary-soft)] truncate">Admin Portal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-[var(--color-primary-soft)] hover:text-white rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentPage === item.route;
          return (
            <button
              key={idx}
              onClick={() => handleNavigation(item.route)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-[var(--color-primary)] text-white font-semibold shadow-md' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--color-terracotta)]/20 hover:text-[var(--color-terracotta)] transition-colors text-white/70"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
}
