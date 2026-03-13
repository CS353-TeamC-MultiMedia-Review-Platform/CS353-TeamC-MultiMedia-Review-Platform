'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

interface SearchResult {
  id: number;
  title: string;
  type: string;
  creator: string;
  rating: number;
  image: string;
  category: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Mock search results - in real app, this would come from an API
  const allItems: SearchResult[] = [
    {
      id: 1,
      title: "Dune: Part Two",
      type: "movie",
      creator: "Denis Villeneuve",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&h=300&fit=crop",
      category: "Sci-Fi"
    },
    {
      id: 2,
      title: "Oppenheimer",
      type: "movie",
      creator: "Christopher Nolan",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7144?w=500&h=300&fit=crop",
      category: "Drama"
    },
    {
      id: 3,
      title: "Golden Hour",
      type: "music",
      creator: "Aria Santos",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
      category: "Pop"
    },
    {
      id: 4,
      title: "The Memory Garden",
      type: "book",
      creator: "Elena Marquis",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop",
      category: "Fiction"
    },
    {
      id: 5,
      title: "Atomic Habits",
      type: "book",
      creator: "James Clear",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=300&fit=crop",
      category: "Self-Help"
    },
  ];

  const results = query
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.creator.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <Link key={item.id} href={`/${item.type}s/${item.id}`}>
                <div className="group cursor-pointer h-full">
                  <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-video h-40">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-3xl text-white">▶</span>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                        {item.type.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-amber-500/20 rounded text-xs text-amber-300">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition text-lg line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">{item.creator}</p>
                    <p className="text-amber-400 font-semibold">⭐ {item.rating}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-6">No results found for "{query}"</p>
            <div>
              <p className="text-slate-500 mb-4">Try searching with different keywords</p>
              <Link href="/" className="text-amber-400 hover:text-amber-300">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Enter a search term to find movies, music, and books</p>
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
