import { baseApi } from '@/redux/baseApi';

export const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userData,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = registerApi;
