import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Star, MapPin, Clock, Phone, Users, ShieldCheck, TicketPercent } from 'lucide-react';
import { getDensityLabel } from '../../data/mockData';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function RestaurantDetail() {
  const { navigate, pageParams, getRestaurant } = useApp();
  const restaurantId = pageParams?.id;
  const restaurant = getRestaurant(restaurantId);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center app-bg">
        <p className="text-[var(--color-navy)]">Restoran tidak ditemukan.</p>
        <button className="ml-4 text-[var(--color-primary)] font-bold hover:underline" onClick={() => navigate('customerHome')}>Kembali</button>
      </div>
    );
  }

  const densityInfo = getDensityLabel(restaurant.density);
  const totalCapacity = restaurant.tables.reduce((acc, table) => acc + table.capacity, 0);
  const availableCapacity = restaurant.tables.filter(t => t.status === 'available').reduce((acc, table) => acc + table.capacity, 0);

  return (
    <div className="app-bg flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <button 
          onClick={() => navigate('customerHome')}
          className="flex items-center text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-bold mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Pencarian
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Main Info) */}
          <div className="lg:w-2/3 space-y-8">
            <div className={`h-80 md:h-96 rounded-3xl bg-[var(--color-primary-soft)]/20 relative flex items-center justify-center overflow-hidden shadow-lg`}>
              <span className="text-9xl drop-shadow-2xl hover:scale-110 transition-transform duration-500">{restaurant.emoji}</span>
              
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-[var(--color-border)]">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-[var(--color-navy)]">{restaurant.rating}</span>
                <span className="text-[var(--color-muted)] text-sm">({restaurant.reviewCount} ulasan)</span>
              </div>
            </div>

            <div className="app-card p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-[var(--color-navy)] mb-2">{restaurant.name}</h1>
                  <p className="text-[var(--color-muted)] font-medium">{restaurant.tags.join(' • ')}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm ${densityInfo.bg} ${densityInfo.color}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${densityInfo.color.replace('text-', 'bg-')} animate-pulse`} />
                  {densityInfo.label}
                </div>
              </div>

              <p className="text-[var(--color-charcoal)] text-lg leading-relaxed mb-8">
                {restaurant.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[var(--color-primary-soft)] rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-muted)] font-semibold mb-1">Jam Operasional</p>
                    <p className="font-bold text-[var(--color-navy)]">{restaurant.openHours}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[var(--color-primary-soft)] rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-muted)] font-semibold mb-1">Lokasi</p>
                    <p className="font-bold text-[var(--color-navy)]">{restaurant.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[var(--color-primary-soft)] rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-muted)] font-semibold mb-1">Kontak</p>
                    <p className="font-bold text-[var(--color-navy)]">{restaurant.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[var(--color-primary-soft)] rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <Users className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-muted)] font-semibold mb-1">Kapasitas Tersedia</p>
                    <p className="font-bold text-[var(--color-navy)]">{availableCapacity} dari {totalCapacity} Kursi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Widget) */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              
              {/* Reservation Widget */}
              <div className="app-card p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-primary)]"></div>
                <h3 className="text-2xl font-extrabold text-[var(--color-navy)] mb-2">Reservasi Meja</h3>
                <p className="text-[var(--color-muted)] mb-6">Pesan sekarang untuk mengamankan tempat Anda.</p>
                
                <button
                  onClick={() => navigate('reservationFlow', { id: restaurant.id })}
                  className="app-button-primary"
                >
                  Mulai Reservasi
                </button>
                <p className="text-center text-xs text-[var(--color-muted)] mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Proses reservasi aman & instan
                </p>
              </div>

              {/* Promos */}
              {restaurant.promos && restaurant.promos.length > 0 && (
                <div className="app-card p-6 md:p-8">
                  <h3 className="font-bold text-[var(--color-navy)] mb-4 text-lg">Promo Tersedia</h3>
                  <div className="space-y-4">
                    {restaurant.promos.map(promo => (
                      <div key={promo.id} className="bg-[var(--color-primary-soft)]/20 border border-[var(--color-border)] p-4 rounded-2xl flex gap-4 relative overflow-hidden">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-[var(--color-border)]">
                          <TicketPercent className="w-6 h-6 text-[var(--color-terracotta)]" />
                        </div>
                        <div className="relative z-10">
                          <h4 className="font-bold text-[var(--color-navy)]">{promo.name}</h4>
                          <p className="text-sm text-[var(--color-charcoal)] leading-snug mt-1">{promo.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
