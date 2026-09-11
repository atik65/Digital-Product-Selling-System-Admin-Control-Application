import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const FormikWrapper = ({ className, form, children }) => {
  return (
    <Form {...form}>
      <form
        className={cn(className)}
        onSubmit={form.handleSubmit(form?.onSubmit)}
        noValidate
      >
        {children}
      </form>
    </Form>
  );
};

export default FormikWrapper;
