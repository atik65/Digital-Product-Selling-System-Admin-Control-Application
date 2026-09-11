import { cn } from "@/lib/utils";
import { useDebouncedValue, useDidUpdate } from "@mantine/hooks";
import { Search as SearchIcon } from "lucide-react";
import { memo, useState } from "react";
import Search from "../Search";

const TableSearch = ({
  tableInfo,
  searchTableParams,
  className,
  inputClassName,
  leftIcon = (
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
  ),
  rightIcon,
  renderSearchButton,
  disabledClearable = false,
  ...props
}) => {
  const [value, setValue] = useState(searchTableParams || "");
  const [search] = useDebouncedValue(value, 500);
  useDidUpdate(() => {
    tableInfo.routerSyncParams({ search, page: 1 });
  }, [search]);

  return (
    <div className={cn("w-full  [&>div]:pt-0 relative", className)}>
      <Search
        value={value}
        setValue={setValue}
        inputClassName={cn(
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          inputClassName
        )}
        disabledClearable={disabledClearable}
        {...props}
      />
      {leftIcon && leftIcon}
      {rightIcon && rightIcon}
    </div>
  );
};

export default memo(TableSearch);
