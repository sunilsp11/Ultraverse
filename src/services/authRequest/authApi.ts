import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl, endPoints} from '../endPoints';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
  endpoints: build => ({
    register: build.mutation<any, any>({
      query: credentials => {
        return {
          url: endPoints.register,
          method: 'POST',
          body: credentials,
        };
      },
    }),
    login: build.mutation<any, any>({
      query: credentials => {
        return {
          url: endPoints.login,
          method: 'POST',
          body: credentials,
        };
      },
    }),
  }),
});

export const {useRegisterMutation, useLoginMutation} = authApi;