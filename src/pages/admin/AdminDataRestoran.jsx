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
            <h1 className="text-3xl font-extrabold text-[var(--color-navy)]">Data Restoran</h1>
            <p className="text-[var(--color-muted)] mt-1">Perbarui profil, alamat, dan jam operasional restoran Anda.</p>
          </div>
          <button onClick={handleSave} className="app-button-primary shadow-lg">
            <Save className="w-5 h-5 mr-2" /> Simpan Perubahan
          </button>
        </div>

        <form onSubmit={handleSave} className="max-w-4xl">
          <div className="app-card p-10 flex flex-col md:flex-row gap-10">
            
            {/* Left Image Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className={`w-full aspect-square rounded-3xl bg-[var(--color-primary-soft)]/20 border border-[var(--color-border)] flex items-center justify-center text-8xl mb-6 shadow-inner relative group`}>
                {restaurant?.emoji}
                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white font-bold">Ubah Foto</span>
                </div>
              </div>
              <p className="text-sm text-[var(--color-muted)] text-center">Format gambar yang didukung: JPG, PNG, atau SVG. Maksimal 2MB.</p>
            </div>

            {/* Right Form Section */}
            <div className="w-full md:w-2/3 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Nama Restoran</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="app-input pl-12 bg-[var(--color-background)] focus:bg-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Alamat Lengkap</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="app-input pl-12 bg-[var(--color-background)] focus:bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Jam Operasional</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
                    <input type="text" name="openHours" value={formData.openHours} onChange={handleChange} className="app-input pl-12 bg-[var(--color-background)] focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">No Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="app-input pl-12 bg-[var(--color-background)] focus:bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Kategori (Pisahkan dengan koma)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="app-input pl-12 bg-[var(--color-background)] focus:bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Deskripsi Singkat</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-4 border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-background)] focus:bg-white text-lg leading-relaxed text-[var(--color-charcoal)]"></textarea>
              </div>
            </div>

          </div>
        </form>
      </AdminLayout>
  );
}
