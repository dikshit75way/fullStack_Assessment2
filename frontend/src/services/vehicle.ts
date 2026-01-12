import { api } from "./api";

export interface Vehicle {
  _id: string;
  brand: string ;
  model: string;
  year: number;
  plateNumber: string;
  type: "Sedan" | "SUV" | "Luxury" | "Truck" | "Van";
  pricePerDay: number;
  image: string;
  status: "available" | "rented" | "maintenance";
  features?: string[];
  owner?: string;
  isCurrentlyRented?: boolean;
}

export const vehicleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query<{ data: Vehicle[] }, { status?: string; type?: string } | void>({
      query: (params) => ({
        url: "/vehicles",
        params: params || {},
      }),
    }),
    getVehicleById: builder.query<{ data: Vehicle }, string>({
      query: (id) => `/vehicles/${id}`,
    }),
    createVehicle: builder.mutation<Vehicle, FormData>({
      query: (formData) => ({
        url: "/admin/vehicles",
        method: "POST",
        body: formData,
      }),
    }),
    updateVehicle: builder.mutation<Vehicle, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/admin/vehicles/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteVehicle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/vehicles/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApi;
