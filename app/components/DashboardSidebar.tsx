'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    // Clear the auth token
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <>
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Dashboard</h2>
          <button 
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sidebar"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link href="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span>
                <span className="nav-label">Overview</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/my-reviews" className="nav-link">
                <span className="nav-icon">📝</span>
                <span className="nav-label">My Reviews</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/browse" className="nav-link">
                <span className="nav-icon">🔍</span>
                <span className="nav-label">Browse</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/profile" className="nav-link">
                <span className="nav-icon">👤</span>
                <span className="nav-label">Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <style jsx>{`
        .dashboard-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 250px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-right: 2px solid #ffa500;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, width 0.3s ease;
          z-index: 100;
        }

        .dashboard-sidebar.closed {
          width: 80px;
          transform: translateX(-170px);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #ffa50044;
        }

        .sidebar-header h2 {
          color: #ffa500;
          margin: 0;
          font-size: 1.5rem;
          white-space: nowrap;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #ffa500;
          cursor: pointer;
          font-size: 1.5rem;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .toggle-btn:hover {
          transform: scale(1.2);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-nav li {
          margin-bottom: 15px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          color: #e0e0e0;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          background-color: #ffa50033;
          color: #ffa500;
          padding-left: 20px;
        }

        .nav-icon {
          font-size: 1.3rem;
          min-width: 30px;
          display: flex;
          justify-content: center;
        }

        .nav-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-footer {
          padding-top: 20px;
          border-top: 2px solid #ffa50044;
        }

        .logout-btn {
          width: 100%;
          padding: 10px;
          background-color: #ff4444;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .logout-btn:hover {
          background-color: #cc0000;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: 80px;
            transform: translateX(-170px);
          }

          .dashboard-sidebar.open {
            transform: translateX(0);
          }

          .sidebar-header h2 {
            font-size: 1.2rem;
          }

          .nav-label {
            display: none;
          }

          .toggle-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
