'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    email: 'alex@example.com',
    bio: 'A passionate reviewer of movies, books, and music.',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="py-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-400">Manage your profile information</p>
        </div>

        <div className="bg-slate-800/30 border border-white/5 rounded-xl p-8">
          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm">Name</p>
                <p className="text-white text-lg font-semibold mt-1">{profile.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white text-lg font-semibold mt-1">{profile.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Bio</p>
                <p className="text-white text-lg font-semibold mt-1">{profile.bio}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Location</p>
                <p className="text-white text-lg font-semibold mt-1">{profile.location}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Member Since</p>
                <p className="text-white text-lg font-semibold mt-1">{profile.joinDate}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full mt-1 bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full mt-1 bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="w-full mt-1 bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className="w-full mt-1 bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link href="/dashboard" className="text-amber-400 hover:text-amber-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
