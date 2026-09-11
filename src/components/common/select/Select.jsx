import useApi from "@/hooks/useApi";
import { useMemo } from "react";
import SelectList from "./SelectList";

const Select = ({
  form,
  title,
  placeholder,
  name,
  api = null,
  manualOption = [],
  filter = null,
  loading = false,
  cacheKey,
  params = null,
  multiSelect = false,
  value,
  setValue,
  showMax = 2,
  required = false,
  optionSchema = {
    id: "id",
    label: "name",
    img: "image",
  },
  inputClassName,
  commandClassName,
  onAddNew = null,
}) => {
  const { data, isLoading: loadingApi } = useApi({
    trigger: !!api,
    api,
    filter,
    params,
    cacheKey,
  });
  const options = useMemo(() => {
    const modifiedList =
      [...manualOption, ...(data?.data || [])].map((item) => ({
        id: item?.[optionSchema?.id],
        label: item?.[optionSchema?.label],
        img: item?.[optionSchema?.img],
      })) || [];
    return modifiedList;
  }, [data?.data, manualOption, optionSchema]);
  const isLoading = loading || loadingApi;
  return (
    <SelectList
      {...{
        showMax,
        form,
        title,
        placeholder,
        name,
        options,
        isLoading,
        multiSelect,
        value,
        setValue,
        inputClassName,
        commandClassName,
        required,
        onAddNew,
      }}
    />
  );
};
export default Select;
