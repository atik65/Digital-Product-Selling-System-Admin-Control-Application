import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FieldInput = ({
  name,
  form,
  placeholder,
  label,
  description,
  type = "text",
  disabled,
  multiline,
  required = false,
  icon,
  className,
  onChange = () => {},

  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && (
                <span className="font-bold text-base text-destructive">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            {multiline ? (
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                {...props}
                className={className}
                onChange={(e) => {
                  onChange(e);
                  field.onChange(e);
                }}
              />
            ) : (
              <div className="relative">
                <Input
                  type={
                    type === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : type === "number"
                      ? "text"
                      : type
                  }
                  placeholder={placeholder}
                  disabled={disabled}
                  {...field}
                  {...props}
                  icon={icon}
                  className={cn("", className)}
                  onChange={(e) => {
                    onChange(e);
                    field.onChange(e);
                    if (type === "number") {
                      field.onChange(
                        Number(e.target.value.replace(/[^0-9]/g, ""))
                      );
                    }
                  }}
                />
                {type === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 my-auto mr-2 cursor-pointer h-fit rounded-full group"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOffIcon
                        size={17}
                        className="text-erp-black-80 group-hover:text-erp-primary transition-colors duration-150"
                      />
                    ) : (
                      <EyeIcon
                        size={17}
                        className="text-erp-black-80 group-hover:text-erp-primary transition-colors duration-150"
                      />
                    )}
                  </button>
                )}
              </div>
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FieldInput;
