import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Accepts a Date or a "yyyy-MM-dd" / ISO string; invalid input yields undefined.
// Strings go through parseISO so "yyyy-MM-dd" is read as a local date (not UTC).
const toDate = (value) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : parseISO(String(value));
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Standalone date picker, independent of any form library.
 * `value` and `onChange` use "yyyy-MM-dd" strings ("" when cleared);
 * re-selecting the chosen day clears it.
 */
const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  displayFormat = "PPP",
  disabled = false,
  icon,
  min,
  max,
  className,
  calendarProps = {},
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const selectedDate = toDate(value);
  const minDate = toDate(min);
  const maxDate = toDate(max);

  const disabledMatchers = [
    calendarProps.disabled,
    minDate && { before: minDate },
    maxDate && { after: maxDate },
  ].filter(Boolean);

  const handleSelect = (date) => {
    if (!date) {
      onChange?.("");
      return;
    }
    onChange?.(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <div className="relative group">
      <Popover open={open} onOpenChange={setOpen}>
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
            {icon || (
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
            )}
            {selectedDate ? (
              <span className="truncate">
                {format(selectedDate, displayFormat)}
              </span>
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
            onSelect={handleSelect}
            defaultMonth={selectedDate}
            initialFocus
            {...calendarProps}
            disabled={disabled || disabledMatchers}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
