import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-white/10 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-white/50 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/" 
            className="px-6 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition"
          >
            Go Home
          </Link>
          <Link 
            href="/feed" 
            className="px-6 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/15 transition"
          >
            Browse Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
