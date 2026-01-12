
import { useEffect, useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { useInitiatePaymentMutation, useGetPaymentStatusQuery } from '../services/payment';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from './Input';
import { cn } from '../utils/cn';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    amount: number;
    onSuccess: () => void;
}

const paymentSchema = yup.object({
  cardNumber: yup.string()
    .required('Card number is required')
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Invalid card number format'),
  expiry: yup.string()
    .required('Expiry date is required')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry format (MM/YY)'),
  cvc: yup.string()
    .required('CVC is required')
    .matches(/^\d{3,4}$/, 'Invalid CVC'),
}).required();

type PaymentFormInputs = yup.InferType<typeof paymentSchema>;

export const PaymentModal = ({ isOpen, onClose, bookingId, amount, onSuccess }: PaymentModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    
    // API Hooks
    const [initiatePayment] = useInitiatePaymentMutation();
    
    // Polling logic: Only poll when isProcessing is true
    const { data: statusData } = useGetPaymentStatusQuery(bookingId, {
        pollingInterval: isProcessing ? 2000 : 0,
        skip: !isOpen || !bookingId,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PaymentFormInputs>({
        resolver: yupResolver(paymentSchema),
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setIsProcessing(false);
        }
    }, [isOpen, reset]);

    // Handle polling results
    useEffect(() => {
        if (isProcessing && statusData?.data) {
            const status = statusData.data.status;
            if (status === 'success') {
                toast.dismiss('payment-toast');
                toast.success("Payment Successful!");
                setIsProcessing(false);
                onSuccess();
                onClose();
            } else if (status === 'failed') {
                toast.dismiss('payment-toast');
                toast.error("Payment Failed. Please try again.");
                setIsProcessing(false);
            }
        }
    }, [statusData, isProcessing, onSuccess, onClose]);

    const onSubmit = async (_data: PaymentFormInputs) => {
        setIsProcessing(true);
        toast.loading("Processing Payment...", { id: 'payment-toast' });

        try {
            await initiatePayment({
                bookingId,
                amount,
                currency: 'USD',
                paymentMethod: 'credit_card'
            }).unwrap();
        } catch (err: any) {
            console.error(err);
            toast.dismiss('payment-toast');
            toast.error(err.data?.message || 'Payment initiation failed');
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-300">
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
                        <p className="text-gray-500 mb-1 text-sm uppercase tracking-wider">Total Amount</p>
                        <p className="text-4xl font-black text-gray-900">${amount.toFixed(2)}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Card Number"
                            placeholder="0000 0000 0000 0000"
                            {...register('cardNumber')}
                            error={errors.cardNumber?.message}
                            icon={<CreditCard size={20} />}
                            autoComplete="cc-number"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Expiry Date"
                                placeholder="MM/YY"
                                {...register('expiry')}
                                error={errors.expiry?.message}
                                autoComplete="cc-exp"
                            />
                            <Input
                                label="CVC"
                                placeholder="123"
                                type="password"
                                {...register('cvc')}
                                error={errors.cvc?.message}
                                icon={<Lock size={18} />}
                                autoComplete="cc-csc"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isProcessing}
                            className={cn(
                                "w-full py-4 rounded-lg font-bold text-white shadow-lg transition transform active:scale-95 text-lg",
                                isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            )}
                        >
                            {isProcessing ? 'Verifying Transaction...' : `Pay $${amount.toFixed(2)}`}
                        </button>
                    </form>
                    
                    <p className="mt-6 text-xs text-center text-gray-400 flex items-center justify-center">
                        <Lock size={12} className="mr-1" /> Encrypted & Secure Connection
                    </p>
                </div>
            </div>
        </div>
    );
};
