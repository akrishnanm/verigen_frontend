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
      query: () => ({
        url: '/fetch_files',
        method: 'GET',
      }),
    }),
    processFile: builder.mutation({
      query: ({ file_id, fcm_token }) => ({
        url: '/api/Icarus/',
        method: 'POST',
        body: { file_id, fcm_token },
      }),
    }),
    processOpenLaneFile: builder.mutation({
      query: ({ file_id, fcm_token}) => ({
        url: '/api/Openlane_2/',
        method: 'POST',
        body: { file_id, fcm_token },
      }),
    }),
  }),
});

export const {
  useUploadMutation,
  useFetchUploadedFilesQuery,
  useProcessFileMutation,
  useProcessOpenLaneFileMutation,
} = uploadApi;
