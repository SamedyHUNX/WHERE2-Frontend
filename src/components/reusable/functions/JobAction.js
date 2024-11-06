import { useNavigate } from "react-router-dom";
import { X, Eye, Check } from "lucide-react";
import config from "../../../config";
import axios from "axios";

export const useJobFunctions = (onJobUpdate) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    console.log("View action triggered for Job with ID:", id);
    navigate(`/detail/job/${id}`);
  };

  const handleApprovePost = async (id) => {
    try {
      const response = await axios.patch(config.job.approveJob(id));
      if (response.status === 200) {
        // Update the UI immediately after successful API call
        onJobUpdate(id, true);
      }
    } catch (error) {
      console.error("Failed to approve job with ID:", id, error);
    }
  };

  const handleDisapprovePost = async (id) => {
    try {
      const response = await axios.patch(config.job.disapproveJob(id));
      if (response.status === 200) {
        // Update the UI immediately after successful API call
        onJobUpdate(id, false);
      }
    } catch (error) {
      console.error("Failed to disapprove job with ID:", id, error);
    }
  };

  const getJobFunctions = (showApproved) => {
    const baseActions = [
      {
        variant: "ghost",
        icon: <Eye />,
        label: "",
        onClick: (id) => handleView(id),
      }
    ];

    if (!showApproved) {
      baseActions.push({
        variant: "success",
        icon: <Check />,
        label: "",
        onClick: (id) => handleApprovePost(id),
        requiresConfirmation: true,
      });
    }
    
    if (showApproved) {
      baseActions.push({
        variant: "danger",
        icon: <X />,
        label: "",
        onClick: (id) => handleDisapprovePost(id),
        requiresConfirmation: true,
      });
    }

    return baseActions;
  };

  return { getJobFunctions };
};