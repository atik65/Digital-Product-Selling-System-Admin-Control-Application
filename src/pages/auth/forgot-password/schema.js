import * as yup from "yup";

const forgotPasswordSchema = {
  validation: yup.object({
    email: yup
      .string()
      .trim()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
  values: () => ({
    email: "",
  }),
};

export default forgotPasswordSchema;
