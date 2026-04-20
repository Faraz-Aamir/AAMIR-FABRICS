import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-heading text-8xl md:text-9xl text-accent mb-4">404</h1>
        <h2 className="font-heading text-2xl md:text-3xl text-primary mb-3">Page Not Found</h2>
        <p className="font-body text-sm text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-8 py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors">
            Go Home
          </Link>
          <Link href="/products" className="px-8 py-3 border-2 border-primary text-primary font-body text-sm tracking-[0.15em] uppercase hover:bg-primary hover:text-white transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
