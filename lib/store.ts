import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingData {
  carId: string;
  startDate: string;
  endDate: string;
  location: string;
  totalPrice: number;
  discountAmount: number;
  voucherCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  idCardNumber: string;
}

interface BookingState {
  booking: Partial<BookingData>;
  setBooking: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
  currentStep: number;
  setStep: (step: number) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      booking: {},
      setBooking: (data) => set((state) => ({ booking: { ...state.booking, ...data } })),
      resetBooking: () => set({ booking: {}, currentStep: 1 }),
      currentStep: 1,
      setStep: (step) => set({ currentStep: step }),
    }),
    {
      name: 'booking-storage',
    }
  )
);

interface SearchFilters {
  brand: string[];
  type: string[];
  capacity: string[];
  transmission: string[];
  fuel: string[];
  priceRange: [number, number];
  searchQuery: string;
}

interface FilterState {
  filters: SearchFilters;
  setFilter: (key: keyof SearchFilters, value: any) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {
    brand: [],
    type: [],
    capacity: [],
    transmission: [],
    fuel: [],
    priceRange: [0, 5000000],
    searchQuery: '',
  },
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  resetFilters: () => set({
    filters: {
      brand: [],
      type: [],
      capacity: [],
      transmission: [],
      fuel: [],
      priceRange: [0, 5000000],
      searchQuery: '',
    }
  }),
}));
