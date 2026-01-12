
import { useState } from 'react';
import { useGetVehiclesQuery, useDeleteVehicleMutation } from '../services/vehicle';
import { useGetAllUsersQuery, useUpdateKYCStatusMutation } from '../services/user';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { cn } from '../utils/cn';
import { FleetManagement } from '../components/Admin/FleetManagement';
import { KYCRequests } from '../components/Admin/KYCRequests';

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

  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const handleDeleteVehicle = async () => {
      if(!vehicleToDelete) return;
      try {
          await deleteVehicle(vehicleToDelete).unwrap();
          toast.success("Vehicle deleted");
          refetchVehicles();
      } catch(err) {
          toast.error("Failed to delete");
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
    cn(
      'py-2 px-4 font-medium transition',
      activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
    );

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
          <FleetManagement 
            vehicles={vehicles} 
            isLoading={vehicleLoading} 
            onDelete={setVehicleToDelete} 
          />
      ) : (
          <KYCRequests 
            users={kycUsers} 
            isLoading={usersLoading} 
            onAction={handleKYCAction} 
          />
      )}

      <ConfirmModal
        isOpen={!!vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        onConfirm={handleDeleteVehicle}
        title="Delete Vehicle"
        message="Are you sure you want to remove this vehicle from the fleet? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};

