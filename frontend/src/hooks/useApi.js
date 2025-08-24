import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'An error occurred');
        }
      } catch (err) {
        // Handle 401 errors (unauthorized)
        if (err.status === 401) {
          logout();
        }
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

export default useApi;
