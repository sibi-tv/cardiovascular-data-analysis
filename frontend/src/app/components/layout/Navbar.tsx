"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { name: "Hypothesis 1", href: "/hypothesis1" },
  { name: "Hypothesis 2", href: "/hypothesis2" },
  { name: "Hypothesis 3", href: "/hypothesis3" },
  { name: "Clustering", href: "/clustering" },
  { name: "Risk Score", href: "/risk-score" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-20 bg-white shadow px-6 py-4 flex gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "text-gray-700 font-medium hover:text-blue-600 transition",
            pathname === item.href && "text-blue-600 border-b-2 border-blue-600"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}