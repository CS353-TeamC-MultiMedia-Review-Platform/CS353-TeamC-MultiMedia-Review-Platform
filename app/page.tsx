import Navigation from './components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <h1>Multimedia Review</h1>
        <p>Your ultimate destination for reviewing and discovering great books, movies, and music.</p>
        <p>Share your thoughts, read others' reviews, and build your personal collection of recommendations.</p>
        
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>What We Review</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
            {/* Books */}
            <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</h3>
              <h3>Books</h3>
              <p>Discover literary masterpieces, page-turners, and hidden gems. Share your favorite reads and recommendations.</p>
            </div>
            
            {/* Movies */}
            <div style={{ background: '#fef0f9', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #ec4899' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</h3>
              <h3>Movies</h3>
              <p>Rate and review the films that moved you. From blockbusters to indie films, share your cinema experience.</p>
            </div>
            
            {/* Music */}
            <div style={{ background: '#fef3c7', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎵</h3>
              <h3>Music</h3>
              <p>Explore albums and artists. Share what's on your playlist and discover new sounds from fellow music lovers.</p>
            </div>
          </div>
        </section>

        <section style={{ marginTop: '3rem', textAlign: 'center', background: '#f3f4f6', padding: '2rem', borderRadius: '8px' }}>
          <h2>Get Started Today</h2>
          <p>Sign up to start sharing your reviews with our community!</p>
          <div className="welcome-links">
            <a href="/register">Create Account</a> • 
            <a href="/login">Log In</a> •
            <a href="/dashboard">View Dashboard</a>
          </div>
        </section>
      </main>
    </>
  );
}