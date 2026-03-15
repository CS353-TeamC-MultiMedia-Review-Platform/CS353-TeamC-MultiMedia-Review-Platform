'use client';

import { useState } from 'react';

export default function AllMovies() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const movies = [
    { id: 1, title: "Dune: Part Two", category: "Sci-Fi", rating: 4.5, image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=400&fit=crop", creator: "Denis Villeneuve" },
    { id: 2, title: "Oppenheimer", category: "Drama", rating: 4.8, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7144?w=300&h=400&fit=crop", creator: "Christopher Nolan" },
    { id: 3, title: "The Batman", category: "Action", rating: 4.2, image: "https://images.unsplash.com/photo-1576869831296-c6476b4fe2bf?w=300&h=400&fit=crop", creator: "Matt Reeves" },
    { id: 4, title: "Everything Everywhere All at Once", category: "Sci-Fi", rating: 5, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop", creator: "Daniel Kwan" },
  ];

  const categories = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Documentary', 'Animation'];

  const filtered = activeCategory
    ? movies.filter((m) => m.category === activeCategory)
    : movies;

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎬</span>
          <h1 className="text-4xl font-bold text-white">All Movies</h1>
        </div>
        <p className="text-slate-400 text-sm">{movies.length} movies in library</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCategory === null
              ? 'bg-amber-500 text-black'
              : 'bg-slate-800 text-slate-400 border border-white/5 hover:text-white'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-amber-500 text-black'
                : 'bg-slate-800 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((movie) => (
          <div key={movie.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-[3/4]">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition">
                  <span className="text-4xl">▶</span>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 transition">{movie.title}</h3>
            <p className="text-slate-400 text-sm">{movie.creator}</p>
            <p className="text-yellow-400 font-semibold mt-2">⭐ {movie.rating}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">No movies found in this category</div>
      )}
    </main>
  );
}
