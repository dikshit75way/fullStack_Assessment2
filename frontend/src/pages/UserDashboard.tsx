import { useState } from 'react';
import { useGetMyBookingsQuery } from '../services/booking';
import { Link } from 'react-router-dom';
import { Calendar, Car, CreditCard, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { PaymentModal } from '../components/PaymentModal';
import { CancelBookingModal } from '../components/CancelBookingModal';

export const UserDashboard = () => {
  const { data, isLoading, error, refetch } = useGetMyBookingsQuery();
  const [selectedBooking, setSelectedBooking] = useState<{id: string, amount: number} | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  if (isLoading) return <div className="text-center py-10">Loading your bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading bookings</div>;

  const bookings = data?.data || [];

  const statusStyles: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Dashboard</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Bookings</h2>
        </div>
        
        {bookings.length === 0 ? (
           <div className="p-10 text-center text-gray-500">
             <p>You haven't made any bookings yet.</p>
             <Link to="/vehicles" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">Browse Vehicles</Link>
           </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-6 md:flex justify-between items-center">
                 <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <Car className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {booking.vehicleId?.brand} {booking.vehicleId?.model}
                      </h3>
                      <div className="flex items-center text-gray-500 mt-1 text-sm">
                        <Calendar size={14} className="mr-1" />
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                      
                      {/* Refund Info */}
                      {booking.status === 'cancelled' && booking.refundAmount !== undefined && (
                          <div className="mt-2 text-xs bg-gray-100 p-2 rounded inline-block">
                              <span className="text-gray-500">Refunded: </span>
                              <span className="font-bold text-gray-900">${booking.refundAmount}</span>
                          </div>
                      )}

                      <div className="mt-2 text-sm">
                        <span className={`px-2 py-1 rounded-full ${statusStyles[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      {booking.status === 'pending' && (
                          <p className="text-xs text-red-500 mt-1">Expires in 15 mins if unpaid</p>
                      )}
                    </div>
                 </div>
                 
                 <div className="mt-4 md:mt-0 flex flex-col items-end">
                   <p className="text-lg font-bold text-gray-900">${booking.totalAmount}</p>
                   
                   {booking.status === 'pending' && (
                       <button
                           onClick={() => setSelectedBooking({ id: booking._id, amount: booking.totalAmount })}
                           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mt-2 flex items-center shadow"
                       >
                           <CreditCard size={16} className="mr-2" /> Pay Now
                       </button>
                   )}

                   {booking.status === 'confirmed' && booking.vehicleId?._id && (
                       <Link
                           to={`/tracking/${booking.vehicleId._id}`}
                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2 flex items-center shadow"
                       >
                           <MapPin size={16} className="mr-2" /> Track Vehicle
                       </Link>
                   )}

                   {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                     <button 
                       onClick={() => setBookingToCancel(booking._id)}
                       className="text-red-600 hover:text-red-800 text-sm mt-2"
                     >
                       Cancel Booking
                     </button>
                   )}
                 </div>
              </div>
            ))}
          </div>
        )}
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
