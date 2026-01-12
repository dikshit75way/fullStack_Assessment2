
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { getImageUrl } from '../../utils/image';

interface Vehicle {
    _id: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    status: string;
    pricePerDay: number;
    image: string;
}

interface FleetManagementProps {
    vehicles: Vehicle[];
    isLoading: boolean;
    onDelete: (id: string) => void;
}

const vehicleStatusVariant: Record<string, any> = {
    available: 'success',
    maintenance: 'warning',
    rented: 'error',
};

export const FleetManagement = ({ vehicles, isLoading, onDelete }: FleetManagementProps) => {
    if (isLoading) return <div>Loading fleet...</div>;

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Link
                    to="/admin/vehicles/new"
                    className="flex items-center btn-primary px-4 py-2 rounded-md"
                >
                    <Plus size={20} className="mr-2" /> Add Vehicle
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={getImageUrl(vehicle.image)} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{vehicle.brand} {vehicle.model}</div>
                                            <div className="text-sm text-gray-500">{vehicle.year}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={vehicleStatusVariant[vehicle.status] || 'gray'}>
                                        {vehicle.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.pricePerDay}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/admin/vehicles/edit/${vehicle._id}`}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => onDelete(vehicle._id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
