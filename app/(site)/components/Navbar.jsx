"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../components/ui/popover";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const allLinks = [
    { href: "/home", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/rented", label: "Rented" },
    { href: "/available", label: "Available" },
    { href: "/editor", label: "Editor" },
    { href: "/drivers", label: "Drivers" },
    { href: "/contect", label: "Contact" },
  ];

  const limitedLinks = [
    { href: "/home", label: "Home" },
    { href: "/rented", label: "Rented" },
    { href: "/available", label: "Available" },
    { href: "/contect", label: "Contact" },
  ];

  // 🧠 Prevent flicker by waiting for session to finish loading
  if (status === "loading") {
    return (
      <nav className="bg-gray-300 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            NexaRent
          </Link>

          <ul className="flex space-x-6 text-gray-700 font-medium opacity-0">
            {limitedLinks.map(({ href, label }) => (
              <li key={href}>
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div className="w-12 h-10" />
        </div>
      </nav>
    );
  }

  const isAdmin = session?.user?.email === adminEmail;
  const linksToRender = isAdmin ? allLinks : limitedLinks;

  return (
    <nav className="bg-gray-300 shadow-md max-h-[72px]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          NexaRent
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-gray-700 font-medium transition-all">
          {linksToRender.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`hover:text-blue-500 ${pathname === href ? "text-blue-500 font-bold" : ""
                  }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Section */}
        {session?.user ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none cursor-pointer">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-400"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-semibold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-800 hidden sm:block">
                    {session.user.name}
                  </span>
                  {isAdmin && (
                    <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-semibold mt-0.5">
                      Admin
                    </span>
                  )}
                </div>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-44 p-3">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold text-gray-800">
                  {session.user.name}
                </span>

                <button
                  onClick={() => signOut()}
                  className="text-sm text-white bg-blue-600 px-3 py-1.5 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Link
            href="/"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
