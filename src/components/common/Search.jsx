import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Search = ({
  value,
  setValue,
  inputClassName,
  disabledClearable,
  ...props
}) => {
  return (
    <>
      <div className="relative">
        <Input
          className={cn("pr-4", inputClassName)}
          placeholder="Search..."
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          {...props}
        />
        {!disabledClearable && value && (
          <div
            className="absolute top-1/2 -translate-y-1/2 right-3 z-1 hover:text-red-500 cursor-pointer"
            onClick={() => {
              setValue("");
            }}
          >
            <X className="w-4 h-4" />
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
