'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  // Sample data - in real app, this would come from an API
  const allItems = [
    {
      id: 1,
      title: "Dune: Part Two",
      type: "movie",
      category: "Sci-Fi",
      rating: 4.5,
      featured: true,
      image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&h=300&fit=crop",
      creator: "Denis Villeneuve",
      description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge."
    },
    {
      id: 2,
      title: "Oppenheimer",
      type: "movie",
      category: "Drama",
      rating: 4.8,
      featured: true,
      image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7144?w=500&h=300&fit=crop",
      creator: "Christopher Nolan",
      description: "The story of American scientist J. Robert Oppenheimer."
    },
    {
      id: 3,
      title: "The Batman",
      type: "movie",
      category: "Action",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1576869831296-c6476b4fe2bf?w=500&h=300&fit=crop",
      creator: "Matt Reeves",
      description: "A thrilling neo-noir take on the Batman universe."
    },
    {
      id: 4,
      title: "Everything Everywhere All at Once",
      type: "movie",
      category: "Sci-Fi",
      rating: 5,
      featured: true,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=300&fit=crop",
      creator: "Daniel Kwan",
      description: "An imaginative and emotional multiverse adventure."
    },
    {
      id: 5,
      title: "Midnight Echoes",
      type: "music",
      category: "Electronic",
      rating: 4.3,
      featured: true,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
      creator: "Luna Wave",
      description: "A groundbreaking electronic album with ambient soundscapes."
    },
  ];

  const featured = allItems.filter(i => i.featured);
  const [currentIndex, setCurrentIndex] = useState(0);
  const item = featured[currentIndex] || featured[0];

  const movies = allItems.filter(i => i.type === 'movie').sort((a, b) => (b.rating || 0) - (a.rating || 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const MediaSection = ({ title, items, color }: any) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.slice(0, 8).map((item: any) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-video">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition">
                  <span className="text-3xl">▶</span>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 transition">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.creator}</p>
            <p className={`${color} font-semibold mt-2`}>⭐ {item.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Featured Carousel */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-blue-600/80 rounded-full text-xs font-semibold text-white">
              {item.type?.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-amber-500/80 rounded-full text-xs font-semibold text-black">
              {item.category}
            </span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{item.title}</h1>
            <p className="text-slate-200 mb-2">{item.creator} (2024)</p>
            <p className="text-amber-400 font-semibold mb-6">⭐ {item.rating}</p>
            <p className="text-slate-300 max-w-2xl mb-8 text-lg">{item.description}</p>
            <button className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition">
              View Details
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition text-white text-2xl"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition ${i === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % featured.length)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition text-white text-2xl"
            >
              ›
            </button>
          </div>
        </div>
      </div>
      
      {/* Popular Movies Section */}
      {movies.length > 0 && <MediaSection title="Popular Movies" items={movies} color="text-blue-400" />}
    </main>
  );
}