"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div
      style={{
        backgroundImage: "url('/car.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        objectFit: "cover",
        minHeight: "88.8vh",
        width: "100%",
      }}
      className="min-h-[88.8vh] flex items-center justify-center bg-gray-50 px-6 py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Managing Director Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-xl transition">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src="/owner.jpg" alt="Rao Majid Saleem" />
            <AvatarFallback>RM</AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold text-gray-800">
            Rao Majid Saleem
          </h2>
          <p className="text-gray-500 mb-6">Car Rental Owner</p>

          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-600" />
              <a
                href="tel:+61424956011"
                className="text-gray-700 hover:text-green-600"
              >
                +61 424 956 011
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <a
                href="https://wa.me/61424956011"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-green-600"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Powered by <span className="font-medium">Rao Waleed Nisar</span>
          </p>
        </div>

        {/* Car Rental Owner Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-xl transition">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src="/profile.jpg" alt="Rao Athar Saleem" />
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold text-gray-800">
            Rao Athar Saleem
          </h2>
          <p className="text-gray-500 mb-6">Managing Director</p>

          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <a
                href="mailto:atharrao7@gmail.com"
                className="text-gray-700 hover:text-blue-600"
              >
                atharrao7@gmail.com
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-600" />
              <a
                href="tel:+923004381202"
                className="text-gray-700 hover:text-green-600"
              >
                +92 300 4381202
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <a
                href="https://wa.me/923256800084"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-green-600"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Powered by <span className="font-medium">Rao Waleed Nisar</span>
          </p>
        </div>
      </div>
    </div>
  );
}
