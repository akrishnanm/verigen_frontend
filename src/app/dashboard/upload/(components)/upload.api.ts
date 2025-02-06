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
    fetchUploadedFiles: builder.query({
      query: (accessToken) => ({
        url: '/fetch_files',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
});

export const { useUploadMutation, useFetchUploadedFilesQuery } = uploadApi;
