import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { Link, useNavigate } from "react-router-dom";
import signupSchema from "./schema";
import AuthLayout from "../AuthLayout";
import authApi from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const { mutateAsync } = useRequest();

  const form = useFormik({
    schema: signupSchema.validation,
    defaultValues: signupSchema.values(),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data) {
    try {
      await mutateAsync({
        data,
        api: authApi.register,
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
      title="Request access to the Embassy Console"
      subtitle="Create your administrator account to manage services and content."
    >
      <FormikWrapper form={form} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldInput
              required
              name="first_name"
              placeholder="Enter your first name"
              label="First name"
              form={form}
              autoComplete="given-name"
            />
            <FieldInput
              required
              name="last_name"
              placeholder="Enter your last name"
              label="Last name"
              form={form}
              autoComplete="family-name"
            />
          </div>
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
            label="Password"
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
            {isSubmitting ? "Submitting..." : "Create account"}
          </Button>
          <div className="flex flex-col items-center justify-between text-sm text-muted-foreground">
            <span>Already have access?</span>
            <Link
              to="/login"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </FormikWrapper>
    </AuthLayout>
  );
}
