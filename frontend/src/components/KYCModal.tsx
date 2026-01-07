import React, { useState } from 'react';
import { useVerifyKYCMutation } from '../services/user';
import { Input } from './Input';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface KYCModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const KYCModal = ({ isOpen, onClose, onSuccess }: KYCModalProps) => {
    const [formData, setFormData] = useState({
        driverLicense: '',
        phoneNumber: ''
    });
    const [verifyKYC, { isLoading }] = useVerifyKYCMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await verifyKYC(formData).unwrap();
            toast.success("KYC Submitted Successfully");
            onSuccess();
            onClose();
        }   catch (err: any) {
              console.error(err);
              toast.error(err.data?.message || 'Registration failed');
            }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Complete KYC Verification</h2>
                <p className="text-gray-600 mb-6">To book a vehicle, we need to verify your identity.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Phone Number" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        required
                        placeholder="+1 234 567 8900"
                    />
                    <Input 
                        label="Driver's License ID" 
                        value={formData.driverLicense}
                        onChange={(e) => setFormData({...formData, driverLicense: e.target.value})}
                        required
                        placeholder="License Number"
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full btn-primary py-2 rounded-md disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Verification'}
                    </button>
                </form>
            </div>
        </div>
    );
};
