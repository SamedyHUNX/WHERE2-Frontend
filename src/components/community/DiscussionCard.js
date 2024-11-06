import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommentSectionComponent from "./CommentSectionComponent";
import ProfilePicture from "../reusable/PictureUpload";
import { useFetchBatchPhotos } from "./../../hooks/useFetchPhoto";
import useIsMobile from "./../../hooks/useIsMobile";
import useAuth from "./../../hooks/useAuth";
import ButtonComponent from "./../reusable/Button";
import useComments from "./../../hooks/useComments";
import config from "./../../config";
import { Trash } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const DiscussionCard = ({ discussion, onDeleteSuccess }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localComments, setLocalComments] = useState(discussion.comments || []);
  const location = useLocation();
  const { isMobile } = useIsMobile();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const isHealthPagePath = location.pathname.startsWith("/health");

  const { userId, token, role } = useAuth();

  const { refetch } = useComments();

  // Memoize user IDs for fetching photos
  const userIds = useMemo(() => {
    return [
      discussion.user?.id,
      ...(localComments || []).map((comment) => comment?.user?.id),
    ].filter(Boolean);
  }, [discussion.user?.id, localComments]);

  const { photoUrls, isLoading, error } = useFetchBatchPhotos(userIds);

  // Handler for adding new comments
  const handleCommentAdded = (newComment) => {
    setLocalComments((prevComments) => [newComment, ...prevComments]);
    refetch();
  };

  // Handler for deleting comments
  const handleCommentDeleted = (commentId) => {
    setLocalComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
    refetch();
  };

  // Navigate to user profile on click
  const handleUserClick = (userId) => (e) => {
    e.stopPropagation();
    navigate(`/user/${userId}`);
  };

  // Expand or collapse the discussion card
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Prevent expanding when clicking inside the comment section
  const handleCommentSectionClick = (e) => {
    e.stopPropagation();
  };

  // Handler for deleting the discussion
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this discussion?")) {
      setIsDeleting(true);

      try {
        const discussionId = discussion.id;

        const response = await axios.delete(
          config.community.deleteDiscussion(discussionId),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-user-Role": role,
            },
          }
        );
        onDeleteSuccess(discussionId);
      } catch (error) {
        console.error("Error deleting discussion:", error);
        if (error.response) {
          console.error("Error Response:", error.response.data);
        }
        alert("Failed to delete discussion");
      }
    }
  };

  const isCurrentUserPost = discussion.user?.id === userId;

  return (
    <div
      className={`lg:p-5 sm:p-1 p-2 rounded-lg shadow hover:shadow-lg cursor-pointer relative
        ${isExpanded ? "min-h-fit" : ""}
        ${isHealthPagePath 
          ? "bg-gray-900 text-white hover:bg-gray-800" 
          : "bg-white text-black hover:bg-gray-50"
        }`}
      onClick={toggleExpand}
    >
      <h3 className="text-2xl font-medium mb-2 truncate tracking-tight">
        {discussion.title}
      </h3>

      {discussion.location && (
        <div className={`text-sm my-4 text-justify ${
          isHealthPagePath ? "text-gray-300" : "text-gray-500"
        }`}>
          <span className="font-medium tracking-tight pl-4 underline">Location:</span>{" "}
          {discussion.location}
        </div>
      )}

      <p
        className={`mb-4 text-justify pl-4 ${
          isExpanded
            ? "whitespace-normal"
            : "overflow-hidden whitespace-nowrap text-ellipsis"
        } ${isHealthPagePath ? "text-gray-300" : "text-gray-600"}`}
      >
        {discussion.content}
      </p>

      <div className={`flex justify-between items-center text-sm mb-2 pl-4 ${
        isHealthPagePath ? "text-gray-400" : "text-gray-500"
      }`}>
        {discussion.user && (
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              isHealthPagePath 
                ? "hover:text-gray-200" 
                : "hover:text-gray-700"
            }`}
            onClick={handleUserClick(discussion.user.id)}
          >
            {isMobile ? <span>By </span> : <span>Posted by </span>}
            <ProfilePicture
              userId={discussion.user.id}
              photoUrl={photoUrls[discussion.user.id]}
              size={20}
            />
            <span>
              {discussion.user?.profile?.entity
                ? discussion.user.profile.entity
                : discussion.user?.profile?.userName}
            </span>
          </div>
        )}
        <span className="pr-4">{localComments.length} replies</span>
      </div>

      {isExpanded && (
        <div onClick={handleCommentSectionClick} className="pl-4">
          <CommentSectionComponent
            discussionId={discussion.id}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
        </div>
      )}

      {/* Delete button visibility */}
      {(isCurrentUserPost || role === "developer") && (
        <div
          className="absolute lg:top-4 lg:right-4 sm:top-2 sm:right-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ButtonComponent
            variant="danger"
            size="small"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "..." : <Trash size={18} />}
          </ButtonComponent>
        </div>
      )}
    </div>
  );
};

export default DiscussionCard;

