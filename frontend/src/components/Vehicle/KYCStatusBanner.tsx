
import { ShieldAlert } from 'lucide-react';

interface KYCStatusBannerProps {
    status: string;
}

export const KYCStatusBanner = ({ status }: KYCStatusBannerProps) => {
    if (status === 'verified') return null;

    const isPending = status === 'pending';
    
    return (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
            isPending ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'
        }`}>
            <ShieldAlert className="mr-2" />
            <div>
                <p className="font-bold">Verification Required</p>
                <p className="text-sm">
                    {isPending 
                      ? 'Your KYC is currently under review. You will be able to book once verified.' 
                      : 'You need to complete KYC verification to book vehicles.'}
                </p>
            </div>
        </div>
    );
};
