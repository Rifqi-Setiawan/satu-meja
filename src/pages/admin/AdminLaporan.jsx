import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { formatRupiah } from '../../data/mockData';
import AdminLayout from '../../components/AdminLayout';

export default function AdminLaporan() {
  const { user, getRestaurant, reservations } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);

  const restaurantReservations = reservations.filter(r => r.restaurantId === restaurant?.id);
  const totalRevenue = restaurantReservations.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalCustomers = restaurantReservations.reduce((sum, r) => sum + r.partySize, 0);

  const itemCounts = {};
  restaurantReservations.forEach(r => {
    if (r.items) {
      r.items.forEach(item => {
        if (!itemCounts[item.menuId]) itemCounts[item.menuId] = { name: item.name, count: 0, revenue: 0 };
        itemCounts[item.menuId].count += item.quantity;
        itemCounts[item.menuId].revenue += (item.price * item.quantity);
      });
    }
  });

  const bestSelling = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-navy)]">Laporan Keuangan</h1>
            <p className="text-[var(--color-muted)] mt-1">Analisis performa, pendapatan, dan tren menu restoran Anda.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="app-card p-8">
              <h3 className="font-bold text-[var(--color-muted)] text-lg mb-6">Ringkasan Bulan Ini</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-6 transition hover:shadow-md hover:-translate-y-1">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700 font-bold mb-1">Total Pendapatan</p>
                    <p className="font-extrabold text-emerald-900 text-3xl">{formatRupiah(totalRevenue)}</p>
                  </div>
                </div>
                
                <div className="bg-[var(--color-primary-soft)]/20 p-6 rounded-2xl border border-[var(--color-primary-soft)] flex items-center gap-6 transition hover:shadow-md hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-primary)] font-bold mb-1">Total Transaksi</p>
                    <p className="font-extrabold text-[var(--color-navy)] text-3xl">{restaurantReservations.length}</p>
                  </div>
                </div>
                
                <div className="bg-[var(--color-background)] p-6 rounded-2xl border border-[var(--color-border)] col-span-1 sm:col-span-2 flex items-center gap-6 transition hover:shadow-md hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[var(--color-navy)] text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-navy)] font-bold mb-1">Total Pengunjung</p>
                    <p className="font-extrabold text-[var(--color-charcoal)] text-3xl">{totalCustomers} Orang</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="app-card p-8 h-full">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--color-border)]">
                <div className="p-3 bg-[var(--color-terracotta)]/10 rounded-xl">
                  <Award className="w-6 h-6 text-[var(--color-terracotta)]" />
                </div>
                <h3 className="font-extrabold text-[var(--color-navy)] text-xl">Top 5 Menu Terlaris</h3>
              </div>
              
              {bestSelling.length > 0 ? (
                <div className="space-y-6">
                  {bestSelling.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-[var(--color-border)] text-2xl w-6 group-hover:text-[var(--color-terracotta)] transition-colors">{idx + 1}</span>
                        <div>
                          <p className="font-bold text-[var(--color-charcoal)] text-lg mb-1">{item.name}</p>
                          <p className="text-sm text-[var(--color-muted)] bg-[var(--color-background)] border border-[var(--color-border)] px-2 py-0.5 rounded-md inline-block">{item.count} Terjual</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">{formatRupiah(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-[var(--color-muted)]">Belum ada data penjualan menu.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </AdminLayout>
  );
}
