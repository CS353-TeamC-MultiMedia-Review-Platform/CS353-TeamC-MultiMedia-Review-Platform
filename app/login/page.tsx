'use client';

import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    // Simple validation
    if (email && password) {
      // Store auth token (in a real app, this would come from your backend)
      const token = btoa(`${email}:${password}`); // Basic encoding for demo
      localStorage.setItem('authToken', token);
      
      // Also set it as a cookie for server-side middleware
      document.cookie = `authToken=${token}; path=/`;
      
      // Redirect to dashboard
      router.push('/dashboard');
    }
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
          Don&apos;t have an account? <a href="/register">Register here</a>
        </div>
      </main>
    </>
  );
}
