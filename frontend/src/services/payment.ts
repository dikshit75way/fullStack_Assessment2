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
  clientSecret?: string;
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
      transformResponse: (response: { data: Payment }) => response.data,
      invalidatesTags: ["Booking", "Payment"],
    }),
    getPaymentStatus: builder.query<Payment, string>({
      query: (bookingId) => `/payments/status/${bookingId}`,
      transformResponse: (response: { data: Payment }) => response.data,
      providesTags: ["Payment"],
    }),
    confirmPayment: builder.mutation<{ success: boolean; status: string }, { paymentIntentId: string }>({
      query: (data) => ({
        url: "/payments/confirm",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking", "Payment"],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetPaymentStatusQuery,
  useLazyGetPaymentStatusQuery,
  useConfirmPaymentMutation,
} = paymentApi;
