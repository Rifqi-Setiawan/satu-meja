import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, contentClassName = '' }) {
  const { user, getRestaurant } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const restaurant = getRestaurant(user?.restaurantId || 1);

  return (
    <div className="min-h-screen app-bg flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar wrapped to handle mobile slide */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-sm">
              {restaurant?.name.charAt(0) || 'R'}
            </div>
            <h2 className="font-bold text-[var(--color-navy)] text-sm truncate max-w-[180px]">{restaurant?.name}</h2>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-[var(--color-background)] text-[var(--color-charcoal)] hover:bg-[var(--color-border)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className={`p-4 md:p-8 flex-1 overflow-x-hidden ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
