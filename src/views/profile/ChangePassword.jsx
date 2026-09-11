import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import { ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profileApi from "./api";
import changePasswordSchema from "./changePasswordSchema";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useRequest();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useFormik({
    schema: changePasswordSchema.validation,
    defaultValues: changePasswordSchema.values(),
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          data: values,
          api: profileApi.changePassword,
          form,
          handleDone: () => {
            navigate("/profile");
          },
          isToast: true,
        });
      } catch (error) {
        console.error("Password change error:", error);
      }
    },
    mode: "onChange",
  });

  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#0f6b47]/10 p-2.5">
              <Lock className="h-5 w-5 text-[#0f6b47]" />
            </div>
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FormikWrapper form={form}>
            <div className="space-y-5">
              <div className="relative">
                <FieldInput
                  form={form}
                  name="old_password"
                  label="Current Password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="relative">
                <FieldInput
                  form={form}
                  name="new_password"
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                />
              </div>

              <div className="relative">
                <FieldInput
                  form={form}
                  name="confirm_password"
                  label="Confirm New Password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                />
              </div>

              {/* <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  Password Requirements:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-blue-700">
                  <li>• At least 8 characters long</li>
                  <li>• Include at least one uppercase letter</li>
                  <li>• Include at least one lowercase letter</li>
                  <li>• Include at least one number</li>
                </ul>
              </div> */}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex-1 bg-[#0f6b47] hover:bg-[#0f6b47]/90"
                >
                  {form.formState.isSubmitting
                    ? "Updating Password..."
                    : "Update Password"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </FormikWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
