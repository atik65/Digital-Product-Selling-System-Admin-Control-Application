import authApi from "@/pages/auth/api";
import { getStoredUser, isAuthenticated } from "@/lib/cookies";
import useApi from "./useApi";

const useProfile = () => {
  const loggedIn = isAuthenticated();
  const storedUser = getStoredUser();

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch,
  } = useApi({
    api: authApi.me,
    cacheKey: "currentUserProfile",
    trigger: loggedIn,
    staleTime: 300000, // 5 minutes
  });

  const userProfile = profileData?.data || storedUser || {};

  return { userProfile, isLoadingProfile, profileError, refetch };
};

export default useProfile;

