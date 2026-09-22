import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, set } from "date-fns";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
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

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        let selectedDate = undefined;
        if (field.value) {
          if (field.value instanceof Date) {
            selectedDate = isNaN(field.value.getTime()) ? undefined : field.value;
          } else {
            const d = new Date(field.value);
            selectedDate = isNaN(d.getTime()) ? undefined : d;
          }
        }

        const handleChange = (date) => {
          if (!date) {
            field.onChange("");
            return;
          }
          const formattedDate = format(date, "yyyy-MM-dd");
          field.onChange(formattedDate);
          setIsFocused(false);
          if (onChange) {
            onChange(formattedDate);
          }
        };

        return (
          <FormItem>
            {label && (
              <FormLabel className="flex items-center gap-0.5 text-sm leading-none h-5">
                <span>{label}</span>
                {required && (
                  <span
                    className="text-destructive font-semibold text-sm leading-none ml-0.5"
                    aria-hidden="true"
                  >
                    *
                  </span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <div className="relative group">
                <Popover open={isFocused} onOpenChange={setIsFocused}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={disabled}
                      className={cn(
                        "relative h-10 px-3 w-full justify-start text-left font-normal border border-slate-200 rounded-xl text-xs bg-white text-slate-800 transition-all duration-200 cursor-pointer shadow-none",
                        "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
                        "hover:bg-slate-50 hover:border-slate-300",
                        !selectedDate && "text-slate-400",
                        disabled && "opacity-50 cursor-not-allowed bg-slate-50",
                        className
                      )}
                      {...props}
                    >
                      {icon || <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />}
                      {selectedDate ? (
                        <span className="truncate">{format(selectedDate, "PPP")}</span>
                      ) : (
                        <span className="text-slate-400 truncate">{placeholder}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-[100]"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        handleChange(date);
                      }}
                      disabled={disabled}
                      initialFocus
                      {...calendarProps}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
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
