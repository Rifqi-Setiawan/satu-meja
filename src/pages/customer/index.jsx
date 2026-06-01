import React, { useState, useMemo } from 'react';
import {
  Search, MapPin, Star, Clock, ArrowLeft, Bell, Home,
  BookOpen, User, Plus, Minus, Tag, Calendar, ChevronRight,
  Wallet, QrCode, Smartphone, CheckCircle, Download, X,
  Users, Coffee, UtensilsCrossed, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, getDensityLabel } from '../../data/mockData';

/* ═══════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════ */

const BottomNav = ({ active }) => {
  const { navigate } = useApp();
  const items = [
    { id: 'customerHome', icon: Home, label: 'Beranda' },
    { id: 'myReservations', icon: BookOpen, label: 'Reservasi' },
    { id: 'customerProfile', icon: User, label: 'Profil' },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 flex justify-around py-2 z-40">
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => navigate(id)}
          className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-xl transition ${
            active === id ? 'text-orange-500' : 'text-gray-400'
          }`}
        >
          <Icon size={22} strokeWidth={active === id ? 2.5 : 1.8} />
          <span className="text-[11px] font-semibold">{label}</span>
        </button>
      ))}
    </nav>
  );
};

const TopBar = ({ title, onBack, rightEl }) => (
  <div className="sticky top-0 bg-white border-b border-gray-100 z-30 flex items-center px-4 h-14">
    {onBack && (
      <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 mr-2">
        <ArrowLeft size={20} className="text-gray-700" />
      </button>
    )}
    <h2 className="flex-1 font-bold text-gray-900 text-base">{title}</h2>
    {rightEl}
  </div>
);

const DensityBar = ({ density }) => {
  const d = getDensityLabel(density);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-gray-600">Kepadatan Tempat</span>
        <span className={`font-bold ${d.color}`}>{d.label} • {density}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${density <= 30 ? 'bg-green-400' : density <= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
          style={{ width: `${density}%` }}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   CUSTOMER HOME
═══════════════════════════════════════ */
export const CustomerHome = () => {
  const { restaurants, user, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('semua');

  const FILTERS = [
    { id: 'semua', label: 'Semua' },
    { id: 'sepi', label: '🟢 Sepi' },
    { id: 'murah', label: '💰 Harga Murah' },
    { id: 'rating', label: '⭐ Rating Tinggi' },
    { id: 'jarak', label: '📍 Terdekat' },
  ];

  const filtered = useMemo(() => {
    let list = [...restaurants];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    switch (filter) {
      case 'sepi': return list.sort((a, b) => a.density - b.density);
      case 'murah': return list.sort((a, b) => parseInt(a.priceRange) - parseInt(b.priceRange));
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'jarak': return list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      default: return list;
    }
  }, [restaurants, search, filter]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Orange header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-5 pt-12 pb-20">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-orange-100 text-sm">Selamat datang,</p>
            <h2 className="text-white text-xl font-extrabold">{user?.name?.split(' ')[0]} 👋</h2>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bell size={20} className="text-white" />
          </button>
        </div>
        <div className="relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mau makan di mana?"
            className="w-full bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-gray-700 shadow-md focus:outline-none"
          />
        </div>
      </div>

      <div className="-mt-12 px-5 space-y-5">
        {/* Promo Jam Sepi Banner */}
        <button
          onClick={() => setFilter('sepi')}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 flex items-center justify-between shadow-xl"
        >
          <div className="text-left">
            <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">TERBATAS</span>
            <p className="text-white font-extrabold text-lg mt-1">Promo Jam Sepi 🌙</p>
            <p className="text-orange-100 text-xs">Diskon hingga 20% di jam-jam sepi!</p>
          </div>
          <div className="text-5xl">🎉</div>
        </button>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                filter === f.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Restaurant list */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-gray-900">Rekomendasi Untukmu</h3>
            <span className="text-xs text-gray-400 font-medium">{filtered.length} tempat</span>
          </div>
          <div className="space-y-4">
            {filtered.map((r) => (
              <RestaurantCard
                key={r.id}
                r={r}
                onClick={() => navigate('restaurantDetail', { restaurantId: r.id })}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">🔍</p>
              <p className="font-semibold">Restoran tidak ditemukan</p>
              <p className="text-sm mt-1">Coba kata kunci lain</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="customerHome" />
    </div>
  );
};

const RestaurantCard = ({ r, onClick }) => {
  const d = getDensityLabel(r.density);
  const hasJamSepi = r.promos?.some((p) => p.type === 'jam_sepi' && p.active);
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition"
    >
      <div className={`bg-gradient-to-br ${r.gradientClasses} h-40 flex items-center justify-center relative`}>
        <span className="text-7xl">{r.emoji}</span>
        {hasJamSepi && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
            JAM SEPI
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/95 rounded-xl px-2.5 py-1 flex items-center gap-1 shadow">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-extrabold text-gray-800">{r.rating}</span>
          <span className="text-[10px] text-gray-400">({r.reviewCount})</span>
        </span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-extrabold text-gray-900 text-sm leading-tight flex-1 pr-2">{r.name}</h4>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${d.bg} ${d.color}`}>
            {d.label} {r.density}%
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1"><MapPin size={11} />{r.distance}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{r.openHours}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {r.tags.slice(0, 2).map((t) => (
              <span key={t} className="bg-gray-100 text-gray-500 text-[11px] font-medium px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
          <span className="text-sm font-bold text-orange-500">{r.priceRange}</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   RESTAURANT DETAIL
