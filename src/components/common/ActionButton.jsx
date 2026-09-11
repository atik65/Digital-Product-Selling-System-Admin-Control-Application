import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

const ActionButton = ({
  isDirty = true,
  isValid = true,
  isSubmitting,
  classNames,
  type = "submit",
  label = "Submit",
  submittingLabel = "",
  ...props
}) => {
  return (
    <>
      <Button
        className={cn(classNames)}
        type={type}
        disabled={!isDirty || isSubmitting || !isValid}
        {...props}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="w-7 h-7 animate-spin " />
            {submittingLabel && <span className="ml-2">{submittingLabel}</span>}
          </>
        ) : (
          label
        )}
      </Button>
    </>
  );
};

export default ActionButton;
