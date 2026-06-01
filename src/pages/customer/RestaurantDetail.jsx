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
      <div className="min-h-screen flex items-center justify-center">
        <p>Restoran tidak ditemukan.</p>
        <button onClick={() => navigate('customerHome')}>Kembali</button>
      </div>
    );
  }

  const densityInfo = getDensityLabel(restaurant.density);
  const totalCapacity = restaurant.tables.reduce((acc, table) => acc + table.capacity, 0);
  const availableCapacity = restaurant.tables.filter(t => t.status === 'available').reduce((acc, table) => acc + table.capacity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <button 
          onClick={() => navigate('customerHome')}
          className="flex items-center text-gray-600 hover:text-orange-600 font-bold mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Pencarian
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Main Info) */}
          <div className="lg:w-2/3 space-y-8">
            <div className={`h-80 md:h-96 rounded-3xl bg-gradient-to-br ${restaurant.gradientClasses} relative flex items-center justify-center overflow-hidden shadow-lg`}>
              <span className="text-9xl drop-shadow-2xl hover:scale-110 transition-transform duration-500">{restaurant.emoji}</span>
              
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-gray-900">{restaurant.rating}</span>
                <span className="text-gray-500 text-sm">({restaurant.reviewCount} ulasan)</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{restaurant.name}</h1>
                  <p className="text-gray-500 font-medium">{restaurant.tags.join(' • ')}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm ${densityInfo.bg} ${densityInfo.color}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${densityInfo.color.replace('text-', 'bg-')} animate-pulse`} />
                  {densityInfo.label}
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {restaurant.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Jam Operasional</p>
                    <p className="font-bold text-gray-900">{restaurant.openHours}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Lokasi</p>
                    <p className="font-bold text-gray-900">{restaurant.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <Phone className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Kontak</p>
                    <p className="font-bold text-gray-900">{restaurant.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mr-4 shrink-0">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Kapasitas Tersedia</p>
                    <p className="font-bold text-gray-900">{availableCapacity} dari {totalCapacity} Kursi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Widget) */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              
              {/* Reservation Widget */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Reservasi Meja</h3>
                <p className="text-gray-500 mb-6">Pesan sekarang untuk mengamankan tempat Anda.</p>
                
                <button
                  onClick={() => navigate('reservationFlow', { id: restaurant.id })}
                  className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition active:scale-95 text-lg flex items-center justify-center"
                >
                  Mulai Reservasi
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Proses reservasi aman & instan
                </p>
              </div>

              {/* Promos */}
              {restaurant.promos && restaurant.promos.length > 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Promo Tersedia</h3>
                  <div className="space-y-4">
                    {restaurant.promos.map(promo => (
                      <div key={promo.id} className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-4 relative overflow-hidden">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                          <TicketPercent className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="relative z-10">
                          <h4 className="font-bold text-orange-800">{promo.name}</h4>
                          <p className="text-sm text-orange-600/80 leading-snug mt-1">{promo.description}</p>
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
