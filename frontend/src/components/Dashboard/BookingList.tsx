

import { Car, Calendar, CreditCard } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface Booking {
    _id: string;
    vehicleId?: {
        _id: string;
        brand: string;
        model: string;
    };
    startDate: string;
    endDate: string;
    status: string;
    totalAmount: number;
    refundAmount?: number;
}

interface BookingListProps {
    bookings: Booking[];
    onPay: (id: string, amount: number) => void;
    onCancel: (id: string) => void;
}

const statusVariant: Record<string, any> = {
    confirmed: 'success',
    pending: 'warning',
    cancelled: 'error',
    completed: 'info',
};

export const BookingList = ({ bookings, onPay, onCancel }: BookingListProps) => {
    return (
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

                            {booking.status === 'cancelled' && booking.refundAmount !== undefined && (
                                <div className="mt-2 text-xs bg-gray-100 p-2 rounded inline-block">
                                    <span className="text-gray-500">Refunded: </span>
                                    <span className="font-bold text-gray-900">${booking.refundAmount}</span>
                                </div>
                            )}

                            <div className="mt-2 text-sm">
                                <Badge variant={statusVariant[booking.status] || 'gray'}>
                                    {booking.status.toUpperCase()}
                                </Badge>
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
                                onClick={() => onPay(booking._id, booking.totalAmount)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mt-2 flex items-center shadow"
                            >
                                <CreditCard size={16} className="mr-2" /> Pay Now
                            </button>
                        )}

                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button
                                onClick={() => onCancel(booking._id)}
                                className="text-red-600 hover:text-red-800 text-sm mt-2"
                            >
                                Cancel Booking
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
