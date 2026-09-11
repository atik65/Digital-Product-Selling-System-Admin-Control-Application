import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useApi from "@/hooks/useApi";
import useRequest from "@/hooks/useRequest";
import productApi from "../api";
import { Loader2, Plus, Trash2, Edit2, Sliders, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { dynamicFieldSchema } from "../utils/schema";
import useFormik from "@/hooks/useFormik";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import FieldInput from "@/components/common/Formik/FieldInput";
import SwitchField from "@/components/common/Formik/SwitchField";
import { toast } from "sonner";

const inputTypes = [
  { id: "text", label: "Text" },
  { id: "number", label: "Number" },
  { id: "email", label: "Email" },
  { id: "url", label: "URL Link" },
  { id: "textarea", label: "Multi-line Textarea" },
];

const ManageFieldsModal = ({ open, onClose, product }) => {
  const [editingField, setEditingField] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const { mutateAsync, isPending } = useRequest();

  const cacheKey = `productFields-${product?.id}`;
  const { data: fieldsData, isLoading, refetch } = useApi({
    api: product?.id ? productApi.listFields(product.id) : null,
    cacheKey,
    trigger: !!product?.id && open,
  });

  const fields = fieldsData?.data || [];

  const form = useFormik({
    schema: dynamicFieldSchema.validation,
    defaultValues: dynamicFieldSchema.values(editingField),
    onSubmit,
    mode: "onChange",
  });

  const handleStartAdd = () => {
    setEditingField(null);
    form.reset(dynamicFieldSchema.values(null));
    setIsAdding(true);
  };

  const handleStartEdit = (field) => {
    setEditingField(field);
    form.reset(dynamicFieldSchema.values(field));
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setEditingField(null);
    setIsAdding(false);
    form.reset();
  };

  async function onSubmit(data) {
    if (!product?.id) return;

    try {
      if (editingField?.id) {
        await mutateAsync({
          id: editingField.id,
          data: {
            ...data,
            sort_order: Number(data.sort_order) || 0,
          },
          api: productApi.updateField(editingField.id),
          cacheKey: productApi.cacheKey,
          handleDone: () => {
            handleCancelForm();
            refetch();
          },
        });
      } else {
        await mutateAsync({
          data: {
            ...data,
            sort_order: Number(data.sort_order) || 0,
          },
          api: productApi.createField(product.id),
          cacheKey: productApi.cacheKey,
          handleDone: () => {
            handleCancelForm();
            refetch();
          },
        });
      }
    } catch (err) {
      console.error("Save dynamic field error:", err);
    }
  }

  const handleDeleteField = async (fieldId) => {
    if (!confirm("Are you sure you want to remove this input field?")) return;
    try {
      await mutateAsync({
        id: fieldId,
        api: productApi.deleteField(fieldId),
        cacheKey: productApi.cacheKey,
        handleDone: () => {
          refetch();
        },
      });
    } catch (err) {
      console.error("Delete field error:", err);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Customer Input Fields
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Configure required user inputs for {product.name} (e.g. Player ID, Zone ID, Email)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Header Action */}
          {!isAdding && (
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">
                Configured Inputs ({fields.length})
              </span>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg h-8 text-xs font-medium"
                onClick={handleStartAdd}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Field
              </Button>
            </div>
          )}

          {/* Form to Add or Edit Field */}
          {isAdding && (
            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                {editingField ? "Edit Field Definition" : "New Input Field"}
              </h4>

              <FormikWrapper form={form}>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput
                      form={form}
                      name="name"
                      label="Key (API parameter name)"
                      placeholder="e.g., player_id, email"
                      required
                    />

                    <FieldInput
                      form={form}
                      name="label"
                      label="Display Label"
                      placeholder="e.g., Player ID (UID)"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Input Type
                      </label>
                      <select
                        {...form.register("type")}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      >
                        {inputTypes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <FieldInput
                      form={form}
                      name="placeholder"
                      label="Placeholder Hint"
                      placeholder="e.g., Enter 10-digit ID"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-end">
                    <FieldInput
                      form={form}
                      name="sort_order"
                      label="Sort Order"
                      type="number"
                      placeholder="0"
                    />

                    <div className="pb-2">
                      <SwitchField
                        form={form}
                        name="is_required"
                        label="Required for Checkout"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-9"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <span>{editingField ? "Update Field" : "Create Field"}</span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelForm}
                      disabled={isPending}
                      className="text-xs h-9"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </FormikWrapper>
            </div>
          )}

          {/* List of Existing Fields */}
          {isLoading ? (
            <div className="flex justify-center py-6 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : fields.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">
                No custom customer input fields configured yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Add fields like Player ID, Character Name, or Email that customers must supply.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {fields.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">
                        {f.label}
                      </span>
                      <code className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        {f.name}
                      </code>
                      {f.is_required && (
                        <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.2 rounded-full font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>Type: <b className="text-slate-600 font-medium">{f.type}</b></span>
                      {f.placeholder && (
                        <span>Hint: &quot;{f.placeholder}&quot;</span>
                      )}
                      <span>Order #{f.sort_order ?? 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg"
                      onClick={() => handleStartEdit(f)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      onClick={() => handleDeleteField(f.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageFieldsModal;
