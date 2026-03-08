'use client';

import { useState } from 'react';

export default function AllBooks() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const books = [
    { id: 1, title: "The Great Gatsby", category: "Fiction", rating: 4.8, image: "https://images.unsplash.com/photo-1543002588-d83cedbc4baf?w=300&h=400&fit=crop", creator: "F. Scott Fitzgerald" },
    { id: 2, title: "To Kill a Mockingbird", category: "Drama", rating: 4.9, image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop", creator: "Harper Lee" },
    { id: 3, title: "1984", category: "Dystopian", rating: 4.7, image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop", creator: "George Orwell" },
    { id: 4, title: "Pride and Prejudice", category: "Romance", rating: 4.8, image: "https://images.unsplash.com/photo-1502494793896-f5df769eecfa?w=300&h=400&fit=crop", creator: "Jane Austen" },
  ];

  const categories = ['Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Drama', 'Non-Fiction', 'Biography', 'Dystopian'];

  const filtered = activeCategory
    ? books.filter((b) => b.category === activeCategory)
    : books;

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📚</span>
          <h1 className="text-4xl font-bold text-white">All Books</h1>
        </div>
        <p className="text-slate-400 text-sm">{books.length} books in library</p>
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

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((book) => (
          <div key={book.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-800 aspect-[3/4]">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition">
                  <span className="text-4xl">▶</span>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 transition">{book.title}</h3>
            <p className="text-slate-400 text-sm">{book.creator}</p>
            <p className="text-emerald-400 font-semibold mt-2">⭐ {book.rating}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">No books found in this category</div>
      )}
    </main>
  );
}
