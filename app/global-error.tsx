"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Something went wrong</h2>
            <button onClick={() => reset()} style={{ padding: "12px 24px", background: "#C8A96A", color: "#fff", border: "none", cursor: "pointer" }}>
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
