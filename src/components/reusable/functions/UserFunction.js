import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash, Eye, Check, X } from "lucide-react";
import deleteUser from "./DeleteUser";
import axios from "axios";
import config from "../../../config";

export const useUserFunctions = (onUserUpdate) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleView = (id) => {
    navigate(`/user/${id}`);
  };

  const handleActivateUser = async (id) => {
    try {
      const response = await axios.patch(config.analytics.reactivateUserById(id));
      if (response.status === 200) {
        // Update the UI immediately after successful API call
        onUserUpdate(id, true);
      }
    } catch (error) {
      console.error("Failed to activate user with ID:", id, error);
    }
  };


  const getUserFunctions = (showActive) => {
    const baseActions = [
      {
        variant: "ghost",
        icon: <Eye />,
        onClick: handleView,
      },
    ];

    if (!showActive) {
      baseActions.push({
        variant: "success",
        icon: <Check />,
        onClick: handleActivateUser,
        requiresConfirmation: true,
      });
    }
    
    if (showActive) {
      baseActions.push({
        variant: "danger",
        icon: <X />,
        onClick: handleDelete,
        requiresConfirmation: true,
      });
    }

    return baseActions;
  };

  return { getUserFunctions };
};