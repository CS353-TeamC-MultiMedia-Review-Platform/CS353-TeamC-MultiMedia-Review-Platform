export default function MyReviewsPage() {
  return (
    <div className="page-container">
      <h1>My Reviews</h1>
      <p>View and manage all your reviews here.</p>
      
      <div className="reviews-list">
        <div className="review-item">
          <h3>Oppenheimer</h3>
          <p className="type">🎬 Movie</p>
          <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
          <p className="content">A brilliantly crafted historical drama that explores the complexities of the atomic age.</p>
          <div className="review-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>

        <div className="review-item">
          <h3>Dune: Part Two</h3>
          <p className="type">🎬 Movie</p>
          <p className="rating">⭐⭐⭐⭐ (4.5/5)</p>
          <p className="content">Epic sci-fi continuation with stunning visuals and complex world-building.</p>
          <div className="review-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>

        <div className="review-item">
          <h3>The Great Gatsby</h3>
          <p className="type">📚 Book</p>
          <p className="rating">⭐⭐⭐⭐⭐ (5/5)</p>
          <p className="content">A timeless masterpiece of American literature with unforgettable characters.</p>
          <div className="review-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
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

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-item {
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.05), rgba(255, 165, 0, 0.02));
          border: 2px solid #ffa50044;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .review-item:hover {
          border-color: #ffa500;
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05));
        }

        .review-item h3 {
          color: #ffa500;
          margin: 0 0 8px 0;
          font-size: 1.3rem;
        }

        .review-item .type {
          margin: 0;
          color: #888;
          font-size: 0.9rem;
        }

        .review-item .rating {
          color: #ffa500;
          margin: 8px 0;
          font-weight: 600;
        }

        .review-item .content {
          color: #d0d0d0;
          margin: 12px 0;
        }

        .review-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .edit-btn, .delete-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .edit-btn {
          background-color: #ffa500;
          color: #000;
        }

        .edit-btn:hover {
          background-color: #ffb733;
          transform: translateY(-2px);
        }

        .delete-btn {
          background-color: #ff4444;
          color: white;
        }

        .delete-btn:hover {
          background-color: #cc0000;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
