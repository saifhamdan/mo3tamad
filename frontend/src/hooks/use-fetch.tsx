import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { headers, accountId } from 'services/auth';
import { httpMapper } from 'utils/http-mapper';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
}

function useFetch<T>(
  url: string,
  initialData: any,
  options?: FetchOptions,
  initRefetch?: boolean | null
): {
  data: T;
  loading: boolean;
  error: Error | undefined;
  setData: React.Dispatch<any>;
  setRefetch: React.Dispatch<boolean | null>;
} {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(initRefetch);
  const [error, setError] = useState<Error | undefined>();

  const { method = 'GET', body = '' } = options || {};

  useEffect(() => {
    if (refetch !== null) {
      setLoading(true);
      const request$ = axios(url, {
        method,
        headers: headers,
        ...(method !== 'GET' && { body }),
      });

      request$
        .then((res) => {
          setData(httpMapper(res.data.data));
        })
        .catch((err) => {
          const error: ErrorResponse = err.response.data;
          if (error.code === 401) {
            navigate('/login');
            return;
          }
          setData(null);
          setError(err);
        })
        .finally(() => setLoading(false));
    }
  }, [refetch]);

  return { data, loading, error, setData, setRefetch };
}

export default useFetch;
