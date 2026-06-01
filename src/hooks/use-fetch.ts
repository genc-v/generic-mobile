import { useState, useCallback } from "react";
import { ApiRequestOptions } from "../types/api.types";
import { executeApiRequest } from "../services/api.service";

export function useFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeFetch = useCallback(
    async <T = any>(options: ApiRequestOptions): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        // Delegate to the decoupled API service
        const data = await executeApiRequest<T>(options);
        return data;
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { executeFetch, isLoading, error };
}
