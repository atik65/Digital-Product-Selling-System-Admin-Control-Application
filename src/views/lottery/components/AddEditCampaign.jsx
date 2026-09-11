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
import lotteryApi from "../api";
import * as yup from "yup";

const campaignValidation = yup.object({
  name: yup.string().trim().required("Campaign name is required"),
  description: yup.string().nullable().optional(),
  starts_at: yup.string().nullable().optional(),
  ends_at: yup.string().nullable().optional(),
  is_active: yup.boolean().default(true),
});

const AddEditCampaign = ({ open, onClose }) => {
  const { mutateAsync, isPending } = useRequest();

  const form = useFormik({
    schema: campaignValidation,
    defaultValues: {
      name: "",
      description: "",
      starts_at: "",
      ends_at: "",
      is_active: true,
    },
    onSubmit,
    mode: "onChange",
  });

  async function onSubmit(data) {
    try {
      await mutateAsync({
        data: {
          ...data,
          starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : null,
          ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : null,
        },
        api: lotteryApi.create,
        cacheKey: lotteryApi.cacheKey,
        handleDone: () => {
          onClose();
          form.reset();
        },
      });
    } catch (err) {
      console.error("Create campaign error:", err);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New Lottery Campaign</SheetTitle>
          <SheetDescription>
            Create a gamified lucky wheel spin campaign for customer rewards
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-1">
          <FormikWrapper form={form}>
            <div className="space-y-4">
              <FieldInput
                form={form}
                name="name"
                label="Campaign Title"
                placeholder="e.g., Eid Lucky Spin 2026, Weekend Fortune Wheel"
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Description / Rules
                </label>
                <textarea
                  {...form.register("description")}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g., Every customer who places an order gets 1 free lucky spin!"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Starts At
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("starts_at")}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Ends At
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("ends_at")}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="pb-1">
                <SwitchField
                  form={form}
                  name="is_active"
                  label="Active and Displaying Wheel"
                />
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <span>Launch Campaign</span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
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

export default AddEditCampaign;
