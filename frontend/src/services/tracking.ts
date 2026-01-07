import { api } from "./api";

export interface TrackingData {
  vehicleId: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

export const trackingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVehicleTracking: builder.query<{ data: TrackingData }, string>({
      query: (vehicleId) => `/tracking/${vehicleId}`,
      keepUnusedDataFor: 5, // Cache for 5 seconds for real-time feel
    }),
  }),
});

export const { useGetVehicleTrackingQuery } = trackingApi;
