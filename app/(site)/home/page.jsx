"use client";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function LandingPage() {
  return (
    <>

      <header
        className="flex-1 flex flex-col justify-center items-center text-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('/car.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-white px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Rent Your Dream Car in AUSTRALIA
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Affordable rides for every journey — Drive BYD, Camry, Swift,Rav 4
          </p>
          <Link
            href="/available"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Footer */}
      <footer className="bg-gray-500 text-white py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          {/* Brand */}
          <p className="text-gray-100 mb-4 md:mb-0">
            © {new Date().getFullYear()} NexaRent | Powered by Rao Waleed Nisar
          </p>

          {/* Contact Info */}
          <div className="flex space-x-6 items-center">
            <a
              href="https://wa.me/923256800084"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-green-400"
            >
              <Phone className="w-5 h-5" />
              <span>+92 300 4381202</span>
            </a>
            <a
              href="mailto:waleedcars@gmail.com"
              className="flex items-center space-x-2 hover:text-red-400"
            >
              <Mail className="w-5 h-5" />
              <span>atharrao7@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
