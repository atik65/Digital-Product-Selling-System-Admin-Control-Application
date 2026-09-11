import profileApi from "@/pages/profile/api";
import useApi from "./useApi";

const useProfile = () => {
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useApi({
    api: profileApi.show,
    cacheKey: profileApi.cacheKey,
  });
  const userProfile = profileData?.data || {};

  return { userProfile, isLoadingProfile, profileError };
};

export default useProfile;
