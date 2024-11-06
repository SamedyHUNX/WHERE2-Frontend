import { getAuthData } from "./../../accountUtilities/UserProfile";
import config from "./../../../config";
const fetchProfile = async () => {
    try {
      const { token, userId } = getAuthData();


      const res = await fetch(config.profile.getMyProfile(userId), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
  
      const { data } = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  };

export default fetchProfile