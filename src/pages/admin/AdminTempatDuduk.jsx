import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, UtensilsCrossed } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminTempatDuduk() {
  const { user, getRestaurant, addTable, removeTable, showToast } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);
  const [isAdding, setIsAdding] = useState(false);
  const [newTable, setNewTable] = useState({ number: '', capacity: 2, type: 'indoor' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTable.number) {
      showToast('Nomor meja wajib diisi', 'error');
      return;
    }
    const tableId = `T-${Date.now()}`;
    addTable(restaurant.id, { id: tableId, number: newTable.number, capacity: Number(newTable.capacity), type: newTable.type, status: 'available' });
    setIsAdding(false);
    setNewTable({ number: '', capacity: 2, type: 'indoor' });
    showToast('Meja berhasil ditambahkan', 'success');
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus meja ini?')) {
      removeTable(restaurant.id, id);
      showToast('Meja dihapus', 'success');
    }
  };

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-navy)]">Pengaturan Tempat Duduk</h1>
            <p className="text-[var(--color-muted)] mt-1">Kelola tata letak dan kapasitas meja di restoran Anda.</p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="app-button-primary shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Tambah Meja Baru
            </button>
          )}
        </div>

        {isAdding && (
          <div className="app-card p-8 mb-8 max-w-3xl border-2 border-[var(--color-primary-soft)]">
            <h3 className="font-bold text-[var(--color-navy)] mb-6 text-xl border-b border-[var(--color-border)] pb-4">Form Tambah Meja Baru</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Nomor / Kode Meja *</label>
                  <input type="text" value={newTable.number} onChange={e => setNewTable({...newTable, number: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white" placeholder="Contoh: A1 atau VIP-1" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Kapasitas Maksimal (Orang)</label>
                  <input type="number" value={newTable.capacity} onChange={e => setNewTable({...newTable, capacity: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white" min="1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Tipe Area</label>
                <select value={newTable.type} onChange={e => setNewTable({...newTable, type: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white">
                  <option value="indoor">Indoor (Dalam Ruangan)</option>
                  <option value="outdoor">Outdoor (Luar Ruangan)</option>
                  <option value="bar">Bar Seat</option>
                  <option value="vip">VIP Room</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold border-2 border-[var(--color-border)] text-[var(--color-charcoal)] hover:bg-[var(--color-background)] transition">Batal</button>
                <button type="submit" className="app-button-primary px-8">Simpan Meja</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {restaurant?.tables.map(table => (
            <div key={table.id} className="app-card p-6 flex flex-col items-center justify-center gap-4 relative group hover:-translate-y-1 hover:border-[var(--color-primary-soft)] transition">
              <button 
                onClick={() => handleDelete(table.id)} 
                className="absolute top-3 right-3 p-2 bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)] rounded-xl opacity-0 group-hover:opacity-100 transition hover:bg-[var(--color-terracotta)] hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center border border-[var(--color-border)] group-hover:bg-[var(--color-primary-soft)]/50 group-hover:border-[var(--color-primary-soft)] transition">
                <UtensilsCrossed className="w-8 h-8 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition" />
              </div>
              
              <div className="text-center">
                <div className="font-extrabold text-[var(--color-navy)] text-xl">{table.number}</div>
                <div className="text-xs font-semibold text-[var(--color-muted)] bg-[var(--color-background)] border border-[var(--color-border)] px-3 py-1.5 rounded-full mt-2">
                  {table.capacity} Kursi • <span className="capitalize">{table.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
  );
}
