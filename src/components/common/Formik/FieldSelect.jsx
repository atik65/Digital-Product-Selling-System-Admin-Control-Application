import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const FieldSelect = ({
  name,
  form,
  placeholder = "Select an option",
  label,
  description,
  disabled = false,
  required = false,
  options = [],
  icon,
  className,
  onChange,
  isOptionsLoading,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value, field) => {
    console.log("Selected value:", value);
    field.onChange(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col">
          <FormItem>
            <div>
              {label && (
                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-1 h-3 mb-1">
                  {label}
                  {required && (
                    <span className="text-rose-500 text-base font-bold">*</span>
                  )}
                </FormLabel>
              )}
            </div>
            <FormControl>
              <motion.div
                // initial={{ opacity: 0, y: 10 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.3 }}
                className="relative group"
              >
                {/* Gradient glow effect → Brand green tint */}
                <div
                  className={cn(
                    "absolute -inset-0.5 bg-[#006A4E]/20 rounded-[10px] blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                    isFocused && "opacity-30"
                  )}
                />

                <Select
                  disabled={disabled}
                  onValueChange={(value) => handleChange(value, field)}
                  value={
                    options.find((option) => option.value == field.value)
                      ?.value || ""
                  }
                  onOpenChange={setIsFocused}
                  {...props}
                >
                  <SelectTrigger
                    className={cn(
                      "relative h-12 px-4   border border-[#D1D5DC] rounded-[10px] text-sm font-medium text-gray-800 transition-all duration-300",
                      "focus:border-[#D1D5DC] focus:border focus:ring-2 focus:ring-[#006A4E]/20 ",
                      "hover:border",
                      icon && "pl-12",
                      disabled && "opacity-50 cursor-not-allowed bg-gray-50",
                      className
                    )}
                  >
                    <SelectValue
                      placeholder={
                        isOptionsLoading ? "Loading options ..." : placeholder
                      }
                    />
                  </SelectTrigger>

                  <SelectContent
                    className={cn(
                      "bg-white/95 backdrop-blur-sm border-2 border-gray-200/80 rounded-[10px] shadow-xl overflow-hidden"
                    )}
                  >
                    {/* if options are loading */}
                    {isOptionsLoading && (
                      <div className="p-4 text-center text-gray-500">
                        Loading options...
                      </div>
                    )}

                    {/* if no options available */}
                    {!isOptionsLoading && options.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No options available.
                      </div>
                    )}

                    <SelectGroup>
                      {options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className={cn(
                            "text-sm font-medium text-gray-700 cursor-pointer transition-colors duration-200 relative",
                            "focus:bg-[#006A4E]/10 focus:text-[#006A4E]",
                            "hover:bg-[#006A4E]/5"
                          )}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </motion.div>
            </FormControl>

            <FormMessage className="text-xs font-bold text-rose-500 mt-0" />
          </FormItem>
        </div>
      )}
    />
  );
};

export default FieldSelect;

/* Example usage:
function MyForm() {


  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "food", label: "Food & Beverages" },
    { value: "books", label: "Books" },
  ];

  return (
   
        <FieldSelect
          name="category"
          form={form}
          label="Category"
          placeholder="Select a category"
          options={categoryOptions}
          icon={<Filter />}
          required
        />
  
  );
}
*/
