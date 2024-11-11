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
    
    // For developer dashboard, fetch all discussions
    // For other paths, fetch discussions specific to the pathname
    if (!isDashboardForDeveloper) {
      url += `?pathname=${encodeURIComponent(pathname)}`;
    }

    try {
      const response = await axios.post(url, { isDashboardForDeveloper });
      // Check if response data structure matches expectations
      if (!response.data || !response.data.data || !response.data.data.discussions) {
        throw new Error('Invalid response structure');
      }

      // If it's the developer dashboard, we might want to filter or sort the discussions
      if (isDashboardForDeveloper) {
        const allDiscussions = response.data.data.discussions;
        return allDiscussions.filter(discussion => (
          discussion.developerOnly ||
          discussion.createdBy?.role === "developer" ||
          discussion.tags?.includes("technical") ||
          !discussion.roleRestricted
        ));
      }

      return response.data.data.discussions;
    } catch (err) {
      console.error('Error fetching discussions:', err);
      throw err;
    }
  };

  // Use useQuery with the object-based API
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['discussions', pathname, role], // Added role to queryKey
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
