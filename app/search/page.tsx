'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { searchMovies, MovieItem } from '@/services/mediaService';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      searchMovies(query).then(data => {
        setResults(data || []);
        setLoading(false);
      });
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen pb-12">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="py-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search Results</h1>
          {query && (
            <p className="text-slate-300">
              Found <span className="font-semibold text-amber-400">{results.length}</span> result{results.length !== 1 ? 's' : ''} for "<span className="font-semibold">{query}</span>"
            </p>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Searching movies...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <div key={item.id} className="group cursor-pointer h-full">
                <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-[3/4]">
                  <img
                    src={item.posterPath}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Poster';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-3xl text-white">▶</span>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="font-semibold text-white group-hover:text-amber-400 transition line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">{item.releaseDate}</p>
                  <p className="text-amber-400 font-semibold">⭐ {item.rating}/10</p>
                  {item.overview && (
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2">{item.overview}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-6">No movies found for "{query}"</p>
            <div>
              <p className="text-slate-500 mb-4">Try searching with different keywords</p>
              <Link href="/" className="text-amber-400 hover:text-amber-300">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Enter a search term to find movies</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
