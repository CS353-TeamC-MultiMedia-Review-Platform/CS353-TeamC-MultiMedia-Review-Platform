'use client';

import { useState } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'A passionate reviewer of movies, books, and music.',
    location: 'San Francisco, CA',
    joinDate: 'January 2023',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically send the updated profile to your backend
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <h1>Profile</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" 
              alt="Profile Avatar"
            />
          </div>
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p className="email">{profile.email}</p>
            <p className="join-date">Member since {profile.joinDate}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="section">
            <h3>About</h3>
            {isEditing ? (
              <textarea 
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="edit-textarea"
              />
            ) : (
              <p className="bio">{profile.bio}</p>
            )}
          </div>

          <div className="section">
            <h3>Location</h3>
            {isEditing ? (
              <input 
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p className="location">📍 {profile.location}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            {isEditing ? (
              <input 
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p className="form-value">{profile.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            {isEditing ? (
              <input 
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p className="form-value">{profile.email}</p>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <p className="stat-value">24</p>
            <p className="stat-label">Total Reviews</p>
          </div>
          <div className="stat">
            <p className="stat-value">18</p>
            <p className="stat-label">Helpful Votes</p>
          </div>
          <div className="stat">
            <p className="stat-value">156</p>
            <p className="stat-label">Followers</p>
          </div>
          <div className="stat">
            <p className="stat-value">89</p>
            <p className="stat-label">Following</p>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 800px;
        }

        h1 {
          color: #ffa500;
          margin-bottom: 30px;
          font-size: 2.5rem;
        }

        .profile-card {
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.05), rgba(255, 165, 0, 0.02));
          border: 2px solid #ffa50044;
          border-radius: 12px;
          padding: 30px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 2px solid #ffa50044;
        }

        .avatar {
          flex-shrink: 0;
        }

        .avatar img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid #ffa500;
        }

        .profile-header h2 {
          color: #ffa500;
          margin: 0 0 10px 0;
          font-size: 1.8rem;
        }

        .profile-header .email {
          color: #aaa;
          margin: 5px 0;
        }

        .profile-header .join-date {
          color: #888;
          margin: 5px 0;
          font-size: 0.9rem;
        }

        .profile-details {
          margin-bottom: 30px;
        }

        .section {
          margin-bottom: 25px;
        }

        .section h3 {
          color: #ffa500;
          margin: 0 0 10px 0;
          font-size: 1.1rem;
        }

        .bio, .location, .form-value {
          color: #d0d0d0;
          margin: 0;
          line-height: 1.6;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #ffa500;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .edit-input, .edit-textarea {
          width: 100%;
          padding: 10px 15px;
          border: 2px solid #ffa50044;
          border-radius: 8px;
          background: rgba(255, 165, 0, 0.05);
          color: #e0e0e0;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .edit-input:focus, .edit-textarea:focus {
          outline: none;
          border-color: #ffa500;
          background: rgba(255, 165, 0, 0.1);
        }

        .edit-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(255, 165, 0, 0.08);
          border-radius: 10px;
          border: 1px solid #ffa50044;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          color: #ffa500;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .stat-label {
          color: #aaa;
          margin: 5px 0 0 0;
          font-size: 0.9rem;
        }

        .profile-actions {
          display: flex;
          gap: 15px;
        }

        .edit-btn, .save-btn, .cancel-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .edit-btn, .save-btn {
          background-color: #ffa500;
          color: #000;
        }

        .edit-btn:hover, .save-btn:hover {
          background-color: #ffb733;
          transform: translateY(-2px);
        }

        .cancel-btn {
          background-color: #444;
          color: #fff;
        }

        .cancel-btn:hover {
          background-color: #666;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .profile-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .profile-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
