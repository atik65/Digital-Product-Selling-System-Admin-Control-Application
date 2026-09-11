import * as yup from "yup";

const categorySchema = {
  validation: yup.object({
    name: yup.string().trim().required("Category name is required"),
    slug: yup
      .string()
      .trim()
      .matches(/^[a-z0-9-]+$/, "Slug must be alphanumeric lowercase and hyphens only")
      .required("Slug is required"),
    description: yup.string().nullable().optional(),
    image: yup.string().nullable().optional(),
    sort_order: yup.number().typeError("Sort order must be a number").default(0),
    is_active: yup.boolean().default(true),
  }),
  values: (data) => ({
    name: data?.name || "",
    slug: data?.slug || "",
    description: data?.description || "",
    image: data?.image || "",
    sort_order: data?.sort_order ?? 0,
    is_active: data?.is_active ?? true,
  }),
};

export default categorySchema;
