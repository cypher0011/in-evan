'use client';

import { useCheckInData } from '@/contexts/CheckInDataContext';
import PaymentView from './PaymentView';
import Loading from '../loading';

export default function PaymentClient({ token }: { token: string }) {
  const { data, isLoading } = useCheckInData();

  if (isLoading || !data) {
    return <Loading />;
  }

  // TODO: Fetch selected enhancements from session/database
  // For now, show empty services (no payment required)
  const services: any[] = [];

  return <PaymentView token={token} services={services} />;
}
