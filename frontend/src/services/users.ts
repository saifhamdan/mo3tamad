import axios from 'axios';
import { headers } from './auth';

export const getMyProfile = async (): Promise<User> => {
  try {
    const res = await axios({
      url: `${process.env.REACT_APP_API_URL}/api/v1/accounts/me`,
      method: 'GET',
      headers,
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
