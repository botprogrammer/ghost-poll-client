"use client";

import { udpatePoll } from "@/lib/actions";
import type { Poll } from "@/lib/types";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

// Define a Comment type
interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

// Update Poll interface to include comments
interface PollWithComments extends Poll {
  comments?: Comment[];
}

interface CommentsSectionProps {
  poll: PollWithComments;
}

export default function CommentsSection({ poll }: CommentsSectionProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localPoll, setLocalPoll] = useState<PollWithComments>(poll);

  // Initialize comments array if it doesn't exist
  useEffect(() => {
    if (!localPoll.comments) {
      setLocalPoll({
        ...localPoll,
        comments: [],
      });
    }
  }, [localPoll]);

  const handlePostComment = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Create a new comment
    const newComment: Comment = {
      id: Date.now().toString(),
      text: comment,
      createdAt: new Date().toISOString(),
      author: "Anonymous",
    };

    // Update local state first for immediate feedback
    const updatedPoll = {
      ...localPoll,
      comments: [...(localPoll.comments || []), newComment],
    };

    setLocalPoll(updatedPoll);

    try {
      // Save to database
      await udpatePoll(poll._id, updatedPoll);
      setComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      // Revert local state if save fails
      setLocalPoll(localPoll);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format relative time for comments
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    } else {
      return "just now";
    }
  };

  const comments = localPoll.comments || [];
  const commentCount = comments.length;

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">Comments</h3>
          <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
            {commentCount}
          </span>
        </div>

        {commentCount > 0 ? (
          <div className="space-y-4">
            {comments
              .slice()
              .reverse()
              .map((comment) => (
                <div
                  key={comment.id}
                  className="bg-muted/50 rounded-lg border p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {comment.author}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {getRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-6 text-center">
            No comments yet. Be the first to comment!
          </div>
        )}

        <textarea
          placeholder="Add an anonymous comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-background focus:border-primary focus:ring-primary min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
        ></textarea>
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          onClick={handlePostComment}
          disabled={!comment.trim() || isSubmitting}
        >
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </div>
        </button>
      </div>
    </div>
  );
}
