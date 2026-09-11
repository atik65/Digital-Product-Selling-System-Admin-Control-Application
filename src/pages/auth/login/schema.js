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
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 characters minimum."),
  }),
  values: () => ({
    email: "",
    password: "",
  }),
};

export default loginSchema;
