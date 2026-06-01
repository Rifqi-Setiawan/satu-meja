import React from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, ChefHat, Clock } from 'lucide-react';
import { formatRupiah } from '../../data/mockData';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDataPesanan() {
  const { user, getRestaurant, reservations } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);

  const activeOrders = reservations.filter(r => r.restaurantId === restaurant?.id && r.status === 'confirmed' && r.items && r.items.length > 0);

  return (
    <AdminLayout contentClassName="h-screen flex flex-col">
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Pesanan Aktif (Dapur)</h1>
            <p className="text-gray-500 mt-1">Pantau pesanan makanan yang masuk secara real-time.</p>
          </div>
          <div className="bg-teal-50 text-teal-700 font-bold px-4 py-2 rounded-xl flex items-center border border-teal-200">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
            {activeOrders.length} Pesanan Berjalan
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-3xl border border-gray-100">
               <ChefHat className="w-24 h-24 text-gray-200 mb-6" />
               <h3 className="text-xl font-bold text-gray-900 mb-2">Dapur sedang kosong</h3>
               <p className="text-gray-500">Belum ada pesanan makanan yang masuk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
              {activeOrders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition">
                  <div className="bg-teal-500 px-6 py-4 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div className="flex items-center relative z-10">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-600 font-extrabold text-xl mr-4 shadow-sm">
                        {order.tableId}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-lg">{order.customerName}</h3>
                        <p className="text-teal-100 text-sm flex items-center"><Clock className="w-3 h-3 mr-1" /> {order.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-4 mb-6">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                          <div className="flex">
                            <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded mr-3 text-sm">{item.quantity}x</span>
                            <span className="font-semibold text-gray-700">{item.name}</span>
                          </div>
                          <span className="text-gray-500 font-medium text-sm">{formatRupiah(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                      <span className="text-sm font-semibold text-gray-500 flex items-center">
                        <Receipt className="w-4 h-4 mr-2 text-gray-400"/> 
                        {order.paymentMethod}
                      </span>
                      <span className="font-extrabold text-teal-600 text-lg">{formatRupiah(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
  );
}
