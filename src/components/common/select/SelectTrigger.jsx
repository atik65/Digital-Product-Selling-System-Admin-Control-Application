import { Badge } from "@/components/ui/badge";
import { FormControl } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import formOpt from "@/lib/formOpt";
import { cn } from "@/lib/utils";
import { ChevronDown, LoaderCircle, X } from "lucide-react";

const TriggerButton = ({
  singleSelectValue,
  options,
  multiSelect,
  multiSelectValues,
  name,
  setSelectValue,
  isForm,
  isLoading,
  placeholder,
  showMax,
}) => {
  if (multiSelect && multiSelectValues) {
    return (
      <div
        className={cn(
          "justify-between flex w-full",
          "px-3" && multiSelectValues?.size === 0
        )}
      >
        <div className="flex justify-between gap-4 w-full">
          <div className="flex items-center text-sm capitalize">
            {multiSelectValues?.size === 0 && (
              <span className="text-muted-foreground text-sm font-normal ">
                {multiSelectValues?.size ? placeholder : placeholder}
              </span>
            )}
            {multiSelectValues?.size > 0 && (
              <>
                {multiSelectValues?.size < 1 && (
                  <Separator orientation="vertical" className="mx-2 h-4" />
                )}
                <div className="gap-1 flex flex-wrap py-1 items-center">
                  {options
                    .filter((option) => multiSelectValues.has(option?.id))
                    .slice(0, showMax)
                    .map((option) => (
                      <div
                        key={option?.id}
                        className="flex items-center g-3 bg-accent px-1.5 rounded-md overflow-hidden"
                      >
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal truncate block max-w-16"
                          title={option?.label}
                        >
                          {option?.label}
                        </Badge>
                        <div
                          className="hover:text-red-500"
                          onClick={(e) => {
                            e.preventDefault();
                            multiSelectValues.delete(option?.id);
                            const values = Array.from(multiSelectValues);
                            if (isForm) {
                              // check is form field
                              setSelectValue(
                                name,
                                values.length ? values : [],
                                formOpt
                              );
                            } else {
                              setSelectValue(values.length ? values : []);
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  {multiSelectValues?.size > showMax && (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      +{multiSelectValues?.size - showMax}
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            {multiSelectValues?.size > 0 && (
              <div
                className="hover:text-red-500 text-xs"
                onClick={(e) => {
                  e.preventDefault();

                  if (isForm) {
                    // check is form field
                    setSelectValue(name, [], formOpt);
                  } else {
                    setSelectValue([]);
                  }
                }}
              >
                {/* <X className="w-4 h-4" /> */}
                Clear All
              </div>
            )}
            <div className="flex items-center">
              {isLoading ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 justify-between grid grid-cols-1 w-full">
      <div className="flex justify-between gap-4 w-full capitalize overflow-hidden">
        <span className="text-muted-foreground text-sm font-normal truncate">
          {singleSelectValue
            ? options.find((option) => option?.id == singleSelectValue)?.label
            : placeholder}
        </span>

        <div className="flex gap-1 items-center">
          {singleSelectValue && (
            <div
              className="hover:text-red-500"
              onClick={(e) => {
                e.preventDefault();

                if (isForm) {
                  // check is form field
                  setSelectValue(name, "", formOpt);
                } else {
                  setSelectValue("");
                }
              }}
            >
              <X className="w-4 h-4" />
            </div>
          )}
          <div>
            {isLoading ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const IsFormControl = ({ isForm, children }) => {
  return isForm ? <FormControl>{children}</FormControl> : children;
};

const SelectTrigger = (props) => {
  return (
    <IsFormControl isForm={props?.isForm}>
      <TriggerButton {...props} />
    </IsFormControl>
  );
};

export default SelectTrigger;
