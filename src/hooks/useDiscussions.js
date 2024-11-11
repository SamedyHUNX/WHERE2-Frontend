import { useQuery } from '@tanstack/react-query';
import { useLocation } from'react-router-dom';
import axios from "axios";
import config from "./../config";
import useAuth from './useAuth';

const useDiscussions = (pathname, userId = null) => {
  const location = useLocation();
  const { role } = useAuth();

  const fetchDiscussions = async () => {
    let url = config.community.getDiscussions;
    const isDashboardForDeveloper = location.pathname.startsWith("/profile") && role === "developer";
    const publicProfilePath = location.pathname.startsWith("/public");
    
    // Adjust URL for pathname if not in developer dashboard
    if (!isDashboardForDeveloper) {
      url += `?pathname=${encodeURIComponent(pathname)}`;
    }

    try {
      const response = await axios.post(url, { isDashboardForDeveloper, publicProfilePath, userId });

      // Validate response structure
      if (!response.data || !response.data.data || !response.data.data.discussions) {
        throw new Error('Invalid response structure');
      }

      const discussions = response.data.data.discussions;

      // Filter discussions if on the developer dashboard
      if (isDashboardForDeveloper) {
        return discussions.filter(discussion => (
          discussion.developerOnly ||
          discussion.createdBy?.role === "developer" ||
          discussion.tags?.includes("technical") ||
          !discussion.roleRestricted
        ));
      }

      return discussions;
    } catch (err) {
      console.error('Error fetching discussions:', err);
      throw err;
    }
  };

  // Use `useQuery` with the extended queryKey
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['discussions', pathname, role, userId], // Added `userId` to queryKey
    queryFn: fetchDiscussions,
    enabled: !!pathname,
  });

  return {
    discussions: data,
    loading: isLoading,
    error: isError,
    setDiscussions: (newData) => {
      refetch();
    },
    refetch,
  };
};

export default useDiscussions;
