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
    forgotPassword: build.mutation<any, any>({
      query: payload => {
        return {
          url: endPoints.forgotPassword,
          method: 'POST',
          body: payload,
        };
      },
    }),
    resetPassword: build.mutation<any, any>({
      query: payload => {
        return {
          url: endPoints.resetPassword,
          method: 'POST',
          body: payload,
        };
      },
    }),
    changePassword: build.mutation<any, {token: string; old_password: string; new_password: string}>({
      query: ({token, ...payload}) => {
        return {
          url: endPoints.changePassword,
          method: 'POST',
          body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;