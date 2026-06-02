import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Wallet, QrCode, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../../data/mockData';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function PaymentFlow() {
  const { navigate, pageParams, makeReservation, user, getRestaurant } = useApp();
  const { reservationData } = pageParams || {};
  
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!reservationData) return <div>Data tidak valid</div>;

  const paymentMethods = [
    { id: 'qris', name: 'QRIS', icon: QrCode, color: 'text-[var(--color-primary)]' },
    { id: 'gopay', name: 'GoPay', icon: Wallet, color: 'text-[var(--color-navy)]' },
    { id: 'dana', name: 'DANA', icon: Wallet, color: 'text-[var(--color-primary)]' },
    { id: 'shopeepay', name: 'ShopeePay', icon: Wallet, color: 'text-[var(--color-terracotta)]' },
    { id: 'cash', name: 'Tunai di Kasir', icon: Banknote, color: 'text-[var(--color-navy)]' },
  ];

  const handlePay = () => {
    if (!selectedMethod) return;
    
    if (selectedMethod === 'qris' && !showQR) {
      setShowQR(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const restaurant = getRestaurant(reservationData.restaurantId);
      
      const newItems = Object.entries(reservationData.orderItems).map(([id, qty]) => {
        const menuItem = restaurant.menu.find(m => m.id === Number(id));
        return { menuId: Number(id), name: menuItem.name, price: menuItem.price, quantity: qty };
      });

      const newReservation = makeReservation({
        restaurantId: reservationData.restaurantId,
        tableId: reservationData.tableId,
        customerId: user?.id || 999,
        customerName: user?.name || 'Guest',
        date: reservationData.date,
        time: reservationData.time,
        partySize: reservationData.partySize,
        items: newItems,
        subtotal: reservationData.subtotal,
        discount: 0,
        totalAmount: reservationData.subtotal,
        paymentMethod: selectedMethod.toUpperCase(),
      });

      setIsProcessing(false);
      navigate('paymentSuccess', { reservationId: newReservation.id });
    }, 1500);
  };

  return (
    <div className="app-bg flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <button onClick={() => showQR ? setShowQR(false) : navigate('reservationFlow', { id: reservationData.restaurantId })} className="flex items-center text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-bold mb-6 transition">
          <ArrowLeft className="w-5 h-5 mr-2" /> {showQR ? 'Kembali Pilih Metode' : 'Kembali ke Reservasi'}
        </button>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
          
          <div className="w-full md:w-1/2">
            <div className="app-card p-8 md:p-10">
              {showQR ? (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <h2 className="text-3xl font-extrabold text-[var(--color-navy)] mb-2">Scan QRIS</h2>
                  <p className="text-[var(--color-muted)] mb-8 text-lg">Buka aplikasi m-banking atau e-wallet Anda.</p>
                  
                  <div className="w-72 h-72 bg-[var(--color-background)] rounded-3xl flex items-center justify-center mb-8 border-8 border-[var(--color-primary-soft)] relative overflow-hidden">
                    <QrCode className="w-40 h-40 text-[var(--color-muted)]" />
                    <div className="absolute inset-0 bg-[var(--color-primary)]/10 animate-pulse"></div>
                  </div>
                  
                  <div className="text-4xl font-extrabold text-[var(--color-terracotta)] mb-4">
                    {formatRupiah(reservationData.subtotal)}
                  </div>
                  <div className="flex items-center text-[var(--color-primary)] bg-[var(--color-primary-soft)]/50 px-4 py-2 rounded-full font-bold mb-8 shadow-sm">
                    <ShieldCheck className="w-5 h-5 mr-2" /> Transaksi Aman & Terenkripsi
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-primary)] rounded-2xl p-8 text-white shadow-lg mb-10">
                    <p className="text-[var(--color-primary-soft)] font-medium mb-2 text-lg">Total Tagihan</p>
                    <h2 className="text-5xl font-extrabold">{formatRupiah(reservationData.subtotal)}</h2>
                  </div>

                  <h3 className="text-2xl font-bold text-[var(--color-navy)] mb-6">Pilih Metode Pembayaran</h3>
                  <div className="space-y-4">
                    {paymentMethods.map(method => {
                      const Icon = method.icon;
                      const isSelected = selectedMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`w-full flex items-center p-5 rounded-2xl border-2 transition hover:-translate-y-0.5 ${
                            isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 shadow-md' : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary-soft)] shadow-sm'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl bg-[var(--color-background)] flex items-center justify-center mr-5 border border-[var(--color-border)] ${method.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-[var(--color-charcoal)] flex-1 text-left text-lg">{method.name}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-border)] bg-white'
                          }`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <button
                onClick={handlePay}
                disabled={!selectedMethod || isProcessing}
                className="app-button-primary mt-10 text-xl py-5"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Memproses Pembayaran...</span>
                ) : showQR ? (
                  'Saya Sudah Bayar'
                ) : (
                  'Bayar Sekarang'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
