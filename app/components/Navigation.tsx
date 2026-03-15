'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/';
    setIsLoggedIn(false);
    router.push('/login');
  };

  const isActive = (href: string) => {
    return pathname === href ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-300 hover:text-white';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">★</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:inline">Critiq</span>
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`pb-2 transition ${isActive('/')}`}>
              Home
            </Link>
            <Link href="/movies" className={`pb-2 transition ${isActive('/movies')}`}>
              Movies
            </Link>
            <Link href="/music" className={`pb-2 transition ${isActive('/music')}`}>
              Music
            </Link>
            <Link href="/books" className={`pb-2 transition ${isActive('/books')}`}>
              Books
            </Link>
            <Link href="/reviews" className={`pb-2 transition ${isActive('/reviews')}`}>
              Reviews
            </Link>
            {isLoggedIn && (
              <Link href="/dashboard" className={`pb-2 transition ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Search & Auth */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg px-3 py-2 border border-white/10">
              <input
                type="text"
                placeholder="Search movies, music, books"
                className="bg-transparent text-slate-300 placeholder-slate-500 outline-none text-sm w-48"
              />
            </div>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-sm font-medium transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
