
import { VehicleCard } from '../VehicleCard';
import type { Vehicle } from '../../services/vehicle';

interface VehicleGridProps {
    vehicles: Vehicle[];
}

export const VehicleGrid = ({ vehicles }: VehicleGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
        </div>
    );
};
