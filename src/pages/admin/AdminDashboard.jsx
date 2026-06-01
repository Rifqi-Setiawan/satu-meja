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
            <h1 className="text-3xl font-extrabold text-gray-900">Dasbor Utama</h1>
            <p className="text-gray-500 mt-1">Selamat datang kembali di panel admin {restaurant?.name}.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-gray-500 font-semibold mb-2 relative z-10">Pendapatan Hari Ini</p>
            <h2 className="text-4xl font-extrabold text-blue-600 relative z-10">{formatRupiah(todayRevenue)}</h2>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-gray-500 font-semibold mb-2 relative z-10">Meja Aktif</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <h2 className="text-4xl font-extrabold text-orange-600">{activeTablesCount}</h2>
              <span className="text-gray-400 font-semibold text-lg">/ {restaurant?.tables.length} Total</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-gray-500 font-semibold mb-2 relative z-10">Total Reservasi Hari Ini</p>
            <h2 className="text-4xl font-extrabold text-green-600 relative z-10">{todayReservations.length}</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Aktivitas Terbaru</h3>
          {todayReservations.length === 0 ? (
            <p className="text-gray-500">Belum ada aktivitas reservasi hari ini.</p>
          ) : (
            <div className="space-y-4">
              {todayReservations.slice(0, 5).map(res => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      res.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                      res.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {res.tableId}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{res.customerName}</h4>
                      <p className="text-sm text-gray-500">{res.time} • {res.partySize} Tamu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatRupiah(res.totalAmount)}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      res.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                      res.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
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
