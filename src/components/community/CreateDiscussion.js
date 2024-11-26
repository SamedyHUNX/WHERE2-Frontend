import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useHistory } from "react-router-dom";
import useAuth from "./../../hooks/useAuth";
import config from "./../../config";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import useGeolocation from "./../../hooks/useGeolocation";
import { LoadingSpinner } from "./../reusable/Loading";
import DiscussionForm from "./DiscussionForm";
import useDiscussions from "./../../hooks/useDiscussions";

const CreateDiscussion = ({ showForm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, entity, userId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { isGettingLocation, error: locationError } = useGeolocation();

  const [formData, setFormData] = useState({
    title: "",
    userId: userId || "", // Ensure userId is set
    content: "",
    location: "",
    pathname: location.pathname,
  });

  // Use the updated useDiscussions hook
  const {
    data: discussions = [],
    isLoading: discussionsLoading,
    isError: discussionsError,
    refetch,
  } = useDiscussions(location.pathname);

  useEffect(() => {
    if (locationError) {
      setError(locationError);
    }
  }, [locationError]);

  useEffect(() => {
    // Update formData with userId if it changes
    setFormData((prev) => ({ ...prev, userId }));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({
      ...prev,
      location,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation check for title, content, and userId
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    if (!formData.userId) {
      setError("User ID is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newDiscussion = {
        id: uuidv4(),
        ...formData,
        author: username ? username : entity,
        createdAt: new Date().toISOString(),
        comments: [],
      };

      const response = await axios.post(
        config.community.createDiscussion,
        newDiscussion
      );

      if (response.data.status === "success") {
        refetch();
        setFormData({
          title: "",
          content: "",
          location: "",
          pathname: location.pathname,
          userId,
        });
        window.location.reload();
      }
    } catch (err) {
      console.error("Error creating discussion:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the discussion."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isGettingLocation) {
    return (
      <LoadingSpinner className="h-screen" message="Getting Location..." />
    );
  }

  return (
    <>
      {showForm && (
        <div className="lg:w-full mb-6 lg:mb-0">
          <DiscussionForm
            formData={formData}
            handleChange={handleChange}
            handleLocationChange={handleLocationChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      )}
    </>
  );
};

export default CreateDiscussion;
