"use client";

import { useEffect, useState } from "react";

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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:5001/reviews");

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

  return (
    <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
          {reviews.map((review) => (
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
                  <button className="hover:text-amber-400 transition">
                    👍 {review.helpful || 0}
                  </button>
                  <button className="hover:text-amber-400 transition">
                    👎 {review.unhelpful || 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
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
