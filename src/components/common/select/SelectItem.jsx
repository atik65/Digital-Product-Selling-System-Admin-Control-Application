import { CommandItem } from "@/components/ui/command";
import formOpt from "@/lib/formOpt";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const SelectItem = (props) =>
  props?.multiSelect ? (
    <MultiSelectItem {...props} />
  ) : (
    <SingleSelectItem {...props} />
  );
const MultiSelectItem = ({
  option,
  name,
  setSelectValue,
  multiSelectValues,
  isForm,
}) => {
  const isSelected = multiSelectValues.has(option?.id);

  return (
    <CommandItem
      value={option?.label}
      onSelect={() => {
        isSelected
          ? multiSelectValues.delete(option?.id)
          : multiSelectValues.add(option?.id);

        const values = Array.from(multiSelectValues);
        if (isForm) {
          // check is form field
          setSelectValue(name, values.length ? values : [], formOpt);
        } else {
          setSelectValue(values.length ? values : []);
        }
      }}
    >
      <ItemUI isSelected={isSelected} option={option} />
    </CommandItem>
  );
};

const SingleSelectItem = ({
  option,
  name,
  setSelectValue,
  singleSelectValue,
  isForm,
  handleClose,
}) => {
  return (
    <CommandItem
      key={option?.id}
      value={option?.label}
      onSelect={() => {
        if (isForm) {
          // check is form field
          setSelectValue(name, option?.id, formOpt);
        } else {
          setSelectValue(option?.id);
        }
        handleClose();
      }}
    >
      <ItemUI isSelected={option?.id === singleSelectValue} option={option} />
    </CommandItem>
  );
};

const ItemUI = ({ isSelected, option }) => {
  return (
    <span className="flex overflow-hidden w-full items-center gap-2">
      {option?.img && (
        <span className="relative w-6 h-6 shrink-0">
          <img
            alt={""}
            src={option?.img}
            className={"rounded-full object-cover"}
          />
        </span>
      )}
      <span className="truncate capitalize">{option?.label}</span>
      <Check
        className={cn(
          "h-4 w-4 shrink-0 ml-auto",
          isSelected ? "block" : "hidden"
        )}
      />
    </span>
  );
};

export default SelectItem;
