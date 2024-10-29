// hooks/useFetch.ts
import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url: string, params: Record<string, any> = {}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, { params });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(params)]);

  return { data, loading, error };
};

export default useFetch;
