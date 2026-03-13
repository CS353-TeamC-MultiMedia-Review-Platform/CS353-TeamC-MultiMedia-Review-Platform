'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface Review {
  id: number;
  title: string;
  type: string;
  rating: number;
  content: string;
}

function MyReviewsContent() {
  const searchParams = useSearchParams();
  const created = searchParams.get('created');

  const reviews: Review[] = [
    {
      id: 1,
      title: 'The Matrix',
      type: 'Movie',
      rating: 5,
      content: 'A groundbreaking sci-fi action film that revolutionized cinema.'
    },
    {
      id: 2,
      title: 'Dune',
      type: 'Movie',
      rating: 4.5,
      content: 'An ambitious epic adaptation with stunning visuals and world-building.'
    }
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Reviews</h1>
              <p className="text-slate-400">Reviews you've written</p>
            </div>
            <Link href="/dashboard" className="text-amber-400 hover:text-amber-300">
              ← Back to Dashboard
            </Link>
          </div>

          {created && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
              <p className="text-green-400 font-medium">✓ Review published successfully!</p>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-slate-800 border border-amber-500/20 rounded-lg p-6 hover:border-amber-500/50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-amber-400 mb-2">{review.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">{review.type} • ⭐ {review.rating}/5</p>
                      <p className="text-slate-300 mb-4">{review.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded transition">
                      Edit
                    </button>
                    <button className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-800/30 border border-white/5 rounded-xl p-12 text-center">
                <p className="text-slate-400 text-lg mb-4">No reviews yet</p>
                <Link
                  href="/dashboard/create-review"
                  className="inline-block px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded transition"
                >
                  Create Your First Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <MyReviewsContent />
    </Suspense>
  );
}
