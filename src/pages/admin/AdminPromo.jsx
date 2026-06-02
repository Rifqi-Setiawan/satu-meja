import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, TicketPercent, Check, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

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
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-navy)]">Kelola Promo</h1>
            <p className="text-[var(--color-muted)] mt-1">Buat kampanye promosi dan diskon untuk menarik lebih banyak pelanggan.</p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="app-button-primary shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Buat Promo Baru
            </button>
          )}
        </div>

        {isAdding && (
          <div className="app-card p-8 mb-8 max-w-3xl border-2 border-[var(--color-primary-soft)]">
            <h3 className="font-bold text-[var(--color-navy)] mb-6 text-xl border-b border-[var(--color-border)] pb-4">Form Buat Promo Baru</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Nama Promo *</label>
                <input type="text" value={newPromo.name} onChange={e => setNewPromo({...newPromo, name: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white" placeholder="Contoh: Promo Spesial Weekend" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Deskripsi Singkat *</label>
                <input type="text" value={newPromo.description} onChange={e => setNewPromo({...newPromo, description: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white" placeholder="Diskon 20% untuk semua menu makanan..." />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Diskon (%)</label>
                  <input type="number" value={newPromo.discount} onChange={e => setNewPromo({...newPromo, discount: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Tipe Promo</label>
                  <select value={newPromo.type} onChange={e => setNewPromo({...newPromo, type: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white">
                    <option value="umum">Umum</option>
                    <option value="jam_sepi">Jam Sepi (Happy Hour)</option>
                    <option value="bundle">Paket / Bundle</option>
                  </select>
                </div>
              </div>
              
              {newPromo.type === 'jam_sepi' && (
                <div className="grid grid-cols-2 gap-6 p-6 bg-[var(--color-primary-soft)]/20 rounded-2xl border border-[var(--color-primary-soft)]">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-navy)] mb-2">Berlaku Mulai Pukul</label>
                    <input type="time" value={newPromo.startTime} onChange={e => setNewPromo({...newPromo, startTime: e.target.value})} className="app-input bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-navy)] mb-2">Berakhir Pukul</label>
                    <input type="time" value={newPromo.endTime} onChange={e => setNewPromo({...newPromo, endTime: e.target.value})} className="app-input bg-white" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold border-2 border-[var(--color-border)] text-[var(--color-charcoal)] hover:bg-[var(--color-background)] transition">Batal</button>
                <button type="submit" className="app-button-primary px-8">Terbitkan Promo</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(!restaurant?.promos || restaurant.promos.length === 0) ? (
             <div className="app-card col-span-full text-center py-20">
                <TicketPercent className="w-16 h-16 text-[var(--color-muted)] mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2">Belum ada promo aktif</h3>
                <p className="text-[var(--color-muted)]">Klik "Buat Promo Baru" untuk mulai menarik pelanggan.</p>
             </div>
          ) : (
            restaurant.promos.map(promo => (
              <div key={promo.id} className={`p-6 rounded-3xl border-2 flex flex-col gap-4 relative overflow-hidden transition ${promo.active ? 'bg-white border-[var(--color-border)] hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-primary-soft)]' : 'bg-[var(--color-background)] border-[var(--color-border)] grayscale opacity-75'}`}>
                {promo.active && <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-soft)] rounded-full -mr-10 -mt-10 blur-2xl"></div>}
                
                <div className="flex items-start justify-between relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${promo.active ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-navy)] text-white' : 'bg-[var(--color-border)] text-[var(--color-muted)]'}`}>
                    <TicketPercent className="w-7 h-7" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${promo.type === 'jam_sepi' ? 'bg-[var(--color-primary-soft)]/50 text-[var(--color-primary)] border-[var(--color-primary-soft)]' : 'bg-[var(--color-background)] text-[var(--color-charcoal)] border-[var(--color-border)]'}`}>
                    {promo.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="relative z-10 flex-1">
                  <h4 className={`text-xl font-extrabold mb-2 ${promo.active ? 'text-[var(--color-navy)]' : 'text-[var(--color-muted)]'}`}>{promo.name}</h4>
                  <p className="text-[var(--color-muted)] mb-4">{promo.description}</p>
                  
                  {promo.type === 'jam_sepi' && (
                    <div className="inline-flex items-center gap-2 bg-[var(--color-primary-soft)]/20 px-3 py-1.5 rounded-lg text-sm font-semibold text-[var(--color-primary)] mb-4 border border-[var(--color-primary-soft)]">
                      ⏱ {promo.startTime} - {promo.endTime}
                    </div>
                  )}
                </div>
                  
                <button 
                  onClick={() => { togglePromo(restaurant.id, promo.id); showToast(promo.active ? 'Promo dinonaktifkan' : 'Promo diaktifkan', 'success'); }}
                  className={`relative z-10 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition border-2 ${promo.active ? 'bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)] border-[var(--color-terracotta)]/20 hover:bg-[var(--color-terracotta)]/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                >
                  {promo.active ? <><X className="w-5 h-5" /> Nonaktifkan Promo</> : <><Check className="w-5 h-5" /> Aktifkan Kembali</>}
                </button>
              </div>
            ))
          )}
        </div>
      </AdminLayout>
  );
}
