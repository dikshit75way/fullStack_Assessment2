
import { useState } from 'react';
import { useGetVehiclesQuery, useDeleteVehicleMutation } from '../services/vehicle';
import { useGetAllUsersQuery, useUpdateKYCStatusMutation } from '../services/user';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/image';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'kyc'>('vehicles');
  
  // Vehicle Data
  const { data: vehicleData, isLoading: vehicleLoading, refetch: refetchVehicles } = useGetVehiclesQuery(undefined);
  const [deleteVehicle] = useDeleteVehicleMutation();

  // User/KYC Data
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsersQuery(undefined, {
      skip: activeTab !== 'kyc' // Only fetch when tab is active
  });
  const [updateKYC] = useUpdateKYCStatusMutation();

  const handleDeleteVehicle = async (id: string) => {
      if(window.confirm("Are you sure?")) {
          try {
              await deleteVehicle(id).unwrap();
              toast.success("Vehicle deleted");
              refetchVehicles();
          } catch(err) {
              toast.error("Failed to delete");
          }
      }
  };

  const handleKYCAction = async (id: string, status: 'verified' | 'rejected') => {
      try {
          await updateKYC({ id, status }).unwrap();
          toast.success(`User KYC ${status}`);
          refetchUsers();
      } catch (err) {
          toast.error("Action failed");
      }
  };

  const vehicles = vehicleData?.data || [];
  const kycUsers = usersData || [];

  const getTabClass = (tab: 'vehicles' | 'kyc') => 
    `py-2 px-4 font-medium transition ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`;

  const vehicleStatusStyles: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    rented: 'bg-red-100 text-red-800',
  };

  const kycStatusStyles: Record<string, string> = {
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="mb-6 flex space-x-4 border-b border-gray-200">
          <button 
            className={getTabClass('vehicles')}
            onClick={() => setActiveTab('vehicles')}
          >
              Fleet Management
          </button>
          <button 
            className={getTabClass('kyc')}
            onClick={() => setActiveTab('kyc')}
          >
              KYC Requests
          </button>
      </div>

      {activeTab === 'vehicles' ? (
          <div>
               <div className="flex justify-end mb-4">
                  <Link 
                    to="/admin/vehicles/new"
                    className="flex items-center btn-primary px-4 py-2 rounded-md"
                  >
                    <Plus size={20} className="mr-2" /> Add Vehicle
                  </Link>
               </div>
               
               {vehicleLoading ? <div>Loading fleet...</div> : (
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
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicleStatusStyles[vehicle.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {vehicle.status}
                                        </span>
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
                                          onClick={() => handleDeleteVehicle(vehicle._id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
               )}
          </div>
      ) : (
          <div>
               {usersLoading ? <div>Loading users...</div> : (
                   <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {kycUsers.filter(u => u.kycStatus === 'pending' || u.kycStatus === 'verified').map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${kycStatusStyles[user.kycStatus] || 'bg-gray-100 text-gray-800'}`}>
                                            {user.kycStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span>License: {user.driverLicense}</span>
                                            <span>Phone: {user.phoneNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {user.kycStatus === 'pending' && (
                                            <>
                                                <button 
                                                className="text-green-600 hover:text-green-900 mr-4"
                                                onClick={() => handleKYCAction(user._id, 'verified')}
                                                title="Verify"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleKYCAction(user._id, 'rejected')}
                                                title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
               )}
          </div>
      )}
    </div>
  );
};

