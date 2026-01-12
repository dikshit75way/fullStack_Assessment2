
import { useState } from 'react';
import { useGetMyBookingsQuery } from '../services/booking';
import toast from 'react-hot-toast';
import { PaymentModal } from '../components/PaymentModal';
import { CancelBookingModal } from '../components/CancelBookingModal';
import { EmptyBookings } from '../components/Dashboard/EmptyBookings';
import { BookingList } from '../components/Dashboard/BookingList';
import { RenderIf } from '../components/ui/RenderIf';

export const UserDashboard = () => {
  const { data, isLoading, error, refetch } = useGetMyBookingsQuery();
  const [selectedBooking, setSelectedBooking] = useState<{id: string, amount: number} | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  if (isLoading) return <div className="text-center py-10">Loading your bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading bookings</div>;

  const bookings = data?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Dashboard</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Bookings</h2>
        </div>
        
        <RenderIf 
          condition={bookings.length === 0}
          render={<EmptyBookings />}
          fallback={
            <BookingList 
              bookings={bookings} 
              onPay={(id, amount) => setSelectedBooking({ id, amount })} 
              onCancel={setBookingToCancel} 
            />
          }
        />
      </div>

      {selectedBooking && (
          <PaymentModal 
              isOpen={!!selectedBooking}
              onClose={() => setSelectedBooking(null)}
              bookingId={selectedBooking.id}
              amount={selectedBooking.amount}
              onSuccess={() => {
                  refetch();
                  toast.success("Booking Confirmed!");
              }}
          />
      )}

      {bookingToCancel && (
          <CancelBookingModal
              isOpen={!!bookingToCancel}
              onClose={() => setBookingToCancel(null)}
              bookingId={bookingToCancel}
              onSuccess={() => {
                  refetch();
              }}
          />
      )}
    </div>
  );
};
