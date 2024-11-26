import React, {useState} from "react";
import { useLocation } from "react-router-dom";

import ButtonComponent from "./../reusable/Button";
import { LoadingOverlay } from "./../reusable/Loading";
import DiscussionCard from "./DiscussionCard";
import useDiscussions from "./../../hooks/useDiscussions";
import { Pencil } from "lucide-react";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button 
} from '@mui/material';
import useAuth from "./../../hooks/useAuth";

const DiscussionList = ({ isCreatingDiscussion, toggleDiscussionView, userId }) => {
  const location = useLocation();
  const { discussions, loading, error, setDiscussions, refetch } =
    useDiscussions(location.pathname, userId);
  const { role } = useAuth();

  // New state for authorization modal
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const isDashboardForDeveloper =
    location.pathname.startsWith("/profile") && role === "developer";
  const isDiscussionsPath = location.pathname === "/discussions";
  const isHealthPagePath = location.pathname.startsWith("/health");

  const handleDeleteSuccess = async (deletedDiscussionId) => {
    setDiscussions((prevDiscussions) =>
      prevDiscussions.filter((disc) => disc.id !== deletedDiscussionId)
    );
    await refetch();
  };

  // Modified create post button click handler
  const handleCreatePostClick = () => {
    if (["admin", "developer"].includes(role) || location.pathname.startsWith("/profile")) {
      toggleDiscussionView();
    } else {
      setOpenAuthModal(true);
    }
  };

  // Close authorization modal
  const handleCloseAuthModal = () => {
    setOpenAuthModal(false);
  };

  if (loading) {
    return (
      <LoadingOverlay
        isFullScreen={true}
        message="We are fetching..."
      />
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div
        className={`${
          isHealthPagePath ? "text-white mt-[0]" : ""
        } w-full py-2 px-6 mx-auto min-h-full my-[32px] shadow-md`}
      >
        <div className="flex justify-between h-full items-center">
          <h2 className={`text-xl font-semibold mt-4 tracking-tight`}>
            {isDiscussionsPath
              ? "All community Posts"
              : isDashboardForDeveloper
              ? "All Posts"
              : "Related Posts"}
          </h2>
          <ButtonComponent
            variant="primary"
            className={`${
              isDiscussionsPath
                ? "w-[197px] sm:w-full h-[38px] lg:w-[343px] sm:h-[50px]"
                : ""
            } w-fit h-full`}
            onClick={handleCreatePostClick}
          >
            {isDiscussionsPath ? "Create Post" : <Pencil size={18} />}
          </ButtonComponent>
        </div>
        <div className="space-y-8 mt-[64px]">
          {discussions?.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))}
          <span className="font-light tracking-[-0.08em]">
            {discussions.length === 0 ? "No posts available for this page." : ""}
          </span>
        </div>
      </div>

      {/* Authorization Modal */}
      <Dialog
        open={openAuthModal}
        onClose={handleCloseAuthModal}
        aria-labelledby="authorization-dialog-title"
        aria-describedby="authorization-dialog-description"
      >
        <DialogTitle id="authorization-dialog-title">
          {"Authorization Required"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="authorization-dialog-description">
            You are not authorized to create any post. Consider upgrading your account to gain access to this feature.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonComponent onClick={handleCloseAuthModal} rounded={false} autoFocus>
            Understand
          </ButtonComponent>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DiscussionList;