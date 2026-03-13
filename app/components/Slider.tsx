'use client';

import React, { useRef } from 'react';

interface Item {
  id: number;
  title: string;
  creator: string;
  rating: number;
  image: string;
}

interface SliderProps {
  title: string;
  items: Item[];
  icon: string;
}

const Slider: React.FC<SliderProps> = ({ title, items, icon }) => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 400;
      if (direction === 'left') {
        scrollContainer.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>

      <div className="relative group">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-amber-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-6"
        >
          ‹
        </button>

        {/* Slider container */}
        <div
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-48 cursor-pointer group/item"
            >
              <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-video h-32">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover/item:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover/item:bg-black/60 transition flex items-center justify-center opacity-0 group-hover/item:opacity-100">
                  <span className="text-3xl text-white">▶</span>
                </div>
              </div>
              <h3 className="font-semibold text-white group-hover/item:text-amber-400 transition line-clamp-2 text-sm mb-1">
                {item.title}
              </h3>
              <p className="text-slate-400 text-xs mb-2">{item.creator}</p>
              <p className="text-amber-400 font-semibold text-sm">⭐ {item.rating}</p>
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-amber-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-6"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Slider;
