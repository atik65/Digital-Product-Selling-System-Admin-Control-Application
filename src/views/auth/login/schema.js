import * as yup from "yup";

const loginSchema = {
  validation: yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .trim()
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password must be at least 6 characters."),
  }),
  values: () => ({
    email: "",
    password: "",
  }),
};

export default loginSchema;
