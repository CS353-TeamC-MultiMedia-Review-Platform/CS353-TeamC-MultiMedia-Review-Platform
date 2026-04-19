"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Slider from "./components/Slider";
import {
  getPopularMovies,
  getTrendingMovies,
  MovieItem,
} from "./services/mediaService";

export default function Home() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [popularMoviesData, trendingMoviesData] = await Promise.all([
          getPopularMovies(),
          getTrendingMovies(),
        ]);

        // Combine and deduplicate movies by ID
        const allMovies = [
          ...(trendingMoviesData || []),
          ...(popularMoviesData || []),
        ];
        const uniqueMovies = Array.from(
          new Map(allMovies.map((movie) => [movie.id, movie])).values(),
        );
        setMovies(uniqueMovies && uniqueMovies.length > 0 ? uniqueMovies : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Featured carousel using first 6 movies
  const featured = movies.slice(0, 6);
  const item = featured[currentIndex] || featured[0];

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  return (
    <main className="min-h-screen pb-12">
      {loading ? (
        <div className="flex items-center justify-center h-[500px] bg-slate-900 text-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p>Loading movies...</p>
          </div>
        </div>
      ) : featured.length > 0 && item ? (
        <>
          {/* Featured Carousel */}
          <div className="relative h-[500px] rounded-b-3xl overflow-hidden mb-16">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: `url(${item.backdropPath || item.posterPath})`,
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16">
              <div />

              <div>
                <div className="flex gap-3 mb-6">
                  <span className="px-3 py-1 bg-amber-500/80 backdrop-blur rounded-full text-xs font-semibold text-black">
                    NOW IN CINEMAS
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {item.title}
                </h1>
                <p className="text-slate-200 mb-2 text-lg">
                  {item.releaseDate}
                </p>
                <p className="text-amber-400 font-semibold mb-6 text-lg">
                  ⭐ {item.rating}/10
                </p>
                <p className="text-slate-300 max-w-2xl mb-8 text-base leading-relaxed line-clamp-3">
                  {item.overview}
                </p>
                <Link
                  href={`/movies/${item.id}`}
                  onClick={() => localStorage.setItem(`movie-${item.id}`, JSON.stringify(item))}
                  className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition transform hover:scale-105"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => (prev - 1 + featured.length) % featured.length,
                    )
                  }
                  className="p-3 rounded-full bg-white/20 hover:bg-amber-500 transition text-white text-2xl w-12 h-12 flex items-center justify-center"
                >
                  ‹
                </button>
                <div className="flex gap-2">
                  {featured.map((_, i) => (
                    <button
                      key={`dot-${i}`}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition ${i === currentIndex ? "w-8 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/60"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % featured.length)
                  }
                  className="p-3 rounded-full bg-white/20 hover:bg-amber-500 transition text-white text-2xl w-12 h-12 flex items-center justify-center"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Popular Movies Section */}
            {movies.length > 0 && (
              <Slider title="Popular Movies" items={movies} icon="🎬" />
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[500px] bg-slate-900 text-white">
          <p>No content available at this time.</p>
        </div>
      )}
    </main>
  );
}
