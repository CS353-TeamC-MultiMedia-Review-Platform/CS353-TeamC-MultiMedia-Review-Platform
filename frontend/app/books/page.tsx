"use client";

import { useState, useEffect } from "react";
import {
  getPopularBooks,
  searchBooks,
  BookItem,
} from "@/services/mediaService";

export default function AllBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [filtered, setFiltered] = useState<BookItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"rating" | "title">("rating");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        console.log("[Books Page] Fetching popular books...");
        const data = await getPopularBooks();
        console.log("[Books Page] Got books:", data.length, data);
        setBooks(data || []);
        setFiltered(data || []);
      } catch (error) {
        console.error("[Books Page] Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);

    if (query.trim()) {
      const results = await searchBooks(query);
      setBooks(results || []);
      setFiltered(results || []);
    } else {
      const data = await getPopularBooks();
      setBooks(data || []);
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

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📚</span>
          <h1 className="text-4xl font-bold text-white">All Books</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books and authors..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm">
            {filtered.length} books found
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort("rating")}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                sortBy === "rating"
                  ? "bg-amber-500 text-black"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Sort by ⭐ Rating
            </button>
            <button
              onClick={() => handleSort("title")}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                sortBy === "title"
                  ? "bg-amber-500 text-black"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Sort by Title
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-slate-400">Loading books...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((book) => (
            <div key={book.id} className="group cursor-pointer h-full">
              <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-[3/4]">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/200x300?text=Book";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-4xl text-white">▶</span>
                </div>
              </div>
              <h3 className="font-semibold text-white group-hover:text-amber-400 transition line-clamp-2">
                {book.title}
              </h3>
              <p className="text-slate-400 text-sm mb-2">{book.author}</p>
              <p className="text-emerald-400 font-semibold">
                ⭐ {book.rating.toFixed(1)}
              </p>
              {book.year && (
                <p className="text-slate-500 text-xs mt-1">{book.year}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">
            No books found. Try a different search.
          </p>
        </div>
      )}
    </main>
  );
}
