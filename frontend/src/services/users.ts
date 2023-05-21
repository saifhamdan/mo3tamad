import axios from 'axios';
import { headers, accountId } from './auth';
import { httpMapper } from 'utils/http-mapper';

export const getMyProfile = async (): Promise<User> => {
  try {
    console.log(headers, accountId);
    const res = await axios({
      url: `${process.env.REACT_APP_API_URL}/api/v1/accounts/${accountId}/users/me`,
      method: 'GET',
      headers,
    });
    return httpMapper<User>(res.data.data);
  } catch (err) {
    throw err;
  }
};
