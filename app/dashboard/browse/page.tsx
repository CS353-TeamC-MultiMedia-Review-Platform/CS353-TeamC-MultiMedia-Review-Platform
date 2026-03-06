export default function BrowsePage() {
  return (
    <div className="page-container">
      <h1>Browse</h1>
      <p>Discover and browse reviews from the community.</p>

      <div className="filters">
        <input 
          type="text" 
          placeholder="Search reviews..." 
          className="search-input"
        />
        <select className="filter-select">
          <option value="">All Categories</option>
          <option value="movies">Movies</option>
          <option value="books">Books</option>
          <option value="music">Music</option>
        </select>
        <select className="filter-select">
          <option value="">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>
      </div>

      <div className="browse-list">
        <div className="browse-item">
          <h3>Midnight Echoes</h3>
          <p className="type">🎵 Music</p>
          <p className="author">Luna Wave</p>
          <p className="rating">⭐⭐⭐⭐ (4.3/5)</p>
          <p className="content">A groundbreaking electronic album that blends ambient soundscapes with pulsing rhythms.</p>
          <button className="view-btn">View Review</button>
        </div>

        <div className="browse-item">
          <h3>The Batman</h3>
          <p className="type">🎬 Movie</p>
          <p className="author">Matt Reeves</p>
          <p className="rating">⭐⭐⭐⭐ (4.2/5)</p>
          <p className="content">A thrilling neo-noir take on the Batman universe with an excellent lead performance.</p>
          <button className="view-btn">View Review</button>
        </div>

        <div className="browse-item">
          <h3>To Kill a Mockingbird</h3>
          <p className="type">📚 Book</p>
          <p className="author">Harper Lee</p>
          <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
          <p className="content">A compelling and essential story about justice, morality, and growing up in the American South.</p>
          <button className="view-btn">View Review</button>
        </div>

        <div className="browse-item">
          <h3>Everything Everywhere All at Once</h3>
          <p className="type">🎬 Movie</p>
          <p className="author">Daniel Kwan</p>
          <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
          <p className="content">An imaginative and emotional multiverse adventure that exceeds expectations on every front.</p>
          <button className="view-btn">View Review</button>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 900px;
        }

        h1 {
          color: #ffa500;
          margin-bottom: 10px;
          font-size: 2.5rem;
        }

        p {
          color: #b0b0b0;
          margin-bottom: 30px;
        }

        .filters {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .search-input, .filter-select {
          padding: 10px 15px;
          border: 2px solid #ffa50044;
          border-radius: 8px;
          background: transparent;
          color: #e0e0e0;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: #666;
        }

        .search-input:focus, .filter-select:focus {
          outline: none;
          border-color: #ffa500;
          background: rgba(255, 165, 0, 0.05);
        }

        .browse-list {
          display: grid;
          gap: 20px;
        }

        .browse-item {
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.05), rgba(255, 165, 0, 0.02));
          border: 2px solid #ffa50044;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .browse-item:hover {
          border-color: #ffa500;
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05));
        }

        .browse-item h3 {
          color: #ffa500;
          margin: 0 0 8px 0;
          font-size: 1.3rem;
        }

        .browse-item .type {
          margin: 0;
          color: #888;
          font-size: 0.9rem;
        }

        .browse-item .author {
          color: #aaa;
          margin: 4px 0;
          font-size: 0.9rem;
        }

        .browse-item .rating {
          color: #ffa500;
          margin: 8px 0;
          font-weight: 600;
        }

        .browse-item .content {
          color: #d0d0d0;
          margin: 12px 0;
        }

        .view-btn {
          padding: 10px 20px;
          background-color: #ffa500;
          color: #000;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .view-btn:hover {
          background-color: #ffb733;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
          }

          .search-input, .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
