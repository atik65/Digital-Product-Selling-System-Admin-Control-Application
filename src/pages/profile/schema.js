import * as yup from "yup";

const profileSchema = {
  validation: yup.object({
    first_name: yup.string().trim().required("First name is required"),
    last_name: yup.string().trim().notRequired(),
    avatar: yup.mixed().notRequired().nullable(),
    // dob: yup
    //   .date()
    //   .max(new Date(), "Date of Birth cannot be in the future")
    //   .notRequired(),
  }),
  values: (data) => ({
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    avatar: data?.avatar?.path || "",
    // dob: data?.dob || "",
  }),
};

export default profileSchema;
