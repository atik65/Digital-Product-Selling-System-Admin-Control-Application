import * as yup from "yup";

const forgotPasswordSchema = {
  verifyEmailValidation: yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .trim()
      .required("Email is required"),
  }),
  resetPasswordValidation: yup.object({
    password: yup
      .string()
      .required("No password provided.")
      .min(6, "Password is too short - should be 6 characters minimum."),
    confirmPassword: yup
      .string()
      .required("No confirm password provided.")
      .min(6, "Confirm password is too short - should be 6 characters minimum.")
      .oneOf([yup.ref("password")], "Passwords must match"),
  }),

  values: () => ({
    email: "",
    password: "",
    confirmPassword: "",
  }),
};

export default forgotPasswordSchema;
