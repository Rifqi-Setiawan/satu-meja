import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { formatRupiah } from '../../data/mockData';
import AdminSidebar from '../../components/AdminSidebar';

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
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Kelola Menu</h1>
            <p className="text-gray-500 mt-1">Tambah, ubah, atau hapus daftar menu restoran Anda.</p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="flex items-center text-white font-bold bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <Plus className="w-5 h-5 mr-2" /> Tambah Menu Baru
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100 mb-8 max-w-3xl">
            <h3 className="font-bold text-gray-900 mb-6 text-xl border-b pb-4">Tambah Menu Baru</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ikon / Emoji</label>
                  <input type="text" value={newItem.emoji} onChange={e => setNewItem({...newItem, emoji: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl text-center text-3xl focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Menu *</label>
                  <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" placeholder="Nasi Goreng Spesial" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg">
                    <option>Makanan</option>
                    <option>Minuman</option>
                    <option>Dessert</option>
                    <option>Cemilan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rp) *</label>
                  <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" placeholder="25000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat</label>
                <input type="text" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" placeholder="Nasi goreng dengan bumbu rahasia..." />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">Batal</button>
                <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Simpan Menu</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurant?.menu.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                  {item.emoji}
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">{item.category}</span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-extrabold text-xl text-gray-900 mb-1">{item.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <p className="font-extrabold text-lg text-gray-900">{formatRupiah(item.price)}</p>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
