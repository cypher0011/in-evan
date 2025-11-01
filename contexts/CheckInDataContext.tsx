'use client';

/**
 * Check-In Data Context
 * Provides cached hotel and guest data across all check-in pages
 * Fetches data once and reuses it to avoid repeated database queries
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type BookingData = {
  id: string;
  roomType: string | null;
  roomNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number | null;
  bookingReference: string | null;
  totalAmount: number | null;
};

export type GuestData = {
  firstName: string;
  lastName: string;
  phone: string;
  roomNumber: string;
};

export type HotelData = {
  id: string;
  name: string;
  subdomain: string;
};

export type CheckInData = {
  hotel: HotelData;
  guest: GuestData;
  booking: BookingData | null;
  token: string;
};

type CheckInDataContextType = {
  data: CheckInData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const CheckInDataContext = createContext<CheckInDataContextType | undefined>(undefined);

type CheckInDataProviderProps = {
  children: ReactNode;
  token: string;
  initialData?: CheckInData;
};

export function CheckInDataProvider({
  children,
  token,
  initialData
}: CheckInDataProviderProps) {
  const [data, setData] = useState<CheckInData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/check-in-data/${token}`);

      if (!response.ok) {
        throw new Error('Failed to fetch check-in data');
      }

      const result = await response.json();
      setData(result);

      // Cache in sessionStorage for page refreshes
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`checkin_data_${token}`, JSON.stringify(result));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching check-in data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from sessionStorage first
    if (!initialData && typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(`checkin_data_${token}`);
      if (cached) {
        try {
          setData(JSON.parse(cached));
          setIsLoading(false);
          return;
        } catch (err) {
          console.error('Error parsing cached data:', err);
        }
      }
    }

    // Fetch if no initial data and no cache
    if (!initialData && !data) {
      fetchData();
    }
  }, [token, initialData]);

  return (
    <CheckInDataContext.Provider value={{ data, isLoading, error, refetch: fetchData }}>
      {children}
    </CheckInDataContext.Provider>
  );
}

export function useCheckInData() {
  const context = useContext(CheckInDataContext);
  if (context === undefined) {
    throw new Error('useCheckInData must be used within a CheckInDataProvider');
  }
  return context;
}
