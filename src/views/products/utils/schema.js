import * as yup from "yup";

export const productSchema = {
  validation: yup.object({
    name: yup.string().trim().required("Product name is required"),
    slug: yup
      .string()
      .trim()
      .matches(/^[a-z0-9-]+$/, "Slug must be alphanumeric lowercase and hyphens only")
      .required("Slug is required"),
    category_id: yup
      .number()
      .typeError("Please select a category")
      .required("Category is required"),
    image: yup.string().nullable().optional(),
    description: yup.string().nullable().optional(),
    instructions: yup.string().nullable().optional(),
    sort_order: yup.number().typeError("Must be a number").default(0),
  }),
  values: (data) => ({
    name: data?.name || "",
    slug: data?.slug || "",
    category_id: data?.category_id || "",
    image: data?.image || "",
    description: data?.description || "",
    instructions: data?.instructions || "",
    sort_order: data?.sort_order ?? 0,
  }),
};

export const dynamicFieldSchema = {
  validation: yup.object({
    name: yup
      .string()
      .trim()
      .matches(/^[a-z0-9_]+$/, "Key must be lowercase letters, numbers, or underscores")
      .required("Field technical key is required"),
    label: yup.string().trim().required("Field label is required"),
    type: yup
      .string()
      .oneOf(["text", "number", "email", "url", "textarea"], "Invalid input type")
      .required("Input type is required"),
    placeholder: yup.string().nullable().optional(),
    is_required: yup.boolean().default(true),
    sort_order: yup.number().typeError("Must be a number").default(0),
  }),
  values: (data) => ({
    name: data?.name || "",
    label: data?.label || "",
    type: data?.type || "text",
    placeholder: data?.placeholder || "",
    is_required: data?.is_required ?? true,
    sort_order: data?.sort_order ?? 0,
  }),
};

export const packageSchema = {
  validation: yup.object({
    name: yup.string().trim().required("Package name is required"),
    price: yup
      .number()
      .typeError("Price must be a valid number")
      .min(0, "Price cannot be negative")
      .required("Price is required"),
    compare_price: yup
      .number()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .min(0, "Original price cannot be negative")
      .optional(),
    duration: yup.string().nullable().optional(),
    description: yup.string().nullable().optional(),
    sort_order: yup.number().typeError("Must be a number").default(0),
    is_active: yup.boolean().default(true),
  }),
  values: (data) => ({
    name: data?.name || "",
    price: data?.price ?? "",
    compare_price: data?.compare_price ?? "",
    duration: data?.duration || "",
    description: data?.description || "",
    sort_order: data?.sort_order ?? 0,
    is_active: data?.is_active ?? true,
  }),
};

export default {
  productSchema,
  dynamicFieldSchema,
  packageSchema,
};
