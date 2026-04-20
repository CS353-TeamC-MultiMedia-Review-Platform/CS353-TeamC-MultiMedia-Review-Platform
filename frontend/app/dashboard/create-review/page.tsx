"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthToken, getUserId, getUserName } from "../../lib/authStorage";
import { buildApiUrl, API_ENDPOINTS } from "../../lib/api";

interface ReviewFormData {
  rating: number;
  reviewText: string;
  mediaTitle: string;
  mediaType: "movie" | "music" | "book";
}

export default function CreateReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    reviewText: "",
    mediaTitle: "",
    mediaType: "movie",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    if (!formData.reviewText.trim()) {
      newErrors.reviewText = "Review text is required";
    } else if (formData.reviewText.trim().length < 10) {
      newErrors.reviewText = "Review must be at least 10 characters";
    } else if (formData.reviewText.length > 2000) {
      newErrors.reviewText = "Review cannot exceed 2000 characters";
    }

    if (!formData.mediaTitle.trim()) {
      newErrors.mediaTitle = "Please select or enter a media title";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      // Get user info from localStorage
      const userId = getUserId();
      const userName = getUserName();

      if (!userId) {
        setErrors({ general: "You must be logged in to create a review" });
        router.push("/login");
        return;
      }

      // Prepare request payload (createdAt is set by backend)
      const payload = {
        userId,
        userName: userName || "Anonymous",
        rating: formData.rating,
        reviewText: formData.reviewText,
        mediaTitle: formData.mediaTitle,
        mediaType: formData.mediaType,
      };

      // Send to backend
      const response = await fetch(buildApiUrl(API_ENDPOINTS.CREATE_REVIEW), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to create review" });
        return;
      }

      // Success - redirect to my-reviews
      router.push("/dashboard/my-reviews?created=true");
    } catch (error) {
      console.error("Error creating review:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-0 pb-12 bg-slate-900">
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="py-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Create Review
              </h1>
              <p className="text-slate-400">
                Share your thoughts on a movie, album, or book
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-amber-400 hover:text-amber-300"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-slate-800 border border-amber-500/20 rounded-lg p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 font-medium">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Media Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                What are you reviewing?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Media Type
                  </label>
                  <select
                    name="mediaType"
                    value={formData.mediaType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="movie">🎬 Movie</option>
                    <option value="music">🎵 Music / Album</option>
                    <option value="book">📚 Book</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="mediaTitle"
                    value={formData.mediaTitle}
                    onChange={handleChange}
                    placeholder={`Enter ${formData.mediaType === "music" ? "album/artist" : formData.mediaType} title`}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  {errors.mediaTitle && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.mediaTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-4">
              <label className="block text-xl font-semibold text-white">
                Your Rating *
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                    className={`w-16 h-16 text-3xl rounded-lg transition transform ${
                      formData.rating >= star
                        ? "bg-amber-500 text-white scale-110"
                        : "bg-slate-700 text-slate-500 hover:bg-slate-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                Rating:{" "}
                <span className="text-amber-400 font-semibold">
                  {formData.rating}/5
                </span>
              </p>
              {errors.rating && (
                <p className="text-sm text-red-400">{errors.rating}</p>
              )}
            </div>

            {/* Review Text */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xl font-semibold text-white">
                  Your Review *
                </label>
                <span className="text-sm text-slate-400">
                  {formData.reviewText.length}/2000
                </span>
              </div>
              <textarea
                name="reviewText"
                value={formData.reviewText}
                onChange={handleChange}
                placeholder="Share your thoughts... (minimum 10 characters)"
                rows={8}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
              />
              {errors.reviewText && (
                <p className="text-sm text-red-400">{errors.reviewText}</p>
              )}
              <p className="text-sm text-slate-400">
                Minimum 10 characters • Maximum 2000 characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition transform hover:scale-105"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Publishing
                    Review...
                  </span>
                ) : (
                  "Publish Review"
                )}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            💡 Tips for a Great Review
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li>• Be specific about what you liked or didn't like</li>
            <li>
              • Mention key performances, plot points, or production details
            </li>
            <li>• Compare it to similar works if relevant</li>
            <li>• Keep it respectful and constructive</li>
            <li>• Avoid major spoilers or warn readers beforehand</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
