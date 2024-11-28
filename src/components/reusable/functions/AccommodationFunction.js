import { useNavigate } from "react-router-dom";
import { X, Eye, Check } from "lucide-react";
import config from "../../../config";
import axios from "axios";

export const useAccommodationFunctions = (onAccommodationUpdate) => {
    const navigate = useNavigate();

    const handleApprovePost = async (id) => {
        try {
            const response = await axios.patch(config.accommodation.approveAccommodation(id));
            if (response.status === 200) {
                // Update the UI immediately after successful API call
                onAccommodationUpdate(id, true);
            }
        } catch (error) {
            console.error("Failed to approve Accommodation with ID:", id, error);
        }
    };

    const handleView = (id) => {
        navigate(`/detail/accommodation/${id}`);
    };

    const handleDisapprovePost = async (id) => {
        try {
            const response = await axios.patch(config.accommodation.disapproveAccommodation(id));
            if (response.status === 200) {
                // Update the UI immediately after successful API call
                onAccommodationUpdate(id, false);
            }
        } catch (error) {
            console.error("Failed to disapprove Accommodation with ID:", id, error);
        }
    }

    const getAccommodationFunctions = (showApproved) => {
        const baseActions = [
            {
                variant: "ghost",
                icon: <Eye/>,
                label: "View",
                onClick: (id) => handleView(id),
            }
        ];

        if (!showApproved) {
            baseActions.push({
                variant: "success",
                icon: <Check />,
                onClick: (id) => handleApprovePost(id),
                requiresConfirmation: true,
            });
        }
        if (showApproved) {
            baseActions.push({
                variant: "danger",
                icon: <X />,
                onClick: (id) => handleDisapprovePost(id),
                requiresConfirmation: true,
            });
        }

        return baseActions;
    };

    return { getAccommodationFunctions };
};