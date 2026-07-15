import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { 
  ToolListing, 
  Booking, 
  UserAccount, 
  FilterState, 
  BookingStatus, 
  ToolCategory 
} from '../types';
import { 
  initialListings, 
  initialBookings, 
  initialCurrentUser 
} from '../data/mockData';

interface AppContextType {
  user: UserAccount | null;
  listings: ToolListing[];
  bookings: Booking[];
  filterState: FilterState;
  
  // Auth actions
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, phone: string, password?: string, city?: string) => void;
  updateUserProfile: (data: Partial<UserAccount>) => void;

  // Listing actions
  addListing: (listing: Omit<ToolListing, 'id' | 'ownerId' | 'owner' | 'rating' | 'reviewCount' | 'reviews'>) => string;
  updateListing: (id: string, data: Partial<ToolListing>) => void;
  deleteListing: (id: string) => void;
  toggleListingStatus: (id: string) => void;

  // Booking actions
  requestBooking: (toolId: string, startDate: string, endDate: string, message: string) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;

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
  const [user, setUser] = useState<UserAccount | null>(initialCurrentUser);
  const [listings, setListings] = useState<ToolListing[]>(initialListings);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filterState, setFilterStateState] = useState<FilterState>(defaultFilterState);

  const setFilterState = (partial: Partial<FilterState>) => {
    setFilterStateState(prev => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilterStateState(defaultFilterState);
  };

  const login = (email: string) => {
    if (email.toLowerCase().includes('alex')) {
      setUser(initialCurrentUser);
      return true;
    }
    // Generic login fallback for prototype
    setUser({
      id: 'user-custom',
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      phone: '+1 (512) 555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      city: 'Austin, TX — Downtown',
      bio: 'Enthusiastic DIYer and maker exploring the Assetex community.',
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      memberSince: 'Jul 2026'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const signup = (name: string, email: string, phone: string, _password?: string, city?: string) => {
    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || '+1 (512) 555-0100',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      city: city || 'Austin, TX — South Congress',
      bio: `New member of Assetex based in ${city || 'Austin, TX'}.`,
      rating: 5.0,
      reviewsCount: 0,
      verified: true,
      memberSince: 'Jul 2026'
    };
    setUser(newUser);
  };

  const updateUserProfile = (data: Partial<UserAccount>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const addListing = (data: Omit<ToolListing, 'id' | 'ownerId' | 'owner' | 'rating' | 'reviewCount' | 'reviews'>) => {
    if (!user) return '';
    const newId = `tool-${Date.now()}`;
    const newListing: ToolListing = {
      ...data,
      id: newId,
      ownerId: user.id,
      owner: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        rating: user.rating || 5.0,
        reviewsCount: user.reviewsCount || 0,
        responseTime: 'Usually responds within 1 hour',
        responseRate: '100%',
        verified: user.verified,
        memberSince: user.memberSince,
        city: user.city,
        bio: user.bio,
      },
      status: 'active',
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };
    setListings(prev => [newListing, ...prev]);
    return newId;
  };

  const updateListing = (id: string, data: Partial<ToolListing>) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
  };

  const toggleListingStatus = (id: string) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'active' ? 'inactive' : 'active'
        };
      }
      return item;
    }));
  };

  const requestBooking = (toolId: string, startDate: string, endDate: string, message: string): Booking => {
    const targetTool = listings.find(t => t.id === toolId);
    if (!targetTool || !user) {
      throw new Error("Tool or user not found");
    }

    // calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalEstimate = days * targetTool.dailyRate;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      toolId: targetTool.id,
      toolTitle: targetTool.title,
      toolImage: targetTool.image,
      toolCategory: targetTool.category as ToolCategory,
      renterId: user.id,
      renterName: user.name,
      renterAvatar: user.avatar,
      renterRating: user.rating || 5.0,
      ownerId: targetTool.ownerId,
      ownerName: targetTool.owner?.name || 'Tool Owner',
      startDate,
      endDate,
      days,
      dailyRate: targetTool.dailyRate,
      totalEstimate,
      status: 'Pending',
      message,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
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
