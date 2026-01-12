import { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { useInitiatePaymentMutation, useConfirmPaymentMutation } from '../services/payment';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    amount: number;
    onSuccess: () => void;
}

const CheckoutForm = ({ bookingId, amount, onSuccess, onClose }: Omit<PaymentModalProps, 'isOpen'>) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmPayment] = useConfirmPaymentMutation();
    const [initiatePayment] = useInitiatePaymentMutation();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);   
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) return;

        toast.loading("Initiating Secure Session...", { id: 'payment-toast' });

        try {
            // 1. Get Client Secret from Backend
            const paymentResponse = await initiatePayment({
                bookingId,
                amount,
                currency: 'USD',
                paymentMethod: 'stripe_card'
            }).unwrap();

            const clientSecret = paymentResponse.clientSecret;
            if (!clientSecret) throw new Error("Could not retrieve payment intent");

            toast.loading("Confirming with Bank...", { id: 'payment-toast' });

            // 2. Confirm Payment with Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                toast.error(error.message || 'Payment failed', { id: 'payment-toast' });
                setIsProcessing(false);
            } else if (paymentIntent?.status === 'succeeded') {
                toast.loading("Payment received! Finalizing...", { id: 'payment-toast' });
                
                // 3. Manual fallback to update backend status immediately
                try {
                    await confirmPayment({ paymentIntentId: paymentIntent.id }).unwrap();
                } catch (confirmErr) {
                    console.error("Manual confirmation failed, status will update via webhook shortly", confirmErr);
                }

                toast.success("Booking Confirmed!", { id: 'payment-toast' });
                setIsProcessing(false);
                onSuccess();
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.data?.message || err.message || 'Payment failed', { id: 'payment-toast' });
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                <CardElement 
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#1f2937',
                                '::placeholder': {
                                    color: '#9ca3af',
                                },
                            },
                            invalid: {
                                color: '#dc2626',
                            },
                        },
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className={cn(
                    "w-full py-4 rounded-lg font-bold text-white shadow-lg transition transform active:scale-95 text-lg",
                    isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                )}
            >
                {isProcessing ? 'Verifying Transaction...' : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
};

export const PaymentModal = (props: PaymentModalProps) => {
    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gray-50 px-6 py-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center text-gray-800">
                        <CreditCard className="mr-2 text-blue-600" /> Secure Checkout
                    </h3>
                    <button onClick={props.onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-8">
                    <div className="mb-8 text-center bg-blue-50/50 py-6 rounded-xl border border-blue-100">
                        <p className="text-blue-600 mb-1 text-xs font-bold uppercase tracking-widest">Amount to Pay</p>
                        <p className="text-5xl font-black text-gray-900">${props.amount.toFixed(2)}</p>
                    </div>

                    <Elements stripe={stripePromise}>
                        <CheckoutForm {...props} />
                    </Elements>
                    
                    <div className="mt-8 flex flex-col items-center space-y-2">
                        <p className="text-[10px] text-gray-400 flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Lock size={10} className="mr-1 text-green-500" /> Powered by Stripe • AES-256 Encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
