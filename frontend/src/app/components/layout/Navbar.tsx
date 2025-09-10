"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { name: "Hypothesis 1", href: "/hypothesis1" },
  { name: "Hypothesis 2", href: "/hypothesis2" },
  //{ name: "Hypothesis 3", href: "/hypothesis3" },
  { name: "Risk Score", href: "/risk-score" },
  { name: "Dataset Info", href: "/clustering" },
];

const home = [{ name: "CVD Analytics", href: "/" }];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-20 bg-slate-900 shadow px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "text-blue-50 font-medium hover:text-sky-300 transition",
              pathname === item.href && "text-sky-300 border-b-2 border-sky-300"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
      {home.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "text-blue-50 font-bold text-xl hover:text-sky-300 transition"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}