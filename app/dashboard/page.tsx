'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [filterType, setFilterType] = useState('all');

  // Sample data
  const items = [
    { id: 1, title: "Dune: Part Two", type: "movie", category: "Sci-Fi", rating: 4.5, featured: true, image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=40&h=40&fit=crop" },
    { id: 2, title: "Oppenheimer", type: "movie", category: "Drama", rating: 4.8, featured: true, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7144?w=40&h=40&fit=crop" },
    { id: 3, title: "The Batman", type: "movie", category: "Action", rating: 4.2, featured: false, image: "https://images.unsplash.com/photo-1576869831296-c6476b4fe2bf?w=40&h=40&fit=crop" },
  ];

  const filtered = filterType === 'all' ? items : items.filter(i => i.type === filterType);

  const stats = {
    total: items.length,
    movies: items.filter(i => i.type === 'movie').length,
    music: items.filter(i => i.type === 'music').length,
    books: items.filter(i => i.type === 'book').length,
    reviews: 0,
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your media library</p>
        </div>
        <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition flex items-center gap-2">
          <span>+</span> Add Item
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-2">Total</p>
        </div>
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
          <p className="text-2xl font-bold text-blue-400">{stats.movies}</p>
          <p className="text-xs text-slate-400 mt-2">Movies</p>
        </div>
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
          <p className="text-2xl font-bold text-purple-400">{stats.music}</p>
          <p className="text-xs text-slate-400 mt-2">Music</p>
        </div>
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
          <p className="text-2xl font-bold text-emerald-400">{stats.books}</p>
          <p className="text-xs text-slate-400 mt-2">Books</p>
        </div>
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
          <p className="text-2xl font-bold text-pink-400">{stats.reviews}</p>
          <p className="text-xs text-slate-400 mt-2">Reviews</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'movie', 'music', 'book'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterType === type
                ? 'bg-amber-500 text-black'
                : 'bg-slate-800 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Items Table */}
      <div className="bg-slate-800/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                <th className="text-left p-4 text-slate-400 font-medium hidden sm:table-cell">Type</th>
                <th className="text-left p-4 text-slate-400 font-medium hidden md:table-cell">Category</th>
                <th className="text-left p-4 text-slate-400 font-medium hidden md:table-cell">Rating</th>
                <th className="text-left p-4 text-slate-400 font-medium hidden lg:table-cell">Featured</th>
                <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-white font-medium">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 capitalize hidden sm:table-cell">{item.type}</td>
                  <td className="p-4 text-slate-400 hidden md:table-cell">{item.category || '—'}</td>
                  <td className="p-4 hidden md:table-cell">
                    {item.rating ? (
                      <span className="text-amber-300 font-semibold">{item.rating.toFixed(1)}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    {item.featured && <span className="text-amber-400 text-xs font-semibold">★ Featured</span>}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                        ✏️
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No items found</div>
        )}
      </div>
    </div>
  );
}
