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
        <div className="p-8 border-b border-gray-100 bg-white z-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Data Reservasi</h1>
              <p className="text-gray-500 mt-1">Kelola reservasi meja pelanggan dan perbarui status ketersediaan.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`py-3 px-6 font-bold text-sm rounded-xl transition ${activeTab === 'upcoming' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              Akan Datang ({upcomingRes.length})
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`py-3 px-6 font-bold text-sm rounded-xl transition ${activeTab === 'past' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
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
                className={`bg-white p-6 rounded-3xl shadow-sm border-2 transition cursor-pointer hover:shadow-lg ${selectedRes === res.id ? 'border-blue-500' : 'border-gray-100 hover:border-blue-200'}`}
                onClick={() => setSelectedRes(res.id === selectedRes ? null : res.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-xl text-gray-900">{res.customerName}</h3>
                    <p className="text-sm font-mono text-gray-400 mt-1">ID: {res.id}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                    res.status === 'confirmed' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    res.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {res.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center text-gray-700 font-medium">
                    <CalendarDays className="w-5 h-5 mr-2 text-orange-500" /> {res.date}
                  </div>
                  <div className="flex items-center text-gray-700 font-medium">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" /> {res.time}
                  </div>
                  <div className="flex items-center text-gray-700 font-medium">
                    <Users className="w-5 h-5 mr-2 text-purple-500" /> {res.partySize} Orang
                  </div>
                  <div className="flex items-center font-bold text-green-600">
                    <LayoutDashboard className="w-5 h-5 mr-2 text-green-500" /> Meja {res.tableId}
                  </div>
                </div>

                {selectedRes === res.id && (
                  <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div className="mb-6">
                      <p className="text-sm font-bold text-gray-900 mb-3">Detail Pesanan Awal:</p>
                      {res.items && res.items.length > 0 ? (
                        <ul className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                          {res.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center text-gray-700">
                              <span><span className="font-bold mr-1">{item.quantity}x</span> {item.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-500 italic text-center">
                          Hanya reservasi meja (tanpa pesanan)
                        </div>
                      )}
                    </div>

                    {res.status === 'confirmed' && (
                      <div className="flex gap-3">
                        <button onClick={(e) => { e.stopPropagation(); handleCancel(res.id, res.tableId); }} className="flex-1 py-3 rounded-xl text-sm font-bold bg-white text-red-600 border-2 border-red-100 hover:bg-red-50 hover:border-red-200 transition">Batalkan</button>
                        <button onClick={(e) => { e.stopPropagation(); handleComplete(res.id, res.tableId); }} className="flex-1 py-3 rounded-xl text-sm font-bold bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600 transition flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> Selesai</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {(activeTab === 'upcoming' ? upcomingRes : pastRes).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <CalendarDays className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada data reservasi</h3>
                <p className="text-gray-500 text-center max-w-sm">Data reservasi dari pelanggan akan otomatis muncul di sini.</p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
  );
}
