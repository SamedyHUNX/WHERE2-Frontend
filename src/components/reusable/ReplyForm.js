import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import ButtonComponent from "./Button";
import useAuth from "./../../hooks/useAuth";
import config from "./../../config";

const ReplyForm = ({ discussionId, onReplySubmitted, onCancel, isHealthPage }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { userId, token } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError("");

    const newCommentId = uuidv4();

    try {
      const response = await axios.post(
        config.community.addComment(discussionId, newCommentId),
        {
          content: content.trim(),
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.id) {
        onReplySubmitted(response.data);
        setContent("");
        if (onCancel) {
          onCancel();
        }
        
        queryClient.invalidateQueries(["comments", discussionId]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to post reply. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 px-2 space-y-4">
      <div className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Max length 200 characters"
          className={`w-full min-h-[100px] mb-2 rounded-md p-4 focus:ring-2 focus:ring-opacity-50 ${
            isHealthPage 
              ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500" 
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-600 focus:border-blue-600"
          }`}
          disabled={isSubmitting}
          maxLength={200}
        />
        <div className={`text-sm text-right ${
          isHealthPage ? "text-gray-400" : "text-gray-500"
        }`}>
          {content.length}/200 characters
        </div>
      </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div className="flex justify-end gap-2">
        <ButtonComponent
          variant={isHealthPage ? "ghost-dark" : "ghost"}
          rounded={false}
          onClick={onCancel}
          disabled={isSubmitting}
          type="button"
          className={isHealthPage ? "text-gray-300 hover:text-gray-100" : ""}
        >
          Cancel
        </ButtonComponent>
        <ButtonComponent
          type="submit"
          disabled={isSubmitting || !content.trim()}
          rounded={false}
          variant={isHealthPage ? "primary-dark" : "primary"}
          className={isHealthPage 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : ""}
        >
          {isSubmitting ? "Replying..." : "Reply"}
        </ButtonComponent>
      </div>
    </form>
  );
};

export default ReplyForm;
