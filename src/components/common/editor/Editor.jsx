import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditor from "./RichTextEditor";

const Editor = ({
  form,
  label,
  name,
  required,
  variant,
  height,
  readOnly,
  placeholder,
  description,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={"text-[#B3B3B3] text-[14px]"}>
            {label}
            {required && (
              <span className="font-bold text-base ml-0.5 text-destructive">
                *
              </span>
            )}
          </FormLabel>
          <FormControl>
            <RichTextEditor
              form={form}
              initialValue={field.value}
              getValue={(value) => field.onChange(value)}
              variant={variant}
              height={height}
              readOnly={readOnly}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
};
export default Editor;
