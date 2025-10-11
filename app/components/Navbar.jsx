"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/rented", label: "Rented" },
    { href: "/available", label: "Available" },
    { href: "/editor", label: "Editor" },
    { href: "/drivers", label: "Drivers" },
    { href: "/contect", label: "Contact" },
  ];

  return (
    <nav className="bg-gray-300 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          NexaRent
        </Link>

        <ul className="flex space-x-6 text-gray-700 font-medium">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`hover:text-blue-500 ${pathname === href ? "text-blue-500 font-bold " : ""
                  }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
