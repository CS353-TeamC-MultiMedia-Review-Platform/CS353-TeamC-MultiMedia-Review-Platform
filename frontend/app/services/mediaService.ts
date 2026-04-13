// TMDB Movie Database Service
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_PLACEHOLDER = 'https://via.placeholder.com/500x750?text=No+Poster';

// Log API key status on mount (for debugging)
if (typeof window !== 'undefined') {
  console.log('[TMDB Service] API Key configured:', !!TMDB_API_KEY);
  if (!TMDB_API_KEY) {
    console.error('[TMDB Service] WARNING: No API key found. Check .env.local');
  }
}

export interface MovieItem {
  id: number;
  title: string;
  posterPath: string;
  backdropPath?: string;
  rating: number;
  releaseDate: string;
  overview: string;
  genres?: string[];
  runtime?: number;
  budget?: number;
  revenue?: number;
}

export interface MediaItem {
  id: string | number;
  title: string;
  image: string;
  rating: number;
  creator?: string;
  description?: string;
  type: 'movie' | 'book' | 'music';
}

// ── MOVIES (TMDB) ──────────────────────────────────────────

/**
 * Fetches popular movies from TMDB API
 */
export async function getPopularMovies(page: number = 1): Promise<MovieItem[]> {
  try {
    if (!TMDB_API_KEY) {
      console.error('TMDB API key not configured in .env.local');
      return [];
    }

    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000) 
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      console.warn('No results returned from TMDB popular movies endpoint');
      return [];
    }

    return data.results.slice(0, 20).map((movie: any) => ({
      id: movie.id,
      title: movie.title || 'Untitled',
      posterPath: movie.poster_path 
        ? `${TMDB_IMAGE_BASE}${movie.poster_path}` 
        : TMDB_PLACEHOLDER,
      backdropPath: movie.backdrop_path
        ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
        : undefined,
      rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
      releaseDate: movie.release_date || 'N/A',
      overview: movie.overview || '',
    }));
  } catch (error) {
    console.error('[TMDB Service] Error fetching popular movies:', error);
    if (error instanceof Error) {
      console.error('[TMDB Service] Error details:', error.message);
    }
    return [];
  }
}

/**
 * Searches for movies by query string
 */
export async function searchMovies(query: string, page: number = 1): Promise<MovieItem[]> {
  if (!query?.trim()) return [];

  try {
    if (!TMDB_API_KEY) return [];

    const encodedQuery = encodeURIComponent(query.trim());
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}&language=en-US&page=${page}`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000) 
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.slice(0, 20).map((movie: any) => ({
      id: movie.id,
      title: movie.title || 'Untitled',
      posterPath: movie.poster_path 
        ? `${TMDB_IMAGE_BASE}${movie.poster_path}` 
        : TMDB_PLACEHOLDER,
      backdropPath: movie.backdrop_path
        ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
        : undefined,
      rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
      releaseDate: movie.release_date || 'N/A',
      overview: movie.overview || '',
    }));
  } catch (error) {
    console.error('Error searching movies on TMDB:', error);
    return [];
  }
}

/**
 * Fetches trending movies from TMDB API
 */
export async function getTrendingMovies(): Promise<MovieItem[]> {
  try {
    if (!TMDB_API_KEY) return [];

    const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000) 
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.slice(0, 15).map((movie: any) => ({
      id: movie.id,
      title: movie.title || 'Untitled',
      posterPath: movie.poster_path 
        ? `${TMDB_IMAGE_BASE}${movie.poster_path}` 
        : TMDB_PLACEHOLDER,
      backdropPath: movie.backdrop_path
        ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
        : undefined,
      rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
      releaseDate: movie.release_date || 'N/A',
      overview: movie.overview || '',
    }));
  } catch (error) {
    console.error('Error fetching trending movies from TMDB:', error);
    return [];
  }
}

// ── MUSIC (Open Library) ────────────────────────────────────

export interface MusicItem {
  id: string;
  title: string;
  artist: string;
  image: string;
  rating: number;
  description?: string;
}

/**
 * Searches for music/albums using a music database
 */
export async function searchMusic(query: string): Promise<MusicItem[]> {
  if (!query?.trim()) return [];

  try {
    // Using Spotify-like data structure from a free music API (last.fm alternative or iTunes)
    // For now, using a mock endpoint that simulates music search
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000) 
    });

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results
      .filter((item: any) => item.kind === 'song' || item.kind === 'album')
      .slice(0, 20)
      .map((item: any) => ({
        id: item.trackId || item.collectionId || Math.random().toString(),
        title: item.trackName || item.collectionName || 'Untitled',
        artist: item.artistName || 'Unknown Artist',
        image: item.artworkUrl100?.replace('100x100', '200x200') || 'https://via.placeholder.com/200x200?text=Album',
        rating: Math.random() * 5,
        description: item.collectionName || item.trackName,
      }));
  } catch (error) {
    console.error('[TMDB Service] Error searching music:', error);
    return [];
  }
}

/**
 * Fetches popular music
 */
export async function getPopularMusic(): Promise<MusicItem[]> {
  try {
    // Popular songs worldwide
    const url = `https://itunes.apple.com/search?term=popular&media=music&limit=20`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000) 
    });

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results
      .filter((item: any) => item.kind === 'song')
      .slice(0, 20)
      .map((item: any) => ({
        id: item.trackId?.toString() || Math.random().toString(),
        title: item.trackName || 'Untitled',
        artist: item.artistName || 'Unknown Artist',
        image: item.artworkUrl100?.replace('100x100', '200x200') || 'https://via.placeholder.com/200x200?text=Album',
        rating: Math.round(Math.random() * 50) / 10,
        description: item.collectionName,
      }));
  } catch (error) {
    console.error('[TMDB Service] Error fetching popular music:', error);
    return [];
  }
}