═══════════════════════════════════════ */
export const RestaurantDetail = () => {
  const { navigate, pageParams, getRestaurant } = useApp();
  const r = getRestaurant(pageParams.restaurantId);
  if (!r) return null;
  const d = getDensityLabel(r.density);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${r.gradientClasses} h-56 flex items-center justify-center relative`}>
        <button
          onClick={() => navigate('customerHome')}
          className="absolute top-12 left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <span className="text-8xl">{r.emoji}</span>
      </div>

      <div className="px-5 -mt-5">
        {/* Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex justify-between items-start mb-1">
            <h1 className="font-extrabold text-xl text-gray-900 flex-1 pr-2">{r.name}</h1>
            {r.promos?.some((p) => p.type === 'jam_sepi' && p.active) && (
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">JAM SEPI</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-4">{r.description}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Rating</p>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="font-extrabold text-gray-900">{r.rating}</span>
                <span className="text-xs text-gray-400">({r.reviewCount})</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Jarak</p>
              <p className="font-extrabold text-gray-900">{r.distance}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Jam Buka</p>
              <p className="font-extrabold text-gray-900 text-sm">{r.openHours}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Harga</p>
              <p className="font-extrabold text-orange-500 text-sm">{r.priceRange}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
            <MapPin size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span>{r.address}</span>
          </div>
          <DensityBar density={r.density} />
        </div>

        {/* Promo list */}
        {r.promos?.filter((p) => p.active).length > 0 && (
          <div className="mb-4">
            <h3 className="font-extrabold text-gray-900 mb-2">Promo Tersedia</h3>
            {r.promos.filter((p) => p.active).map((promo) => (
              <div key={promo.id} className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-3 mb-2">
                <Tag size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-orange-700">{promo.name}</p>
                  <p className="text-xs text-orange-600 mt-0.5">{promo.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu preview */}
        <div className="mb-24">
          <h3 className="font-extrabold text-gray-900 mb-2">Menu Unggulan</h3>
          <div className="grid grid-cols-2 gap-2">
            {r.menu.slice(0, 4).map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{item.name}</p>
                <p className="text-xs font-extrabold text-orange-500 mt-1">{formatRupiah(item.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button
          onClick={() => navigate('reservationStep1', { restaurantId: r.id })}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 rounded-2xl text-base shadow-lg shadow-orange-200 transition active:scale-98"
        >
          Reservasi Sekarang
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   RESERVATION STEP 1 – DATE & TIME
═══════════════════════════════════════ */
export const ReservationStep1 = () => {
  const { navigate, pageParams, setCurrentReservation, getRestaurant } = useApp();
  const r = getRestaurant(pageParams.restaurantId);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState(2);

  const timeSlots = [
    '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00',
    '16:00','17:00','18:00','19:00','20:00','21:00',
  ];

  const handleNext = () => {
    setCurrentReservation({ restaurantId: r.id, date, time, partySize, items: [] });
    navigate('reservationStep2', { restaurantId: r.id });
  };

  const isJamSepi = (t) => {
    const sepiPromo = r?.promos?.find((p) => p.type === 'jam_sepi' && p.active);
    if (!sepiPromo) return false;
    return t >= sepiPromo.startTime && t < sepiPromo.endTime;
  };

  if (!r) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar title="Pilih Waktu" onBack={() => navigate('restaurantDetail', { restaurantId: r.id })} />

      {/* Step indicator */}
      <StepIndicator current={1} total={3} />

      <div className="flex-1 px-5 py-4 space-y-5 pb-32">
        {/* Date */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-orange-500" /> Pilih Tanggal
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Time slots */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-orange-500" /> Pilih Jam Kedatangan
          </label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((t) => {
              const sepi = isJamSepi(t);
              return (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`py-2.5 rounded-xl text-xs font-bold border-2 transition relative ${
                    time === t
                      ? 'bg-orange-500 border-orange-500 text-white shadow'
                      : sepi
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  {t}
                  {sepi && time !== t && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-orange-500 rounded-full border border-white" />
                  )}
                </button>
              );
            })}
          </div>
          {time && isJamSepi(time) && (
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2">
              <Tag size={14} className="text-orange-500" />
              <p className="text-xs text-orange-600 font-semibold">
                Jam ini termasuk Promo Jam Sepi! Dapatkan diskon spesial 🎉
              </p>
            </div>
          )}
        </div>

        {/* Party size */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Users size={16} className="text-orange-500" /> Jumlah Tamu
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPartySize((p) => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 transition"
            >
              <Minus size={16} />
            </button>
            <span className="text-3xl font-extrabold text-gray-900 w-8 text-center">{partySize}</span>
            <button
              onClick={() => setPartySize((p) => Math.min(10, p + 1))}
              className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition"
            >
              <Plus size={16} />
            </button>
            <span className="text-sm text-gray-500 font-medium ml-2">orang</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button
          onClick={handleNext}
          disabled={!time || !date}
          className="w-full bg-orange-500 disabled:opacity-50 hover:bg-orange-600 text-white font-extrabold py-4 rounded-2xl transition"
        >
          Pilih Meja →
        </button>
      </div>
    </div>
  );
};

