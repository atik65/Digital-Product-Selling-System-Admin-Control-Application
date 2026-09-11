import * as yup from "yup";

const changePasswordSchema = {
  validation: yup.object({
    old_password: yup
      .string()
      .trim()
      .required("Current password is required")
      .min(6, "Password must be at least 6 characters"),
    new_password: yup
      .string()
      .trim()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      //   .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      //   .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      //   .matches(/[0-9]/, "Password must contain at least one number")
      .notOneOf(
        [yup.ref("old_password")],
        "New password must be different from current password"
      ),
    confirm_password: yup
      .string()
      .trim()
      .required("Please confirm your new password")
      .oneOf([yup.ref("new_password")], "Passwords must match"),
  }),
  values: () => ({
    old_password: "",
    new_password: "",
    confirm_password: "",
  }),
};

export default changePasswordSchema;
