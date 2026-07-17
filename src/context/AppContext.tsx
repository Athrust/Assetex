import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  ToolListing, 
  Booking, 
  UserAccount, 
  FilterState, 
  BookingStatus 
} from '../types';


const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const isCloudDeploy = typeof window !== 'undefined' && (
  window.location.hostname.includes('netlify.app') || 
  window.location.hostname.includes('vercel.app') || 
  window.location.protocol === 'https:'
);
const API_URL = isCloudDeploy ? '/api' : `http://${hostname}:5001/api`;

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
  const [listings, setListings] = useState<ToolListing[]>(() => {
    const saved = localStorage.getItem('assetex_listings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'tool-1',
        title: 'Milwaukee Fuel 12" Compound Miter Saw',
        category: 'Power Tools & Carpentry',
        dailyRate: 2800,
        securityDeposit: 15000,
        location: 'South Congress',
        description: 'Professional 15-Amp dual-bevel sliding compound miter saw. Includes 60-tooth fine finish blade, dust bag, and heavy-duty folding stand with adjustable work stops.',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
        available: true,
        rating: 5.0,
        reviewCount: 14,
        ownerId: 'user-alex',
        ownerName: 'Atharv Mule',
        ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        ownerRating: 5.0,
        specifications: {
          'Blade Diameter': '12 Inches',
          'Motor': '15 Amp Direct Drive',
          'Weight': '65 lbs (with stand)',
          'Power Source': '120V Corded'
        },
        includedItems: ['Folding Stand', 'Dust Bag', 'Blade Wrench', 'Material Clamp'],
        rules: ['Must use eye and ear protection', 'Clean sawdust before returning', 'No cutting masonry or metal']
      }
    ];
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('assetex_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });
  const [filterState, setFilterStateState] = useState<FilterState>(defaultFilterState);

  // Save listings & bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('assetex_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('assetex_bookings', JSON.stringify(bookings));
  }, [bookings]);

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
          if (Array.isArray(listingsData)) {
            setListings(listingsData);
          }
        }
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          if (Array.isArray(bookingsData)) {
            setBookings(bookingsData);
          }
        }
      } catch (error) {
        console.warn('Backend data API unreachable (static hosting), using cached/fallback listings:', error);
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
      console.warn('Backend login unreachable (static hosting), performing client-side login:', error);
      const nameParts = email.split('@')[0].split(/[._-]/);
      const formattedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'Atharv Mule';
      const fallbackUser: UserAccount = {
        id: `user-${email.replace(/[^a-zA-Z0-9]/g, '') || 'alex'}`,
        name: formattedName,
        email: email,
        phone: '+1 (512) 555-0199',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        rating: 5.0,
        reviewsCount: 14,
        city: 'Austin, TX — South Congress',
        bio: 'Neighborhood lender and equipment owner on Assetex.',
        verified: true,
        memberSince: '2025'
      };
      setUser(fallbackUser);
      return true;
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
      console.warn('Backend signup unreachable (static hosting), performing client-side signup:', error);
      const fallbackUser: UserAccount = {
        id: `user-${email.replace(/[^a-zA-Z0-9]/g, '') || Date.now()}`,
        name: name || 'Atharv Mule',
        email: email,
        phone: phone || '+1 (512) 555-0199',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        rating: 5.0,
        reviewsCount: 0,
        city: city || 'Austin, TX',
        bio: 'New member on Assetex.',
        verified: true,
        memberSince: 'Just now'
      };
      setUser(fallbackUser);
      return;
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
    const payload = {
      ...data,
      ownerId: user.id,
      owner: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        rating: user.rating || 5.0,
        reviewsCount: user.reviewsCount || 0,
        responseTime: 'Usually responds within 1 hour',
        responseRate: '100%',
        verified: user.verified !== undefined ? user.verified : true,
        memberSince: user.memberSince || 'Just now',
        city: user.city || data.location || 'Austin, TX',
        bio: user.bio || 'Neighborhood lender on Assetex.'
      }
    };
    try {
      const res = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newListing = await res.json();
        setListings(prev => [newListing, ...prev]);
        return newListing.id;
      }
    } catch (error) {
      console.error('Add listing failed:', error);
    }
    const fallbackId = `tool-${Date.now()}`;
    const fallbackListing: ToolListing = {
      ...payload,
      id: fallbackId,
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };
    setListings(prev => [fallbackListing, ...prev]);
    return fallbackId;
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
    const targetTool = listings.find(l => l.id === toolId);
    if (!targetTool) throw new Error("Tool not found");

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalEstimate = days * targetTool.dailyRate;

    const payload = {
      toolId,
      toolTitle: targetTool.title,
      toolImage: targetTool.image,
      toolCategory: targetTool.category,
      startDate,
      endDate,
      message,
      days,
      dailyRate: targetTool.dailyRate,
      totalEstimate,
      renterId: user.id,
      renterName: user.name,
      renterAvatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      renterRating: user.rating || 5.0,
      ownerId: targetTool.ownerId || 'user-alex',
      ownerName: targetTool.owner?.name || 'Tool Owner'
    };

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newBooking = await res.json();
        setBookings(prev => [newBooking, ...prev]);
        return newBooking;
      } else {
        throw new Error("Failed to create booking on backend");
      }
    } catch (error) {
      console.warn('Backend request booking failed, creating client booking:', error);
      const fallbackBooking: Booking = {
        ...payload,
        id: `book-${Date.now()}`,
        status: 'Pending',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBookings(prev => [fallbackBooking, ...prev]);
      return fallbackBooking;
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
