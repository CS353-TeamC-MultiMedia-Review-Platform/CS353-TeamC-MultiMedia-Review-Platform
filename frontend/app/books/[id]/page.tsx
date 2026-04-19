"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/authStorage";
import { API_BASE_URL } from "@/lib/api";

// Force dynamic rendering for client-side data
export const dynamic = 'force-dynamic';

interface BookDetails {
  id: string;
  title: string;
  author: string;
  image: string;
  rating: number;
  description?: string;
  year?: number;
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

export default function BookDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 3,
    reviewText: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch book details from localStorage (passed from listing page)
    // Decode the ID since it was encoded when stored (for handling special characters)
    const decodedId = decodeURIComponent(bookId);
    const storedBook = localStorage.getItem(`book-${bookId}`);
    if (storedBook) {
      const bookData = JSON.parse(storedBook);
      console.log("[BookDetail] Loaded book from localStorage:", bookData.title);
      setBook(bookData);
      // Fetch reviews after we have the book data
      fetchReviewsForBook(bookData.title);
      setLoading(false);
    } else {
      console.warn("[BookDetail] No book data found in localStorage for ID:", bookId);
      setLoading(false);
    }
  }, [bookId]);

  const fetchReviewsForBook = async (bookTitle: string) => {
    console.log("[BookDetail] Fetching reviews for:", bookTitle);
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/media/${encodeURIComponent(bookTitle)}`
      );
      if (response.ok) {
        const data = await response.json();
        const reviewList = Array.isArray(data) ? data : data.reviews || [];
        console.log("[BookDetail] Fetched", reviewList.length, 'reviews for', bookTitle);
        setReviews(reviewList);
      } else {
        console.error("[BookDetail] Failed to fetch reviews, status:", response.status);
        setReviews([]);
      }
    } catch (error) {
      console.error("[BookDetail] Error fetching reviews:", error);
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

    if (!book?.title) {
      alert("Error: Book information not available");
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
      console.log("[BookDetail] Submitting review for book:", book.title);
      const response = await fetch(`${API_BASE_URL}/reviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          mediaId: bookId,
          mediaType: "book",
          rating: reviewData.rating,
          reviewText: trimmedReview,
          mediaTitle: book.title,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("[BookDetail] Review submitted successfully!");
        alert("Review submitted successfully!");
        setReviewData({ rating: 3, reviewText: "" });
        setShowReviewForm(false);
        // Fetch reviews again to show the new review
        console.log("[BookDetail] Fetching reviews after submission for:", book.title);
        fetchReviewsForBook(book.title);
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

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 pt-20">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Book not found</p>
          <p className="text-slate-400 mb-6">The book data could not be loaded. Please go back and try again.</p>
          <Link href="/books" className="text-amber-400 hover:text-amber-300">
            ← Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Back Link */}
        <Link href="/books" className="text-amber-400 hover:text-amber-300 mb-8 inline-block">
          ← Back to Books
        </Link>

        {/* Book Info Card */}
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl flex flex-col sm:flex-row gap-6 p-6 mb-8">
          {/* Cover */}
          <div className="flex-shrink-0 w-full sm:w-48">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/128x192?text=No+Cover";
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{book.title}</h1>
            <p className="text-xl text-amber-400 mb-4">by {book.author}</p>
            
            {book.year && (
              <p className="text-slate-400 mb-4">Published: {book.year}</p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-amber-400">
                  {book.rating}
                </span>
                <span className="text-slate-400 ml-2">/10</span>
              </div>
            </div>

            {book.description && (
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-slate-300">{book.description}</p>
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
