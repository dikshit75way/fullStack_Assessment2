import { useState } from 'react';
import { useGetVehiclesQuery } from '../services/vehicle';
import { VehicleCard } from '../components/VehicleCard';
import { Filter } from 'lucide-react';

export const Vehicles = () => {
  const [filterType, setFilterType] = useState<string>('');
  const { data, isLoading, error } = useGetVehiclesQuery(filterType ? { type: filterType } : undefined);

  const vehicleTypes = ["Sedan", "SUV", "Luxury", "Truck", "Van"];

  if (isLoading) return <div className="text-center py-10">Loading vehicles...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading vehicles</div>;

  const vehicles = data?.data || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Our Fleet</h1>
           <p className="text-gray-600 mt-1">Choose from our premium collection of vehicles.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select 
              className="border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No vehicles found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};
