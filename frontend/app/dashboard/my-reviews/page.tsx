"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getUserId, getAuthToken } from "../../lib/authStorage";
import { buildApiUrl, API_ENDPOINTS } from "../../lib/api";

interface Review {
  id: string;
  mediaTitle: string;
  mediaType: string;
  rating: number;
  reviewText: string;
  createdAt?: any;
  userName?: string;
}

function MyReviewsContent() {
  const searchParams = useSearchParams();
  const created = searchParams.get("created");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setError("User not logged in");
          return;
        }

        const response = await fetch(
          buildApiUrl(API_ENDPOINTS.GET_USER_REVIEWS, userId),
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          },
        );

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
  }, [created]);

  const handleDelete = async (reviewId: string) => {
    setDeleteConfirmId(reviewId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    setDeleting(true);
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.DELETE_REVIEW, deleteConfirmId),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Remove from local state
      setReviews(reviews.filter((r) => r.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error deleting review:", err);
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen pt-0 pb-12">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Reviews</h1>
              <p className="text-slate-400">Reviews you've written</p>
            </div>
            <Link
              href="/dashboard"
              className="text-amber-400 hover:text-amber-300"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {created && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
              <p className="text-green-400 font-medium">
                ✓ Review published successfully!
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading your reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-slate-800 border border-amber-500/20 rounded-lg p-6 hover:border-amber-500/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-amber-400 mb-2">
                        {review.mediaTitle}
                      </h3>
                      <p className="text-sm text-slate-400 mb-3">
                        {review.mediaType} • ⭐ {review.rating}/5
                      </p>
                      <p className="text-slate-300 mb-4">{review.reviewText}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500 flex-1">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Recently added"}
                    </p>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-white/5 rounded-xl p-12 text-center">
              <p className="text-slate-400 text-lg mb-4">No reviews yet</p>
              <Link
                href="/dashboard/create-review"
                className="inline-block px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded transition"
              >
                Create Your First Review
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-amber-500/20 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              Delete Review?
            </h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-semibold rounded-lg transition"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <p className="text-white">Loading...</p>
        </div>
      }
    >
      <MyReviewsContent />
    </Suspense>
  );
}
