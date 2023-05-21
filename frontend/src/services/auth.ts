import axios from 'axios';
import Cookies from 'js-cookie';

import { ACCESS_TOKEN, COOKIE_ACCOUNT_ID } from 'constant/cookies';
import { httpMapper } from 'utils/http-mapper';

export let headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,PUT,PATCH,DELETE',
  'Access-Control-Allow-Headers': 'Authorization, Lang',
  authorization: `Bearer ${Cookies.get(ACCESS_TOKEN)}`,
};

export let accountId = 1;

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const res = await axios({
      url: `${process.env.REACT_APP_API_URL}/auth/oauth/login`,
      method: 'POST',
      headers: {
        authorization: `Basic ${basicAuth(email, password)}`,
      },
    });

    return httpMapper<LoginResponse>(res.data.data);
  } catch (err) {
    throw err;
  }
};

export const refreshToken = async () => {
  try {
    const res = await axios({
      url: `${process.env.REACT_APP_API_URL}/auth/oauth/refresh/token`,
      method: 'POST',
    });

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getUserPolicies = async (): Promise<CasbinPolicies> => {
  try {
    const res = await axios({
      url: `${process.env.REACT_APP_API_URL}/api/v1/accounts/${accountId}/users/policies/ui`,
      method: 'GET',
      headers: headers,
    });

    return httpMapper<CasbinPolicies>(res.data.data);
  } catch (err) {
    throw err;
  }
};

export const logout = async (sessionId: string) => {
  try {
    await axios({
      url: `${process.env.REACT_APP_API_URL}/auth/oauth/logout/${sessionId}`,
      method: 'DELETE',
    });
  } catch (err) {
    throw err;
  }
};

export const updateHeaders = (accessToken: string) => {
  headers = {
    ...headers,
    authorization: `Bearer ${accessToken}`,
  };
};

export const updateAccountId = (id: number) => {
  console.log(id);
  accountId = id;
};

const basicAuth = (username: string, password: string): string => {
  return btoa(username + ':' + password);
};