const StepIndicator = ({ current, total }) => (
  <div className="bg-white px-5 py-3 flex items-center justify-center gap-2 border-b border-gray-100">
    {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
      <React.Fragment key={step}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
            step < current ? 'bg-orange-500 text-white' : step === current ? 'bg-orange-500 text-white ring-4 ring-orange-100' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {step < current ? '✓' : step}
        </div>
        {step < total && <div className={`h-0.5 w-10 rounded ${step < current ? 'bg-orange-500' : 'bg-gray-200'}`} />}
      </React.Fragment>
    ))}
    <span className="ml-2 text-xs text-gray-400 font-medium">
      {['Waktu', 'Meja', 'Menu'][current - 1]}
    </span>
  </div>
);

/* ═══════════════════════════════════════
   RESERVATION STEP 2 – TABLE SELECTION
═══════════════════════════════════════ */
export const ReservationStep2 = () => {
  const { navigate, pageParams, currentReservation, setCurrentReservation, getRestaurant } = useApp();
  const r = getRestaurant(pageParams.restaurantId);
  const [selectedTable, setSelectedTable] = useState(null);

  if (!r) return null;

  const indoorTables = r.tables.filter((t) => t.type === 'indoor');
  const outdoorTables = r.tables.filter((t) => t.type === 'outdoor');
  const barTables = r.tables.filter((t) => t.type === 'bar');

  const handleNext = () => {
    setCurrentReservation((prev) => ({ ...prev, tableId: selectedTable.id, tableNumber: selectedTable.number }));
    navigate('reservationStep3', { restaurantId: r.id });
  };

  const TableBtn = ({ table }) => {
    const isSelected = selectedTable?.id === table.id;
    const isOccupied = table.status === 'occupied';
    return (
      <button
        onClick={() => !isOccupied && setSelectedTable(table)}
        disabled={isOccupied}
        className={`rounded-xl p-3 flex flex-col items-center gap-1 border-2 transition ${
          isOccupied
            ? 'bg-red-50 border-red-200 cursor-not-allowed'
            : isSelected
            ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-200'
            : 'bg-green-50 border-green-200 hover:border-green-400'
        }`}
      >
        <UtensilsCrossed
          size={20}
          className={isOccupied ? 'text-red-400' : isSelected ? 'text-white' : 'text-green-600'}
        />
        <span className={`text-xs font-extrabold ${isOccupied ? 'text-red-400' : isSelected ? 'text-white' : 'text-green-700'}`}>
          {table.number}
        </span>
        <span className={`text-[10px] ${isOccupied ? 'text-red-300' : isSelected ? 'text-orange-100' : 'text-green-500'}`}>
          {table.capacity} kursi
        </span>
      </button>
    );
  };

  const TableGroup = ({ title, tables }) =>
    tables.length > 0 ? (
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
        <div className="grid grid-cols-4 gap-2">
          {tables.map((t) => <TableBtn key={t.id} table={t} />)}
        </div>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar title="Pilih Meja" onBack={() => navigate('reservationStep1', { restaurantId: r.id })} />
      <StepIndicator current={2} total={3} />

      <div className="flex-1 px-5 py-4 pb-32">
        {/* Legend */}
        <div className="flex gap-4 mb-4">
          {[
            { color: 'bg-green-400', label: 'Tersedia' },
            { color: 'bg-red-400', label: 'Terisi' },
            { color: 'bg-orange-500', label: 'Dipilih' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${l.color}`} />
              <span className="text-xs text-gray-600 font-medium">{l.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <TableGroup title="Indoor" tables={indoorTables} />
          <TableGroup title="Outdoor" tables={outdoorTables} />
          <TableGroup title="Bar" tables={barTables} />
        </div>

        {selectedTable && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900">Meja {selectedTable.number}</p>
              <p className="text-xs text-gray-500">Kapasitas {selectedTable.capacity} orang • {selectedTable.type}</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button
          onClick={handleNext}
          disabled={!selectedTable}
          className="w-full bg-orange-500 disabled:opacity-50 hover:bg-orange-600 text-white font-extrabold py-4 rounded-2xl transition"
        >
          Pilih Menu →
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   RESERVATION STEP 3 – MENU SELECTION
═══════════════════════════════════════ */
export const ReservationStep3 = () => {
  const { navigate, pageParams, currentReservation, setCurrentReservation, getRestaurant } = useApp();
  const r = getRestaurant(pageParams.restaurantId);
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');

  if (!r) return null;

  const categories = ['all', ...new Set(r.menu.map((m) => m.category))];
  const filteredMenu = activeCategory === 'all' ? r.menu : r.menu.filter((m) => m.category === activeCategory);

  const addItem = (item) => setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  const removeItem = (item) => setCart((prev) => {
    const next = { ...prev };
    if ((next[item.id] || 0) <= 1) delete next[item.id];
    else next[item.id]--;
    return next;
  });

  const subtotal = r.menu.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleNext = () => {
    const items = r.menu
      .filter((m) => cart[m.id])
      .map((m) => ({ menuId: m.id, name: m.name, price: m.price, emoji: m.emoji, quantity: cart[m.id] }));
    setCurrentReservation((prev) => ({ ...prev, items, subtotal }));
    navigate('reservationSummary', { restaurantId: r.id });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar title="Pilih Menu" onBack={() => navigate('reservationStep2', { restaurantId: r.id })} />
      <StepIndicator current={3} total={3} />

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100 px-5 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 py-4 pb-40 space-y-3">
        {filteredMenu.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
                <p className="font-extrabold text-orange-500 text-sm mt-1">{formatRupiah(item.price)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {qty > 0 ? (
                  <>
                    <button
                      onClick={() => removeItem(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <Minus size={14} className="text-gray-600" />
                    </button>
                    <span className="text-base font-extrabold text-gray-900 w-5 text-center">{qty}</span>
                    <button
                      onClick={() => addItem(item)}
                      className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition"
                    >
                      <Plus size={14} className="text-white" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => addItem(item)}
                    className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition shadow"
                  >
                    <Plus size={16} className="text-white" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        {totalItems > 0 && (
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 font-medium">{totalItems} item dipilih</span>
            <span className="font-extrabold text-gray-900">{formatRupiah(subtotal)}</span>
          </div>
        )}
        <button
          onClick={handleNext}
          disabled={totalItems === 0}
          className="w-full bg-orange-500 disabled:opacity-50 hover:bg-orange-600 text-white font-extrabold py-4 rounded-2xl transition"
        >
          {totalItems === 0 ? 'Pilih minimal 1 menu' : `Lihat Ringkasan →`}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   RESERVATION SUMMARY
═══════════════════════════════════════ */
export const ReservationSummary = () => {
  const { navigate, pageParams, currentReservation, setCurrentReservation, getRestaurant } = useApp();
  const r = getRestaurant(pageParams.restaurantId);

  if (!r || !currentReservation) return null;

  const sepiPromo = currentReservation.time && r.promos?.find(
    (p) => p.type === 'jam_sepi' && p.active && currentReservation.time >= p.startTime && currentReservation.time < p.endTime
  );
  const discountAmt = sepiPromo?.discount ? Math.floor(currentReservation.subtotal * sepiPromo.discount / 100) : 0;
  const total = currentReservation.subtotal - discountAmt;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <TopBar title="Ringkasan Pesanan" onBack={() => navigate('reservationStep3', { restaurantId: r.id })} />

      <div className="px-5 py-4 space-y-4">
        {/* Restaurant */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.gradientClasses} flex items-center justify-center text-2xl`}>
              {r.emoji}
            </div>
            <div>
              <p className="font-extrabold text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-500">{r.address}</p>
            </div>
          </div>
        </div>

        {/* Reservation info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h4 className="font-bold text-gray-900">Detail Reservasi</h4>
          {[
            { icon: Calendar, label: 'Tanggal', val: new Date(currentReservation.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
            { icon: Clock, label: 'Jam', val: currentReservation.time + ' WIB' },
            { icon: UtensilsCrossed, label: 'Meja', val: `Meja ${currentReservation.tableNumber}` },
            { icon: Users, label: 'Tamu', val: `${currentReservation.partySize} orang` },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500">
                <Icon size={14} />
                <span className="text-sm">{label}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{val}</span>
            </div>
          ))}
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-3">Pesanan</h4>
          <div className="space-y-3">
            {currentReservation.items.map((item) => (
              <div key={item.menuId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.quantity}× {formatRupiah(item.price)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-900">{formatRupiah(currentReservation.subtotal)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 flex items-center gap-1"><Tag size={12} />{sepiPromo.name} ({sepiPromo.discount}%)</span>
                <span className="font-bold text-green-600">-{formatRupiah(discountAmt)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-extrabold text-gray-900">Total Pembayaran</span>
              <span className="text-xl font-extrabold text-orange-500">{formatRupiah(total)}</span>
            </div>
          </div>
        </div>

        {sepiPromo && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-3">
            <Tag size={16} className="text-green-500" />
            <p className="text-sm text-green-700 font-semibold">
              Promo Jam Sepi diterapkan! Hemat {formatRupiah(discountAmt)} 🎉
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40 space-y-2">
        <button
          onClick={() => {
            setCurrentReservation((p) => ({ ...p, discountAmt, total }));
            navigate('payment', { restaurantId: r.id });
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 rounded-2xl transition shadow-lg shadow-orange-200"
        >
          Bayar {formatRupiah(total)}
        </button>
        <button
          onClick={() => navigate('customerHome')}
          className="w-full bg-gray-100 text-gray-700 font-bold py-3.5 rounded-2xl transition text-sm"
        >
          Batalkan
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   PAYMENT PAGE
═══════════════════════════════════════ */
export const PaymentPage = () => {
  const { navigate, pageParams, currentReservation, setCurrentReservation, getRestaurant } = useApp();
  const r = getRestaurant(pageParams.restaurantId);
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (!r || !currentReservation) return null;

  const methods = [
    { id: 'tunai', label: 'Tunai / Cash', icon: '💵', desc: 'Bayar langsung di kasir' },
    { id: 'qris', label: 'QRIS', icon: '📱', desc: 'Scan QR code pembayaran' },
    { id: 'dana', label: 'DANA', icon: '🔵', desc: 'Bayar via dompet DANA' },
    { id: 'gopay', label: 'GoPay', icon: '🟢', desc: 'Bayar via GoPay' },
    { id: 'shopeepay', label: 'ShopeePay', icon: '🟠', desc: 'Bayar via ShopeePay' },
  ];

  const handlePay = () => {
    setCurrentReservation((p) => ({ ...p, paymentMethod: selectedMethod }));
    if (selectedMethod === 'qris') navigate('paymentQRIS', { restaurantId: r.id });
    else navigate('paymentSuccess', { restaurantId: r.id });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Metode Pembayaran" onBack={() => navigate('reservationSummary', { restaurantId: r.id })} />

      <div className="px-5 py-4 space-y-4 pb-36">
        {/* Total */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
          <p className="text-orange-100 text-sm">Total Pembayaran</p>
          <p className="text-3xl font-extrabold">{formatRupiah(currentReservation.total)}</p>
          <p className="text-orange-200 text-xs mt-1">{r.name} • Meja {currentReservation.tableNumber}</p>
        </div>

        {/* Methods */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Pilih Metode</h4>
          <div className="space-y-2">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
                  selectedMethod === m.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-2xl w-10 flex items-center justify-center">{m.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 text-sm">{m.label}</p>
                  <p className="text-xs text-gray-500">{m.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 transition flex items-center justify-center ${
                  selectedMethod === m.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {selectedMethod === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button
          onClick={handlePay}
          disabled={!selectedMethod}
          className="w-full bg-orange-500 disabled:opacity-50 hover:bg-orange-600 text-white font-extrabold py-4 rounded-2xl transition"
        >
          {selectedMethod === 'qris' ? 'Lanjut ke QRIS →' : 'Konfirmasi Pembayaran'}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   PAYMENT QRIS
═══════════════════════════════════════ */
export const PaymentQRIS = () => {
  const { navigate, pageParams, currentReservation, makeReservation, user, showToast } = useApp();
  const [paid, setPaid] = useState(false);

  if (!currentReservation) return null;

  const handlePaid = () => {
    const res = makeReservation({ ...currentReservation, customerName: user?.name, customerId: user?.id });
    setPaid(true);
    setTimeout(() => navigate('paymentSuccess', { restaurantId: pageParams.restaurantId, reservationId: res.id }), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar title="Bayar dengan QRIS" onBack={() => navigate('payment', { restaurantId: pageParams.restaurantId })} />

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Total yang harus dibayar</p>
          <p className="text-4xl font-extrabold text-orange-500">{formatRupiah(currentReservation.total)}</p>
        </div>

        {/* Mock QR Code */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-500 font-extrabold text-lg">Satu</span>
              <span className="text-gray-800 font-extrabold text-lg">Meja</span>
            </div>
            <MockQRCode />
            <p className="text-xs text-gray-400 text-center">Scan QR ini menggunakan aplikasi e-wallet favoritmu</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 w-full">
          <p className="text-xs text-blue-700 font-semibold text-center">
            💡 Buka aplikasi GoPay, OVO, DANA, atau ShopeePay lalu scan QR di atas
          </p>
        </div>

        {paid ? (
          <div className="w-full bg-green-500 text-white font-extrabold py-4 rounded-2xl text-center">
            ✓ Pembayaran Diverifikasi...
          </div>
        ) : (
          <button
            onClick={handlePaid}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 rounded-2xl transition shadow-lg shadow-orange-200"
          >
            Saya Sudah Bayar ✓
          </button>
        )}
      </div>
    </div>
  );
};

const MockQRCode = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" className="rounded-xl">
    <rect width="180" height="180" fill="white" />
    {/* Position detection patterns */}
    <rect x="10" y="10" width="50" height="50" rx="6" fill="#1a1a1a" />
    <rect x="16" y="16" width="38" height="38" rx="4" fill="white" />
    <rect x="22" y="22" width="26" height="26" rx="3" fill="#1a1a1a" />
    <rect x="120" y="10" width="50" height="50" rx="6" fill="#1a1a1a" />
    <rect x="126" y="16" width="38" height="38" rx="4" fill="white" />
    <rect x="132" y="22" width="26" height="26" rx="3" fill="#1a1a1a" />
    <rect x="10" y="120" width="50" height="50" rx="6" fill="#1a1a1a" />
    <rect x="16" y="126" width="38" height="38" rx="4" fill="white" />
    <rect x="22" y="132" width="26" height="26" rx="3" fill="#1a1a1a" />
    {/* Data modules */}
    {[70,80,90,100,110].map(x => [70,80,90,100,110].map(y => (
      Math.sin(x * y) > 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="1" fill="#1a1a1a" /> : null
    )))}
    {[70,78,86,94,102,110,118].map((x, i) => (
      <rect key={`row-${i}`} x={x} y={70} width="6" height="6" rx="1" fill={i % 2 === 0 ? '#1a1a1a' : 'white'} />
    ))}
    {[70,78,86,94,102,110,118].map((y, i) => (
      <rect key={`col-${i}`} x={70} y={y} width="6" height="6" rx="1" fill={i % 2 === 0 ? '#1a1a1a' : 'white'} />
    ))}
    {/* Extra modules */}
    {[[78,78],[86,86],[94,94],[102,78],[110,94],[118,102],[78,94],[102,110]].map(([x,y]) => (
      <rect key={`m-${x}-${y}`} x={x} y={y} width="6" height="6" rx="1" fill="#f97316" />
    ))}
    {/* Center logo area */}
    <rect x="77" y="77" width="26" height="26" rx="4" fill="white" />
    <rect x="80" y="80" width="20" height="20" rx="3" fill="#f97316" />
    <text x="90" y="94" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">SM</text>
  </svg>
);

/* ═══════════════════════════════════════
   PAYMENT SUCCESS
═══════════════════════════════════════ */
export const PaymentSuccess = () => {
  const { navigate, pageParams, currentReservation, makeReservation, user, reservations, showToast } = useApp();
  const [confirmedRes, setConfirmedRes] = useState(null);

  React.useEffect(() => {
    if (!currentReservation) return;
    if (currentReservation.paymentMethod !== 'qris') {
      const res = makeReservation({ ...currentReservation, customerName: user?.name, customerId: user?.id });
      setConfirmedRes(res);
    } else {
      const last = reservations[reservations.length - 1];
      setConfirmedRes(last);
    }
  }, []);

  const res = confirmedRes || currentReservation;
  if (!res) return null;

  const methodLabel = {
    tunai: 'Tunai / Cash', qris: 'QRIS', dana: 'DANA', gopay: 'GoPay', shopeepay: 'ShopeePay'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-br from-green-400 to-emerald-500 px-5 pt-14 pb-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Reservasi Berhasil!</h2>
        <p className="text-green-100 text-sm mt-1">Pembayaran telah dikonfirmasi</p>
      </div>

      <div className="flex-1 px-5 py-4 pb-32 space-y-4 -mt-4">
        {/* Receipt */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-orange-50 border-b border-orange-100">
            <p className="text-xs text-gray-500 font-medium">Order ID</p>
            <p className="font-extrabold text-orange-600 text-sm">{res.orderId || confirmedRes?.orderId}</p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[
              { label: 'Tanggal', val: new Date(res.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Jam', val: `${res.time} WIB` },
              { label: 'Meja', val: `Meja ${res.tableNumber || res.tableId}` },
              { label: 'Pembayaran', val: methodLabel[res.paymentMethod] || res.paymentMethod },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-bold text-gray-900">{val}</span>
              </div>
            ))}
          </div>
          {/* Dashed separator */}
          <div className="relative px-5">
            <div className="border-t-2 border-dashed border-gray-200" />
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border border-gray-200" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border border-gray-200" />
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Detail Pesanan</p>
            {(res.items || []).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{item.emoji} {item.name} ×{item.quantity}</span>
                <span className="text-sm font-semibold text-gray-900">{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
            {res.discountAmt > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm">Diskon Jam Sepi</span>
                <span className="text-sm font-bold">-{formatRupiah(res.discountAmt)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-extrabold text-gray-900">Total</span>
              <span className="font-extrabold text-orange-500 text-lg">{formatRupiah(res.total || res.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40 space-y-2">
        <button
          onClick={() => showToast('Bukti pembayaran tersimpan!')}
          className="w-full border-2 border-orange-500 text-orange-500 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50 transition text-sm"
        >
          <Download size={16} /> Simpan Bukti Bayar
        </button>
        <button
          onClick={() => navigate('customerHome')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 rounded-2xl transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   MY RESERVATIONS
═══════════════════════════════════════ */
export const MyReservations = () => {
  const { navigate, reservations, user } = useApp();
  const myRes = reservations.filter((r) => r.customerId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 pt-12 pb-6">
        <h2 className="text-xl font-extrabold text-white">Reservasi Saya</h2>
        <p className="text-orange-100 text-sm mt-1">{myRes.length} reservasi aktif</p>
      </div>

      <div className="px-5 py-4 space-y-3">
        {myRes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-3">📅</p>
            <p className="font-bold text-gray-700">Belum ada reservasi</p>
            <p className="text-sm text-gray-400 mt-1">Yuk reservasi meja sekarang!</p>
            <button
              onClick={() => navigate('customerHome')}
              className="mt-4 bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
            >
              Cari Restoran
            </button>
          </div>
        ) : (
          myRes.map((res) => (
            <div key={res.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <p className="font-extrabold text-gray-900 text-sm">{res.orderId}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  res.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {res.status === 'confirmed' ? 'Terkonfirmasi' : res.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{new Date(res.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} • {res.time}</p>
              <p className="text-xs text-gray-500">Meja {res.tableId} • {res.items?.length} menu</p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-extrabold text-orange-500">{formatRupiah(res.totalAmount || res.total)}</span>
                <span className="text-xs text-gray-400">{res.paymentMethod}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav active="myReservations" />
    </div>
  );
};

/* ═══════════════════════════════════════
   CUSTOMER PROFILE
═══════════════════════════════════════ */
export const CustomerProfile = () => {
  const { user, logout, navigate } = useApp();

  const menus = [
    { icon: BookOpen, label: 'Riwayat Reservasi', onClick: () => navigate('myReservations') },
    { icon: Star, label: 'Ulasan Saya', onClick: () => {} },
    { icon: Bell, label: 'Notifikasi', onClick: () => {} },
    { icon: AlertCircle, label: 'Bantuan', onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 pt-12 pb-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg mb-3">
          👤
        </div>
        <h2 className="text-xl font-extrabold text-white">{user?.name}</h2>
        <p className="text-orange-100 text-sm">{user?.email}</p>
      </div>

      <div className="px-5 py-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {menus.map(({ icon: Icon, label, onClick }, i) => (
            <button
              key={label}
              onClick={onClick}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition text-left ${i > 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                <Icon size={17} className="text-orange-500" />
              </div>
              <span className="flex-1 text-sm font-semibold text-gray-800">{label}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-50 border border-red-200 text-red-500 font-bold py-4 rounded-2xl text-sm transition hover:bg-red-100"
        >
          Keluar dari Akun
        </button>
      </div>

      <BottomNav active="customerProfile" />
    </div>
  );
};
