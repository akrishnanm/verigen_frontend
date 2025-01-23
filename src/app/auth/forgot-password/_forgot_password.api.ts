import { baseApi } from '@/redux/baseApi';

export const forgotPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation({
      query: (userData) => ({
        url: '/forgot-password/security-question',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userData,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation } = forgotPasswordApi;
