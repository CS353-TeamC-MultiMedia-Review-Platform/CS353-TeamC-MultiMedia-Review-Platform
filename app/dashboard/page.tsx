"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserId, getUserName, getAuthToken } from "../lib/authStorage";

interface Review {
  id: string;
  title: string;
  mediaType: "movie" | "music" | "book";
  rating: number;
  reviewText: string;
  createdAt: string;
  mediaTitle: string;
  userName: string;
}

interface UserData {
  name: string;
  email: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("my-reviews");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userCreatedAt, setUserCreatedAt] = useState("");
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Check authentication and load user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const uid = getUserId();
        const name = getUserName();

        if (!uid || !name) {
          router.push("/login");
          return;
        }

        setUserId(uid);
        setUserName(name);

        // Fetch user's full data from backend (including email)
        try {
          const userResponse = await fetch(`http://localhost:5001/data/${uid}`);
          if (userResponse.ok) {
            const userData: UserData = await userResponse.json();
            setUserEmail(userData.email);
            if (userData.createdAt) {
              setUserCreatedAt(userData.createdAt);
            }
          }
        } catch (userErr) {
          console.error("Could not fetch user data:", userErr);
        }

        // Fetch user's reviews from backend
        const response = await fetch(
          `http://localhost:5001/reviews/user/${uid}`,
        );
        if (response.ok) {
          const data = await response.json();
          setUserReviews(Array.isArray(data) ? data : data.reviews || []);
        } else {
          setError("Failed to load reviews");
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleDelete = async (reviewId: string) => {
    setDeleteConfirmId(reviewId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    setDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:5001/reviews/${deleteConfirmId}`,
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
      setUserReviews(userReviews.filter((r) => r.id !== deleteConfirmId));
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

  const stats = {
    total: userReviews.length,
    movies: userReviews.filter((r) => r.mediaType === "movie").length,
    music: userReviews.filter((r) => r.mediaType === "music").length,
    books: userReviews.filter((r) => r.mediaType === "book").length,
  };

  const filtered =
    filterType === "all"
      ? userReviews
      : userReviews.filter(
          (r) => r.mediaType === (filterType as "movie" | "music" | "book"),
        );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/" className="text-amber-400 hover:text-amber-300">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-amber-600/20 via-slate-900 to-slate-950 border-b border-white/10 mb-12">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full border-3 border-amber-500 bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-5xl">👤</span>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-white mb-3">{userName}</h1>
              <p className="text-slate-300 text-lg mb-6">
                Your Personal Dashboard
              </p>

              {/* User Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-5">
                  <p className="text-xs text-slate-500 mb-2">📧 Email</p>
                  <p className="text-slate-100 font-medium text-sm">
                    {userEmail || "Loading..."}
                  </p>
                </div>
                {userCreatedAt && (
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-5">
                    <p className="text-xs text-slate-500 mb-2">
                      📅 Member Since
                    </p>
                    <p className="text-slate-100 font-medium text-sm">
                      {new Date(userCreatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Create Review Button */}
            <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
              <Link
                href="/dashboard/create-review"
                className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition whitespace-nowrap text-center text-base shadow-lg"
              >
                + Create Review
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">✍️ My Reviews</h2>
          <p className="text-slate-400 text-base">
            Manage and track all your reviews
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-amber-500/20 rounded-xl p-7 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Reviews</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <p className="text-4xl opacity-20">📝</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/80 border border-blue-500/20 rounded-xl p-7 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Movies</p>
                <p className="text-3xl font-bold text-blue-400">
                  {stats.movies}
                </p>
              </div>
              <p className="text-4xl">🎬</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/80 border border-purple-500/20 rounded-xl p-7 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Music</p>
                <p className="text-3xl font-bold text-purple-400">
                  {stats.music}
                </p>
              </div>
              <p className="text-4xl">🎵</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/30 to-slate-900/80 border border-emerald-500/20 rounded-xl p-7 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Books</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {stats.books}
                </p>
              </div>
              <p className="text-4xl">📚</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 flex-wrap mb-12 pb-8 border-b border-white/10">
          {["all", "movie", "music", "book"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-3 rounded-lg text-sm font-medium transition-all ${
                filterType === type
                  ? "bg-amber-500 text-black"
                  : "bg-slate-800 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {type === "all"
                ? "All Reviews"
                : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg mb-6">
              You haven't written any reviews yet.
            </p>
            <Link
              href="/dashboard/create-review"
              className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition text-base"
            >
              Write Your First Review
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((review) => (
              <div
                key={review.id}
                className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-xl p-8 hover:border-amber-500/30 transition"
              >
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {review.mediaTitle}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {review.mediaType === "movie"
                        ? "🎬 Movie"
                        : review.mediaType === "music"
                          ? "🎵 Music"
                          : "📚 Book"}
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg text-sm font-semibold whitespace-nowrap">
                    ⭐ {review.rating}/5
                  </span>
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {review.reviewText}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <p className="text-sm text-slate-400">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "Recently added"}
                  </p>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-5 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 rounded transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-amber-500/20 rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-4">
                Delete Review?
              </h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete this review? This action cannot
                be undone.
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
    </div>
  );
}
