import { baseApi } from '@/redux/baseApi';

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (userData) => ({
        url: '/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userData,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = loginApi;
