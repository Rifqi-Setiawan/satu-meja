import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Star, ChevronRight, SlidersHorizontal, TicketPercent } from 'lucide-react';
import { getDensityLabel } from '../../data/mockData';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function CustomerHome() {
  const { restaurants, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filters = ['Semua', 'Kepadatan', 'Rating Tinggi', 'Jarak Dekat', 'Promo'];

  let filteredRestaurants = restaurants.filter(r => {
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (activeFilter === 'Promo' && (!r.promos || r.promos.length === 0)) return false;
    return true;
  });

  if (activeFilter === 'Kepadatan') {
    filteredRestaurants.sort((a, b) => a.density - b.density);
  } else if (activeFilter === 'Rating Tinggi') {
    filteredRestaurants.sort((a, b) => b.rating - a.rating);
  } else if (activeFilter === 'Jarak Dekat') {
    filteredRestaurants.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }

  if (activeFilter === 'Promo') {
    filteredRestaurants = filteredRestaurants.slice(0, 1);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 space-y-8 flex-1">
        
        {/* Banner Promo */}
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden cursor-pointer" 
          onClick={() => setActiveFilter('Promo')}
        >
          <div className="relative z-10 md:w-1/2">
            <div className="inline-flex items-center bg-white/20 px-3 py-1.5 rounded-lg text-sm font-bold mb-4 backdrop-blur-sm border border-white/20">
              <TicketPercent className="w-4 h-4 mr-2" />
              Spesial Hari Ini
            </div>
            <h3 className="font-extrabold text-3xl md:text-4xl mb-3">Promo Jam Sepi</h3>
            <p className="text-orange-100 text-lg mb-6">Nikmati diskon hingga 30% untuk reservasi di jam tertentu. Jangan sampai kelewatan!</p>
            <button className="bg-white text-orange-600 text-sm font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition shadow-lg">
              Cek Restoran Promo
            </button>
          </div>
          <div className="absolute -right-10 -bottom-20 opacity-20 transform -rotate-12">
            <TicketPercent className="w-96 h-96" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Restaurant Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Rekomendasi Untukmu</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => {
                const densityInfo = getDensityLabel(restaurant.density);
                
                return (
                  <div 
                    key={restaurant.id}
                    onClick={() => navigate('restaurantDetail', { id: restaurant.id })}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all group overflow-hidden flex flex-col"
                  >
                    <div className={`h-48 flex items-center justify-center text-7xl shadow-inner bg-gradient-to-br ${restaurant.gradientClasses} relative`}>
                      {restaurant.emoji}
                      <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-md ${densityInfo.bg} ${densityInfo.color}`}>
                        <div className={`w-2 h-2 rounded-full ${densityInfo.color.replace('text-', 'bg-')} mr-1.5 animate-pulse`} />
                        {densityInfo.label} {restaurant.density}%
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-2">
                        <h3 className="font-extrabold text-xl text-gray-900 leading-tight group-hover:text-orange-600 transition truncate">{restaurant.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 truncate">{restaurant.tags.join(' • ')}</p>
                      
                      <div className="mt-auto flex items-center justify-between text-sm font-semibold text-gray-600 border-t border-gray-100 pt-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1.5 fill-yellow-500" />
                          {restaurant.rating}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1.5" />
                          {restaurant.distance}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Restoran tidak ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
