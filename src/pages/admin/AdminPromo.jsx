import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, TicketPercent, Check, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminPromo() {
  const { user, getRestaurant, addPromo, togglePromo, showToast } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);
  const [isAdding, setIsAdding] = useState(false);
  const [newPromo, setNewPromo] = useState({ name: '', description: '', discount: 0, type: 'umum', startTime: '', endTime: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newPromo.name || !newPromo.description) {
      showToast('Nama dan Deskripsi wajib diisi', 'error');
      return;
    }
    addPromo(restaurant.id, { ...newPromo, active: true, discount: Number(newPromo.discount) });
    setIsAdding(false);
    setNewPromo({ name: '', description: '', discount: 0, type: 'umum', startTime: '', endTime: '' });
    showToast('Promo berhasil ditambahkan', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Kelola Promo</h1>
            <p className="text-gray-500 mt-1">Buat kampanye promosi dan diskon untuk menarik lebih banyak pelanggan.</p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="flex items-center text-white font-bold bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <Plus className="w-5 h-5 mr-2" /> Buat Promo Baru
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100 mb-8 max-w-3xl">
            <h3 className="font-bold text-gray-900 mb-6 text-xl border-b pb-4">Form Buat Promo Baru</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Promo *</label>
                <input type="text" value={newPromo.name} onChange={e => setNewPromo({...newPromo, name: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" placeholder="Contoh: Promo Spesial Weekend" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat *</label>
                <input type="text" value={newPromo.description} onChange={e => setNewPromo({...newPromo, description: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" placeholder="Diskon 20% untuk semua menu makanan..." />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Diskon (%)</label>
                  <input type="number" value={newPromo.discount} onChange={e => setNewPromo({...newPromo, discount: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Promo</label>
                  <select value={newPromo.type} onChange={e => setNewPromo({...newPromo, type: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg">
                    <option value="umum">Umum</option>
                    <option value="jam_sepi">Jam Sepi (Happy Hour)</option>
                    <option value="bundle">Paket / Bundle</option>
                  </select>
                </div>
              </div>
              
              {newPromo.type === 'jam_sepi' && (
                <div className="grid grid-cols-2 gap-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">Berlaku Mulai Pukul</label>
                    <input type="time" value={newPromo.startTime} onChange={e => setNewPromo({...newPromo, startTime: e.target.value})} className="w-full p-4 border border-white rounded-xl focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">Berakhir Pukul</label>
                    <input type="time" value={newPromo.endTime} onChange={e => setNewPromo({...newPromo, endTime: e.target.value})} className="w-full p-4 border border-white rounded-xl focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">Batal</button>
                <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Terbitkan Promo</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(!restaurant?.promos || restaurant.promos.length === 0) ? (
             <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100">
                <TicketPercent className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada promo aktif</h3>
                <p className="text-gray-500">Klik "Buat Promo Baru" untuk mulai menarik pelanggan.</p>
             </div>
          ) : (
            restaurant.promos.map(promo => (
              <div key={promo.id} className={`p-6 rounded-3xl border-2 flex flex-col gap-4 relative overflow-hidden transition hover:-translate-y-1 hover:shadow-lg ${promo.active ? 'bg-white border-orange-100' : 'bg-gray-50 border-gray-200 grayscale opacity-75'}`}>
                {promo.active && <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>}
                
                <div className="flex items-start justify-between relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${promo.active ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <TicketPercent className="w-7 h-7" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${promo.type === 'jam_sepi' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {promo.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="relative z-10 flex-1">
                  <h4 className={`text-xl font-extrabold mb-2 ${promo.active ? 'text-gray-900' : 'text-gray-600'}`}>{promo.name}</h4>
                  <p className="text-gray-500 mb-4">{promo.description}</p>
                  
                  {promo.type === 'jam_sepi' && (
                    <div className="inline-flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-semibold text-purple-700 mb-4 border border-purple-100">
                      ⏱ {promo.startTime} - {promo.endTime}
                    </div>
                  )}
                </div>
                  
                <button 
                  onClick={() => { togglePromo(restaurant.id, promo.id); showToast(promo.active ? 'Promo dinonaktifkan' : 'Promo diaktifkan', 'success'); }}
                  className={`relative z-10 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition border-2 ${promo.active ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'}`}
                >
                  {promo.active ? <><X className="w-5 h-5" /> Nonaktifkan Promo</> : <><Check className="w-5 h-5" /> Aktifkan Kembali</>}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
