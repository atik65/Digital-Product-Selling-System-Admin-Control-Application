import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProfile from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  Edit,
  Camera,
} from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  </div>
);

const Profile = () => {
  usePageTitle("My Profile");
  const navigate = useNavigate();
  const { userProfile, isLoadingProfile, profileError } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = () => {
    if (!userProfile?.first_name) return "U";
    const firstInitial = userProfile.first_name.charAt(0).toUpperCase();
    const lastInitial = userProfile.last_name
      ? userProfile.last_name.charAt(0).toUpperCase()
      : "";
    return `${firstInitial}${lastInitial}`;
  };

  const getUserName = () => {
    if (!userProfile?.first_name) return "User";
    return `${userProfile.first_name} ${userProfile.last_name || ""}`.trim();
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserTypeLabel = (userType) => {
    const types = {
      ADMIN: "Administrator",
      USER: "User",
      MODERATOR: "Moderator",
    };
    return types[userType] || userType;
  };

  if (isLoadingProfile) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <ProfileSkeleton />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold  text-slate-600">
                  Failed to Load Profile
                </h3>
              </div>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage
                  src={userProfile?.avatar?.path}
                  alt={getUserName()}
                />
                <AvatarFallback className="bg-[#0f6b47] text-2xl font-bold text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-white"
                onClick={() => {
                  // TODO: Implement avatar upload
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getUserName()}
                </h1>
                <p className="text-sm text-gray-500">{userProfile?.email}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge
                  variant={userProfile?.is_active ? "default" : "secondary"}
                  className={
                    userProfile?.is_active
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : ""
                  }
                >
                  {userProfile?.is_active ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3" />
                      Inactive
                    </>
                  )}
                </Badge>

                <Badge
                  variant={userProfile?.is_verified ? "default" : "secondary"}
                  className={
                    userProfile?.is_verified
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      : ""
                  }
                >
                  {userProfile?.is_verified ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </>
                  )}
                </Badge>

                <Badge
                  variant="outline"
                  className="border-[#0f6b47] text-[#0f6b47]"
                >
                  <Shield className="mr-1 h-3 w-3" />
                  {getUserTypeLabel(userProfile?.user_type)}
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/profile/update")}
              className="w-full sm:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your account details and personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <User className="h-4 w-4" />
                First Name
              </div>
              <p className="text-base font-medium text-gray-900">
                {userProfile?.first_name}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <User className="h-4 w-4" />
                Last Name
              </div>
              <p className="text-base font-medium text-gray-900">
                {userProfile?.last_name}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
              <p className="text-base font-medium text-gray-900">
                {userProfile?.email}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </div>
              <p className="text-base font-medium text-gray-900">
                {formatDate(userProfile?.dob)}
              </p>
            </div>
          </div>

          {/* <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Calendar className="h-4 w-4" />
                Account Created
              </div>
              <p className="text-base font-medium text-gray-900">
                {formatDate(userProfile?.created_at)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Calendar className="h-4 w-4" />
                Last Updated
              </div>
              <p className="text-base font-medium text-gray-900">
                {formatDate(userProfile?.updated_at)}
              </p>
            </div>
          </div> */}
        </CardContent>
      </Card>

      {/* Account Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Current status of your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${
                    userProfile?.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {userProfile?.is_active ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className="text-sm text-gray-500">
                    Your account is{" "}
                    {userProfile?.is_active ? "active" : "inactive"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${
                    userProfile?.is_verified
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {userProfile?.is_verified ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-gray-500">
                    Your email is{" "}
                    {userProfile?.is_verified ? "verified" : "not verified"}
                  </p>
                </div>
              </div>
              {!userProfile?.is_verified && (
                <Button variant="outline" size="sm">
                  Verify Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
