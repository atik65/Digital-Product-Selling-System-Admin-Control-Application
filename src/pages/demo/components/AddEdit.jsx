import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import SwitchField from "@/components/common/Formik/SwitchField";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Loader2 } from "lucide-react";
import appointmentApi from "../api";
import appointmentSchema from "../utils/schema";

const AddEdit = ({ open, onClose, editData = null }) => {
  const { mutateAsync, isPending } = useRequest();
  const isEditMode = !!editData;

  const form = useFormik({
    schema: appointmentSchema.validation,
    defaultValues: appointmentSchema.values(editData),
    onSubmit,
    mode: "onChange",
  });

  async function onSubmit(data) {
    try {
      await mutateAsync({
        id: editData?.id,
        data,
        api: isEditMode
          ? appointmentApi.update(editData.id)
          : appointmentApi.create,
        cacheKey: appointmentApi.cacheKey,
        handleDone: async () => {
          onClose();
          form.reset();
        },
      });
    } catch (error) {
      console.error("Appointment save error:", error);
    }
  }

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-135 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Appointment" : "Add Appointment"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the appointment information below."
              : "Fill in the information to create a new appointment."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-5">
          <FormikWrapper form={form}>
            <div className="space-y-5">
              <FieldInput
                form={form}
                name="applicant_name"
                label="Applicant Name"
                placeholder="e.g., John Doe"
                required
              />

              <FieldInput
                form={form}
                name="email"
                label="Email Address"
                placeholder="e.g., john@example.com"
                type="email"
                required
              />

              <FieldInput
                form={form}
                name="status"
                label="Status"
                placeholder="e.g., pending, submitted, under-review, approved, rejected"
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Update" : "Create"}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </FormikWrapper>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddEdit;
