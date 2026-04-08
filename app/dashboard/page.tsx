"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserId, getUserName } from "../lib/authStorage";

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
          setUserReviews(data.reviews || []);
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
    <div className="min-h-screen pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-amber-600/20 via-slate-900 to-slate-950 border-b border-white/10 mb-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-2 border-amber-500 bg-amber-500/20 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{userName}</h1>
              <p className="text-slate-400 mb-4">Your Personal Dashboard</p>

              {/* User Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">📧 Email</p>
                  <p className="text-slate-200 font-medium">
                    {userEmail || "Loading..."}
                  </p>
                </div>
                {userCreatedAt && (
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">
                      📅 Member Since
                    </p>
                    <p className="text-slate-200 font-medium">
                      {new Date(userCreatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-8 flex-wrap">
                <div>
                  <p className="text-2xl font-bold text-amber-400">
                    {stats.total}
                  </p>
                  <p className="text-slate-400 text-sm">Total Reviews</p>
                </div>
              </div>
            </div>

            {/* Create Review Button */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <Link
                href="/dashboard/create-review"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition whitespace-nowrap text-center"
              >
                + Create Review
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("my-reviews")}
            className={`pb-4 px-1 font-semibold transition border-b-2 ${
              activeTab === "my-reviews"
                ? "text-amber-400 border-amber-400"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            ✍️ My Reviews
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/70 transition">
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-slate-400 mt-2">Total Reviews</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/70 transition">
            <p className="text-3xl font-bold text-blue-400">🎬</p>
            <p className="text-xs text-slate-400 mt-2">{stats.movies} Movies</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/70 transition">
            <p className="text-3xl font-bold text-purple-400">🎵</p>
            <p className="text-xs text-slate-400 mt-2">{stats.music} Music</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/70 transition">
            <p className="text-3xl font-bold text-emerald-400">📚</p>
            <p className="text-xs text-slate-400 mt-2">{stats.books} Books</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["all", "movie", "music", "book"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterType === type
                  ? "bg-amber-500 text-black"
                  : "bg-slate-800 text-slate-400 border border-white/5 hover:text-white"
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
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">
              You haven't written any reviews yet.
            </p>
            <Link
              href="/dashboard/create-review"
              className="inline-block px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition"
            >
              Write Your First Review
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((review) => (
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
                      {review.mediaType === "movie"
                        ? "🎬 Movie"
                        : review.mediaType === "music"
                          ? "🎵 Music"
                          : "📚 Book"}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-sm font-semibold">
                    ⭐ {review.rating}/5
                  </span>
                </div>
                <p className="text-slate-300 mb-3">{review.reviewText}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "Recently added"}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/my-reviews/${review.id}`}
                      className="text-amber-400 hover:text-amber-300 text-sm font-medium transition"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
