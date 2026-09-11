import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function useSyncParams() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const routerSyncParams = useCallback(
    (params) => {
      const newSearchParams = new URLSearchParams(searchParams);

      // Update or add new parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          // Remove parameter if value is null, undefined, or empty string
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      // Navigate to the same path with updated search params
      navigate(`?${newSearchParams.toString()}`, { replace: true });
    },
    [searchParams, navigate]
  );

  return {
    searchParamsSyncParams: searchParams,
    routerSyncParams,
  };
}
