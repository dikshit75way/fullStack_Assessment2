
import { useState, useEffect } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { useInitiatePaymentMutation, useLazyGetPaymentStatusQuery } from '../services/payment';
import toast from 'react-hot-toast';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    amount: number;
    onSuccess: () => void;
}

export const PaymentModal = ({ isOpen, onClose, bookingId, amount, onSuccess }: PaymentModalProps) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // API Hooks
    const [initiatePayment] = useInitiatePaymentMutation();
    const [getPaymentStatus] = useLazyGetPaymentStatusQuery();

    useEffect(() => {
        if (!isOpen) {
            setCardNumber('');
            setExpiry('');
            setCvc('');
            setIsProcessing(false);
        }
    }, [isOpen]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // 1. Initiate Payment
            await initiatePayment({
                bookingId,
                amount,
                currency: 'USD',
                paymentMethod: 'credit_card'
            }).unwrap();

            toast.loading("Processing Payment...", { id: 'payment-toast' });

            // 2. Poll for status (Simulated)
            const checkStatus = setInterval(async () => {
                const { data } = await getPaymentStatus(bookingId);
                
                if (data?.data?.status === 'success') {
                    clearInterval(checkStatus);
                    toast.dismiss('payment-toast');
                    toast.success("Payment Successful!");
                    setIsProcessing(false);
                    onSuccess();
                    onClose();
                } else if (data?.data?.status === 'failed') {
                     clearInterval(checkStatus);
                     toast.dismiss('payment-toast');
                     toast.error("Payment Failed. Please try again.");
                     setIsProcessing(false);
                }
            }, 1000);

            // Timeout after 10s
             setTimeout(() => {
                 clearInterval(checkStatus);
                 if (isProcessing) {
                     toast.dismiss('payment-toast');
                     toast.error("Payment Timed Out");
                     setIsProcessing(false);
                 }
             }, 10000);

         } catch (err: any) {
              console.error(err);
              toast.error(err.data?.message || 'Registration failed');
            }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center">
                        <CreditCard className="mr-2 text-blue-600" /> Secure Payment
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="mb-6 text-center">
                        <p className="text-gray-500 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-gray-900">${amount.toFixed(2)}</p>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Card Number</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    required
                                    maxLength={19}
                                />
                                <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    required
                                    maxLength={5}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">CVC</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="123"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                        required
                                        maxLength={3}
                                    />
                                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isProcessing}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition transform active:scale-95 ${
                                isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isProcessing ? 'Processing Payment...' : `Pay $${amount.toFixed(2)}`}
                        </button>
                    </form>
                    
                    <p className="mt-4 text-xs text-center text-gray-400 flex items-center justify-center">
                        <Lock size={12} className="mr-1" /> Encrypted & Secure Connection
                    </p>
                </div>
            </div>
        </div>
    );
};
