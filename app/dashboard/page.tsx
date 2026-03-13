'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Review {
  id: number;
  title: string;
  type: 'movie' | 'music' | 'book';
  category: string;
  rating: number;
  userRating: number;
  myReview: string;
  dateAdded: string;
  image: string;
}

export default function DashboardPage() {
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('my-library');

  // Sample user data
  const userProfile = {
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    joinDate: 'January 2024',
    totalReviews: 8,
    followers: 234,
    following: 156,
  };

  const myLibrary: Review[] = [
    {
      id: 1,
      title: "Dune: Part Two",
      type: "movie",
      category: "Sci-Fi",
      rating: 4.5,
      userRating: 5,
      myReview: "An epic continuation with stunning visuals and compelling storytelling.",
      dateAdded: "2 weeks ago",
      image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=80&h=80&fit=crop"
    },
    {
      id: 2,
      title: "Atomic Habits",
      type: "book",
      category: "Self-Help",
      rating: 4.9,
      userRating: 5,
      myReview: "Life-changing insights into building better habits through small, consistent actions.",
      dateAdded: "1 month ago",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=80&h=80&fit=crop"
    },
    {
      id: 3,
      title: "Golden Hour",
      type: "music",
      category: "Pop",
      rating: 4.6,
      userRating: 4,
      myReview: "Beautiful melodies but some tracks feel a bit repetitive towards the end.",
      dateAdded: "3 weeks ago",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop"
    },
  ];

  const stats = {
    total: myLibrary.length,
    movies: myLibrary.filter(i => i.type === 'movie').length,
    music: myLibrary.filter(i => i.type === 'music').length,
    books: myLibrary.filter(i => i.type === 'book').length,
  };

  const filtered = filterType === 'all' ? myLibrary : myLibrary.filter(i => i.type === (filterType === 'movie' ? 'movie' : filterType === 'music' ? 'music' : 'book'));

  return (
    <div className="min-h-screen pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-amber-600/20 via-slate-900 to-slate-950 border-b border-white/10 mb-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-20 h-20 rounded-full border-2 border-amber-500"
            />

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{userProfile.name}</h1>
              <p className="text-slate-400 mb-4">Member since {userProfile.joinDate}</p>
              <div className="flex gap-8 flex-wrap">
                <div>
                  <p className="text-2xl font-bold text-white">{userProfile.followers}</p>
                  <p className="text-slate-400 text-sm">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{userProfile.following}</p>
                  <p className="text-slate-400 text-sm">Following</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">{userProfile.totalReviews}</p>
                  <p className="text-slate-400 text-sm">Reviews</p>
                </div>
              </div>
            </div>

            {/* Edit and Create Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <Link
                href="/dashboard/create-review"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition whitespace-nowrap text-center"
              >
                + Create Review
              </Link>
              <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition whitespace-nowrap">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('my-library')}
            className={`pb-4 px-1 font-semibold transition border-b-2 ${
              activeTab === 'my-library'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            📚 My Library
          </button>
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`pb-4 px-1 font-semibold transition border-b-2 ${
              activeTab === 'my-reviews'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            ✍️ My Reviews
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-4 px-1 font-semibold transition border-b-2 ${
              activeTab === 'saved'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            ❤️ Saved Items
          </button>
        </div>

        {/* Library View */}
        {activeTab === 'my-library' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/70 transition">
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-slate-400 mt-2">Total Items</p>
              </div>
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/70 transition">
                <p className="text-3xl font-bold text-blue-400">🎬</p>
                <p className="text-xs text-slate-400 mt-2">{stats.movies} Movies</p>
              </div>
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/70 transition">
                <p className="text-3xl font-bold text-purple-400">🎵</p>
                <p className="text-xs text-slate-400 mt-2">{stats.music} Music</p>
              </div>
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/70 transition">
                <p className="text-3xl font-bold text-emerald-400">📚</p>
                <p className="text-xs text-slate-400 mt-2">{stats.books} Books</p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap mb-6">
              {['all', 'movie', 'music', 'book'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterType === type
                      ? 'bg-amber-500 text-black'
                      : 'bg-slate-800 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All Items' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                </button>
              ))}
            </div>

            {/* Library Items */}
            <div className="space-y-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/30 border border-white/5 rounded-xl p-5 hover:bg-slate-800/50 transition flex gap-5"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="text-slate-400 text-sm">{item.category}</p>
                      </div>
                      <div className="flex gap-2 items-center flex-shrink-0">
                        <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">{item.dateAdded}</span>
                        <span className="text-amber-400 font-semibold">⭐ {item.userRating}/5</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm line-clamp-2">{item.myReview}</p>
                  </div>
                  <button className="px-4 py-2 text-amber-400 hover:bg-amber-500/20 rounded transition flex-shrink-0">
                    ✎ Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews View */}
        {activeTab === 'my-reviews' && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">You haven't written any standalone reviews yet.</p>
            <Link href="/dashboard/create-review" className="inline-block mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition">
              Write Your First Review
            </Link>
          </div>
        )}

        {/* Saved Items View */}
        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">You haven't saved any items yet.</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition">
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
