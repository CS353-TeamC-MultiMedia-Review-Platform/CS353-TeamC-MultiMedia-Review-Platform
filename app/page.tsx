'use client';

import React, { useState, useEffect } from 'react';
import Slider from './components/Slider';

interface Item {
  id: number;
  title: string;
  type: string;
  category: string;
  rating: number;
  featured?: boolean;
  image: string;
  creator: string;
  description: string;
}

export default function Home() {
  const allItems: Item[] = [
    // Movies
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
      featured: false,
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
      title: "Interstellar",
      type: "movie",
      category: "Sci-Fi",
      rating: 4.7,
      featured: false,
      image: "https://images.unsplash.com/photo-1535016120754-fd58615602c5?w=500&h=300&fit=crop",
      creator: "Christopher Nolan",
      description: "Explorers travel through a wormhole to ensure humanity's survival."
    },
    // Music
    {
      id: 6,
      title: "Midnight Echoes",
      type: "music",
      category: "Electronic",
      rating: 4.3,
      featured: true,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
      creator: "Luna Wave",
      description: "A groundbreaking electronic album with ambient soundscapes."
    },
    {
      id: 7,
      title: "Golden Hour",
      type: "music",
      category: "Pop",
      rating: 4.6,
      featured: false,
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
      creator: "Aria Santos",
      description: "Atmospheric pop melodies with synthesizer layers."
    },
    {
      id: 8,
      title: "Rust & Redemption",
      type: "music",
      category: "Rock",
      rating: 4.4,
      featured: false,
      image: "https://images.unsplash.com/photo-1514613535308-eb5405ed5999?w=500&h=300&fit=crop",
      creator: "The Iron Wolves",
      description: "Gritty rock album with powerful vocals and guitar work."
    },
    {
      id: 9,
      title: "Velvet Skies",
      type: "music",
      category: "Jazz",
      rating: 4.5,
      featured: false,
      image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=300&fit=crop",
      creator: "Miles Chen Trio",
      description: "Smooth jazz compositions with improvisation and elegance."
    },
    {
      id: 10,
      title: "Neon Dreams",
      type: "music",
      category: "Electronic",
      rating: 4.2,
      featured: false,
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
      creator: "Synth Wave",
      description: "Retro-futuristic electronic sound with pulsing beats."
    },
    // Books
    {
      id: 11,
      title: "The Memory Garden",
      type: "book",
      category: "Fiction",
      rating: 4.8,
      featured: true,
      image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop",
      creator: "Elena Marquis",
      description: "A captivating tale of memory and redemption."
    },
    {
      id: 12,
      title: "Atomic Habits",
      type: "book",
      category: "Self-Help",
      rating: 4.9,
      featured: false,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=300&fit=crop",
      creator: "James Clear",
      description: "Transform your life through small, consistent habits."
    },
    {
      id: 13,
      title: "Project Hail Mary",
      type: "book",
      category: "Science Fiction",
      rating: 4.7,
      featured: false,
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8f?w=500&h=300&fit=crop",
      creator: "Andy Weir",
      description: "A thrilling space adventure from the author of The Martian."
    },
    {
      id: 14,
      title: "The Invisible Life of Addie LaRue",
      type: "book",
      category: "Fantasy",
      rating: 4.6,
      featured: false,
      image: "https://images.unsplash.com/photo-1543002588-d4d28bde5205?w=500&h=300&fit=crop",
      creator: "V.E. Schwab",
      description: "A captivating tale of a Faustian bargain across the ages."
    },
    {
      id: 15,
      title: "Klara and the Sun",
      type: "book",
      category: "Fiction",
      rating: 4.4,
      featured: false,
      image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop",
      creator: "Kazuo Ishiguro",
      description: "An AI companion's perspective on humanity and love."
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = allItems.filter(i => i.featured);
  const item = featured[currentIndex] || featured[0];

  const movies = allItems.filter(i => i.type === 'movie').sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const music = allItems.filter(i => i.type === 'music').sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const books = allItems.filter(i => i.type === 'book').sort((a, b) => (b.rating || 0) - (a.rating || 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  return (
    <main className="min-h-screen pb-12">
      {/* Featured Carousel */}
      <div className="relative h-[500px] rounded-b-3xl overflow-hidden mb-16">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16">
          <div />
          
          <div>
            <div className="flex gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-600/80 backdrop-blur rounded-full text-xs font-semibold text-white">
                {item.type?.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-amber-500/80 backdrop-blur rounded-full text-xs font-semibold text-black">
                {item.category}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{item.title}</h1>
            <p className="text-slate-200 mb-2 text-lg">{item.creator} (2024)</p>
            <p className="text-amber-400 font-semibold mb-6 text-lg">⭐ {item.rating}</p>
            <p className="text-slate-300 max-w-2xl mb-8 text-base leading-relaxed">{item.description}</p>
            <button className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition transform hover:scale-105">
              View Details
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length)}
              className="p-3 rounded-full bg-white/20 hover:bg-amber-500 transition text-white text-2xl w-12 h-12 flex items-center justify-center"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition ${i === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % featured.length)}
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
        {movies.length > 0 && <Slider title="Popular Movies" items={movies} icon="🎬" />}

        {/* Popular Music Section */}
        {music.length > 0 && <Slider title="Popular Music" items={music} icon="🎵" />}

        {/* Popular Books Section */}
        {books.length > 0 && <Slider title="Popular Books" items={books} icon="📚" />}
      </div>
    </main>
  );
}