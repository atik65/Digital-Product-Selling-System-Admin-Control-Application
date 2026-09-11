import * as yup from "yup";

const verifyOtpSchema = {
  validation: yup.object({
    email: yup
      .string()
      .trim()
      .email("Must be a valid email")
      .required("Email is required"),
    otp: yup
      .string()
      .trim()
      .length(6, "Enter the 6-digit code")
      .required("Verification code is required"),
    type: yup
      .string()
      .oneOf(["REGISTER", "LOGIN", "FORGOT"])
      .default("REGISTER"),
  }),
  values: (email = "", type = "REGISTER") => ({
    email,
    otp: "",
    type,
  }),
};

export default verifyOtpSchema;
