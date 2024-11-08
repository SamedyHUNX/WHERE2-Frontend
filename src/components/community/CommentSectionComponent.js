import React, { useState, useCallback } from "react";
import ButtonComponent from "../reusable/Button";
import { useQueryClient } from "@tanstack/react-query";
import useComments from "./../../hooks/useComments";
import useAuth from "./../../hooks/useAuth";
import ProfilePicture from "./../reusable/PictureUpload";
import ReplyForm from "../reusable/ReplyForm";
import { Reply } from "lucide-react";
import config from "./../../config";
import { Trash } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PublicProfile from "../reusable/PublicProfile";

const CommentSectionComponent = ({ discussionId, onCommentAdded }) => {
  const { isLoggedIn, userId, role, token } = useAuth();
  const location = useLocation();
  const isHealthPagePath = location.pathname.startsWith("/health");

  const {
    comments,
    loading: isLoading,
    error: fetchError,
  } = useComments(discussionId);

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [deletingComments, setDeletingComments] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const queryClient = useQueryClient();

  const handleReplySubmitted = useCallback(
    (newComment) => {
      if (newComment && newComment.id && newComment.content) {
        queryClient.setQueryData(["comments", discussionId], (oldData) => {
          const updatedComments = oldData
            ? [...oldData, newComment]
            : [newComment];
          return updatedComments;
        });

        onCommentAdded(newComment);
        setShowReplyForm(false);
        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }
    },
    [queryClient, discussionId, onCommentAdded]
  );

  const handleDelete = useCallback(
    async (commentId) => {
      try {
        setDeletingComments((prev) => ({ ...prev, [commentId]: true }));

        await axios.delete(config.community.deleteComment(commentId), {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-Role": role,
          },
        });

        queryClient.setQueryData(["comments", discussionId], (oldData) => {
          return oldData
            ? oldData.filter((comment) => comment.id !== commentId)
            : [];
        });
      } catch (err) {
        console.error("Error deleting comment:", err);
        queryClient.invalidateQueries(["comments", discussionId]);
      } finally {
        setDeletingComments((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [queryClient, discussionId, token, role]
  );

  const canDeleteComment = (comment) => {
    return comment.user && (userId === comment.user.id || role === "developer");
  };

  return (
    <div className="mt-6 space-y-8">
      <h2
        className={`text-sm tracking-tighter ${
          isHealthPagePath ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Comments ({comments ? comments.length : 0})
      </h2>

      {isLoggedIn && !showReplyForm && (
        <div className="w-full flex justify-end">
          <ButtonComponent
            variant={isHealthPagePath ? "ghost-dark" : "ghost"}
            className={`hover:visible text-sm flex ${
              isHealthPagePath
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setShowReplyForm(true)}
          >
            <Reply className="mt-1" size={18} />
            <span className="mt-1 mr-1">reply</span>
          </ButtonComponent>
        </div>
      )}

      {showReplyForm && (
        <ReplyForm
          discussionId={discussionId}
          onReplySubmitted={handleReplySubmitted}
          onCancel={() => setShowReplyForm(false)}
          isHealthPage={isHealthPagePath}
        />
      )}

      {fetchError && (
        <div className="text-red-500 text-sm">
          Error loading comments. Please try again.
        </div>
      )}
      {isSuccess && (
        <div className="text-green-500 text-sm">
          Comment posted successfully!
        </div>
      )}
      {isLoading && (
        <div
          className={`text-sm ${
            isHealthPagePath ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Loading comments...
        </div>
      )}

      <div className="space-y-4 pl-8">
        {comments &&
          comments
            .filter((comment) => comment && comment.user)
            .map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg relative ${
                  isHealthPagePath
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ProfilePicture userId={comment.user.id} />
                  <span
                    className={`text-sm truncate max-w-[200px] ${
                      isHealthPagePath ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {comment.user.profile.userName
                      ? comment.user.profile.userName
                      : comment.user.profile.entity}
                    <span> says:</span>
                  </span>
                </div>
                {canDeleteComment(comment) && (
                  <div
                    className="absolute top-2 right-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ButtonComponent
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingComments[comment.id]}
                    >
                      {deletingComments[comment.id] ? (
                        "..."
                      ) : (
                        <Trash size={18} />
                      )}
                    </ButtonComponent>
                  </div>
                )}
                <div
                  className={`whitespace-pre-wrap break-all w-full pl-4 ${
                    isHealthPagePath ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {comment.content.split(" ").map((word, index) => (
                    <React.Fragment key={index}>
                      <span className="break-all w-[90%] h-fit">{word}</span>
                      {index !== comment.content.split(" ").length - 1 && " "}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default CommentSectionComponent;
