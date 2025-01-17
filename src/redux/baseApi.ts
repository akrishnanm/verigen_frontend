import {
  fetchBaseQuery,
  createApi,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: 'http://127.0.0.1:8080',
    });

    const result = await baseQuery(args, api, extraOptions);

    // Global error handling
    if (result.error) {
      const error = result.error as FetchBaseQueryError;

      let errorMessage = 'An unexpected error occurred';

      // Handle HTTP errors (status is a number)
      if (typeof error.status === 'number') {
        errorMessage =
          (error.data as { detail?: string })?.detail || errorMessage;
      }

      // Handle network or parsing errors
      if (error.status === 'FETCH_ERROR' || error.status === 'PARSING_ERROR') {
        errorMessage = error.error || 'Network error occurred';
      }
      toast.error(errorMessage);
    }

    // Success message for status 201
    if (result.meta?.response?.status === 201) {
      const successMessage =
        (result.data as { message?: string })?.message ||
        'Action completed successfully!';
      toast.success(successMessage);
    }

    return result;
  },
  endpoints: () => ({}),
});
