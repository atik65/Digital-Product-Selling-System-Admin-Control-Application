import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import DatePicker from "@/components/common/DatePicker";

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
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const handleChange = (formattedDate) => {
          field.onChange(formattedDate);
          if (formattedDate && onChange) {
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
              <DatePicker
                value={field.value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                icon={icon}
                className={className}
                calendarProps={calendarProps}
                {...props}
              />
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
