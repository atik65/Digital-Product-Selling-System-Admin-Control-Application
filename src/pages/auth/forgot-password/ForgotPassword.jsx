import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import authApi from "../api";
import forgotPasswordSchema from "./schema";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { mutateAsync } = useRequest();

  const form = useFormik({
    schema: forgotPasswordSchema.validation,
    defaultValues: forgotPasswordSchema.values(),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data) {
    try {
      await mutateAsync({
        data,
        api: authApi.forgotPassword,
        handleDone: async (res) => {
          navigate("/verify-otp", {
            state: { email: data.email, type: res.data.otp_type },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthLayout
      title="Reset your access"
      subtitle="We will send a verification code to your email to restore access."
    >
      <FormikWrapper form={form} className="space-y-6">
        <FieldInput
          required
          name="email"
          placeholder="Enter your email"
          label="Email"
          form={form}
          autoComplete="email"
        />

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Sending code..." : "Send verification code"}
          </Button>
          <div className="flex flex-col items-center justify-between text-sm text-muted-foreground">
            <Link
              to="/login"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-200"
            >
              Back to sign in
            </Link>
            <Link
              to="/register"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-200"
            >
              Request access
            </Link>
          </div>
        </div>
      </FormikWrapper>
    </AuthLayout>
  );
}
