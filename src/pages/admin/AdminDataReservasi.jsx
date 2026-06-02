import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Clock, CalendarDays, Users, LayoutDashboard } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDataReservasi() {
  const { user, getRestaurant, reservations, updateReservationStatus, updateTableStatus, showToast } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedRes, setSelectedRes] = useState(null);

  const restaurantReservations = reservations.filter(r => r.restaurantId === restaurant?.id);
  const upcomingRes = restaurantReservations.filter(r => r.status === 'confirmed');
  const pastRes = restaurantReservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

  const handleComplete = (resId, tableId) => {
    if(confirm('Tandai reservasi selesai dan kosongkan meja?')) {
      updateReservationStatus(resId, 'completed');
      updateTableStatus(restaurant.id, tableId, 'available');
      showToast('Reservasi selesai!', 'success');
      setSelectedRes(null);
    }
  };

  const handleCancel = (resId, tableId) => {
    if(confirm('Yakin membatalkan reservasi ini?')) {
      updateReservationStatus(resId, 'cancelled');
      updateTableStatus(restaurant.id, tableId, 'available');
      showToast('Reservasi dibatalkan.', 'success');
      setSelectedRes(null);
    }
  };

  return (
    <AdminLayout contentClassName="flex flex-col h-screen overflow-hidden">
        <div className="p-8 border-b border-[var(--color-border)] bg-white z-10 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[var(--color-navy)]">Data Reservasi</h1>
              <p className="text-[var(--color-muted)] mt-1">Kelola reservasi meja pelanggan dan perbarui status ketersediaan.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`py-3 px-6 font-bold text-sm rounded-xl transition ${activeTab === 'upcoming' ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] shadow-sm border border-[var(--color-primary-soft)]' : 'bg-[var(--color-background)] text-[var(--color-muted)] hover:bg-[var(--color-border)] border border-transparent'}`}
            >
              Akan Datang ({upcomingRes.length})
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`py-3 px-6 font-bold text-sm rounded-xl transition ${activeTab === 'past' ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] shadow-sm border border-[var(--color-primary-soft)]' : 'bg-[var(--color-background)] text-[var(--color-muted)] hover:bg-[var(--color-border)] border border-transparent'}`}
            >
              Riwayat (Selesai/Batal)
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'upcoming' ? upcomingRes : pastRes).map(res => (
              <div 
                key={res.id} 
                className={`app-card p-6 transition cursor-pointer hover:-translate-y-1 hover:shadow-lg ${selectedRes === res.id ? 'border-[var(--color-primary)] shadow-md' : 'border-[var(--color-border)] hover:border-[var(--color-primary-soft)]'}`}
                onClick={() => setSelectedRes(res.id === selectedRes ? null : res.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-xl text-[var(--color-navy)]">{res.customerName}</h3>
                    <p className="text-sm font-mono text-[var(--color-muted)] mt-1">ID: {res.id}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                    res.status === 'confirmed' ? 'bg-[var(--color-primary-soft)]/50 text-[var(--color-primary)] border-[var(--color-primary-soft)]' :
                    res.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)] border-[var(--color-terracotta)]/20'
                  }`}>
                    {res.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4 bg-[var(--color-background)] p-4 rounded-2xl border border-[var(--color-border)]">
                  <div className="flex items-center text-[var(--color-charcoal)] font-medium">
                    <CalendarDays className="w-5 h-5 mr-2 text-[var(--color-terracotta)]" /> {res.date}
                  </div>
                  <div className="flex items-center text-[var(--color-charcoal)] font-medium">
                    <Clock className="w-5 h-5 mr-2 text-[var(--color-primary)]" /> {res.time}
                  </div>
                  <div className="flex items-center text-[var(--color-charcoal)] font-medium">
                    <Users className="w-5 h-5 mr-2 text-[var(--color-navy)]" /> {res.partySize} Orang
                  </div>
                  <div className="flex items-center font-bold text-emerald-600">
                    <LayoutDashboard className="w-5 h-5 mr-2 text-emerald-500" /> Meja {res.tableId}
                  </div>
                </div>

                {selectedRes === res.id && (
                  <div className="pt-4 border-t border-[var(--color-border)] animate-in fade-in slide-in-from-top-2">
                    <div className="mb-6">
                      <p className="text-sm font-bold text-[var(--color-navy)] mb-3">Detail Pesanan Awal:</p>
                      {res.items && res.items.length > 0 ? (
                        <ul className="space-y-2 bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)] text-sm">
                          {res.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center text-[var(--color-charcoal)]">
                              <span><span className="font-bold mr-1">{item.quantity}x</span> {item.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-muted)] italic text-center">
                          Hanya reservasi meja (tanpa pesanan)
                        </div>
                      )}
                    </div>

                    {res.status === 'confirmed' && (
                      <div className="flex gap-3">
                        <button onClick={(e) => { e.stopPropagation(); handleCancel(res.id, res.tableId); }} className="flex-1 py-3 rounded-xl text-sm font-bold bg-white text-[var(--color-terracotta)] border-2 border-[var(--color-terracotta)]/20 hover:bg-[var(--color-terracotta)]/10 transition">Batalkan</button>
                        <button onClick={(e) => { e.stopPropagation(); handleComplete(res.id, res.tableId); }} className="flex-1 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> Selesai</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {(activeTab === 'upcoming' ? upcomingRes : pastRes).length === 0 && (
              <div className="app-card col-span-full flex flex-col items-center justify-center py-20">
                <CalendarDays className="w-16 h-16 text-[var(--color-muted)] mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2">Belum ada data reservasi</h3>
                <p className="text-[var(--color-muted)] text-center max-w-sm">Data reservasi dari pelanggan akan otomatis muncul di sini.</p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
  );
}
