"use client";

import { udpatePoll } from "@/lib/actions";
import { refetchData } from "@/lib/refetch";
import type { Poll } from "@/lib/types";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VotingSectionProps {
  poll: Poll;
  isExpired: boolean;
}

export default function VotingSection({ poll, isExpired }: VotingSectionProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollData, setPollData] = useState(poll);

  const router = useRouter();

  // Check if user has already voted
  useEffect(() => {
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "{}");
    if (votedPolls[poll._id]) {
      setHasVoted(true);
    }
  }, [poll._id]);

  const handleVote = async () => {
    if (!selectedOption || hasVoted || isSubmitting) return;
    setIsSubmitting(true);

    // Update local state to show vote
    const updatedOptions = pollData.options.map((option) =>
      option.id === selectedOption
        ? { ...option, votes: option.votes + 1 }
        : option,
    );

    const updatedPoll = {
      ...pollData,
      options: updatedOptions,
      totalVotes: (pollData.totalVotes ?? 0) + 1,
    };

    setPollData(updatedPoll);

    // Update in database
    await udpatePoll(poll._id, updatedPoll);
    await refetchData();
    router.refresh();

    // Save vote to localStorage
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "{}");
    votedPolls[poll._id] = true;
    localStorage.setItem("votedPolls", JSON.stringify(votedPolls));

    setHasVoted(true);
    setIsSubmitting(false);
  };

  if (hasVoted || isExpired) {
    return null;
  }

  return (
    <div className="bg-card mb-8 rounded-lg border p-6 shadow-sm">
      <div className="space-y-3">
        {pollData.options.map((option) => (
          <div
            key={option.id}
            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
              selectedOption === option.id
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
            onClick={() => setSelectedOption(option.id)}
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  selectedOption === option.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground"
                }`}
              >
                {selectedOption === option.id && <Check className="h-3 w-3" />}
              </div>
              <span className="font-medium">{option.value}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring mt-4 w-full rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        onClick={handleVote}
        disabled={!selectedOption || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Vote"}
      </button>
    </div>
  );
}
