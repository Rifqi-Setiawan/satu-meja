import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_RESTAURANTS, INITIAL_RESERVATIONS, MOCK_USERS } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [pageParams, setPageParams] = useState({});
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useCallback((page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback((emailOrUsername, password) => {
    const found = MOCK_USERS.find(
      (u) => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );
    if (found) { setUser(found); return found; }
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    setCurrentReservation(null);
    navigate('welcome');
  }, [navigate]);

  const getRestaurant = useCallback((id) => restaurants.find((r) => r.id === id), [restaurants]);

  const updateRestaurant = useCallback((restaurantId, data) => {
    setRestaurants((prev) => prev.map((r) => (r.id === restaurantId ? { ...r, ...data } : r)));
  }, []);

  const updateTableStatus = useCallback((restaurantId, tableId, status) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, tables: r.tables.map((t) => (t.id === tableId ? { ...t, status } : t)) }
          : r
      )
    );
  }, []);

  const addMenuItem = useCallback((restaurantId, item) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id !== restaurantId) return r;
        const newId = Math.max(0, ...r.menu.map((m) => m.id)) + 1;
        return { ...r, menu: [...r.menu, { ...item, id: newId }] };
      })
    );
  }, []);

  const removeMenuItem = useCallback((restaurantId, itemId) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, menu: r.menu.filter((m) => m.id !== itemId) } : r
      )
    );
  }, []);

  const addTable = useCallback((restaurantId, table) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, tables: [...r.tables, table] } : r))
    );
  }, []);

  const removeTable = useCallback((restaurantId, tableId) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, tables: r.tables.filter((t) => t.id !== tableId) } : r
      )
    );
  }, []);

  const addPromo = useCallback((restaurantId, promo) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id !== restaurantId) return r;
        const newId = Math.max(0, ...(r.promos || []).map((p) => p.id)) + 1;
        return { ...r, promos: [...(r.promos || []), { ...promo, id: newId }] };
      })
    );
  }, []);

  const togglePromo = useCallback((restaurantId, promoId) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, promos: r.promos.map((p) => (p.id === promoId ? { ...p, active: !p.active } : p)) }
          : r
      )
    );
  }, []);

  const makeReservation = useCallback((data) => {
    const newRes = {
      ...data,
      id: `RES${String(reservations.length + 1).padStart(3, '0')}`,
      orderId: `ORD-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [...prev, newRes]);
    updateTableStatus(data.restaurantId, data.tableId, 'occupied');
    return newRes;
  }, [reservations.length, updateTableStatus]);

  const updateReservationStatus = useCallback((resId, status) => {
    setReservations((prev) => prev.map((r) => (r.id === resId ? { ...r, status } : r)));
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, pageParams, navigate,
      user, login, logout,
      role, setRole,
      restaurants, getRestaurant, updateRestaurant,
      addMenuItem, removeMenuItem,
      addTable, removeTable,
      addPromo, togglePromo,
      reservations, makeReservation, updateReservationStatus,
      currentReservation, setCurrentReservation,
      updateTableStatus,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
