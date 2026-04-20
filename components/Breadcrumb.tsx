import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 font-body text-xs text-gray-400 tracking-wider">
      <Link href="/" className="hover:text-accent transition-colors uppercase">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center space-x-2">
          <span className="text-gray-300">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-accent transition-colors uppercase">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary uppercase">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
