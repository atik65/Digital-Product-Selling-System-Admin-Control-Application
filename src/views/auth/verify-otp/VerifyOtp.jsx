import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { setCookie } from "@/lib/cookies";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import authApi from "../api";
import verifyOtpSchema from "./schema";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const location = useLocation();
  const seedEmail = location.state?.email || "";
  const seedType = location.state?.type || "";

  const { mutateAsync } = useRequest();
  const { mutateAsync: resendOtp, isPending: isResending } = useRequest();

  const [cooldown, setCooldown] = useState(0);
  const cooldownKey = useMemo(
    () => `verifyOtpCooldown:${seedEmail || "unknown"}:${seedType}`,
    [seedEmail, seedType]
  );

  const form = useFormik({
    schema: verifyOtpSchema.validation,
    defaultValues: verifyOtpSchema.values(seedEmail, seedType),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;
  const canResend = cooldown === 0 && !isResending;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(cooldownKey);
    if (stored) {
      const expiresAt = Number(stored);
      if (!Number.isNaN(expiresAt)) {
        const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
        if (remaining > 0) {
          setCooldown(remaining);
        } else {
          window.localStorage.removeItem(cooldownKey);
        }
      }
    }
  }, [cooldownKey]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        const next = prev > 0 ? prev - 1 : 0;
        if (next === 0 && typeof window !== "undefined") {
          window.localStorage.removeItem(cooldownKey);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown, cooldownKey]);

  async function onSubmit(data) {
    try {
      await mutateAsync({
        data,
        api: authApi.verifyOtp,
        handleDone: async (res) => {
          if (res.data.otp_type === "FORGOT") {
            navigate("/reset-password", {
              state: { email: data.email, otp: data.otp },
            });
          } else {
            setCookie("signedIn", "true");
            navigate("/");
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendOtp({
        data: {
          email: form.getValues("email"),
          type: form.getValues("type") || seedType,
        },
        api: authApi.resendOtp,
        toastVariant: "success",
      });
      form.setValue("otp", "");
      const nextCooldown = 60;
      setCooldown(nextCooldown);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          cooldownKey,
          String(Date.now() + nextCooldown * 2000)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout
      title="Verify one-time code"
      subtitle="Enter the 6-digit code sent to your email to continue."
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
            name="otp"
            placeholder="6-digit code"
            label="Verification code"
            form={form}
            inputMode="numeric"
            maxLength={6}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-emerald-200 text-emerald-700"
            disabled={!canResend}
            onClick={handleResend}
          >
            {isResending
              ? "Sending code..."
              : cooldown > 0
              ? `Resend available in ${cooldown}s`
              : "Resend code"}
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify code"}
          </Button>
          <div className="flex flex-col items-center justify-between text-sm text-muted-foreground">
            <Link
              to="/login"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-200"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </FormikWrapper>
    </AuthLayout>
  );
}
