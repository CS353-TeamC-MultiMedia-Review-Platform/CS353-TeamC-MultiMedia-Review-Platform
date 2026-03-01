'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';

export default function ReviewsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  function filterReviews(category: string) {
    setActiveCategory(category);
  }

  return (
    <>
      <Navigation />
      <main>
        <h2>Browse Reviews</h2>
        <p>Explore reviews from our community across all categories.</p>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '1rem', margin: '2rem 0', flexWrap: 'wrap' }}>
          <button 
            onClick={() => filterReviews('all')} 
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
          >
            All Reviews
          </button>
          <button 
            onClick={() => filterReviews('books')} 
            className={`filter-btn ${activeCategory === 'books' ? 'active' : ''}`}
          >
            📚 Books
          </button>
          <button 
            onClick={() => filterReviews('movies')} 
            className={`filter-btn ${activeCategory === 'movies' ? 'active' : ''}`}
          >
            🎬 Movies
          </button>
          <button 
            onClick={() => filterReviews('music')} 
            className={`filter-btn ${activeCategory === 'music' ? 'active' : ''}`}
          >
            🎵 Music
          </button>
        </div>

        {/* BOOKS SECTION */}
        {(activeCategory === 'all' || activeCategory === 'books') && (
          <section className="review-section" id="books-section">
            <h3>📚 Books</h3>
            <div className="review-container">
              <div className="review-card">
                <h4>The Great Gatsby</h4>
                <p className="author">F. Scott Fitzgerald</p>
                <p className="rating">⭐⭐⭐⭐⭐ (5/5) • 234 reviews</p>
                <p>A masterpiece of American literature that explores themes of wealth, love, and the American Dream.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
              <div className="review-card">
                <h4>To Kill a Mockingbird</h4>
                <p className="author">Harper Lee</p>
                <p className="rating">⭐⭐⭐⭐ (4.8/5) • 189 reviews</p>
                <p>A compelling story about justice, morality, and growing up in the American South.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
              <div className="review-card">
                <h4>1984</h4>
                <p className="author">George Orwell</p>
                <p className="rating">⭐⭐⭐⭐⭐ (4.9/5) • 312 reviews</p>
                <p>A dystopian novel that remains eerily relevant. A chilling exploration of totalitarianism.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
            </div>
          </section>
        )}

        {/* MOVIES SECTION */}
        {(activeCategory === 'all' || activeCategory === 'movies') && (
          <section className="review-section" id="movies-section">
            <h3>🎬 Movies</h3>
            <div className="review-container">
              <div className="review-card">
                <h4>Inception</h4>
                <p className="author">Directed by Christopher Nolan</p>
                <p className="rating">⭐⭐⭐⭐⭐ (5/5) • 567 reviews</p>
                <p>A mind-bending sci-fi thriller with incredible cinematography and a haunting score.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
              <div className="review-card">
                <h4>The Shawshank Redemption</h4>
                <p className="author">Directed by Frank Darabont</p>
                <p className="rating">⭐⭐⭐⭐⭐ (5/5) • 892 reviews</p>
                <p>Often called the greatest film ever made. A story of hope, friendship, and redemption.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
              <div className="review-card">
                <h4>Pulp Fiction</h4>
                <p className="author">Directed by Quentin Tarantino</p>
                <p className="rating">⭐⭐⭐⭐ (4.7/5) • 425 reviews</p>
                <p>A groundbreaking film with brilliant dialogue and interweaving narratives.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
            </div>
          </section>
        )}

        {/* MUSIC SECTION */}
        {(activeCategory === 'all' || activeCategory === 'music') && (
          <section className="review-section" id="music-section">
            <h3>🎵 Music</h3>
            <div className="review-container">
              <div className="review-card">
                <h4>Abbey Road</h4>
                <p className="artist">The Beatles</p>
                <p className="rating">⭐⭐⭐⭐⭐ (5/5) • 345 reviews</p>
                <p>Iconic album with some of the greatest songs ever recorded. Timeless classic.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
              <div className="review-card">
                <h4>Dark Side of the Moon</h4>
                <p className="artist">Pink Floyd</p>
                <p className="rating">⭐⭐⭐⭐⭐ (5/5) • 478 reviews</p>
                <p>Experimental and innovative. One of the most influential albums in rock history.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
              <div className="review-card">
                <h4>Rumours</h4>
                <p className="artist">Fleetwood Mac</p>
                <p className="rating">⭐⭐⭐⭐ (4.9/5) • 256 reviews</p>
                <p>A masterpiece of pop-rock. Created during chaotic band tensions, it's pure perfection.</p>
                <a href="#" className="view-link">Read More →</a>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
