import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { setAuthCookies } from "@/lib/cookies";
import { useAuthState } from "@/state/useAuthState";
import { ShieldCheck, UserCheck, Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "../AuthLayout";
import authApi from "../api";
import loginSchema from "./schema";

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync } = useRequest();
  const setAuth = useAuthState((state) => state.setAuth);

  const form = useFormik({
    schema: loginSchema.validation,
    defaultValues: loginSchema.values(),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data) {
    try {
      await mutateAsync({
        data: {
          email: data.email,
          password: data.password,
        },
        api: authApi.adminLogin,
        isToast: false,
        handleDone: async (res) => {
          const authData = res?.data || res;
          const accessToken = authData?.access_token;
          const refreshToken = authData?.refresh_token;
          const user = authData?.user;

          // Enforce admin RBAC on the client side as well
          if (user && user.role !== "admin") {
            toast.error("Access denied: Only administrators can log in here.");
            return;
          }

          // The server has issued HttpOnly cookies for access_token and refresh_token
          setAuthCookies({ user });
          setAuth({
            user,
            isAuthenticated: true,
          });
          toast.success("Welcome back, Admin!");
          navigate("/");
        },
      });
    } catch (error) {
      console.error("Login submission error:", error);
    }
  }

  // Quick Demo Auto-Fill Handlers
  const handleFillAdmin = () => {
    form.setValue("email", "admin@example.com", { shouldValidate: true });
    form.setValue("password", "admin123", { shouldValidate: true });
    toast.info("Admin demo credentials populated (admin@example.com)");
  };

  const handleFillCustomer = () => {
    form.setValue("email", "user@example.com", { shouldValidate: true });
    form.setValue("password", "user123", { shouldValidate: true });
    toast.info("Customer demo credentials populated (tests 403 rejection)");
  };

  return (
    <AuthLayout
      title="Admin Portal Sign In"
      subtitle="Digital Product Selling System — Administrator Console"
    >
      <FormikWrapper form={form} className="space-y-6">
        <div className="space-y-4">
          <FieldInput
            required
            name="email"
            placeholder="admin@example.com"
            label="Email Address"
            form={form}
            autoComplete="email"
          />

          <FieldInput
            required
            autoComplete="current-password"
            type="password"
            name="password"
            placeholder="••••••••••••"
            label="Password"
            form={form}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-sm font-medium rounded-xl shadow-xs"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In as Admin"
            )}
          </Button>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-400 font-medium text-center uppercase tracking-wider">
              Test Credentials Quick-Fill
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillAdmin}
                className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg justify-start"
              >
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5 shrink-0 text-emerald-600" />
                <span>Super Admin</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillCustomer}
                className="text-xs border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg justify-start"
              >
                <Users className="h-3.5 w-3.5 mr-1.5 shrink-0 text-slate-500" />
                <span>Customer (403 Test)</span>
              </Button>
            </div>
          </div>
        </div>
      </FormikWrapper>
    </AuthLayout>
  );
}
