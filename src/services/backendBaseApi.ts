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
  
  /**
   * Base query wrapper that handles token refresh when an authenticated request fails
   * due to an expired/invalid access token.
   */
  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    let result = await timeoutFetchBaseQuery(args, api, extraOptions);
  
    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      try {
        const refreshToken = await AsyncStorage.getItem('UserRefreshToken');
        console.log("refreshToken", refreshToken);
        
        if (!refreshToken) {
          return result;
        }
  
        const refreshBaseQuery = fetchBaseQuery({
          baseUrl: baseUrl,
          prepareHeaders: (headers) => {
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            return headers;
          },
        });
  
        const refreshResult = await refreshBaseQuery(
          {
            url: '/auth/token/refresh/',
            method: 'POST',
            body: {refresh: refreshToken},
          },
          api,
          extraOptions,
        );
        
        if (refreshResult.data) {
          const data = refreshResult.data as any;
          const newAccessToken = data.access;
          const newRefreshToken = data.refresh ?? refreshToken;
  
          if (newAccessToken) {
            await AsyncStorage.setItem('UserToken', newAccessToken);
            if (newRefreshToken) {
              await AsyncStorage.setItem('UserRefreshToken', newRefreshToken);
            }
  
            // Retry the original query with the new access token
            result = await timeoutFetchBaseQuery(args, api, extraOptions);
          }
        } else {
          // If refresh failed, clear stored tokens
          await AsyncStorage.multiRemove(['UserToken', 'UserRefreshToken']);
        }
      } catch (e) {
        // In case of any unexpected error, just return the original result
        return result;
      }
    }
  
    return result;
  };
  
  const baseQueryWithRetriesAndBailout = retry(
    async (args, api, options) => {
      const result = await baseQueryWithReauth(args, api, options);
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