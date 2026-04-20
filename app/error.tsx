"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="font-heading text-2xl text-primary mb-3">Something went wrong</h2>
        <p className="font-body text-sm text-gray-400 mb-6">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
