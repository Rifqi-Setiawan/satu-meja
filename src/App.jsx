import React from 'react';
import { useApp } from './context/AppContext';
import { WelcomePage, LoginPage, RegisterPage, RoleSelectionPage } from './pages/auth';
import { CustomerHome, RestaurantDetail, ReservationFlow, PaymentFlow, PaymentSuccess } from './pages/customer';
import { AdminDashboard, AdminDataRestoran, AdminKelolaMenu, AdminTempatDuduk, AdminPromo, AdminDataReservasi, AdminDataPesanan, AdminLaporan } from './pages/admin';

function App() {
  const { currentPage, toast } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome': return <WelcomePage />;
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'roleSelection': return <RoleSelectionPage />;
      
      // Customer Portal
      case 'customerHome': return <CustomerHome />;
      case 'restaurantDetail': return <RestaurantDetail />;
      case 'reservationFlow': return <ReservationFlow />;
      case 'paymentFlow': return <PaymentFlow />;
      case 'paymentSuccess': return <PaymentSuccess />;

      // Admin Portal
      case 'adminDashboard': return <AdminDashboard />;
      case 'adminDataRestoran': return <AdminDataRestoran />;
      case 'adminKelolaMenu': return <AdminKelolaMenu />;
      case 'adminTempatDuduk': return <AdminTempatDuduk />;
      case 'adminPromo': return <AdminPromo />;
      case 'adminDataReservasi': return <AdminDataReservasi />;
      case 'adminDataPesanan': return <AdminDataPesanan />;
      case 'adminLaporan': return <AdminLaporan />;
      
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
            Page "{currentPage}" not found or under construction.
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-50 overflow-hidden font-sans">
      {renderPage()}
      
      {toast && (
        <div className="absolute top-4 left-4 right-4 z-50 flex justify-center animate-in fade-in slide-in-from-top-4">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-500' : 
            toast.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
