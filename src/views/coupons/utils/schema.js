import * as yup from "yup";

const couponSchema = {
  validation: yup.object({
    code: yup
      .string()
      .trim()
      .uppercase()
      .matches(/^[A-Z0-9_-]+$/, "Code must be uppercase letters, numbers, hyphens or underscores")
      .required("Coupon code is required"),
    type: yup
      .string()
      .oneOf(["FIXED", "PERCENTAGE"], "Invalid coupon type")
      .required("Coupon type is required"),
    value: yup
      .number()
      .typeError("Value must be a number")
      .min(0.01, "Discount value must be greater than 0")
      .required("Discount value is required"),
    max_discount: yup
      .number()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .optional(),
    minimum_order_amount: yup
      .number()
      .typeError("Must be a number")
      .min(0)
      .default(0),
    usage_limit: yup
      .number()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .optional(),
    per_user_limit: yup.number().typeError("Must be a number").min(1).default(1),
    starts_at: yup.string().nullable().optional(),
    expires_at: yup.string().nullable().optional(),
    is_active: yup.boolean().default(true),
  }),
  values: (data) => ({
    code: data?.code || "",
    type: data?.type || "PERCENTAGE",
    value: data?.value ?? "",
    max_discount: data?.max_discount ?? "",
    minimum_order_amount: data?.minimum_order_amount ?? 0,
    usage_limit: data?.usage_limit ?? "",
    per_user_limit: data?.per_user_limit ?? 1,
    starts_at: data?.starts_at ? data.starts_at.slice(0, 16) : "",
    expires_at: data?.expires_at ? data.expires_at.slice(0, 16) : "",
    is_active: data?.is_active ?? true,
  }),
};

export default couponSchema;
