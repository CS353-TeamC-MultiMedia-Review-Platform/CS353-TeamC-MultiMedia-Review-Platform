"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/authStorage";
import { API_BASE_URL } from "@/lib/api";

// Force dynamic rendering for client-side data
export const dynamic = 'force-dynamic';

interface MusicDetails {
  id: string;
  title: string;
  artist: string;
  image: string;
  rating: number;
  description?: string;
}

interface Review {
  id: string;
  rating: number;
  reviewText: string;
  userName: string;
  createdAt: string;
  mediaTitle: string;
  mediaType: string;
}

export default function MusicDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const musicId = params.id as string;

  const [music, setMusic] = useState<MusicDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 3,
    reviewText: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch music details from localStorage (passed from listing page)
    const storedMusic = localStorage.getItem(`music-${musicId}`);
    if (storedMusic) {
      const musicData = JSON.parse(storedMusic);
      console.log("[MusicDetail] Loaded music from localStorage:", musicData.title);
      setMusic(musicData);
      // Fetch reviews after we have the music data
      fetchReviewsForMusic(musicData.title);
      setLoading(false);
    } else {
      console.warn("[MusicDetail] No music data found in localStorage for ID:", musicId);
      setLoading(false);
    }
  }, [musicId]);

  const fetchReviewsForMusic = async (musicTitle: string) => {
    console.log("[MusicDetail] Fetching reviews for:", musicTitle);
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/media/${encodeURIComponent(musicTitle)}`
      );
      if (response.ok) {
        const data = await response.json();
        const reviewList = Array.isArray(data) ? data : data.reviews || [];
        console.log("[MusicDetail] Fetched", reviewList.length, 'reviews for', musicTitle);
        setReviews(reviewList);
      } else {
        console.error("[MusicDetail] Failed to fetch reviews, status:", response.status);
        setReviews([]);
      }
    } catch (error) {
      console.error("[MusicDetail] Error fetching reviews:", error);
      setReviews([]);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please log in to submit a review");
      router.push("/login");
      return;
    }

    if (!music?.title) {
      alert("Error: Music information not available");
      return;
    }

    // Client-side validation
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    const trimmedReview = reviewData.reviewText.trim();
    if (trimmedReview.length < 10) {
      alert("Review must be at least 10 characters");
      return;
    }

    if (trimmedReview.length > 2000) {
      alert("Review cannot exceed 2000 characters");
      return;
    }

    setSubmitting(true);
    try {
      const musicTitle = `${music.title} - ${music.artist}`;
      console.log("[MusicDetail] Submitting review for music:", musicTitle);
      const response = await fetch(`${API_BASE_URL}/reviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          mediaId: musicId,
          mediaType: "music",
          rating: reviewData.rating,
          reviewText: trimmedReview,
          mediaTitle: musicTitle,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("[MusicDetail] Review submitted successfully!");
        alert("Review submitted successfully!");
        setReviewData({ rating: 3, reviewText: "" });
        setShowReviewForm(false);
        // Fetch reviews again to show the new review
        console.log("[MusicDetail] Fetching reviews after submission for:", musicTitle);
        fetchReviewsForMusic(musicTitle);
      } else {
        console.error("Review submission error:", data);
        alert(`Failed to submit review: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!music) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Music not found</p>
          <Link href="/music" className="text-amber-400 hover:text-amber-300">
            Back to Music
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Back Link */}
        <Link href="/music" className="text-amber-400 hover:text-amber-300 mb-8 inline-block">
          ← Back to Music
        </Link>

        {/* Music Info Card */}
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl flex flex-col sm:flex-row gap-6 p-6 mb-8">
          {/* Album Art */}
          <div className="flex-shrink-0 w-full sm:w-48">
            <img
              src={music.image}
              alt={music.title}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/200x200?text=Album";
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{music.title}</h1>
            <p className="text-xl text-amber-400 mb-6">by {music.artist}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-amber-400">
                  {music.rating}
                </span>
                <span className="text-slate-400 ml-2">/10</span>
              </div>
            </div>

            {music.description && (
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-slate-300">{music.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Button */}
        {user && (
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-2 bg-amber-400 text-slate-900 font-semibold rounded-lg hover:bg-amber-300 transition"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && user && (
          <div className="mb-8 bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Rating (1-5 stars)</label>
                <select
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, rating: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-400"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} / 5 {'⭐'.repeat(num)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Review (minimum 10 characters)</label>
                <textarea
                  value={reviewData.reviewText}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, reviewText: e.target.value })
                  }
                  placeholder="Write your review here..."
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-amber-400 text-slate-900 font-semibold rounded-lg hover:bg-amber-300 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-slate-400">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-amber-400 font-bold text-lg">{review.rating}/5 ⭐</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">By {review.userName}</p>
                  <p className="text-slate-300">{review.reviewText}</p>
                  <p className="text-slate-500 text-xs mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
