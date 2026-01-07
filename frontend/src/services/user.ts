import { api } from "./api";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    kycStatus: "none" | "pending" | "verified" | "rejected";
    driverLicense?: string;
    phoneNumber?: string;
}

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        verifyKYC: builder.mutation<User, { driverLicense: string; phoneNumber: string }>({
            query: (data) => ({
                url: "/users/verify-kyc",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        getAllUsers: builder.query<User[], void>({
            query: () => "/users",
            transformResponse: (response: { data: User[] }) => response.data,
            providesTags: ['UserList'],
        }),
        updateKYCStatus: builder.mutation<User, { id: string; status: string }>({
             query: ({ id, status }) => ({
                 url: `/users/admin/kyc/${id}`,
                 method: "PATCH",
                 body: { status }
             }),
             invalidatesTags: ['UserList'],
        })
    })
});

export const { useVerifyKYCMutation, useGetAllUsersQuery, useUpdateKYCStatusMutation } = userApi;
