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
    <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col z-50 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
            {restaurant?.name.charAt(0) || 'R'}
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-white truncate max-w-[120px]">{restaurant?.name}</h2>
            <p className="text-xs text-slate-500 truncate">Admin Portal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
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
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white font-semibold shadow-md' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
}
