import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    retry,
  } from '@reduxjs/toolkit/query/react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from './endPoints';
  
  export const TAGS = Object.freeze({
    Stands: 'Stands',
  });
  
  const TAG_TYPES: string[] = Object.values(TAGS);
  
  const timeoutFetchBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);
  
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: baseUrl,
      prepareHeaders: async (headers, {type}) => {
        headers.set('Accept', 'application/json');
        headers.set('X-Pagination', 'false');
  
        if (type === 'mutation' && !headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }
  
        const token = await AsyncStorage.getItem('UserToken');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
  
        return headers;
      },
      signal: controller.signal,
    });
  
    const result = await rawBaseQuery(args, api, extraOptions);
    clearTimeout(timeoutId);
    return result;
  };
  
  const baseQueryWithRetriesAndBailout = retry(
    async (args, api, options) => {
      const result = await timeoutFetchBaseQuery(args, api, options);
      return result;
    },
    {maxRetries: 2},
  );
  
  const backendBaseApi = createApi({
    reducerPath: 'ultraverseBackend',
    baseQuery: baseQueryWithRetriesAndBailout,
    endpoints: () => ({}),
    tagTypes: TAG_TYPES,
  });
  
  export const {
    util: {resetApiState: resetBackendApiState},
  } = backendBaseApi;
  export default backendBaseApi;