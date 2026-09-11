import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const CheckBoxField = ({
  name,
  form,
  description,
  label,
  className,
  checkboxClassName,
  disabled,
  onChange,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className={cn("flex items-center gap-2 w-full", className)}>
            <FormControl>
              <Checkbox
                ref={field.ref}
                checked={field.value}
                onCheckedChange={onChange ? onChange : field.onChange}
                disabled={disabled}
                className={cn(
                  "flex focus:outline-none focus:ring-1 focus:ring-ring ",
                  checkboxClassName
                )}
              />
            </FormControl>
            {label && <FormLabel className={"leading-5"}>{label}</FormLabel>}
          </div>
          {description && <FormDescription>{description}</FormDescription>}

          {/* {form.formState.errors[name] && (
            <FormMessage className="text-red-500 text-[12px]">
              {form.formState.errors[name].message}
            </FormMessage>
          )} */}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckBoxField;
