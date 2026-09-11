import useApi from "@/hooks/useApi";
import useSyncParams from "@/hooks/useSyncParams";
import useSelect from "./useSelect";
import { useEffect } from "react";
import { appointmentMockData } from "@/pages/demo/utils/mockData";

const useTable = ({ filter, api, apiCacheKey, staleTime }) => {
  const { selectedRows, handleRowSelect, handleSelectAll, handleUnselectAll } =
    useSelect();

  const { routerSyncParams, searchParamsSyncParams } = useSyncParams();

  const searchParams = searchParamsSyncParams;
  const pageParams = searchParams?.get("page");
  const per_pageParams = searchParams?.get("per_page");
  const page =
    (isNaN(per_pageParams) || pageParams) < 1 ? 1 : (pageParams ?? 1);
  const per_page =
    (isNaN(per_pageParams) || per_pageParams < 1 ? 10 : per_pageParams) ?? 10;

  const { data, isLoading } = useApi({
    params: {
      page,
      limit: per_page,
      ...filter,
    },
    api,
    cacheKey: apiCacheKey,
    staleTime,
  });

  useEffect(() => {
    handleUnselectAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsSyncParams]);

  // here commented out real api data and used mock data for demo purpose -- remove mock data and uncomment real api data when integrating with real api

  const tableInfo = {
    // data: data?.data ?? [],
    data: { data: appointmentMockData },
    pagination: {
      ...data?.data?.pagination,
      page: Number(page),
      per_page: Number(per_page),
    },
    routerSyncParams,
    handleRowSelect,
    handleSelectAll,
    handleUnselectAll,
    selectedRows,
    cacheKey: apiCacheKey,

    // isLoading,
    isLoading: false,
  };
  return { tableInfo };
};
export default useTable;
