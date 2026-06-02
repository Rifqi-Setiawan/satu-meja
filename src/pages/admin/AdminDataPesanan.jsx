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
            <h1 className="text-3xl font-extrabold text-[var(--color-navy)]">Pesanan Aktif (Dapur)</h1>
            <p className="text-[var(--color-muted)] mt-1">Pantau pesanan makanan yang masuk secara real-time.</p>
          </div>
          <div className="bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold px-4 py-2 rounded-xl flex items-center border border-[var(--color-primary-soft)] shadow-sm">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-primary)]"></span>
            </span>
            {activeOrders.length} Pesanan Berjalan
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-8">
          {activeOrders.length === 0 ? (
            <div className="app-card flex flex-col items-center justify-center h-full">
               <ChefHat className="w-24 h-24 text-[var(--color-muted)] mb-6 opacity-50" />
               <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2">Dapur sedang kosong</h3>
               <p className="text-[var(--color-muted)]">Belum ada pesanan makanan yang masuk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
              {activeOrders.map(order => (
                <div key={order.id} className="app-card overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-primary-soft)] transition">
                  <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-navy)] px-6 py-4 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div className="flex items-center relative z-10">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[var(--color-navy)] font-extrabold text-xl mr-4 shadow-sm">
                        {order.tableId}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-lg">{order.customerName}</h3>
                        <p className="text-[var(--color-primary-soft)] text-sm flex items-center"><Clock className="w-3 h-3 mr-1" /> {order.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-4 mb-6">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-start border-b border-[var(--color-border)] pb-3 last:border-0 last:pb-0">
                          <div className="flex">
                            <span className="font-extrabold text-[var(--color-navy)] bg-[var(--color-background)] border border-[var(--color-border)] px-2 py-0.5 rounded mr-3 text-sm">{item.quantity}x</span>
                            <span className="font-semibold text-[var(--color-charcoal)]">{item.name}</span>
                          </div>
                          <span className="text-[var(--color-muted)] font-medium text-sm">{formatRupiah(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-[var(--color-background)] rounded-2xl p-4 flex justify-between items-center border border-[var(--color-border)]">
                      <span className="text-sm font-semibold text-[var(--color-muted)] flex items-center">
                        <Receipt className="w-4 h-4 mr-2 text-[var(--color-muted)]"/> 
                        {order.paymentMethod}
                      </span>
                      <span className="font-extrabold text-[var(--color-primary)] text-lg">{formatRupiah(order.totalAmount)}</span>
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
