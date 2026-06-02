import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut } from 'lucide-react';
import { formatRupiah } from '../../data/mockData';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const { user, getRestaurant, reservations } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);

  const activeTablesCount = restaurant?.tables.filter(t => t.status === 'occupied').length || 0;
  
  const todayReservations = reservations.filter(r => r.restaurantId === restaurant?.id); 
  const todayRevenue = todayReservations.reduce((sum, res) => sum + res.totalAmount, 0);

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-navy)]">Dasbor Utama</h1>
            <p className="text-[var(--color-muted)] mt-1">Selamat datang kembali di panel admin {restaurant?.name}.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="app-card p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-soft)] rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-[var(--color-muted)] font-semibold mb-2 relative z-10">Pendapatan Hari Ini</p>
            <h2 className="text-4xl font-extrabold text-[var(--color-primary)] relative z-10">{formatRupiah(todayRevenue)}</h2>
          </div>
          
          <div className="app-card p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-terracotta)]/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-[var(--color-muted)] font-semibold mb-2 relative z-10">Meja Aktif</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <h2 className="text-4xl font-extrabold text-[var(--color-terracotta)]">{activeTablesCount}</h2>
              <span className="text-[var(--color-muted)] font-semibold text-lg">/ {restaurant?.tables.length} Total</span>
            </div>
          </div>

          <div className="app-card p-6 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-[var(--color-muted)] font-semibold mb-2 relative z-10">Total Reservasi Hari Ini</p>
            <h2 className="text-4xl font-extrabold text-emerald-600 relative z-10">{todayReservations.length}</h2>
          </div>
        </div>

        <div className="app-card p-8">
          <h3 className="text-xl font-bold text-[var(--color-navy)] mb-6">Aktivitas Terbaru</h3>
          {todayReservations.length === 0 ? (
            <p className="text-[var(--color-muted)]">Belum ada aktivitas reservasi hari ini.</p>
          ) : (
            <div className="space-y-4">
              {todayReservations.slice(0, 5).map(res => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--color-background)] transition border border-transparent hover:border-[var(--color-border)]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      res.status === 'confirmed' ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' :
                      res.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]'
                    }`}>
                      {res.tableId}
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-navy)]">{res.customerName}</h4>
                      <p className="text-sm text-[var(--color-muted)]">{res.time} • {res.partySize} Tamu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-navy)]">{formatRupiah(res.totalAmount)}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      res.status === 'confirmed' ? 'bg-[var(--color-primary-soft)]/50 text-[var(--color-primary)]' :
                      res.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)]'
                    }`}>
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
  );
}
