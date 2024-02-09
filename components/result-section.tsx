"use client";

import { udpatePoll } from "@/lib/actions";
import { refetchData } from "@/lib/refetch";
import type { Poll } from "@/lib/types";
import { ThumbsUp, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ResultsSectionProps {
  poll: Poll;
  isExpired: boolean;
}

export default function ResultsSection({
  poll,
  isExpired,
}: ResultsSectionProps) {
  const router = useRouter();

  const [hasVoted, setHasVoted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [pollData, setPollData] = useState(poll);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has already voted or liked
  useEffect(() => {
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "{}");
    const likedPolls = JSON.parse(localStorage.getItem("likedPolls") || "{}");

    if (likedPolls[poll._id]) {
      setHasLiked(true);
    }

    if (votedPolls[poll._id]) {
      setHasVoted(true);
    }
  }, [poll._id]);

  // Update local state when poll props change
  useEffect(() => {
    setPollData(poll);
  }, [poll]);

  const handleReaction = async (type: "likes" | "trending") => {
    if (hasLiked || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const updatedPoll = {
        ...pollData,
        reactions: {
          ...pollData.reactions,
          [type]: pollData.reactions[type] + 1,
        },
      };

      // Update local state
      setPollData(updatedPoll);

      // Update in database
      await udpatePoll(poll._id, updatedPoll);

      // Call server action to revalidate
      await refetchData();

      // Force a router refresh
      router.refresh();

      // Update localStorage
      const likedPolls = JSON.parse(localStorage.getItem("likedPolls") || "{}");
      likedPolls[poll._id] = true;
      localStorage.setItem("likedPolls", JSON.stringify(likedPolls));

      setHasLiked(true);
    } catch (error) {
      console.error("Error handling reaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate percentages for the results
  const calculatePercentage = (votes: number) => {
    if (pollData.totalVotes === 0) return 0;
    return Math.round((votes / (pollData.totalVotes ?? 0)) * 100);
  };

  // Determine if we should show the poll results
  const shouldShowResults = !poll.hideResults || isExpired || hasVoted;

  return (
    <div className="bg-card mb-8 rounded-lg border p-6 shadow-sm">
      {shouldShowResults && (
        <>
          <h2 className="mb-6 text-xl font-semibold">Results</h2>

          <div className="space-y-5">
            {pollData.options.map((option) => {
              const percentage = calculatePercentage(option.votes);

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.value}</span>
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full transition-all duration-500 ease-in-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {option.votes} votes
                  </p>
                </div>
              );
            })}

            <div className="border-t pt-2">
              <p className="text-muted-foreground text-sm">
                Total votes: {pollData.totalVotes}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Reactions section - always visible */}
      <div
        className={`${shouldShowResults ? "mt-6" : "mt-0"} flex items-center gap-4`}
      >
        <button
          disabled={hasLiked || isSubmitting}
          onClick={() => handleReaction("likes")}
          className="hover:border-primary hover:bg-primary/5 hover:text-primary disabled:border-primary disabled:text-primary flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{pollData.reactions.likes}</span>
        </button>

        <button
          disabled={hasLiked || isSubmitting}
          onClick={() => handleReaction("trending")}
          className="hover:border-primary hover:bg-primary/5 hover:text-primary disabled:border-primary disabled:text-primary flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed"
        >
          <TrendingUp className="h-4 w-4" />
          <span>{pollData.reactions.trending}</span>
        </button>
      </div>
    </div>
  );
}
