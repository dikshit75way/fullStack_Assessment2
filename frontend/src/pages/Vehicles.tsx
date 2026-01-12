
import { useState } from 'react';
import { useGetVehiclesQuery } from '../services/vehicle';
import { Filter } from 'lucide-react';
import { VehicleGrid } from '../components/Vehicle/VehicleGrid';
import { EmptyVehicles } from '../components/Vehicle/EmptyVehicles';
import { RenderIf } from '../components/ui/RenderIf';

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

      <RenderIf 
        condition={vehicles.length === 0}
        render={<EmptyVehicles />}
        fallback={<VehicleGrid vehicles={vehicles} />}
      />
    </div>
  );
};
