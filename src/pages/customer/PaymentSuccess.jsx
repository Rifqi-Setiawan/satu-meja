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
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate('customerHome')}>Kembali</button>
      </div>
    );
  }

  const copyId = () => {
    navigator.clipboard.writeText(reservation.id);
    showToast('ID Reservasi disalin!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomerNavbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-emerald-500 rounded-t-3xl p-10 flex flex-col items-center text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 animate-bounce mb-6">
              <CheckCircle2 className="w-24 h-24 text-white drop-shadow-md" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 relative z-10 text-center">Reservasi Berhasil!</h1>
            <p className="text-emerald-100 text-center text-lg relative z-10">Meja Anda telah diamankan.</p>
          </div>
          
          <div className="bg-white rounded-b-3xl p-8 md:p-10 shadow-xl border border-gray-100 relative pt-12">
            {/* Cutout circles for receipt effect */}
            <div className="absolute -top-4 left-6 w-8 h-8 bg-gray-50 rounded-full shadow-inner border-b border-gray-100"></div>
            <div className="absolute -top-4 right-6 w-8 h-8 bg-gray-50 rounded-full shadow-inner border-b border-gray-100"></div>
            <div className="absolute top-0 left-10 right-10 h-0 border-t-2 border-dashed border-gray-200"></div>

            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 mb-1">ID Reservasi</p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-bold text-xl text-gray-900 tracking-wider bg-gray-50 px-3 py-1 rounded-lg border">{reservation.id}</span>
                <button onClick={copyId} className="p-2 text-gray-400 hover:text-emerald-600 bg-gray-50 border rounded-lg transition" title="Copy ID">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 shrink-0">
                  {restaurant?.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{restaurant?.name}</h3>
                  <p className="text-sm text-gray-500 flex items-start">
                    <MapPin className="w-4 h-4 mr-1 mt-0.5 shrink-0" />
                    {restaurant?.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                  <CalendarDays className="w-6 h-6 text-orange-500 mb-2" />
                  <p className="text-xs text-orange-600/70 font-semibold mb-1">Tanggal</p>
                  <p className="font-bold text-orange-900">{reservation.date}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <Clock className="w-6 h-6 text-blue-500 mb-2" />
                  <p className="text-xs text-blue-600/70 font-semibold mb-1">Waktu</p>
                  <p className="font-bold text-blue-900">{reservation.time}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                  <Users className="w-6 h-6 text-purple-500 mb-2" />
                  <p className="text-xs text-purple-600/70 font-semibold mb-1">Tamu</p>
                  <p className="font-bold text-purple-900">{reservation.partySize} Orang</p>
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
              className="w-full mt-10 bg-gray-900 text-white font-bold py-4 px-4 rounded-xl hover:bg-gray-800 transition active:scale-95 flex items-center justify-center text-lg"
            >
              Selesai & Kembali <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
