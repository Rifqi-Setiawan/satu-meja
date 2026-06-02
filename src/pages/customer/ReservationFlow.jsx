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
      <h3 className="text-2xl font-bold text-[var(--color-navy)] mb-6 border-b border-[var(--color-border)] pb-4">Pilih Waktu & Tamu</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-bold text-[var(--color-navy)] mb-2">Tanggal Reservasi</label>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="app-input pl-12 bg-[var(--color-background)] focus:bg-white" />
          </div>
        </div>
        <div>
          <label className="block font-bold text-[var(--color-navy)] mb-2">Jam Kedatangan</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="app-input pl-12 bg-[var(--color-background)] focus:bg-white" />
          </div>
        </div>
      </div>
      <div>
        <label className="block font-bold text-[var(--color-navy)] mb-2 mt-4">Jumlah Orang</label>
        <div className="flex items-center justify-center gap-6 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl py-4 max-w-sm">
          <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="w-12 h-12 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition shadow-sm text-[var(--color-charcoal)]">-</button>
          <div className="flex items-center text-2xl font-bold w-20 justify-center text-[var(--color-navy)]">
            <Users className="w-6 h-6 mr-2 text-[var(--color-primary)]" />
            {partySize}
          </div>
          <button onClick={() => setPartySize(partySize + 1)} className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-xl font-bold hover:opacity-80 transition shadow-sm border border-[var(--color-primary)]">+</button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-in fade-in">
      <h3 className="text-2xl font-bold text-[var(--color-navy)] mb-2 border-b border-[var(--color-border)] pb-4">Pilih Meja</h3>
      <p className="text-[var(--color-muted)] mb-6">Pilih meja yang tersedia sesuai kapasitas Anda.</p>
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
                !isAvailable ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed hover:-translate-y-0' :
                isSelected ? 'bg-[var(--color-primary-soft)] border-[var(--color-primary)] shadow-md' :
                'bg-white border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md shadow-sm'
              }`}
            >
              <UtensilsCrossed className={`w-10 h-10 ${!isAvailable ? 'text-[var(--color-muted)]' : isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-charcoal)]'}`} />
              <div className="text-center">
                <div className="font-bold text-[var(--color-navy)] text-lg">{table.number}</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">{table.capacity} Kursi • <span className="capitalize">{table.type}</span></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4 mb-6">
        <h3 className="text-2xl font-bold text-[var(--color-navy)]">Pesan Menu (Opsional)</h3>
        <div className="bg-[var(--color-primary-soft)]/30 px-4 py-2 rounded-xl border border-[var(--color-primary-soft)]">
          <span className="font-semibold text-[var(--color-navy)] mr-3">Subtotal Makanan:</span>
          <span className="font-extrabold text-[var(--color-terracotta)] text-lg">{formatRupiah(subtotal)}</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {restaurant.menu.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:border-[var(--color-primary)] transition">
            <div className="w-20 h-20 bg-[var(--color-background)] rounded-xl flex items-center justify-center text-4xl shrink-0 border border-[var(--color-border)]">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[var(--color-navy)] truncate text-lg">{item.name}</h4>
              <p className="text-[var(--color-terracotta)] font-bold mb-2">{formatRupiah(item.price)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {orderItems[item.id] ? (
                <>
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-[var(--color-background)] text-[var(--color-charcoal)] flex items-center justify-center font-bold hover:bg-gray-200 border border-[var(--color-border)]">-</button>
                  <span className="w-4 text-center font-bold text-lg text-[var(--color-navy)]">{orderItems[item.id]}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center font-bold hover:opacity-80 border border-[var(--color-primary)]">+</button>
                </>
              ) : (
                <button onClick={() => updateQuantity(item.id, 1)} className="px-4 py-2 bg-[var(--color-primary-soft)]/50 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl font-bold hover:bg-[var(--color-primary-soft)] transition">Tambah</button>
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
    <div className="app-bg flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <button onClick={handleBack} className="flex items-center text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-bold mb-6 transition">
          <ArrowLeft className="w-5 h-5 mr-2" /> {step === 1 ? 'Kembali ke Detail' : 'Kembali'}
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="lg:w-2/3">
            <div className="app-card p-8 min-h-[500px]">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 app-card p-6">
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4 mb-4">
                <div className="w-12 h-12 bg-[var(--color-background)] flex items-center justify-center rounded-xl text-2xl border border-[var(--color-border)]">
                  {restaurant.emoji}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-navy)]">{restaurant.name}</h4>
                  <p className="text-xs text-[var(--color-muted)]">Ringkasan Reservasi</p>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-muted)] flex items-center"><CalendarDays className="w-4 h-4 mr-2"/> Tanggal</span>
                  <span className="font-bold text-[var(--color-navy)]">{date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-muted)] flex items-center"><Clock className="w-4 h-4 mr-2"/> Waktu</span>
                  <span className="font-bold text-[var(--color-navy)]">{time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-muted)] flex items-center"><Users className="w-4 h-4 mr-2"/> Tamu</span>
                  <span className="font-bold text-[var(--color-navy)]">{partySize} Orang</span>
                </div>
                {selectedTable && (
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-[var(--color-border)]">
                    <span className="text-[var(--color-muted)] flex items-center">Meja Terpilih</span>
                    <span className="font-bold text-[var(--color-primary)] bg-[var(--color-primary-soft)] px-2 py-1 rounded">Meja {tableInfo?.number}</span>
                  </div>
                )}
              </div>

              {Object.keys(orderItems).length > 0 && (
                <div className="border-t border-[var(--color-border)] pt-4 mb-6">
                  <p className="font-bold text-[var(--color-navy)] mb-3 text-sm">Pesanan Makanan</p>
                  <div className="space-y-2 mb-4">
                    {Object.entries(orderItems).map(([id, qty]) => {
                      const item = restaurant.menu.find(m => m.id === Number(id));
                      return (
                        <div key={id} className="flex justify-between text-xs text-[var(--color-charcoal)]">
                          <span>{qty}x {item.name}</span>
                          <span className="font-semibold text-[var(--color-navy)]">{formatRupiah(item.price * qty)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-[var(--color-border)] pt-4 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[var(--color-navy)]">Total Pembayaran</span>
                  <span className="font-extrabold text-[var(--color-terracotta)] text-xl">{formatRupiah(subtotal)}</span>
                </div>
                {subtotal === 0 && <p className="text-xs text-[var(--color-muted)]">Belum ada makanan dipesan</p>}
              </div>

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={step === 2 && !selectedTable}
                  className="app-button-primary flex items-center justify-center text-lg shadow-md"
                >
                  Langkah Selanjutnya <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleProceedToPayment}
                  className="app-button-primary flex items-center justify-center text-lg"
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
