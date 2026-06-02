import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { formatRupiah } from '../../data/mockData';
import AdminLayout from '../../components/AdminLayout';

export default function AdminKelolaMenu() {
  const { user, getRestaurant, addMenuItem, removeMenuItem, showToast } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Makanan', price: '', emoji: '🍲', description: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      showToast('Nama dan Harga wajib diisi', 'error');
      return;
    }
    addMenuItem(restaurant.id, { ...newItem, price: Number(newItem.price) });
    setIsAdding(false);
    setNewItem({ name: '', category: 'Makanan', price: '', emoji: '🍲', description: '' });
    showToast('Menu berhasil ditambahkan', 'success');
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus menu ini?')) {
      removeMenuItem(restaurant.id, id);
      showToast('Menu dihapus', 'success');
    }
  };

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-navy)]">Kelola Menu</h1>
            <p className="text-[var(--color-muted)] mt-1">Tambah, ubah, atau hapus daftar menu restoran Anda.</p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="app-button-primary shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Tambah Menu Baru
            </button>
          )}
        </div>

        {isAdding && (
          <div className="app-card p-8 mb-8 max-w-3xl border-2 border-[var(--color-primary-soft)]">
            <h3 className="font-bold text-[var(--color-navy)] mb-6 text-xl border-b border-[var(--color-border)] pb-4">Tambah Menu Baru</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Ikon / Emoji</label>
                  <input type="text" value={newItem.emoji} onChange={e => setNewItem({...newItem, emoji: e.target.value})} className="app-input text-center text-3xl bg-[var(--color-background)] focus:bg-white" />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Nama Menu *</label>
                  <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white" placeholder="Nasi Goreng Spesial" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Kategori</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white">
                    <option>Makanan</option>
                    <option>Minuman</option>
                    <option>Dessert</option>
                    <option>Cemilan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Harga (Rp) *</label>
                  <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white" placeholder="25000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Deskripsi Singkat</label>
                <input type="text" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="app-input bg-[var(--color-background)] focus:bg-white" placeholder="Nasi goreng dengan bumbu rahasia..." />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold border-2 border-[var(--color-border)] text-[var(--color-charcoal)] hover:bg-[var(--color-background)] transition">Batal</button>
                <button type="submit" className="app-button-primary px-8">Simpan Menu</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurant?.menu.map(item => (
            <div key={item.id} className="app-card p-6 flex flex-col group hover:-translate-y-1 hover:border-[var(--color-primary-soft)] transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-20 h-20 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                  {item.emoji}
                </div>
                <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-soft)]/50 px-3 py-1.5 rounded-lg border border-[var(--color-primary-soft)]">{item.category}</span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-extrabold text-xl text-[var(--color-navy)] mb-1">{item.name}</h4>
                <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-4">{item.description}</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 mt-auto">
                <p className="font-extrabold text-lg text-[var(--color-navy)]">{formatRupiah(item.price)}</p>
                <div className="flex gap-2">
                  <button className="p-2 text-[var(--color-primary)] bg-[var(--color-primary-soft)]/50 rounded-xl hover:bg-[var(--color-primary-soft)] transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-[var(--color-terracotta)] bg-[var(--color-terracotta)]/10 rounded-xl hover:bg-[var(--color-terracotta)]/20 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
  );
}