// ── BOOKS (Open Library) ────────────────────────────────────

export interface BookItem {
  id: string;
  title: string;
  author: string;
  image: string;
  rating: number;
  description?: string;
  year?: number;
}

/**
 * Searches for books using Open Library API
 */
export async function searchBooks(query: string): Promise<BookItem[]> {
  if (!query?.trim()) return [];

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`;
    
    console.log('[Books API] Searching for:', query, 'URL:', url);
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000) 
    });

    if (!response.ok) {
      console.error('[Books API] Search response not ok:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('[Books API] Search response:', data);

    if (!data.docs || !Array.isArray(data.docs)) {
      console.warn('[Books API] No docs in search response');
      return [];
    }

    const books = data.docs
      .filter((book: any) => book.cover_i && book.title)
      .slice(0, 20)
      .map((book: any) => ({
        id: book.key || Math.random().toString(),
        title: book.title || 'Untitled',
        author: book.author_name?.[0] || 'Unknown Author',
        image: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
        rating: Math.round(Math.random() * 50) / 10,
        description: book.first_publish_year?.toString(),
        year: book.first_publish_year,
      }));

    console.log('[Books API] Returning', books.length, 'books');
    return books;
  } catch (error) {
    console.error('[Books API] Error searching books:', error);
    return [];
  }
}

/**
 * Fetches popular books
 */
export async function getPopularBooks(): Promise<BookItem[]> {
  try {
    // Use a simple query that Open Library accepts
    const url = `https://openlibrary.org/search.json?q=fiction&limit=20`;
    
    console.log('[Books API] Fetching popular books from:', url);
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000) 
    });

    if (!response.ok) {
      console.error('[Books API] Response not ok:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('[Books API] Response status ok, docs:', data.docs?.length);

    if (!data.docs || !Array.isArray(data.docs)) {
      console.warn('[Books API] No docs in response');
      return [];
    }

    const books = data.docs
      .filter((book: any) => book.cover_i && book.title)
      .slice(0, 20)
      .map((book: any) => ({
        id: book.key || Math.random().toString(),
        title: book.title || 'Untitled',
        author: book.author_name?.[0] || 'Unknown Author',
        image: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
        rating: Math.round(Math.random() * 50) / 10,
        description: book.first_publish_year?.toString(),
        year: book.first_publish_year,
      }));

    console.log('[Books API] Returning', books.length, 'books');
    return books;
  } catch (error) {
    console.error('[Books API] Error fetching popular books:', error);
    return [];
  }
}


