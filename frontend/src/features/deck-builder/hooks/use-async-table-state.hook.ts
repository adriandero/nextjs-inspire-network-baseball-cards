import { useState, useEffect } from "react";

// Custom hook to manage table loading states properly
export function useTableLoadingState<T>(
  data: T[] | undefined,
  isLoading: boolean,
) {
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    // Mark as loaded once when we have data or when loading finishes
    if ((data !== undefined && data.length >= 0) || !isLoading) {
      setHasLoadedOnce(true);
    }
  }, [data, isLoading]);

  return {
    isLoading,
    hasLoadedOnce,
    hasData: data && data.length > 0,
  };
}

// Alternative hook for more complex scenarios
export function useAsyncTableState<T>() {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (fetchFn: () => Promise<T[]>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      setHasLoadedOnce(true);
    } catch (err) {
      setError(err as Error);
      setHasLoadedOnce(true);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData([]);
    setIsLoading(false);
    setHasLoadedOnce(false);
    setError(null);
  };

  return {
    data,
    isLoading,
    hasLoadedOnce,
    error,
    fetchData,
    reset,
    hasData: data.length > 0,
  };
}
