import useApi from "@/hooks/useApi";
import useSyncParams from "@/hooks/useSyncParams";
import useSelect from "./useSelect";
import { useEffect } from "react";
import { appointmentMockData } from "@/views/demo/utils/mockData";

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

  // Filter mock data when demo mock is active
  const filteredMockData = appointmentMockData.filter((item) => {
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      const name = `${item.user?.first_name} ${item.user?.last_name}`.toLowerCase();
      const email = (item.user?.email || "").toLowerCase();
      const id = (item.id || "").toLowerCase();
      const category = (item.document_category?.name || "").toLowerCase();
      if (!name.includes(q) && !email.includes(q) && !id.includes(q) && !category.includes(q)) {
        return false;
      }
    }
    if (filter?.status && filter.status !== "" && filter.status !== "all") {
      if (item.status?.toUpperCase() !== filter.status?.toUpperCase()) {
        return false;
      }
    }
    return true;
  });

  const totalMock = filteredMockData.length;
  const lastPageMock = Math.ceil(totalMock / Number(per_page)) || 1;
  const fromMock = totalMock === 0 ? 0 : (Number(page) - 1) * Number(per_page) + 1;
  const toMock = Math.min(Number(page) * Number(per_page), totalMock);
  const pagedMockData = filteredMockData.slice(
    (Number(page) - 1) * Number(per_page),
    Number(page) * Number(per_page)
  );

  const tableInfo = {
    // data: data?.data ?? [],
    data: { data: pagedMockData },
    pagination: {
      ...data?.data?.pagination,
      page: Number(page),
      per_page: Number(per_page),
      total: totalMock,
      last_page: lastPageMock,
      from: fromMock,
      to: toMock,
      prev_page: Number(page) > 1 ? Number(page) - 1 : null,
      next_page: Number(page) < lastPageMock ? Number(page) + 1 : null,
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
