"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Transactions",
    href: "/",
  },
  {
    label: "Analytics",
    href: "/analytics",
  },
  {
    label: "Rewards",
    href: "/rewards",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-[calc(100vh-4rem)] w-60 border-r bg-white p-4">
      <nav className="space-y-2">
        {navigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 font-medium transition-colors ${
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}