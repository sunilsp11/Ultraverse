import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl, endPoints} from '../endPoints';

export type SocialLoginPayload = {
  provider: string;
  id_token: string;
};

export type SocialLoginResponse = {
  id: number;
  token: string;
  refresh: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

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
    socialLogin: build.mutation<SocialLoginResponse, SocialLoginPayload>({
      query: body => {
        return {
          url: endPoints.socialLogin,
          method: 'POST',
          body,
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
  useSocialLoginMutation,
} = authApi;