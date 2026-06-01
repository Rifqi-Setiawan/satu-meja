import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { formatRupiah } from '../../data/mockData';
import AdminSidebar from '../../components/AdminSidebar';

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
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Laporan Keuangan</h1>
            <p className="text-gray-500 mt-1">Analisis performa, pendapatan, dan tren menu restoran Anda.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-500 text-lg mb-6">Ringkasan Bulan Ini</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center gap-6 transition hover:shadow-md">
                  <div className="w-14 h-14 bg-green-200 text-green-700 rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-bold mb-1">Total Pendapatan</p>
                    <p className="font-extrabold text-green-900 text-3xl">{formatRupiah(totalRevenue)}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-6 transition hover:shadow-md">
                  <div className="w-14 h-14 bg-blue-200 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-bold mb-1">Total Transaksi</p>
                    <p className="font-extrabold text-blue-900 text-3xl">{restaurantReservations.length}</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 col-span-1 sm:col-span-2 flex items-center gap-6 transition hover:shadow-md">
                  <div className="w-14 h-14 bg-purple-200 text-purple-700 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 font-bold mb-1">Total Pengunjung</p>
                    <p className="font-extrabold text-purple-900 text-3xl">{totalCustomers} Orang</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <Award className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl">Top 5 Menu Terlaris</h3>
              </div>
              
              {bestSelling.length > 0 ? (
                <div className="space-y-6">
                  {bestSelling.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-gray-200 text-2xl w-6 group-hover:text-yellow-400 transition-colors">{idx + 1}</span>
                        <div>
                          <p className="font-bold text-gray-800 text-lg mb-1">{item.name}</p>
                          <p className="text-sm text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md inline-block">{item.count} Terjual</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">{formatRupiah(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">Belum ada data penjualan menu.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
