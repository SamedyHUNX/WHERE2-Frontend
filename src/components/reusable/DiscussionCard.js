import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommentSectionComponent from "../community/CommentSectionComponent";
import ProfilePicture from "./PictureUpload";
import { useFetchBatchPhotos } from "./../../hooks/useFetchPhoto";
import WrapperComponent from "./WrapperComponent";
import useIsMobile from "./../../hooks/useIsMobile";

const DiscussionCard = ({ discussion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localComments, setLocalComments] = useState(discussion.comments || []);
  const { isMobile, isDesktop } = useIsMobile();
  const navigate = useNavigate();

  // Memoize the user IDs to avoid unnecessary recalculations
  const userIds = useMemo(() => {
    return [
      discussion.user?.id,
      ...(localComments || []).map((comment) => comment?.user?.id),
    ].filter(Boolean); // Filters out undefined or null values
  }, [discussion.user?.id, localComments]);

  // Fetch batch photos only when userIds change
  const { photoUrls, isLoading, error } = useFetchBatchPhotos(userIds);

  const handleCommentAdded = (newComment) => {
    setLocalComments((prevComments) => [newComment, ...prevComments]);
  };


  const handleUserClick = (userId) => (e) => {
    e.stopPropagation();
    navigate(`/public/user/${userId}`);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCommentSectionClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    console.log("Comment updated: ", localComments)
  }, [localComments])

  return (
    <WrapperComponent>
      <div
        className={`p-6 bg-white transition-transform duration-500 ease-in-out transform hover:scale-110 ${
          isExpanded ? "z-50" : "lg:max-h-[144px]"
        } rounded-lg shadow hover:shadow-lg cursor-pointer`}
        onClick={toggleExpand}
      >
        <h3 className="text-xl font-semibold mb-2 truncate">
          {discussion.title}
        </h3>
        <p
          className={`text-gray-600 mb-4 ${
            isExpanded ? "" : "truncate text-ellipsis"
          }`}
        >
          {discussion.content}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          {discussion.user && (
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-gray-700"
              onClick={handleUserClick(discussion.user.id)}
            >
              { isMobile ? <span>By </span> : <span>Posted by </span>}
              <ProfilePicture
                userId={discussion.user.id}
                photoUrl={photoUrls[discussion.user.id]}
                size={20}
              />
              <span>{discussion.user.email}</span>
            </div>
          )}
          <span>{localComments.length} comments</span>
        </div>
        {isExpanded && (
          <div onClick={handleCommentSectionClick}>
            <CommentSectionComponent
              discussionId={discussion.id}
              comments={localComments}
              onCommentAdded={handleCommentAdded}
              photoUrls={photoUrls}
            />
          </div>
        )}
      </div>
    </WrapperComponent>
  );
};

export default DiscussionCard;