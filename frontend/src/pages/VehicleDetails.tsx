import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetVehicleByIdQuery } from '../services/vehicle';
import { useCreateBookingMutation } from '../services/booking';
import { Users, Fuel, Gauge, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../components/Input';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { KYCModal } from '../components/KYCModal';
import { setCredentials } from '../store/authSlice';
import { getImageUrl } from '../utils/image';
import { type IUser } from '../store/authSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { KYCStatusBanner } from '../components/Vehicle/KYCStatusBanner';
import { VehicleFeatures } from '../components/Vehicle/VehicleFeatures';




const bookingSchema = yup.object({
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string()
    .required('End date is required')
    .test('is-after-start', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      return !startDate || !value || new Date(value) >= new Date(startDate);
    }),
}).required();

type BookingFormInputs = yup.InferType<typeof bookingSchema>;

export const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetVehicleByIdQuery(id || '');
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showKYCModal, setShowKYCModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<BookingFormInputs>({
    resolver: yupResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormInputs) => {
      // 1. Check Login
      if (!user) {
          toast.error("Please login to book");
          navigate('/login');
          return;
      }

      // 2. Check KYC
      if (user.kycStatus !== 'verified') {
          if (user.kycStatus === 'pending') {
              toast('Your KYC is pending verification', { icon: '⏳' });
          } else {
              toast.error("Complete KYC verification to book");
              setShowKYCModal(true);
          }
          return;
      }
      
      if (!data) return;

      // 3. Create Booking
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      
      // Handle same day booking as 1 day, but check if duration is valid
      const duration = days <= 0 ? 1 : days;
      const totalAmount = duration * (vehicle?.pricePerDay || 0);
      
      try {
          await createBooking({
              vehicleId: id as any,
              startDate: data.startDate,
              endDate: data.endDate,
              totalAmount: totalAmount
          }).unwrap();
          toast.success("Booking Request Sent!");
          navigate('/dashboard');
    }   catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || 'Booking failed');
    }
  };

  const onKYCSuccess = () => {
      // Update local state to pending so UI reflects it immediately
      // In a real app we might refetch user profile
      if (user) {
         dispatch(setCredentials({ 
             user: { ...user, kycStatus: 'pending' } as IUser, 
             accessToken: localStorage.getItem('accessToken') || '' 
         }));
      }
  };

  if (isLoading) return <div className="text-center py-20">Loading vehicle details...</div>;
  if (error || !data?.data) return <div className="text-center py-20 text-red-500">Error loading vehicle details or vehicle not found.</div>;

  const vehicle = data.data;

  const isVehicleAvailable = vehicle.status === 'available';
  const isKycVerified = user?.kycStatus === 'verified';
  const isKycPending = user?.kycStatus === 'pending';
  const canBook = isVehicleAvailable && isKycVerified;

  const getButtonText = () => {
    if (isBooking) return 'Processing...';
    if (!isKycVerified) return 'Verification Required';
    if (!isVehicleAvailable) return 'Currently Unavailable';
    return 'Book Now';
  };

  const buttonClasses = `w-full py-4 rounded-lg text-lg font-bold transition shadow-lg ${
    canBook 
      ? 'btn-primary' 
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`;

  return (
    <div>
      <Link to="/vehicles" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={20} className="mr-2" /> Back to Fleet
      </Link>

      <div className="bg-white rounded-xl shadow-lg run-in overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2 h-96 bg-gray-200 relative">
             <img
              src={getImageUrl(vehicle.image)}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h1>
                  <p className="text-lg text-gray-500">{vehicle.year} • {vehicle.type}</p>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-bold text-blue-600">${vehicle.pricePerDay}</span>
                  <span className="text-gray-500">per day</span>
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"><Users className="mr-3 text-blue-500"/> 5 Seats</div>
                 <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"><Fuel className="mr-3 text-blue-500"/> Petrol</div>
                 <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"><Gauge className="mr-3 text-blue-500"/> Auto</div>
                 <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"><Calendar className="mr-3 text-blue-500"/> {vehicle.year}</div>
               </div>

               {/* KYC Status Banner */}
               {user && <KYCStatusBanner status={user.kycStatus || 'pending'} />}

               <VehicleFeatures features={vehicle.features} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h3 className="text-lg font-semibold mb-2">Book this Vehicle</h3>
                        <div className="grid grid-cols-2 gap-4">
                             <Input 
                                 label="Start Date" 
                                 type="date" 
                                 {...register('startDate')}
                                 min={new Date().toISOString().split('T')[0]}
                                 error={formErrors.startDate?.message}
                             />
                             <Input 
                                 label="End Date" 
                                 type="date" 
                                 {...register('endDate')}
                                 min={new Date().toISOString().split('T')[0]}
                                 error={formErrors.endDate?.message}
                             />
                        </div>
                    </div>
                
                    <div>
                      <button 
                        type="submit"
                        className={buttonClasses}
                        disabled={!canBook || isBooking}
                      >
                        {getButtonText()}
                      </button>
                    </div>
                </form>  {!isKycVerified && !isKycPending && (
                  <button 
                    onClick={() => setShowKYCModal(true)}
                    className="w-full mt-2 py-2 text-blue-600 hover:text-blue-800 underline"
                  >
                      Complete Verification Now
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <KYCModal 
        isOpen={showKYCModal} 
        onClose={() => setShowKYCModal(false)}
        onSuccess={onKYCSuccess}
      />
    </div>
  );
};
