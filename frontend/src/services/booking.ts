import { api } from "./api";
import type { Vehicle } from "./vehicle";

export interface Booking {
  _id: string;
  vehicleId: Vehicle  ;
  userId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  cancellationReason?: string;
  refundAmount?: number;
  createdAt: string;
}

export const bookingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
    }),
    getMyBookings: builder.query<{ data: Booking[] }, void>({
      query: () => "/bookings/my",
    }),
    cancelBooking: builder.mutation<Booking, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/bookings/${id}/cancel`,
        method: "POST",
        body: { reason },
      }),
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} = bookingApi;
