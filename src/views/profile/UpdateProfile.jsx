import { useNavigate } from "react-router-dom";
import useProfile from "@/hooks/useProfile";
import useFormik from "@/hooks/useFormik";
import useRequest from "@/hooks/useRequest";
import FieldInput from "@/components/common/Formik/FieldInput";
import FormikWrapper from "@/components/common/Formik/FormikWrapper";
import FileInput from "@/components/common/Formik/FileInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";
import profileSchema from "./schema";
import profileApi from "./api";
import { revalidateCache } from "@/lib/queryInstance";
import processAsFormData from "@/lib/processFormData";

const FormSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </CardContent>
  </Card>
);

const UpdateProfile = () => {
  usePageTitle("Update Profile");
  const navigate = useNavigate();
  const { userProfile, isLoadingProfile } = useProfile();
  const { mutateAsync } = useRequest();

  const form = useFormik({
    schema: profileSchema.validation,
    defaultValues: profileSchema.values(userProfile),
    onSubmit,
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data) {
    const filteredData = { ...data };

    // If avatar hasn't changed (same URL string), remove it from update
    if (
      filteredData.avatar === userProfile?.avatar?.path ||
      (!filteredData.avatar && !userProfile?.avatar?.path)
    ) {
      delete filteredData.avatar;
    }

    try {
      await mutateAsync({
        data: processAsFormData(filteredData),
        api: profileApi.update,
        form,
        handleDone: async (res) => {
          await revalidateCache(profileApi.cacheKey);
          navigate("/profile");
        },
        handleError: async (err) => {
          console.error("Update profile error:", err);
        },
      });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  }

  const handleCancel = () => {
    navigate("/profile");
  };

  if (isLoadingProfile) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Update Profile</h1>
          {/* <p className="text-sm text-gray-500">
            Update your account information
          </p> */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details below</CardDescription>
        </CardHeader>
        <CardContent>
          <FormikWrapper form={form} className="space-y-6">
            <div className="flex justify-center">
              <FileInput
                name="avatar"
                form={form}
                label="Profile Picture"
                cropType="circle"
                acceptedTypes="image"
                data={userProfile?.avatar?.path}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldInput
                required
                name="first_name"
                placeholder="Enter your first name"
                label="First Name"
                form={form}
                autoComplete="given-name"
              />

              <FieldInput
                name="last_name"
                placeholder="Enter your last name"
                label="Last Name"
                form={form}
                autoComplete="family-name"
              />
            </div>

            <FieldInput
              disabled
              name="email"
              placeholder="Email address"
              label="Email Address"
              form={form}
              autoComplete="email"
              value={userProfile?.email}
            />

            {/* <FieldInput
              type="date"
              name="dob"
              label="Date of Birth"
              form={form}
              autoComplete="bday"
            /> */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </FormikWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfile;
