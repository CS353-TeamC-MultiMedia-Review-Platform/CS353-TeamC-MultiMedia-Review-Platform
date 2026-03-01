import Navigation from '../components/Navigation';

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <main>
        <h2>Dashboard</h2>
        <p>Welcome to your multimedia review dashboard! Browse and manage your reviews below.</p>
        
        {/* BOOKS SECTION */}
        <section className="review-section">
          <h3>📚 Books</h3>
          <div className="review-container">
            <div className="review-card">
              <h4>The Great Gatsby</h4>
              <p className="author">F. Scott Fitzgerald</p>
              <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
              <p>A masterpiece of American literature. The prose is beautiful and the characters are unforgettable.</p>
              <a href="#" className="view-link">View Review →</a>
            </div>
            <div className="review-card">
              <h4>To Kill a Mockingbird</h4>
              <p className="author">Harper Lee</p>
              <p className="rating">⭐⭐⭐⭐ (4/5)</p>
              <p>A compelling story about justice and morality. Essential reading for everyone.</p>
              <a href="#" className="view-link">View Review →</a>
            </div>
          </div>
          <button className="add-review-btn">+ Add Book Review</button>
        </section>

        {/* MOVIES SECTION */}
        <section className="review-section">
          <h3>🎬 Movies</h3>
          <div className="review-container">
            <div className="review-card">
              <h4>Inception</h4>
              <p className="author">Directed by Christopher Nolan</p>
              <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
              <p>Mind-bending cinematography and an incredible soundtrack. A true sci-fi masterpiece.</p>
              <a href="#" className="view-link">View Review →</a>
            </div>
            <div className="review-card">
              <h4>The Shawshank Redemption</h4>
              <p className="author">Directed by Frank Darabont</p>
              <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
              <p>The best movie ever made. A story of hope and friendship that never gets old.</p>
              <a href="#" className="view-link">View Review →</a>
            </div>
          </div>
          <button className="add-review-btn">+ Add Movie Review</button>
        </section>

        {/* MUSIC SECTION */}
        <section className="review-section">
          <h3>🎵 Music</h3>
          <div className="review-container">
            <div className="review-card">
              <h4>Abbey Road</h4>
              <p className="artist">The Beatles</p>
              <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
              <p>Iconic album with some of the greatest songs ever recorded. A timeless classic.</p>
              <a href="#" className="view-link">View Review →</a>
            </div>
            <div className="review-card">
              <h4>Dark Side of the Moon</h4>
              <p className="artist">Pink Floyd</p>
              <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
              <p>Experimental and innovative. One of the most influential albums in rock history.</p>
              <a href="#" className="view-link">View Review →</a>
            </div>
          </div>
          <button className="add-review-btn">+ Add Music Review</button>
        </section>
      </main>
    </>
  );
}
