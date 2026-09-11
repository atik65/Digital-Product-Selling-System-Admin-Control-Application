import * as yup from "yup";

const signupSchema = {
  validation: yup.object({
    first_name: yup.string().trim().required("First name is required"),
    last_name: yup.string().trim().required("Last name is required"),
    email: yup
      .string()
      .trim()
      .email("Must be a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  }),
  values: () => ({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  }),
};

export default signupSchema;
