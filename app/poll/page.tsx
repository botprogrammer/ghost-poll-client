"use client";

import {
  ArrowLeft,
  Check,
  Clipboard,
  Clock,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

// Mock data for the poll
const mockPoll = {
  id: "abc123",
  question: "What's your favorite programming language?",
  options: [
    { id: "opt1", text: "JavaScript", votes: 42 },
    { id: "opt2", text: "Python", votes: 35 },
    { id: "opt3", text: "TypeScript", votes: 28 },
    { id: "opt4", text: "Java", votes: 15 },
  ],
  expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  hideResults: false,
  totalVotes: 120,
  reactions: {
    likes: 24,
    trending: 18,
  },
};

export default function PollPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [poll, setPoll] = useState(mockPoll);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comment, setComment] = useState("");

  // Calculate time left and check if poll is expired
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(poll.expiresAt);
      const diffMs = expiry.getTime() - now.getTime();

      if (diffMs <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);

      if (diffHours > 0) {
        setTimeLeft(`${diffHours} hour${diffHours > 1 ? "s" : ""}`);
      } else if (diffMins > 0) {
        setTimeLeft(`${diffMins} minute${diffMins > 1 ? "s" : ""}`);
      } else {
        setTimeLeft(`${diffSecs} second${diffSecs > 1 ? "s" : ""}`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [poll.expiresAt]);

  // Check if user has already voted
  useEffect(() => {
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "{}");
    if (votedPolls[slug]) {
      setHasVoted(true);
    }
  }, [slug]);

  const handleVote = () => {
    if (!selectedOption || hasVoted || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Update local state to show vote
      const updatedOptions = poll.options.map((option) =>
        option.id === selectedOption
          ? { ...option, votes: option.votes + 1 }
          : option,
      );

      setPoll({
        ...poll,
        options: updatedOptions,
        totalVotes: poll.totalVotes + 1,
      });

      // Save vote to localStorage
      const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "{}");
      votedPolls[slug] = true;
      localStorage.setItem("votedPolls", JSON.stringify(votedPolls));

      setHasVoted(true);
      setIsSubmitting(false);
    }, 500);
  };

  const handleReaction = (type: "likes" | "trending") => {
    // Simulate API call
    setTimeout(() => {
      setPoll({
        ...poll,
        reactions: {
          ...poll.reactions,
          [type]: poll.reactions[type] + 1,
        },
      });
    }, 300);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate percentages for the results
  const calculatePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{poll.question}</h1>
        <div className="text-muted-foreground flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4" />
          {isExpired ? "This poll has expired" : `Expires in ${timeLeft}`}
        </div>
      </div>

      {/* Voting Section */}
      {!hasVoted && !isExpired && (
        <div className="bg-card mb-8 rounded-lg border p-6 shadow-sm">
          <div className="space-y-3">
            {poll.options.map((option) => (
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
                    {selectedOption === option.id && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring mt-4 w-full rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            onClick={handleVote}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Vote"}
          </button>
        </div>
      )}

      {/* Results Section */}
      {(hasVoted || isExpired || !poll.hideResults) && (
        <div className="bg-card mb-8 rounded-lg border p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Results</h2>

          <div className="space-y-5">
            {poll.options.map((option) => {
              const percentage = calculatePercentage(option.votes);

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.text}</span>
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
                Total votes: {poll.totalVotes}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => handleReaction("likes")}
              className="hover:border-primary hover:bg-primary/5 hover:text-primary flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{poll.reactions.likes}</span>
            </button>

            <button
              onClick={() => handleReaction("trending")}
              className="hover:border-primary hover:bg-primary/5 hover:text-primary flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{poll.reactions.trending}</span>
            </button>
          </div>
        </div>
      )}

      {/* Share Section */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Share this poll</h2>

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={typeof window !== "undefined" ? window.location.href : ""}
            className="bg-muted h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
          />
          <button
            className="bg-background hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors focus:outline-none"
            onClick={handleCopyLink}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="text-primary h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Comment section */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center">
            <h3 className="text-sm font-medium">Comments</h3>
            <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
              3
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium">Anonymous</span>
                <span className="text-muted-foreground text-xs">
                  2 minutes ago
                </span>
              </div>
              <p className="text-sm">
                TypeScript is definitely the way to go for large projects!
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium">Anonymous</span>
                <span className="text-muted-foreground text-xs">
                  15 minutes ago
                </span>
              </div>
              <p className="text-sm">
                Python is great for data science and machine learning.
              </p>
            </div>
          </div>

          <textarea
            placeholder="Add an anonymous comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-background focus:border-primary focus:ring-primary min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1"
          ></textarea>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Post Comment
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
