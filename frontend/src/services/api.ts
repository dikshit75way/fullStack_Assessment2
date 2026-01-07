import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout, type AuthState } from '../store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api', // Backend URL
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: AuthState }).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to get refresh token from state
    const refreshToken = (api.getState() as { auth: AuthState }).auth.refreshToken;
    
    if (refreshToken) {
      // call refresh token endpoint
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        // store the new token
        const data = refreshResult.data as  {data : {accessToken : string , refreshToken : string}}; // Adjust type based on actual response
        console.log("debbuging the to type data" , data)
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;
        

        
        const user = (api.getState() as { auth: AuthState }).auth.user;

        api.dispatch(setCredentials({ 
            user: user, 
            accessToken: newAccessToken,
            refreshToken: newRefreshToken 
        }));
        
        // retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "UserList"], 
  endpoints: () => ({}),
});
