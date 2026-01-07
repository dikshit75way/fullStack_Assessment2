import { api } from "./api";

export interface Payment {
  _id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation<Payment, Partial<Payment>>({
      query: (data) => ({
        url: "/payments/checkout",
        method: "POST",
        body: data,
      }),
    }),
    getPaymentStatus: builder.query<{ data: Payment }, string>({
      query: (bookingId) => `/payments/status/${bookingId}`,
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetPaymentStatusQuery,
  useLazyGetPaymentStatusQuery,
} = paymentApi;
