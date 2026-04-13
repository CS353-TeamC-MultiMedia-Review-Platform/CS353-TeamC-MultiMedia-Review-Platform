"use client";

import Link from "next/link";

export default function BrowsePage() {
  return (
    <div className="min-h-screen pb-12\">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Browse Community Reviews
          </h1>
          <p className="text-slate-400">
            Discover reviews shared by the community
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-800/30 border border-white/5 rounded-xl p-8 text-center">
            <p className="text-slate-400 text-lg mb-4">
              Community reviews feature coming soon
            </p>
            <Link
              href="/dashboard"
              className="text-amber-400 hover:text-amber-300"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
