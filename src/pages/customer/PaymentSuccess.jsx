import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Copy, MapPin, CalendarDays, Clock, Users, ArrowRight } from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function PaymentSuccess() {
  const { navigate, pageParams, reservations, getRestaurant, showToast } = useApp();
  const { reservationId } = pageParams || {};
  
  const reservation = reservations.find(r => r.id === reservationId);
  const restaurant = getRestaurant(reservation?.restaurantId);

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center app-bg">
        <button className="text-[var(--color-primary)] font-bold hover:underline" onClick={() => navigate('customerHome')}>Kembali</button>
      </div>
    );
  }

  const copyId = () => {
    navigator.clipboard.writeText(reservation.id);
    showToast('ID Reservasi disalin!', 'success');
  };

  return (
    <div className="app-bg flex flex-col">
      <CustomerNavbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-emerald-400 rounded-t-3xl p-10 flex flex-col items-center text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10 animate-bounce mb-6">
              <CheckCircle2 className="w-24 h-24 text-white drop-shadow-md" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 relative z-10 text-center">Reservasi Berhasil!</h1>
            <p className="text-emerald-50 text-center text-lg relative z-10">Meja Anda telah diamankan.</p>
          </div>
          
          <div className="bg-white rounded-b-3xl p-8 md:p-10 shadow-xl border border-[var(--color-border)] relative pt-12">
            {/* Cutout circles for receipt effect */}
            <div className="absolute -top-4 left-6 w-8 h-8 bg-[var(--color-background)] rounded-full shadow-inner border-b border-[var(--color-border)]"></div>
            <div className="absolute -top-4 right-6 w-8 h-8 bg-[var(--color-background)] rounded-full shadow-inner border-b border-[var(--color-border)]"></div>
            <div className="absolute top-0 left-10 right-10 h-0 border-t-2 border-dashed border-[var(--color-border)]"></div>

            <div className="text-center mb-8">
              <p className="text-sm text-[var(--color-muted)] mb-1">ID Reservasi</p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-bold text-xl text-[var(--color-navy)] tracking-wider bg-[var(--color-background)] px-3 py-1 rounded-lg border border-[var(--color-border)]">{reservation.id}</span>
                <button onClick={copyId} className="p-2 text-[var(--color-muted)] hover:text-emerald-500 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg transition" title="Copy ID">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm border border-[var(--color-border)] shrink-0">
                  {restaurant?.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-navy)] text-lg mb-1">{restaurant?.name}</h3>
                  <p className="text-sm text-[var(--color-muted)] flex items-start">
                    <MapPin className="w-4 h-4 mr-1 mt-0.5 shrink-0" />
                    {restaurant?.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-terracotta)]/10 p-4 rounded-2xl border border-[var(--color-terracotta)]/20">
                  <CalendarDays className="w-6 h-6 text-[var(--color-terracotta)] mb-2" />
                  <p className="text-xs text-[var(--color-terracotta)]/80 font-semibold mb-1">Tanggal</p>
                  <p className="font-bold text-[var(--color-terracotta)]">{reservation.date}</p>
                </div>
                <div className="bg-[var(--color-primary-soft)] p-4 rounded-2xl border border-[var(--color-primary-soft)]/50">
                  <Clock className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <p className="text-xs text-[var(--color-primary)]/80 font-semibold mb-1">Waktu</p>
                  <p className="font-bold text-[var(--color-primary)]">{reservation.time}</p>
                </div>
                <div className="bg-[var(--color-primary-soft)]/50 p-4 rounded-2xl border border-[var(--color-primary-soft)]">
                  <Users className="w-6 h-6 text-[var(--color-navy)] mb-2" />
                  <p className="text-xs text-[var(--color-navy)]/70 font-semibold mb-1">Tamu</p>
                  <p className="font-bold text-[var(--color-navy)]">{reservation.partySize} Orang</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="w-6 h-6 rounded bg-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2 border border-emerald-300">
                    {reservation.tableId}
                  </div>
                  <p className="text-xs text-emerald-600/70 font-semibold mb-1">Nomor Meja</p>
                  <p className="font-bold text-emerald-900">Meja {reservation.tableId}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('customerHome')}
              className="w-full mt-10 bg-[var(--color-navy)] text-white font-bold py-4 px-4 rounded-xl hover:opacity-90 transition active:scale-95 flex items-center justify-center text-lg"
            >
              Selesai & Kembali <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
