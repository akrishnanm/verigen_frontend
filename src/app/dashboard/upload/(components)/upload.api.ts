import { baseApi } from '@/redux/baseApi';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upload: builder.mutation({
      query: (formData) => ({
        url: '/storage/blob/upload?container=verigen',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadMutation } = uploadApi;
