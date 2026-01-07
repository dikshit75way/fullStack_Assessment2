import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetVehicleByIdQuery } from '../services/vehicle';
import { useCreateBookingMutation } from '../services/booking';
import { Users, Fuel, Gauge, ArrowLeft, Calendar, CheckCircle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../components/Input';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { KYCModal } from '../components/KYCModal';
import { setCredentials } from '../store/authSlice';
import { getImageUrl } from '../utils/image';
import { type IUser } from '../store/authSlice';




export const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetVehicleByIdQuery(id || '');
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showKYCModal, setShowKYCModal] = useState(false);

  const [bookingDates, setBookingDates] = useState({
      startDate: '',
      endDate: ''
  });

  const handleBooking = async () => {
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
      
      // 3. Dates Validation
      if (!bookingDates.startDate || !bookingDates.endDate) {
          toast.error("Please select start and end dates");
          return;
      }
      
      if(new Date(bookingDates.startDate) > new Date(bookingDates.endDate)){
           toast.error("End date cannot be before start date");
           return;
      }

      if (!data?.data) return;

      // 4. Create Booking
      const start = new Date(bookingDates.startDate);
      const end = new Date(bookingDates.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      const totalAmount = days * data.data.pricePerDay;

      if (days <= 0) {
           toast.error("Invalid duration");
           return;
      }
      
      try {
          await createBooking({
              vehicleId: id,
              startDate: bookingDates.startDate,
              endDate: bookingDates.endDate,
              totalAmount: totalAmount
          }).unwrap();
          toast.success("Booking Request Sent!");
          navigate('/dashboard');
      }   catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || 'Registration failed');
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
  if (error || !data) return <div className="text-center py-20 text-red-500">Error loading vehicle details or vehicle not found.</div>;

  const vehicle = data.data;

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
               {user && user.kycStatus !== 'verified' && (
                   <div className={`mb-6 p-4 rounded-lg flex items-center ${
                       user.kycStatus === 'pending' ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'
                   }`}>
                       <ShieldAlert className="mr-2" />
                       <div>
                           <p className="font-bold">Verification Required</p>
                           <p className="text-sm">
                               {user.kycStatus === 'pending' 
                                 ? 'Your KYC is currently under review. You will be able to book once verified.' 
                                 : 'You need to complete KYC verification to book vehicles.'}
                           </p>
                       </div>
                   </div>
               )}

               <div className="mb-6">
                 <h3 className="text-xl font-semibold mb-3">Features</h3>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                   {vehicle.features && vehicle.features.length > 0 ? (
                      vehicle.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <CheckCircle size={16} className="mr-2 text-green-500" /> {feature}
                        </li>
                      ))
                   ) : (
                     <li className="text-gray-500 italic">No specific features listed.</li>
                   )}
                 </ul>
               </div>

               {/* Booking Form Area */}
               <div className="bg-gray-50 p-4 rounded-lg mb-4">
                   <h3 className="text-lg font-semibold mb-2">Book this Vehicle</h3>
                   <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Start Date" 
                            type="date" 
                            value={bookingDates.startDate}
                            onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <Input 
                            label="End Date" 
                            type="date" 
                            value={bookingDates.endDate}
                            onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                            min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
                        />
                   </div>
               </div>
            </div>

            <div>
              <button 
                onClick={handleBooking}
                className={`w-full py-4 rounded-lg text-lg font-bold transition shadow-lg ${
                  vehicle.status === 'available' && (user?.kycStatus === 'verified')
                    ? 'btn-primary' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={vehicle.status !== 'available' || isBooking || (user?.kycStatus !== 'verified')}
              >
                {isBooking ? 'Processing...' : (
                    user?.kycStatus === 'verified' ? (vehicle.status === 'available' ? 'Book Now' : 'Currently Unavailable') : 'Verification Required'
                )}
              </button>
              {user?.kycStatus !== 'verified' && user?.kycStatus !== 'pending' && (
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
