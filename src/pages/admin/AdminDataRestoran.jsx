import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, Store, MapPin, Clock, Phone, Tag } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDataRestoran() {
  const { user, getRestaurant, updateRestaurant, showToast } = useApp();
  const restaurant = getRestaurant(user?.restaurantId || 1);
  
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    address: restaurant?.address || '',
    openHours: restaurant?.openHours || '',
    phone: restaurant?.phone || '',
    tags: restaurant?.tags?.join(', ') || '',
    description: restaurant?.description || '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    updateRestaurant(restaurant.id, {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    showToast('Data restoran berhasil diperbarui!', 'success');
  };

  return (
    <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Data Restoran</h1>
            <p className="text-gray-500 mt-1">Perbarui profil, alamat, dan jam operasional restoran Anda.</p>
          </div>
          <button onClick={handleSave} className="flex items-center text-white font-bold bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
          </button>
        </div>

        <form onSubmit={handleSave} className="max-w-4xl">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex gap-10">
            
            {/* Left Image Section */}
            <div className="w-1/3 flex flex-col items-center">
              <div className={`w-full aspect-square rounded-3xl bg-gradient-to-br ${restaurant.gradientClasses} flex items-center justify-center text-8xl mb-6 shadow-inner relative group`}>
                {restaurant?.emoji}
                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white font-bold">Ubah Foto</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-center">Format gambar yang didukung: JPG, PNG, atau SVG. Maksimal 2MB.</p>
            </div>

            {/* Right Form Section */}
            <div className="w-2/3 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Restoran</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Operasional</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="openHours" value={formData.openHours} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">No Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori (Pisahkan dengan koma)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-lg leading-relaxed"></textarea>
              </div>
            </div>

          </div>
        </form>
      </AdminLayout>
  );
}
