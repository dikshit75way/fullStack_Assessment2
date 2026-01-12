

import { X, AlertTriangle } from 'lucide-react';
import { useCancelBookingMutation } from '../services/booking';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface CancelBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    onSuccess: () => void;
}

const cancelSchema = yup.object({
    reason: yup.string().min(10, 'Reason must be at least 10 characters long').required('Please provide a reason for cancellation'),
}).required();

type CancelFormInputs = yup.InferType<typeof cancelSchema>;

export const CancelBookingModal = ({ isOpen, onClose, bookingId, onSuccess }: CancelBookingModalProps) => {
    const [cancelBooking, { isLoading }] = useCancelBookingMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CancelFormInputs>({
        resolver: yupResolver(cancelSchema),
    });

    if (!isOpen) return null;

    const onSubmit = async (data: CancelFormInputs) => {
        try {
            await cancelBooking({ id: bookingId, reason: data.reason }).unwrap();
            toast.success("Booking cancelled successfully");
            reset();
            onSuccess();
            onClose();
        }   catch (err: any) {
              console.error(err);
              toast.error(err.data?.message || 'Cancellation failed');
            }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center text-red-700">
                        <AlertTriangle className="mr-2" /> Cancel Booking
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800 border border-blue-200">
                        <h4 className="font-bold mb-1">Cancellation Policy:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>More than 3 days before: <span className="font-semibold">100% Refund</span></li>
                            <li>1 to 3 days before: <span className="font-semibold">50% Refund</span></li>
                            <li>Less than 24 hours: <span className="font-semibold">No Refund</span></li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Reason for Cancellation <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition ${
                                    errors.reason ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                                }`}
                                rows={3}
                                placeholder="Please explain why you are cancelling..."
                                {...register('reason')}
                                required
                            />
                            {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
                                disabled={isLoading}
                            >
                                Keep Booking
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-lg font-bold text-white shadow-lg transition transfor ${
                                    isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:scale-95'
                                }`}
                            >
                                {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
