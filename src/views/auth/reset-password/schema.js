import * as yup from "yup";

const resetPasswordSchema = {
  validation: yup.object({
    email: yup
      .string()
      .trim()
      .email("Must be a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    otp: yup
      .string()
      .trim()
      .length(6, "Enter the 6-digit code")
      .required("Verification code is required"),
  }),
  values: (email = "", otp = "") => ({
    email,
    password: "",
    otp,
  }),
};

export default resetPasswordSchema;
