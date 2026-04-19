"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/authStorage";
import { API_BASE_URL } from "@/lib/api";

// Force dynamic rendering for client-side data
export const dynamic = 'force-dynamic';

interface MovieDetails {
  id: number;
  title: string;
  posterPath: string;
  backdropPath?: string;
  rating: number;
  releaseDate: string;
  overview: string;
  genres?: string[];
  runtime?: number;
  budget?: number;
  revenue?: number;
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

export default function MovieDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 3,
    reviewText: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch movie details from localStorage (passed from listing page)
    const storedMovie = localStorage.getItem(`movie-${movieId}`);
    if (storedMovie) {
      const movieData = JSON.parse(storedMovie);
      console.log("[MovieDetail] Loaded movie from localStorage:", movieData.title);
      setMovie(movieData);
      // Fetch reviews after we have the movie data
      fetchReviewsForMovie(movieData.title);
      setLoading(false);
    } else {
      console.warn("[MovieDetail] No movie data found in localStorage for ID:", movieId);
      setLoading(false);
    }
  }, [movieId]);

  const fetchReviewsForMovie = async (movieTitle: string) => {
    console.log("[MovieDetail] Fetching reviews for:", movieTitle);
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/media/${encodeURIComponent(movieTitle)}`
      );
      if (response.ok) {
        const data = await response.json();
        const reviewList = Array.isArray(data) ? data : data.reviews || [];
        console.log("[MovieDetail] Fetched", reviewList.length, 'reviews for', movieTitle);
        setReviews(reviewList);
      } else {
        console.error("[MovieDetail] Failed to fetch reviews, status:", response.status);
        setReviews([]);
      }
    } catch (error) {
      console.error("[MovieDetail] Error fetching reviews:", error);
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

    if (!movie?.title) {
      alert("Error: Movie information not available");
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
      console.log("[MovieDetail] Submitting review for movie:", movie.title);
      const response = await fetch(`${API_BASE_URL}/reviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          mediaId: movieId,
          mediaType: "movie",
          rating: reviewData.rating,
          reviewText: trimmedReview,
          mediaTitle: movie.title,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("[MovieDetail] Review submitted successfully!");
        alert("Review submitted successfully!");
        setReviewData({ rating: 3, reviewText: "" });
        setShowReviewForm(false);
        // Fetch reviews again to show the new review
        console.log("[MovieDetail] Fetching reviews after submission for:", movie.title);
        fetchReviewsForMovie(movie.title);
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

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Movie not found</p>
          <Link href="/movies" className="text-amber-400 hover:text-amber-300">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: movie.backdropPath ? `url(${movie.backdropPath})` : "none",
          backgroundColor: "#1e293b",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <Link
          href="/movies"
          className="absolute top-4 left-4 text-white hover:text-amber-400 z-10"
        >
          ← Back to Movies
        </Link>
      </div>

      {/* Content */}
      <div className="relative -mt-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-12">
        {/* Movie Info Card */}
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl flex flex-col sm:flex-row gap-6 p-6">
          {/* Poster */}
          <div className="flex-shrink-0 w-full sm:w-48">
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/500x750?text=No+Poster";
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
            <p className="text-slate-400 mb-4">{movie.releaseDate}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-amber-400">
                  {movie.rating}
                </span>
                <span className="text-slate-400 ml-2">/10</span>
              </div>
              {movie.runtime && (
                <div className="text-slate-300">
                  <span className="text-slate-400">Runtime:</span> {movie.runtime} min
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <p className="text-slate-400 mb-2">Genres:</p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.budget && (
              <p className="text-slate-300 mb-2">
                <span className="text-slate-400">Budget:</span> ${movie.budget.toLocaleString()}
              </p>
            )}
            {movie.revenue && (
              <p className="text-slate-300">
                <span className="text-slate-400">Revenue:</span> ${movie.revenue.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Overview */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
          <p className="text-slate-300 leading-relaxed">{movie.overview}</p>
        </div>

        {/* Review Button */}
        {user && (
          <div className="mt-8 flex gap-4">
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
          <div className="mt-8 bg-slate-800 rounded-lg p-6">
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
        <div className="mt-12">
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
