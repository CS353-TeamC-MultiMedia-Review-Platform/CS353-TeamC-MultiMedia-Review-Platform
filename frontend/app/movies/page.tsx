"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getPopularMovies,
  searchMovies,
  MovieItem,
} from "@/services/mediaService";

export default function AllMovies() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [filtered, setFiltered] = useState<MovieItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"rating" | "title">("rating");

  const sortOptions = ["rating", "title"] as const;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await getPopularMovies();
        setMovies(data || []);
        setFiltered(data || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);

    if (query.trim()) {
      const results = await searchMovies(query);
      setMovies(results || []);
      setFiltered(results || []);
    } else {
      const data = await getPopularMovies();
      setMovies(data || []);
      setFiltered(data || []);
    }
    setLoading(false);
  };

  const handleSort = (criteria: "rating" | "title") => {
    setSortBy(criteria);
    const sorted = [...filtered].sort((a, b) => {
      if (criteria === "rating") {
        return b.rating - a.rating;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    setFiltered(sorted);
  };

  const handleMovieClick = (movie: MovieItem) => {
    // Store movie details in localStorage for the detail page
    localStorage.setItem(`movie-${movie.id}`, JSON.stringify(movie));
  };

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎬</span>
          <h1 className="text-4xl font-bold text-white">All Movies</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm">
            {filtered.length} movies found
          </p>
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleSort(option)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  sortBy === option
                    ? "bg-amber-500 text-black"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Sort by {option === "rating" ? "⭐ Rating" : "Title"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-slate-400">Loading movies...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              onClick={() => handleMovieClick(movie)}
              className="group cursor-pointer h-full"
            >
              <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-[3/4]">
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/500x750?text=No+Poster";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-4xl text-white">▶</span>
                </div>
              </div>
              <h3 className="font-semibold text-white group-hover:text-amber-400 transition line-clamp-2">
                {movie.title}
              </h3>
              <p className="text-slate-400 text-sm mb-2">{movie.releaseDate}</p>
              <p className="text-amber-400 font-semibold">
                ⭐ {movie.rating}/10
              </p>
              {movie.overview && (
                <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                  {movie.overview}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">
            No movies found. Try a different search.
          </p>
        </div>
      )}
    </main>
  );
}
