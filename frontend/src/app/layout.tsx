import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Cardio Analysis Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen text-slate-900">
        <header className="bg-white/60 backdrop-blur sticky top-0 z-40 border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">Cardio Insights</Link>
            <nav className="flex gap-3">
              <NavLink href="/hypothesis1">Hypothesis 1</NavLink>
              <NavLink href="/hypothesis2">Hypothesis 2</NavLink>
              <NavLink href="/hypothesis3">Hypothesis 3</NavLink>
              <NavLink href="/clustering">Clustering</NavLink>
              <NavLink href="/risk-score">Risk Score</NavLink>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>

        <footer className="mt-12 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Cardio Insights
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 transition"
    >
      {children}
    </Link>
  );
}