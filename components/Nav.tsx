"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/shifts", label: "Shifts" },
  { href: "/expenses", label: "Expenses" },
  { href: "/backup", label: "Backup" },
];

export default function Nav() {
  const path = (usePathname() || "/").replace(/(.)\/$/, "$1");
  return (
    <nav className="nav" aria-label="Main">
      {items.map((i) => (
        <Link key={i.href} href={i.href} aria-current={path === i.href ? "page" : undefined}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
