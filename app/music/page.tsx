'use client';

import { useState, useEffect } from 'react';
import { getPopularMusic, searchMusic, MusicItem } from '@/services/mediaService';

export default function AllMusic() {
  const [albums, setAlbums] = useState<MusicItem[]>([]);
  const [filtered, setFiltered] = useState<MusicItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rating' | 'title'>('rating');

  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const data = await getPopularMusic();
        setAlbums(data || []);
        setFiltered(data || []);
      } catch (error) {
        console.error('Error fetching music:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    if (query.trim()) {
      const results = await searchMusic(query);
      setAlbums(results || []);
      setFiltered(results || []);
    } else {
      const data = await getPopularMusic();
      setAlbums(data || []);
      setFiltered(data || []);
    }
    setLoading(false);
  };

  const handleSort = (criteria: 'rating' | 'title') => {
    setSortBy(criteria);
    const sorted = [...filtered].sort((a, b) => {
      if (criteria === 'rating') {
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
          <span className="text-3xl">🎵</span>
          <h1 className="text-4xl font-bold text-white">All Music</h1>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search albums and artists..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-amber-500"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm">{filtered.length} albums found</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('rating')}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                sortBy === 'rating'
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Sort by ⭐ Rating
            </button>
            <button
              onClick={() => handleSort('title')}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                sortBy === 'title'
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Sort by Title
            </button>
          </div>
        </div>
      </div>

      {/* Music Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-slate-400">Loading music...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((album) => (
            <div key={album.id} className="group cursor-pointer h-full">
              <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-square">
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Album';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-4xl text-white">▶</span>
                </div>
              </div>
              <h3 className="font-semibold text-white group-hover:text-amber-400 transition line-clamp-2">
                {album.title}
              </h3>
              <p className="text-slate-400 text-sm mb-2">{album.artist}</p>
              <p className="text-purple-400 font-semibold">⭐ {album.rating.toFixed(1)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">No music found. Try a different search.</p>
        </div>
      )}
    </main>
  );
}
