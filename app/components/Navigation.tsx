import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/reviews">Reviews</Link>
      <Link href="/login">Login</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
