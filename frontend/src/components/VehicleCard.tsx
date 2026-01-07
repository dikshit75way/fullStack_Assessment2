import { Link } from 'react-router-dom';
import type { Vehicle } from '../services/vehicle';
import { Users, Fuel, Gauge } from 'lucide-react'; // Example icons
import { getImageUrl } from '../utils/image';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden bg-gray-200 relative">
        <img
          src={getImageUrl(vehicle.image)}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-semibold shadow">
           ${vehicle.pricePerDay}/day
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
             <h3 className="text-lg font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
             <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.type}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            vehicle.status === 'available' ? 'bg-green-100 text-green-800' : 
            vehicle.status === 'rented' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            {vehicle.status}
          </span>
        </div>

        <div className="mt-4 flex space-x-4 text-sm text-gray-600">
           {/* Placeholder specs, replace with real data if available in features */}
           <div className="flex items-center"><Users size={16} className="mr-1"/> 5 Seats</div>
           <div className="flex items-center"><Fuel size={16} className="mr-1"/> Petrol</div>
           <div className="flex items-center"><Gauge size={16} className="mr-1"/> Auto</div>
        </div>

        <div className="mt-4">
          <Link 
            to={`/vehicles/${vehicle._id}`}
            className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
