
import { useParams, Link } from 'react-router-dom';
import { useGetVehicleTrackingQuery } from '../services/tracking';
import { useGetVehicleByIdQuery } from '../services/vehicle';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';

export const Tracking = () => {
    const { id } = useParams<{ id: string }>();
    const { data: trackingData, isLoading: isLoadingTracking, error: trackingError } = useGetVehicleTrackingQuery(id || '', {
        pollingInterval: 5000, // Poll every 5 seconds
    });
    const { data: vehicleData } = useGetVehicleByIdQuery(id || '');

    if (isLoadingTracking) return <div className="text-center py-20">Locating vehicle...</div>;
    if (trackingError) return <div className="text-center py-20 text-red-500">Unable to track vehicle.</div>;

    const vehicle = vehicleData?.data;
    const location = trackingData?.data;

    return (
        <div>
             <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
                        {vehicle && <p className="text-gray-500">{vehicle.brand} {vehicle.model}</p>}
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Live
                    </div>
                </div>

                <div className="relative h-96 bg-gray-100 flex items-center justify-center">
                    {/* Mock Map View */}
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20"></div>
                    
                    <div className="relative z-10 text-center">
                        <div className="inline-block p-4 bg-blue-600 rounded-full text-white shadow-xl animate-bounce">
                            <Navigation size={32} className="transform rotate-45" />
                        </div>
                        <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
                            <p className="font-bold text-gray-900 flex items-center justify-center">
                                <MapPin size={16} className="text-red-500 mr-1" /> Current Location
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Lat: {location?.lat.toFixed(4)}</p>
                            <p className="text-sm text-gray-600">Lng: {location?.lng.toFixed(4)}</p>
                            <p className="text-xs text-gray-400 mt-2">Updated: {new Date(location?.updatedAt || '').toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-gray-50">
                    <h3 className="font-semibold mb-2">Tracking Status</h3>
                    <p className="text-sm text-gray-600">
                        Vehicle is currently active and transmitting location data. 
                        Location updates automatically every 5 seconds.
                    </p>
                </div>
            </div>
        </div>
    );
};
