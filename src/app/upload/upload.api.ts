import { baseApi } from '@/redux/baseApi';

export const uploadFileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: ({ file, token }) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: '/storage/blob/upload?container=verigen',
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = uploadFileApi;