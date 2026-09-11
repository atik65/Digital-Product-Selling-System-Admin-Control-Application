import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, set } from "date-fns";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const FieldDatePicker = ({
  name,
  form,
  placeholder = "Select date",
  label,
  description,
  disabled = false,
  required = false,
  icon,
  className,
  onChange,
  calendarProps = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (date, field) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    field.onChange(formattedDate);
    setIsFocused(false);
    if (onChange) {
      onChange(formattedDate);
    }
  };

  //   console.log("is focused:", isFocused);

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
              <motion.div className="relative group">
                {/* Gradient glow effect → Brand green tint */}
                <div
                  className={cn(
                    "absolute -inset-0.5 bg-[#006A4E]/20 rounded-[10px] blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                    isFocused && "opacity-30"
                  )}
                />

                <Popover open={isFocused} onOpenChange={setIsFocused}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={disabled}
                      className={cn(
                        "relative h-12 px-4 w-full justify-start text-left font-medium border border-[#D1D5DC] rounded-[10px] text-sm text-gray-800 transition-all duration-300 cursor-pointer",
                        "focus:border-[#D1D5DC] focus:border focus:ring-2 focus:ring-[#006A4E]/20",
                        "hover:border",
                        !field.value && "text-gray-500",
                        disabled && "opacity-50 cursor-not-allowed bg-gray-50",
                        className
                      )}
                      {...props}
                    >
                      {icon || <CalendarIcon className="mr-2 h-4 w-4" />}
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{placeholder}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className={cn(
                      "w-auto p-0 bg-white/95 backdrop-blur-sm border-2 border-gray-200/80 rounded-[10px] shadow-xl overflow-hidden"
                    )}
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        handleChange(date, field);
                      }}
                      disabled={disabled}
                      initialFocus
                      {...calendarProps}
                    />
                  </PopoverContent>
                </Popover>
              </motion.div>
            </FormControl>

            <FormMessage className="text-xs font-bold text-rose-500 mt-0" />
          </FormItem>
        </div>
      )}
    />
  );
};

export default FieldDatePicker;

//  Example usage:

//         <FieldDatePicker
//           name="birthDate"
//           form={form}
//           label="Date of Birth"
//           placeholder="Select your birth date"
//           required
//           calendarProps={{
//             captionLayout: "dropdown",
//             fromYear: 1900,
//             toYear: new Date().getFullYear(),
//           }}
//         />

//         <FieldDatePicker
//           name="appointmentDate"
//           form={form}
//           label="Appointment Date"
//           placeholder="Pick an appointment date"
//           calendarProps={{
//             disabled: (date) => date < new Date(),
//           }}
//         />
