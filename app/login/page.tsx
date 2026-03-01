'use client';

import Navigation from '../components/Navigation';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
  };

  return (
    <>
      <Navigation />
      <main>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          
          <button type="submit">Sign In</button>
        </form>

        <div className="link-text">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </main>
    </>
  );
}
