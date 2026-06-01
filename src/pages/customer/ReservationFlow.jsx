import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CalendarDays, Clock, Users, UtensilsCrossed, ChevronRight, Store } from 'lucide-react';
import { formatRupiah } from '../../data/mockData';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function ReservationFlow() {
  const { navigate, pageParams, getRestaurant } = useApp();
  const restaurantId = pageParams?.id;
  const restaurant = getRestaurant(restaurantId);

  const [step, setStep] = useState(1); // 1: Time, 2: Table, 3: Menu
  
  // Reservation Data State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [partySize, setPartySize] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderItems, setOrderItems] = useState({});

  if (!restaurant) return <div>Not found</div>;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
    else navigate('restaurantDetail', { id: restaurantId });
  };

  const updateQuantity = (menuId, delta) => {
    setOrderItems(prev => {
      const current = prev[menuId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[menuId];
        return copy;
      }
      return { ...prev, [menuId]: next };
    });
  };

  const subtotal = Object.entries(orderItems).reduce((sum, [id, qty]) => {
    const item = restaurant.menu.find(m => m.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Pilih Waktu & Tamu</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-bold text-gray-700 mb-2">Tanggal Reservasi</label>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:bg-white transition" />
          </div>
        </div>
        <div>
          <label className="block font-bold text-gray-700 mb-2">Jam Kedatangan</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:bg-white transition" />
          </div>
        </div>
      </div>
      <div>
        <label className="block font-bold text-gray-700 mb-2 mt-4">Jumlah Orang</label>
        <div className="flex items-center justify-center gap-6 bg-gray-50 border border-gray-200 rounded-xl py-4 max-w-sm">
          <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition shadow-sm">-</button>
          <div className="flex items-center text-2xl font-bold w-20 justify-center text-gray-900">
            <Users className="w-6 h-6 mr-2 text-orange-500" />
            {partySize}
          </div>
          <button onClick={() => setPartySize(partySize + 1)} className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold hover:bg-orange-100 transition shadow-sm border border-orange-200">+</button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-in fade-in">
      <h3 className="text-2xl font-bold text-gray-900 mb-2 border-b pb-4">Pilih Meja</h3>
      <p className="text-gray-500 mb-6">Pilih meja yang tersedia (Warna hijau) sesuai kapasitas Anda.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {restaurant.tables.map(table => {
          const isAvailable = table.status === 'available';
          const isSelected = selectedTable === table.id;
          return (
            <button
              key={table.id}
              disabled={!isAvailable}
              onClick={() => setSelectedTable(table.id)}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition hover:-translate-y-1 ${
                !isAvailable ? 'bg-red-50 border-red-100 opacity-60 cursor-not-allowed hover:-translate-y-0' :
                isSelected ? 'bg-orange-50 border-orange-500 shadow-md' :
                'bg-white border-green-200 hover:border-green-400 hover:shadow-md shadow-sm'
              }`}
            >
              <UtensilsCrossed className={`w-10 h-10 ${!isAvailable ? 'text-red-400' : isSelected ? 'text-orange-500' : 'text-green-500'}`} />
              <div className="text-center">
                <div className="font-bold text-gray-900 text-lg">{table.number}</div>
                <div className="text-xs text-gray-500 mt-1">{table.capacity} Kursi • <span className="capitalize">{table.type}</span></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Pesan Menu (Opsional)</h3>
        <div className="bg-orange-100 px-4 py-2 rounded-xl border border-orange-200">
          <span className="font-semibold text-orange-800 mr-3">Subtotal Makanan:</span>
          <span className="font-extrabold text-orange-600 text-lg">{formatRupiah(subtotal)}</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {restaurant.menu.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-orange-200 transition">
            <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 truncate text-lg">{item.name}</h4>
              <p className="text-orange-600 font-bold mb-2">{formatRupiah(item.price)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {orderItems[item.id] ? (
                <>
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold hover:bg-gray-200">-</button>
                  <span className="w-4 text-center font-bold text-lg">{orderItems[item.id]}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold hover:bg-orange-200">+</button>
                </>
              ) : (
                <button onClick={() => updateQuantity(item.id, 1)} className="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-600 rounded-xl font-bold hover:bg-orange-100 transition">Tambah</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleProceedToPayment = () => {
    const reservationData = {
      restaurantId,
      date,
      time,
      partySize,
      tableId: selectedTable,
      orderItems,
      subtotal
    };
    navigate('paymentFlow', { reservationData });
  };

  const tableInfo = restaurant.tables.find(t => t.id === selectedTable);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-orange-600 font-bold mb-6 transition">
          <ArrowLeft className="w-5 h-5 mr-2" /> {step === 1 ? 'Kembali ke Detail' : 'Kembali'}
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-xl text-2xl border">
                  {restaurant.emoji}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{restaurant.name}</h4>
                  <p className="text-xs text-gray-500">Ringkasan Reservasi</p>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center"><CalendarDays className="w-4 h-4 mr-2"/> Tanggal</span>
                  <span className="font-bold text-gray-900">{date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-2"/> Waktu</span>
                  <span className="font-bold text-gray-900">{time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center"><Users className="w-4 h-4 mr-2"/> Tamu</span>
                  <span className="font-bold text-gray-900">{partySize} Orang</span>
                </div>
                {selectedTable && (
                  <div className="flex justify-between items-center pt-2 border-t border-dashed">
                    <span className="text-gray-500 flex items-center">Meja Terpilih</span>
                    <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">Meja {tableInfo?.number}</span>
                  </div>
                )}
              </div>

              {Object.keys(orderItems).length > 0 && (
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <p className="font-bold text-gray-900 mb-3 text-sm">Pesanan Makanan</p>
                  <div className="space-y-2 mb-4">
                    {Object.entries(orderItems).map(([id, qty]) => {
                      const item = restaurant.menu.find(m => m.id === Number(id));
                      return (
                        <div key={id} className="flex justify-between text-xs text-gray-600">
                          <span>{qty}x {item.name}</span>
                          <span className="font-semibold text-gray-900">{formatRupiah(item.price * qty)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900">Total Pembayaran</span>
                  <span className="font-extrabold text-orange-600 text-xl">{formatRupiah(subtotal)}</span>
                </div>
                {subtotal === 0 && <p className="text-xs text-gray-400">Belum ada makanan dipesan</p>}
              </div>

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={step === 2 && !selectedTable}
                  className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-xl hover:bg-orange-600 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-md"
                >
                  Langkah Selanjutnya <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-green-500 text-white font-bold py-4 px-4 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-200 active:scale-95 flex items-center justify-center text-lg"
                >
                  Lanjut ke Pembayaran
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
