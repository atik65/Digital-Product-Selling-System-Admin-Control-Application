import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import authApi from "../api";
import resetPasswordSchema from "./schema";

export default function ResetPassword() {
  const navigate = useNavigate();

  const location = useLocation();
  const seedEmail = location.state?.email || "";
  const seedOtp = location.state?.otp || "";

  const { mutateAsync } = useRequest();

  const form = useFormik({
    schema: resetPasswordSchema.validation,
    defaultValues: resetPasswordSchema.values(seedEmail, seedOtp),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data) {
    try {
      await mutateAsync({
        data,
        api: authApi.resetPassword,
        handleDone: async () => {
          navigate("/login");
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Secure your administrator account with a fresh password."
      badge="Reset password"
      highlight={{
        title: "Hardened access control",
        description:
          "Use a strong, unique password to protect consular workflows and sensitive citizen data.",
      }}
    >
      <FormikWrapper form={form} className="space-y-6">
        <div className="space-y-4">
          <FieldInput
            required
            name="email"
            placeholder="Enter your email"
            label="Email"
            form={form}
            autoComplete="email"
          />
          <FieldInput
            required
            name="password"
            type="password"
            placeholder="Create a strong password"
            label="New password"
            form={form}
            autoComplete="new-password"
          />
          <FieldInput
            required
            name="confirm_password"
            type="password"
            placeholder="Confirm your password"
            label="Confirm password"
            form={form}
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Link
              to="/login"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-200"
            >
              Return to sign in
            </Link>
            <Link
              to="/forgot-password"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-200"
            >
              Start over
            </Link>
          </div>
        </div>
      </FormikWrapper>
    </AuthLayout>
  );
}
