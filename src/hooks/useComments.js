import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "./../config";

const useComments = (discussionId) => {
  const fetchComments = async () => {
    const url = `${config.community.getAllComments(discussionId)}`;
    try {
      const response = await axios.get(url);

      // Check if response data structure matches expectations
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response structure");
      }

      // Extract the comments array from the response
      const comments = response.data.data; // Access the 'data' array which contains the comments

      return comments; // Return the comments directly
    } catch (err) {
      console.error("Error fetching comments:", err);
      throw err;
    }
  };

  // Use useQuery with the new object-based API
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["comments", discussionId], // Key for the query
    queryFn: fetchComments, // Function to fetch comments
    enabled: !!discussionId, // Only run the query if discussionId is defined
  });

  return {
    comments: data, // `data` will contain the array of comments
    loading: isLoading,
    error: isError,
    refetch, // Keep refetch for external usage
  };
};

export default useComments;
