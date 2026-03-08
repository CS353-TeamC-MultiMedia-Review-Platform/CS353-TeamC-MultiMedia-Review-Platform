'use client';

import { useState } from 'react';

export default function AllMusic() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const music = [
    { id: 1, title: "Midnight Echoes", category: "Electronic", rating: 4.3, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", creator: "Luna Wave" },
    { id: 2, title: "Urban Beats", category: "Hip Hop", rating: 4.6, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop", creator: "DJ Flow" },
    { id: 3, title: "Classical Harmony", category: "Classical", rating: 4.9, image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop", creator: "Symphony Orchestra" },
    { id: 4, title: "Jazz Nights", category: "Jazz", rating: 4.7, image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop", creator: "Jazz Quartet" },
  ];

  const categories = ['Blues', 'Classical', 'Country', 'Electronic', 'Hip Hop', 'Jazz', 'Pop', 'Rock', 'Soul'];

  const filtered = activeCategory
    ? music.filter((m) => m.category === activeCategory)
    : music;

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎵</span>
          <h1 className="text-4xl font-bold text-white">All Music</h1>
        </div>
        <p className="text-slate-400 text-sm">{music.length} albums in library</p>
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

      {/* Music Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((album) => (
          <div key={album.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-square">
              <img
                src={album.image}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition">
                  <span className="text-4xl">▶</span>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 transition">{album.title}</h3>
            <p className="text-slate-400 text-sm">{album.creator}</p>
            <p className="text-purple-400 font-semibold mt-2">⭐ {album.rating}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">No albums found in this category</div>
      )}
    </main>
  );
}
