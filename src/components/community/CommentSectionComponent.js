import React, { useState, useEffect, useCallback } from "react";
import ButtonComponent from "../reusable/Button";
import useAuth from "../../hooks/useAuth";
import ProfilePicture from "../reusable/ProfilePicture";
import ReplyForm from "../reusable/ReplyForm";
import config from "./../../config";
import axios from "axios";


const CommentSectionComponent = ({
  discussionId,
  comments,
  onCommentAdded,
  photoUrls,
}) => {
  const { isLoggedIn } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsLoading] = useState(false);

  const fetchComments = async (discussionId) => {
    try {
      const response = await axios.get(config.community.getAllComments(discussionId));
      // Assuming response.data.data.comments returns an array of comments
      onCommentAdded(response.data.data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Error fetching comments");
    }
  };

  const handleReplySubmitted = useCallback(
    (newComment) => {
      onCommentAdded((prevComments) => {
        const existingCommentIndex = prevComments.findIndex(comment => comment.id === newComment.id);
        if (existingCommentIndex !== -1) {
          setIsLoading(true);
          const updatedComments = [...prevComments];
          updatedComments[existingCommentIndex] = newComment;
          setIsLoading(false);
          return updatedComments;
        }
        setIsLoading(false);
        return [newComment, ...prevComments];
      });
      setIsLoading(false);
      setShowReplyForm(false);
    },
    [onCommentAdded]
  );

  useEffect(() => {
    fetchComments(discussionId);
  }, [discussionId]);

  return (
    <div className="mt-6 space-y-8">
      <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>

      {isLoggedIn && !showReplyForm && (
        <div className="w-full flex justify-end">
          <ButtonComponent
            variant="ghost"
            className="hover:visible text-sm text-opacity-70"
            onClick={() => setShowReplyForm(true)}
          >
            Add a reply
          </ButtonComponent>
        </div>
      )}

      {showReplyForm && (
        <ReplyForm
          discussionId={discussionId}
          onReplySubmitted={handleReplySubmitted}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="space-y-4">
        {comments
          .filter(comment => comment && comment.user) // Check for both comment and user
          .map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ProfilePicture userId={comment.user.id} size={6} />
                <span className="text-sm text-gray-600">
                  {comment.user.email}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentSectionComponent;