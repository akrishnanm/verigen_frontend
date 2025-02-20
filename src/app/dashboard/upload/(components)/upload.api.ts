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
    processFile: builder.mutation({
      query: ({ file_id }) => ({
        url: '/api/Icarus/',
        method: 'POST',
        body: { file_id },
      }),
    }),
    processOpenLaneFile: builder.mutation({
      query: ({ file_id }) => ({
        url: '/api/Openlane_2/',
        method: 'POST',
        body: { file_id },
      }),
    }),
  }),
});

export const { useUploadMutation, useFetchUploadedFilesQuery, useProcessFileMutation, useProcessOpenLaneFileMutation } = uploadApi;
