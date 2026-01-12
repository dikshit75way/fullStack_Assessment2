
import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface User {
    _id: string;
    name: string;
    email: string;
    kycStatus: string;
    driverLicense?: string;
    phoneNumber?: string;
}

interface KYCRequestsProps {
    users: User[];
    isLoading: boolean;
    onAction: (id: string, status: 'verified' | 'rejected') => void;
}

const kycStatusVariant: Record<string, any> = {
    verified: 'success',
    pending: 'warning',
    rejected: 'error',
};

export const KYCRequests = ({ users, isLoading, onAction }: KYCRequestsProps) => {
    if (isLoading) return <div>Loading users...</div>;

    const kycUsers = users.filter(u => u.kycStatus === 'pending' || u.kycStatus === 'verified');

    return (
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
                    {kycUsers.map((user) => (
                        <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={kycStatusVariant[user.kycStatus] || 'gray'}>
                                    {user.kycStatus}
                                </Badge>
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
                                            onClick={() => onAction(user._id, 'verified')}
                                            title="Verify"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => onAction(user._id, 'rejected')}
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
    );
};
