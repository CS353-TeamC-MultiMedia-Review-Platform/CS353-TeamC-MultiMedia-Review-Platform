'use client';

export default function ReviewsPage() {
  const reviews = [
    { id: 1, title: "Dune: Part Two", rating: 4.5, author: "Denis Villeneuve", type: "Movie", review: "A visually stunning continuation with excellent world-building.", date: "2024-02-15" },
    { id: 2, title: "Oppenheimer", rating: 4.8, author: "Christopher Nolan", type: "Movie", review: "A masterpiece exploring the human cost of innovation.", date: "2024-01-20" },
    { id: 3, title: "The Great Gatsby", rating: 4.8, author: "F. Scott Fitzgerald", type: "Book", review: "A timeless classic about the American dream.", date: "2024-01-10" },
  ];

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⭐</span>
          <h1 className="text-4xl font-bold text-white">All Reviews</h1>
        </div>
        <p className="text-slate-400 text-sm">{reviews.length} reviews from community</p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-slate-800/30 border border-white/5 rounded-xl p-6 hover:border-white/10 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{review.title}</h3>
                <p className="text-sm text-slate-400">{review.type} • {review.author}</p>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-sm font-semibold">
                ⭐ {review.rating}
              </span>
            </div>
            <p className="text-slate-300 mb-3">{review.review}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
              <button className="text-amber-400 hover:text-amber-300 text-sm font-medium transition">
                Read Full Review →
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 text-slate-400">No reviews yet</div>
      )}
    </main>
  );
}
