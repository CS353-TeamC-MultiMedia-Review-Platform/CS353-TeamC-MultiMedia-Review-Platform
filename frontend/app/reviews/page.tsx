"use client";

import { useEffect, useState } from "react";
import { buildApiUrl, API_ENDPOINTS } from "../lib/api";

interface Review {
  id: string;
  mediaTitle: string;
  mediaType: string;
  rating: number;
  reviewText: string;
  userName: string;
  createdAt?: any;
  helpful?: number;
  unhelpful?: number;
}

type VoteType = "helpful" | "unhelpful" | null;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Map<string, VoteType>>(new Map());

  useEffect(() => {
    // Load user votes from localStorage on mount
    const savedVotes = localStorage.getItem("reviewVotes");
    if (savedVotes) {
      try {
        const votesObj = JSON.parse(savedVotes);
        setUserVotes(new Map(Object.entries(votesObj)));
      } catch (e) {
        console.error("Error loading user votes:", e);
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.GET_REVIEWS));

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleVote = async (reviewId: string, voteType: VoteType) => {
    const currentVote = userVotes.get(reviewId);

    // If clicking the same vote, toggle it off
    if (currentVote === voteType && voteType !== null) {
      try {
        const undoEndpoint = voteType === "helpful" ? "helpful/undo" : "unhelpful/undo";
        const response = await fetch(
          buildApiUrl(`/reviews/${reviewId}/${undoEndpoint}`),
          { method: "POST" }
        );

        if (response.ok) {
          // Update the local review count to decrement
          setReviews(
            reviews.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    [voteType]: Math.max(0, (review[voteType] || 0) - 1),
                  }
                : review
            )
          );

          // Remove the vote from state
          const newVotes = new Map(userVotes);
          newVotes.delete(reviewId);
          setUserVotes(newVotes);
          localStorage.setItem("reviewVotes", JSON.stringify(Object.fromEntries(newVotes)));
        }
      } catch (err) {
        console.error("Error undoing vote:", err);
      }
      return;
    }

    // If no vote type and there was a current vote, undo it
    if (voteType === null && currentVote) {
      try {
        const undoEndpoint = currentVote === "helpful" ? "helpful/undo" : "unhelpful/undo";
        const response = await fetch(
          buildApiUrl(`/reviews/${reviewId}/${undoEndpoint}`),
          { method: "POST" }
        );

        if (response.ok) {
          setReviews(
            reviews.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    [currentVote]: Math.max(0, (review[currentVote] || 0) - 1),
                  }
                : review
            )
          );

          const newVotes = new Map(userVotes);
          newVotes.delete(reviewId);
          setUserVotes(newVotes);
          localStorage.setItem("reviewVotes", JSON.stringify(Object.fromEntries(newVotes)));
        }
      } catch (err) {
        console.error("Error undoing vote:", err);
      }
      return;
    }

    // User is changing their vote or voting for the first time
    if (voteType) {
      try {
        const endpoint = voteType === "helpful" ? "helpful" : "unhelpful";
        const response = await fetch(
          buildApiUrl(`/reviews/${reviewId}/${endpoint}`),
          { method: "POST" }
        );

        if (response.ok) {
          // Update the local review count
          setReviews(
            reviews.map((review) => {
              if (review.id === reviewId) {
                const updated = { ...review };

                // If there was a previous vote, decrement it
                if (currentVote === "helpful") {
                  updated.helpful = Math.max(0, (updated.helpful || 0) - 1);
                } else if (currentVote === "unhelpful") {
                  updated.unhelpful = Math.max(0, (updated.unhelpful || 0) - 1);
                }

                // Increment the new vote
                updated[voteType] = (updated[voteType] || 0) + 1;
                return updated;
              }
              return review;
            })
          );

          // Save the new vote
          const newVotes = new Map(userVotes);
          newVotes.set(reviewId, voteType);
          setUserVotes(newVotes);
          localStorage.setItem("reviewVotes", JSON.stringify(Object.fromEntries(newVotes)));
        }
      } catch (err) {
        console.error("Error voting on review:", err);
      }
    }
  };

  return (
    <main className="pt-0 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⭐</span>
          <h1 className="text-4xl font-bold text-white">All Reviews</h1>
        </div>
        <p className="text-slate-400 text-sm">
          {loading ? "Loading..." : `${reviews.length} reviews from community`}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const userVote = userVotes.get(review.id);
            return (
              <div
                key={review.id}
                className="bg-slate-800/30 border border-white/5 rounded-xl p-6 hover:border-white/10 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {review.mediaTitle}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {review.mediaType} • {review.userName}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-sm font-semibold">
                    ⭐ {review.rating}
                  </span>
                </div>
                <p className="text-slate-300 mb-3">{review.reviewText}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <button
                      onClick={() =>
                        handleVote(review.id, userVote === "helpful" ? null : "helpful")
                      }
                      className={`transition ${
                        userVote === "helpful"
                          ? "text-green-400 font-semibold"
                          : "hover:text-green-400"
                      }`}
                    >
                      👍 {review.helpful || 0}
                    </button>
                    <button
                      onClick={() =>
                        handleVote(review.id, userVote === "unhelpful" ? null : "unhelpful")
                      }
                      className={`transition ${
                        userVote === "unhelpful"
                          ? "text-red-400 font-semibold"
                          : "hover:text-red-400"
                      }`}
                    >
                      👎 {review.unhelpful || 0}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800/30 border border-white/5 rounded-xl">
          <p className="text-slate-400 text-lg">No reviews yet</p>
          <p className="text-slate-500 text-sm mt-2">
            Be the first to share your thoughts!
          </p>
        </div>
      )}
    </main>
  );
}
