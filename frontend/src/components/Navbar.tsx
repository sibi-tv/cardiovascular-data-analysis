'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Hypothesis 1', href: '/hypotheses/1' },
  { name: 'Hypothesis 2', href: '/hypotheses/2' },
  { name: 'Hypothesis 3', href: '/hypotheses/3' },
  { name: 'Clustering', href: '/clustering' },
  { name: 'Risk Score', href: '/risk-score' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-red-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          CVD Analysis
        </Link>
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transform transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-orange-200 text-red-900 font-extrabold scale-105'
                    : 'text-orange-200 hover:bg-red-700 hover:text-white hover:scale-110'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}