import { baseApi } from '@/redux/baseApi';
export const resetPasswordAPI = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      resetPassword: builder.mutation({
        query: (userData) => ({
          url: '/forgot-password/reset',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: userData,
        }),
      }),
    }),
  });
  
  export const { useResetPasswordMutation } = resetPasswordAPI;