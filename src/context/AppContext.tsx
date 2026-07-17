import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  ToolListing, 
  Booking, 
  UserAccount, 
  FilterState, 
  BookingStatus 
} from '../types';


const API_URL = 'http://localhost:5001/api';

interface AppContextType {
  user: UserAccount | null;
  listings: ToolListing[];
  bookings: Booking[];
  filterState: FilterState;
  
  // Auth actions
  login: (email: string, password?: string) => Promise<boolean | string>;
  logout: () => void;
  signup: (name: string, email: string, phone: string, password?: string, city?: string) => Promise<void | string>;
  updateUserProfile: (data: Partial<UserAccount>) => Promise<void>;

  // Listing actions
  addListing: (listing: Omit<ToolListing, 'id' | 'ownerId' | 'owner' | 'rating' | 'reviewCount' | 'reviews'>) => Promise<string>;
  updateListing: (id: string, data: Partial<ToolListing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  toggleListingStatus: (id: string) => Promise<void>;

  // Booking actions
  requestBooking: (toolId: string, startDate: string, endDate: string, message: string) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;

  // Filter actions
  setFilterState: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const defaultFilterState: FilterState = {
  searchQuery: '',
  category: 'All Categories',
  maxPrice: 6000,
  sortBy: 'rating',
  location: 'All Austin',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const savedUser = localStorage.getItem('assetex_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { /* ignore */ }
    }
    return null;
  });
  const [listings, setListings] = useState<ToolListing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterState, setFilterStateState] = useState<FilterState>(defaultFilterState);

  // Fetch data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [listingsRes, bookingsRes] = await Promise.all([
          fetch(`${API_URL}/listings`),
          fetch(`${API_URL}/bookings`)
        ]);
        if (listingsRes.ok) {
          const listingsData = await listingsRes.json();
          setListings(listingsData);
        }
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error('Failed to fetch initial data from backend:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('assetex_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('assetex_user');
    }
  }, [user]);

  const setFilterState = (partial: Partial<FilterState>) => {
    setFilterStateState(prev => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilterStateState(defaultFilterState);
  };

  const login = async (email: string, password?: string): Promise<boolean | string> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        return true;
      }
      return data.error || 'Login failed. Please try again.';
    } catch (error) {
      console.error('Login failed:', error);
      return 'Network error. Please check your connection.';
    }
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name: string, email: string, phone: string, password?: string, city?: string): Promise<void | string> => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, city })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        return;
      }
      return data.error || 'Signup failed. Please try again.';
    } catch (error) {
      console.error('Signup failed:', error);
      return 'Network error. Please check your connection.';
    }
  };

  const updateUserProfile = async (data: Partial<UserAccount>): Promise<void> => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const addListing = async (data: Omit<ToolListing, 'id' | 'ownerId' | 'owner' | 'rating' | 'reviewCount' | 'reviews'>): Promise<string> => {
    if (!user) return '';
    try {
      const res = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newListing = await res.json();
        setListings(prev => [newListing, ...prev]);
        return newListing.id;
      }
    } catch (error) {
      console.error('Add listing failed:', error);
    }
    return '';
  };

  const updateListing = async (id: string, data: Partial<ToolListing>): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setListings(prev => prev.map(item => item.id === id ? updated : item));
      }
    } catch (error) {
      console.error('Update listing failed:', error);
    }
  };

  const deleteListing = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/listings/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setListings(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Delete listing failed:', error);
    }
  };

  const toggleListingStatus = async (id: string): Promise<void> => {
    const target = listings.find(l => l.id === id);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    await updateListing(id, { status: newStatus });
  };

  const requestBooking = async (toolId: string, startDate: string, endDate: string, message: string): Promise<Booking> => {
    if (!user) throw new Error("User not logged in");
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, startDate, endDate, message })
      });
      if (res.ok) {
        const newBooking = await res.json();
        setBookings(prev => [newBooking, ...prev]);
        return newBooking;
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error('Request booking failed:', error);
      throw error;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
      }
    } catch (error) {
      console.error('Update booking status failed:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        listings,
        bookings,
        filterState,
        login,
        logout,
        signup,
        updateUserProfile,
        addListing,
        updateListing,
        deleteListing,
        toggleListingStatus,
        requestBooking,
        updateBookingStatus,
        setFilterState,
        resetFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
